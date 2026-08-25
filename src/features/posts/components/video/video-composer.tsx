"use client"

import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useAuth } from "@/features/auth/store/auth-store"
import { useRouter } from "next/navigation"
import { useTargetChannels } from "../../hooks/use-target-channels"
import { usePostSubmit } from "../../hooks/use-post-submit"
import { publishVideoPost, fetchPostById, updateScheduledPost } from "../../api/server"
import { UploadStatusModal } from "../upload-status-modal"
import { Lock, FileVideo } from "lucide-react"
import { format, parseISO, addDays } from "date-fns"

// Sub-components
import { TargetAccountsSelector } from "../target-accounts-selector"
import { MediaFileUploader } from "./media-file-uploader"
import { CompositionDetails } from "../composition-details"
import { LivePreviewPhone } from "./live-preview-phone"
import { SchedulerWidget } from "../scheduler-widget"
import { ThumbnailPickerModal } from "./thumbnail-picker-modal"

export interface VideoPostFormValues {
  title: string
  caption: string
  isScheduled: boolean
  scheduleDate: string
  scheduleTime: string
  customizePerPlatform: boolean
  youtubeTitle?: string
  youtubeCaption?: string
  tiktokCaption?: string
  instagramCaption?: string
  facebookCaption?: string
  linkedinCaption?: string
  xCaption?: string
  tiktokPrivacyLevel: "PUBLIC_TO_EVERYONE" | "MUTUAL_FRIENDS" | "SELF_ONLY"
  tiktokAllowComments: boolean
  tiktokAllowDuet: boolean
  tiktokAllowStitch: boolean
  tiktokBrandContentToggle: boolean
  tiktokBrandOrganicToggle: boolean
  coverImageTimestamp?: number
}

type VideoComposerProps = {
  postId?: string
  onBack?: () => void
}

function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(",")
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg"
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

