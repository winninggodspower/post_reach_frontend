"use client"

import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useAuth } from "@/features/auth/store/auth-store"
import { useRouter } from "next/navigation"
import { useTargetChannels } from "../../hooks/use-target-channels"
import { usePostSubmit } from "../../hooks/use-post-submit"
import { publishImagePost, fetchPostById, updateScheduledPost } from "../../api/server"
import { Loader2, Lock } from "lucide-react"
import { UploadStatusModal } from "../upload-status-modal"
import { addDays, format } from "date-fns"

// Sub-components
import { TargetAccountsSelector } from "../target-accounts-selector"
import { ImageFilesUploader } from "./image-files-uploader"
import { CompositionDetails } from "../composition-details"
import type { VideoPostFormValues } from "../video/video-composer"
import { ImagePreviewPhone } from "./image-preview-phone"
import { SchedulerWidget } from "../scheduler-widget"

export function ImageComposer({ postId }: { postId?: string }) {
  const router = useRouter()
  const user = useAuth((state) => state.user)
  const brand = user?.brand

  // Target Accounts using hook
  const { channels, setChannels, toggleChannel, selectedChannels } = useTargetChannels(
    brand?.connected_accounts,
    ["facebook", "linkedin", "twitter", "x", "instagram", "tiktok"]
  )

  // Images state
  const [imageFiles, setImageFiles] = React.useState<File[]>([])
  const [imageSrcs, setImageSrcs] = React.useState<string[]>([])

  // Revoke blob URLs on unmount
  React.useEffect(() => {
    return () => {
      imageSrcs.forEach((src) => URL.revokeObjectURL(src))
    }
  }, [imageSrcs])

  const handleFileChange = (newFiles: File[]) => {
    // Revoke old URLs
    imageSrcs.forEach((src) => URL.revokeObjectURL(src))

    // Create new URLs
    const newSrcs = newFiles.map((file) => URL.createObjectURL(file))
    setImageFiles(newFiles)
    setImageSrcs(newSrcs)
  }

  const handleRemoveImage = (indexToRemove: number) => {
    URL.revokeObjectURL(imageSrcs[indexToRemove])
    const newFiles = imageFiles.filter((_, i) => i !== indexToRemove)
    const newSrcs = imageSrcs.filter((_, i) => i !== indexToRemove)
    setImageFiles(newFiles)
    setImageSrcs(newSrcs)
  }

  // React Hook Form
  const { register, watch, setValue, getValues } = useForm<VideoPostFormValues>({
    defaultValues: {
      title: "",
      caption: "",
      isScheduled: false,
      scheduleDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      scheduleTime: "14:00",
      customizePerPlatform: false,
      youtubeTitle: "",
      youtubeCaption: "",
      tiktokCaption: "",
      instagramCaption: "",
      facebookCaption: "",
      linkedinCaption: "",
      xCaption: "",
      tiktokPrivacyLevel: "PUBLIC_TO_EVERYONE",
      tiktokAllowComments: true,
      tiktokAllowDuet: true,
      tiktokAllowStitch: true,
      tiktokBrandContentToggle: false,
      tiktokBrandOrganicToggle: false,
    },
  })

  const [isFetchingPost, setIsFetchingPost] = React.useState(false)

  React.useEffect(() => {
    if (postId) {
      setIsFetchingPost(true)
      fetchPostById(postId).then(({ data }) => {
        setValue("caption", data.caption)
        setValue("isScheduled", true)
        
        if (data.scheduled_at) {
          const dt = new Date(data.scheduled_at)
          setValue("scheduleDate", dt.toISOString().split('T')[0])
          setValue("scheduleTime", dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }))
        }
        
        if (data.media_urls && data.media_urls.length > 0) {
          setImageSrcs(data.media_urls)
        } else if (data.thumbnail_url) {
          setImageSrcs([data.thumbnail_url])
        }
        
        setChannels(prev => prev.map(c => ({
          ...c,
          selected: data.platforms.some(p => p.platform.toLowerCase() === c.platform.toLowerCase())
        })))
        
        let hasCustomCaptions = false
        data.platforms.forEach(p => {
          const plat = p.platform.toLowerCase()
          if (p.caption && p.caption !== data.caption) {
            hasCustomCaptions = true
            if (plat === 'youtube') setValue('youtubeCaption', p.caption)
            if (plat === 'tiktok') setValue('tiktokCaption', p.caption)
            if (plat === 'instagram') setValue('instagramCaption', p.caption)
            if (plat === 'facebook') setValue('facebookCaption', p.caption)
            if (plat === 'linkedin') setValue('linkedinCaption', p.caption)
            if (plat === 'twitter' || plat === 'x') setValue('xCaption', p.caption)
          }
        })
        if (hasCustomCaptions) {
          setValue('customizePerPlatform', true)
        }
      }).catch(err => {
        toast.error("Failed to load post")
        router.push("/dashboard/calendar")
      }).finally(() => {
        setIsFetchingPost(false)
      })
    }
  }, [postId, setValue, setChannels, router])

  // Watch form fields for live preview
  const title = watch("title")
  const caption = watch("caption")
  const isScheduled = watch("isScheduled")
  const scheduleDate = watch("scheduleDate")
  const scheduleTime = watch("scheduleTime")
  const customizePerPlatform = watch("customizePerPlatform")
  const youtubeCaption = watch("youtubeCaption")
  const tiktokCaption = watch("tiktokCaption")
  const instagramCaption = watch("instagramCaption")
  const facebookCaption = watch("facebookCaption")
  const linkedinCaption = watch("linkedinCaption")
  const xCaption = watch("xCaption")

  // Phone preview interactions
  const [previewPlatform, setPreviewPlatform] = React.useState<any>("instagram")

  // Post Submission Hook
  const {
    isPublishing,
    setIsPublishing,
    isStatusModalOpen,
    setIsStatusModalOpen,
    uploadProgress,
    setUploadProgress,
    createdPostId,
    handlePublish,
  } = usePostSubmit({
    submitFn: async (scheduledAt) => {
      const activeChs = channels.filter(c => c.selected)
      const mappedPlatforms = activeChs.map(c => c.platform === "x" ? "twitter" : c.platform)

      const platformSettings: Record<string, unknown> = {}
      if (customizePerPlatform) {
        if (mappedPlatforms.includes("facebook") && facebookCaption) {
          platformSettings.facebook = { caption: facebookCaption }
        }
        if (mappedPlatforms.includes("instagram") && instagramCaption) {
          platformSettings.instagram = { caption: instagramCaption }
        }
        if (mappedPlatforms.includes("tiktok") && tiktokCaption) {
          platformSettings.tiktok = { caption: tiktokCaption }
        }
        if (mappedPlatforms.includes("linkedin") && linkedinCaption) {
          platformSettings.linkedin = { caption: linkedinCaption }
        }
        if (mappedPlatforms.includes("twitter") && xCaption) {
          platformSettings.twitter = { caption: xCaption }
        }
      }

      if (postId) {
        return updateScheduledPost(postId, {
          caption: caption || "",
          platforms: mappedPlatforms,
          platformSettings: Object.keys(platformSettings).length > 0 ? platformSettings : undefined,
          scheduledAt,
        })
      }

      return publishImagePost({
        images: imageFiles,
        caption: caption || "",
        platforms: mappedPlatforms,
        platformSettings: Object.keys(platformSettings).length > 0 ? platformSettings : undefined,
        scheduledAt,
      }, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || progressEvent.loaded))
        setUploadProgress(percent)
      })
    }
  })

  const handleBack = () => {
    router.push("/dashboard/posts")
  }

  const onPublishClick = (action: "schedule" | "now") => {
    const activeChs = channels.filter(c => c.selected)
    if (activeChs.length === 0) {
      toast.error("No channels selected", {
        description: "Please select at least one social media channel to post to.",
      })
      return
    }

    if (imageFiles.length === 0 && !postId) {
      toast.error("Images are missing", {
        description: "Please upload at least one image to compose your post.",
      })
      return
    }

    handlePublish(action, scheduleDate, scheduleTime)
  }

  const activeChannel = channels.find(c => c.selected && c.platform === previewPlatform) || channels.find(c => c.selected) || channels[0]

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-20 py-6 md:py-10 animate-fade-in text-slate-800 dark:text-slate-200">
      
      {isFetchingPost && (
        <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
          <Loader2 className="size-8 text-accent-brand animate-spin" />
        </div>
      )}

      {/* Back button and title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            aria-label="Back to selection"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {postId ? "Edit scheduled post" : "Create image post"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {postId ? "Update caption, time, or platforms" : "Draft and schedule multi-platform image and carousel posts"}
            </p>
          </div>
        </div>

        {/* Action Header publish shortcut */}
        <div className="flex items-center gap-2">
          <button
            disabled={isPublishing || isFetchingPost}
            onClick={() => onPublishClick(isScheduled ? "schedule" : "now")}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-linear-to-r from-accent-dark to-accent-brand text-white shadow-md hover:brightness-105 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? (postId ? "Updating..." : "Publishing...") : (postId ? "Update Post" : (isScheduled ? "Schedule Post" : "Publish Now"))}
          </button>
        </div>
      </div>

      {/* Target Accounts Selector */}
      <TargetAccountsSelector
        channels={channels}
        onToggleChannel={toggleChannel}
      />

      {/* Main Grid: Left inputs, Right preview/scheduler */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column - Form fields */}
        <div className={imageSrcs.length > 0 ? "lg:col-span-7 space-y-6" : "lg:col-span-8 space-y-6"}>

          {postId ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 overflow-hidden shadow-sm">
              <div className="bg-amber-50 dark:bg-amber-900/10 border-b border-amber-100 dark:border-amber-900/30 px-4 py-2.5 flex items-center gap-2">
                <Lock className="size-4 text-amber-600 dark:text-amber-500 shrink-0" />
                <p className="text-sm">
                  <span className="font-semibold text-amber-800 dark:text-amber-500">Media Locked: </span>
                  <span className="text-amber-700/90 dark:text-amber-500/90">Media cannot be changed on scheduled posts.</span>
                </p>
              </div>
              
              <div className="p-8 flex gap-4 overflow-x-auto w-full items-center justify-center relative">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,64,60,0.02)_25%,rgba(68,64,60,0.02)_50%,transparent_50%,transparent_75%,rgba(68,64,60,0.02)_75%,rgba(68,64,60,0.02)_100%)] bg-[length:20px_20px] dark:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%,rgba(255,255,255,0.02)_100%)] pointer-events-none" />
                {imageSrcs.map((src, idx) => (
                  <img key={idx} src={src} alt="Post media" className="h-32 w-auto object-cover rounded-xl shadow-md border border-slate-200 dark:border-slate-700 opacity-95 transition-all" />
                ))}
                {imageSrcs.length === 0 && (
                  <div className="h-32 w-32 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                )}
              </div>
            </div>
          ) : (
            <ImageFilesUploader
              imageFiles={imageFiles}
              imageSrcs={imageSrcs}
              onFileChange={handleFileChange}
              onRemoveImage={handleRemoveImage}
            />
          )}

          {imageSrcs.length > 0 && (
            <CompositionDetails
              register={register as any}
              setValue={setValue as any}
              watch={watch as any}
              channels={channels}
              postType="photo"
            />
          )}
        </div>

        {/* Right Column - Preview & Scheduler widget */}
        <div className={imageSrcs.length > 0 ? "lg:col-span-5 space-y-6 lg:sticky lg:top-6" : "lg:col-span-4 space-y-6"}>

          {imageSrcs.length > 0 && (
            <ImagePreviewPhone
              imageSrcs={imageSrcs}
              previewPlatform={previewPlatform}
              onChangePreviewPlatform={setPreviewPlatform}
              activeChannel={activeChannel}
              caption={
                customizePerPlatform
                  ? (previewPlatform === "youtube"
                    ? youtubeCaption
                    : previewPlatform === "tiktok"
                      ? tiktokCaption
                      : instagramCaption) || caption
                  : caption
              }
              channels={channels}
            />
          )}

          <SchedulerWidget
            register={register as any}
            setValue={setValue as any}
            isScheduled={isScheduled}
            onChangeIsScheduled={(val) => setValue("isScheduled", val)}
            scheduleDate={scheduleDate}
            scheduleTime={scheduleTime}
            onPublish={onPublishClick}
            disabled={isPublishing}
          />
        </div>
      </div>

      {/* Status Multi-platform modal popup */}
      <UploadStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false)
          setIsPublishing(false)
          router.push("/dashboard/posts")
        }}
        postId={createdPostId}
        uploadProgress={uploadProgress}
        postType="photo"
        isScheduled={isScheduled}
        selectedPlatforms={selectedChannels.map(c => c.platform)}
        previewData={{
          title: title,
          caption: caption,
          imageSrc: imageSrcs?.[0] || undefined
        }}
        fileSizeBytes={imageFiles.reduce((acc, file) => acc + file.size, 0)}
      />
    </div>
  )
}
