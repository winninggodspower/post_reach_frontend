"use client"

import * as React from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useAuth } from "@/features/auth/store/auth-store"
import { useRouter } from "next/navigation"
import { useTargetChannels } from "../../hooks/use-target-channels"
import { usePostSubmit } from "../../hooks/use-post-submit"
import { usePostHydration } from "../../hooks/use-post-hydration"
import { publishImagePost, updateScheduledPost } from "../../api/server"
import { Loader2 } from "lucide-react"
import { UploadStatusModal } from "../upload-status-modal"
import { addDays, format } from "date-fns"

// Sub-components
import { TargetAccountsSelector } from "../target-accounts-selector"
import { ImageFilesUploader } from "./image-files-uploader"
import { CompositionDetails } from "../composition-details"
import { ImagePreviewPhone } from "./image-preview-phone"
import { SchedulerWidget } from "../scheduler-widget"
import { ComposerHeader } from "../composer-header"
import { LockedMediaCard } from "../locked-media-card"
import type { ImagePostFormValues } from "../../types/composer"
import { buildPlatformSettings } from "../../lib/composer-utils"

interface ImageComposerProps {
  postId?: string
  onBack?: () => void
}

export function ImageComposer({ postId, onBack }: ImageComposerProps) {
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
  const { register, watch, setValue, getValues } = useForm<ImagePostFormValues>({
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

  // Hydrate form on edit
  const { isFetching: isFetchingPost } = usePostHydration({
    postId,
    setValue,
    setChannels,
    onMediaLoaded: ({ mediaUrls, thumbnailUrl }) => {
      if (mediaUrls && mediaUrls.length > 0) {
        setImageSrcs(mediaUrls)
      } else if (thumbnailUrl) {
        setImageSrcs([thumbnailUrl])
      }
    },
    onError: () => {
      toast.error("Failed to load post")
      router.push("/dashboard/calendar")
    },
  })

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
      const activeChs = channels.filter((c) => c.selected)
      const platforms = activeChs.map((c) => (c.platform === "x" ? "twitter" : c.platform))
      const platformSettings = buildPlatformSettings({
        platforms,
        values: getValues(),
      })

      if (postId) {
        return updateScheduledPost(postId, {
          caption: caption || "",
          platforms,
          platformSettings,
          scheduledAt,
        })
      }

      return publishImagePost(
        {
          images: imageFiles,
          caption: caption || "",
          platforms,
          platformSettings,
          scheduledAt,
        },
        (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || progressEvent.loaded)
          )
          setUploadProgress(percent)
        }
      )
    },
  })

  const onPublishClick = (action: "schedule" | "now") => {
    const activeChs = channels.filter((c) => c.selected)
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

  const activeChannel =
    channels.find((c) => c.selected && c.platform === previewPlatform) ||
    channels.find((c) => c.selected) ||
    channels[0]

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-20 py-6 md:py-10 animate-fade-in text-slate-800 dark:text-slate-200">
      {isFetchingPost && (
        <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
          <Loader2 className="size-8 text-accent-brand animate-spin" />
        </div>
      )}

      {/* Unified Composer Header */}
      <ComposerHeader
        title={postId ? "Edit scheduled post" : "Create image post"}
        subtitle={
          postId
            ? "Update caption, time, or platforms"
            : "Draft and schedule multi-platform image and carousel posts"
        }
        onBack={onBack}
        onPublish={() => onPublishClick(isScheduled ? "schedule" : "now")}
        isPublishing={isPublishing}
        isScheduled={isScheduled}
        isEditMode={!!postId}
        disabled={isPublishing || isFetchingPost}
      />

      {/* Target Accounts Selector */}
      <TargetAccountsSelector channels={channels} onToggleChannel={toggleChannel} />

      {/* Main Grid: Left inputs, Right preview/scheduler */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column - Form fields */}
        <div className={imageSrcs.length > 0 ? "lg:col-span-7 space-y-6" : "lg:col-span-8 space-y-6"}>
          {postId ? (
            <LockedMediaCard
              description="Media cannot be changed on scheduled posts."
              containerClassName="p-8 flex gap-4 overflow-x-auto w-full"
            >
              {imageSrcs.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="Post media"
                  className="h-32 w-auto object-cover rounded-xl shadow-md border border-slate-200 dark:border-slate-700 opacity-95 transition-all"
                />
              ))}
              {imageSrcs.length === 0 && (
                <div className="h-32 w-32 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              )}
            </LockedMediaCard>
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
        selectedPlatforms={selectedChannels.map((c) => c.platform)}
        previewData={{
          title: title,
          caption: caption,
          imageSrc: imageSrcs?.[0] || undefined,
        }}
        fileSizeBytes={imageFiles.reduce((acc, file) => acc + file.size, 0)}
      />
    </div>
  )
}