export function VideoComposer({ postId, onBack }: VideoComposerProps) {
  const router = useRouter()
  const user = useAuth((state) => state.user)
  const brand = user?.brand

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.push("/dashboard/posts")
    }
  }

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false)
    setIsPublishing(false)
    router.push("/dashboard/posts")
  }

  // Target Accounts using hook
  const { channels, toggleChannel, selectedChannels, setChannels } = useTargetChannels(
    brand?.connected_accounts,
    ["youtube", "instagram", "tiktok", "facebook", "linkedin", "twitter", "x"]
  )

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

  // Watch values for preview binding and scheduler trigger
  const title = watch("title")
  const caption = watch("caption")
  const isScheduled = watch("isScheduled")
  const scheduleDate = watch("scheduleDate")
  const scheduleTime = watch("scheduleTime")
  const customizePerPlatform = watch("customizePerPlatform")
  const youtubeTitle = watch("youtubeTitle")
  const youtubeCaption = watch("youtubeCaption")
  const tiktokCaption = watch("tiktokCaption")
  const instagramCaption = watch("instagramCaption")
  const facebookCaption = watch("facebookCaption")
  const linkedinCaption = watch("linkedinCaption")
  const xCaption = watch("xCaption")

  // Video state
  const [videoFile, setVideoFile] = React.useState<File | null>(null)
  const [videoSrc, setVideoSrc] = React.useState<string>("")
  const [isPlaying, setIsPlaying] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const previewVideoRef = React.useRef<HTMLVideoElement>(null)

  // Phone preview interactions
  const [previewPlatform, setPreviewPlatform] = React.useState<"tiktok" | "youtube" | "instagram">("tiktok")

  // Thumbnail (cover frame)
  const [thumbnailDataUrl, setThumbnailDataUrl] = React.useState("")
  const [showThumbnailPicker, setShowThumbnailPicker] = React.useState(false)

  // Watch cover timestamp from form
  const coverImageTimestamp = watch("coverImageTimestamp")
  const [isHorizontal, setIsHorizontal] = React.useState(false)
  const [isFetching, setIsFetching] = React.useState(!!postId)

  React.useEffect(() => {
    if (!postId) return

    setIsFetching(true)
    fetchPostById(postId)
      .then(res => {
        if (!res.success || !res.data) throw new Error("Failed to load post")
        const data = res.data

        setValue("caption", data.caption)
        setValue("title", data.platforms.find(p => p.platform === "youtube")?.title || "")

        if (data.scheduled_at) {
          setValue("isScheduled", true)
          const d = parseISO(data.scheduled_at)
          setValue("scheduleDate", format(d, "yyyy-MM-dd"))
          setValue("scheduleTime", format(d, "HH:mm"))
        }

        // Hydrate channels
        setChannels(prev => prev.map(c => ({
          ...c,
          selected: data.platforms.some(p => p.platform.toLowerCase() === c.platform.toLowerCase() || (p.platform === "twitter" && c.platform === "x"))
        })))

        if (data.media_urls?.[0]) {
          setVideoSrc(data.media_urls[0])
        }
        if (data.thumbnail_url) {
          setThumbnailDataUrl(data.thumbnail_url)
        }

        // Hydrate platform settings (custom captions and tiktok specifics)
        let hasCustom = false
        const firstPlatform = data.platforms[0]
        data.platforms.forEach(p => {
          if (p.caption && p.caption !== data.caption) {
            hasCustom = true
            const plat = p.platform.toLowerCase()
            if (plat === 'youtube') setValue('youtubeCaption', p.caption)
            if (plat === 'tiktok') setValue('tiktokCaption', p.caption)
            if (plat === 'instagram') setValue('instagramCaption', p.caption)
            if (plat === 'facebook') setValue('facebookCaption', p.caption)
            if (plat === 'linkedin') setValue('linkedinCaption', p.caption)
            if (plat === 'twitter') setValue('xCaption', p.caption)
          }

          // In a real app, backend would return platform_settings.
          // For now, if we had it, we would parse it here:
          // if (p.platform_settings?.tiktok) {
          //   setValue("tiktokPrivacyLevel", p.platform_settings.tiktok.privacy_level || "PUBLIC_TO_EVERYONE")
          //   ...
          // }
        })

        if (hasCustom) {
          setValue("customizePerPlatform", true)
        }
      })
      .catch(err => {
        toast.error("Failed to load post data")
      })
      .finally(() => {
        setIsFetching(false)
      })
  }, [postId, setValue, setChannels])

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
      if (mappedPlatforms.includes("youtube")) {
        platformSettings.youtube = {
          title: (customizePerPlatform ? youtubeTitle : title) || title,
          description: (customizePerPlatform ? youtubeCaption : caption) || caption
        }
      }

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

      if (mappedPlatforms.includes("tiktok")) {
        const vals = getValues()
        platformSettings.tiktok = {
          ...(platformSettings.tiktok || {}),
          privacy_level: vals.tiktokPrivacyLevel,
          disable_comment: !vals.tiktokAllowComments,
          disable_duet: !vals.tiktokAllowDuet,
          disable_stitch: !vals.tiktokAllowStitch,
          brand_content_toggle: vals.tiktokBrandContentToggle,
          brand_organic_toggle: vals.tiktokBrandOrganicToggle,
        }
      }

      let thumbnailFile: File | undefined = undefined
      if (thumbnailDataUrl) {
        try {
          thumbnailFile = dataURLtoFile(thumbnailDataUrl, "thumbnail.jpg")
        } catch (error) {
          console.error("Error converting thumbnail data URL to File:", error)
        }
      }

      if (postId) {
        return updateScheduledPost(postId, {
          caption: caption || "",
          platforms: mappedPlatforms,
          platformSettings: Object.keys(platformSettings).length > 0 ? platformSettings : undefined,
          scheduledAt
        }).then(res => {
          // ensure consistent response for modal
          return res
        })
      }

      return publishVideoPost({
        video: videoFile!,
        caption: caption || "",
        platforms: mappedPlatforms,
        platformSettings: Object.keys(platformSettings).length > 0 ? platformSettings : undefined,
        scheduledAt,
        thumbnail: thumbnailFile,
        video_thumbnail_offset: coverImageTimestamp,
      }, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || progressEvent.loaded))
        setUploadProgress(percent)
      })
    }
  })

  const handleFileChange = (file: File | null) => {
    if (!file) {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc)
      }
      setVideoFile(null)
      setVideoSrc("")
      setIsPlaying(false)
      setThumbnailDataUrl("")
      setValue("coverImageTimestamp", undefined)
      setIsHorizontal(false)
      return
    }

    setVideoFile(file)
    const url = URL.createObjectURL(file)
    setVideoSrc(url)
    setIsPlaying(false)

    // Clear cover image when media is replaced/updated
    setThumbnailDataUrl("")
    setValue("coverImageTimestamp", undefined)
  }

  const togglePlay = () => {
    const nextPlay = !isPlaying
    setIsPlaying(nextPlay)

    if (nextPlay) {
      // Sync preview to the main video's current time before playing both
      if (videoRef.current && previewVideoRef.current) {
        previewVideoRef.current.currentTime = videoRef.current.currentTime
      }
      videoRef.current?.play().catch(() => { })
      previewVideoRef.current?.play().catch(() => { })
    } else {
      videoRef.current?.pause()
      previewVideoRef.current?.pause()
    }
  }

  const onPublishClick = (action: "schedule" | "now") => {
    const activeChs = channels.filter(c => c.selected)
    if (activeChs.length === 0) {
      toast.error("No channels selected", {
        description: "Please select at least one social media channel to post to.",
      })
      return
    }

    if (!postId && !videoFile) {
      toast.error("Video file is missing", {
        description: "Please upload a video to compose your post.",
      })
      return
    }

    const isYoutubeSelected = activeChs.some(c => c.platform === "youtube")
    if (isYoutubeSelected && !title.trim()) {
      toast.error("YouTube Title is required", {
        description: "Please add a YouTube Title before publishing to YouTube.",
      })
      return
    }

    handlePublish(action, scheduleDate, scheduleTime)
  }

  const activeChannel = channels.find(c => c.selected && c.platform === previewPlatform) || channels.find(c => c.selected) || channels[0]

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-20 py-6 md:py-10 animate-fade-in text-slate-800 dark:text-slate-200">

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
              Create video post
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Draft and schedule multi-platform short video content
            </p>
          </div>
        </div>

        {/* Action Header publish shortcut */}
        <div className="flex items-center gap-2">
          <button
            disabled={isPublishing || isFetching}
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
        <div className={videoSrc ? "lg:col-span-7 space-y-6" : "lg:col-span-8 space-y-6"}>

          {postId ? (
            <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 overflow-hidden group">
              <div className="absolute inset-0 pointer-events-none" />
              <div className="w-full bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200/50 dark:border-amber-500/20 p-3 flex items-start sm:items-center gap-3">
                <div className="bg-amber-100 dark:bg-amber-500/20 p-1.5 rounded-full shrink-0 mt-0.5 sm:mt-0">
                  <Lock className="size-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    Media Locked
                  </p>
                  <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-0.5 leading-relaxed">
                    Scheduled posts cannot change media. To swap videos, delete this post and create a new one.
                  </p>
                </div>
              </div>
              <div className="p-6 sm:p-8 flex justify-center items-center min-h-[300px]">
                {videoSrc ? (
                  <div className="relative w-full max-w-sm rounded-lg overflow-hidden shadow-sm border border-slate-200/50 dark:border-slate-800/50 aspect-video bg-black flex items-center justify-center">
                     <video src={videoSrc} className="max-h-full max-w-full" controls />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                    <FileVideo className="size-10 mb-2 opacity-50" />
                    <span className="text-sm font-medium">Video preview unavailable</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <MediaFileUploader
              videoSrc={videoSrc}
              videoFile={videoFile}
              isPlaying={isPlaying}
              videoRef={videoRef}
              thumbnailDataUrl={thumbnailDataUrl}
              coverImageTimestamp={coverImageTimestamp}
              onTogglePlay={togglePlay}
              onFileChange={handleFileChange}
              onOpenThumbnailPicker={() => setShowThumbnailPicker(true)}
              onThumbnailSelect={(dataUrl) => {
                setThumbnailDataUrl(dataUrl)
                setValue("coverImageTimestamp", undefined)
              }}
              isHorizontalVideo={isHorizontal}
              onVideoMetadataLoaded={({ isHorizontal }) => setIsHorizontal(isHorizontal)}
            />
          )}

          {/* Thumbnail Picker Modal */}
          {showThumbnailPicker && videoSrc && (
            <ThumbnailPickerModal
              videoSrc={videoSrc}
              currentThumbnail={thumbnailDataUrl}
              initialTimestamp={coverImageTimestamp ? coverImageTimestamp / 1000 : undefined}
              onSelect={(dataUrl, timestamp) => {
                setThumbnailDataUrl(dataUrl)
                setValue("coverImageTimestamp", timestamp)
              }}
              onClose={() => setShowThumbnailPicker(false)}
            />
          )}

          {videoSrc && (
            <CompositionDetails
              register={register}
              setValue={setValue}
              watch={watch}
              channels={channels}
            />
          )}

        </div>

        {/* Right Column - Preview & Scheduler widget */}
        <div className={videoSrc ? "lg:col-span-5 space-y-6 lg:sticky lg:top-6" : "lg:col-span-4 space-y-6"}>

          {videoSrc && (
            <LivePreviewPhone
              videoSrc={videoSrc}
              isPlaying={isPlaying}
              previewPlatform={previewPlatform}
              onChangePreviewPlatform={setPreviewPlatform}
              previewVideoRef={previewVideoRef}
              activeChannel={activeChannel}
              onTogglePlay={togglePlay}
              title={
                customizePerPlatform && previewPlatform === "youtube"
                  ? youtubeTitle || title
                  : title
              }
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
              thumbnailDataUrl={thumbnailDataUrl}
            />
          )}

          <SchedulerWidget
            register={register}
            setValue={setValue}
            isScheduled={isScheduled}
            onChangeIsScheduled={(val) => setValue("isScheduled", val)}
            scheduleDate={scheduleDate}
            scheduleTime={scheduleTime}
            onPublish={onPublishClick}
            disabled={isPublishing}
          />

        </div>

      </div>

      <UploadStatusModal
        isOpen={isStatusModalOpen}
        onClose={handleCloseStatusModal}
        postId={createdPostId}
        uploadProgress={uploadProgress}
        postType="video"
        isScheduled={isScheduled || !!postId}
        selectedPlatforms={selectedChannels.map(c => c.platform)}
        previewData={{
          title: watch("title"),
          caption: watch("caption"),
          imageSrc: thumbnailDataUrl || undefined,
          videoSrc: videoFile ? URL.createObjectURL(videoFile) : undefined
        }}
        fileSizeBytes={videoFile?.size}
      />
    </div>
  )
}
