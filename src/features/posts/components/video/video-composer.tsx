"use client"

import * as React from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useAuth } from "@/features/auth/store/auth-store"
import { useRouter } from "next/navigation"
import { useTargetChannels } from "../../hooks/use-target-channels"
import { usePostSubmit } from "../../hooks/use-post-submit"
import { usePostHydration } from "../../hooks/use-post-hydration"
import { publishVideoPost, updateScheduledPost } from "../../api/server"
import { UploadStatusModal } from "../upload-status-modal"
import { FileVideo } from "lucide-react"
import { format, addDays } from "date-fns"

// Sub-components
import { TargetAccountsSelector } from "../target-accounts-selector"
import { MediaFileUploader } from "./media-file-uploader"
import { CompositionDetails } from "../composition-details"
import { LivePreviewPhone } from "./live-preview-phone"
import { SchedulerWidget } from "../scheduler-widget"
import { ThumbnailPickerModal } from "./thumbnail-picker-modal"
import { ComposerHeader } from "../composer-header"
import { LockedMediaCard } from "../locked-media-card"
import type { VideoPostFormValues } from "../../types/composer"
import { buildPlatformSettings } from "../../lib/composer-utils"

export type { VideoPostFormValues } from "../../types/composer"

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

  // Hydrate post data on edit
  const { isFetching } = usePostHydration({
    postId,
    setValue,
    setChannels,
    onMediaLoaded: ({ mediaUrls, thumbnailUrl }) => {
      if (mediaUrls?.[0]) {
        setVideoSrc(mediaUrls[0])
      }
      if (thumbnailUrl) {
        setThumbnailDataUrl(thumbnailUrl)
      }
    },
  })

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
      const vals = getValues()

      const platformSettings = buildPlatformSettings({
        platforms,
        values: vals,
        extraSettings: {
          youtube: platforms.includes("youtube")
            ? {
                title: youtubeTitle?.trim() || vals.title || title,
                description: youtubeCaption?.trim() || vals.caption || caption,
              }
            : undefined,
          tiktok: platforms.includes("tiktok")
            ? {
                privacy_level: vals.tiktokPrivacyLevel,
                disable_comment: !vals.tiktokAllowComments,
                disable_duet: !vals.tiktokAllowDuet,
                disable_stitch: !vals.tiktokAllowStitch,
                brand_content_toggle: vals.tiktokBrandContentToggle,
                brand_organic_toggle: vals.tiktokBrandOrganicToggle,
              }
            : undefined,
        },
      })

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
          platforms,
          platformSettings,
          scheduledAt,
        }).then((res) => {
          return res
        })
      }

      return publishVideoPost(
        {
          video: videoFile!,
          caption: caption || "",
          platforms,
          platformSettings,
          scheduledAt,
          thumbnail: thumbnailFile,
          video_thumbnail_offset: coverImageTimestamp,
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
      videoRef.current?.play().catch(() => {})
      previewVideoRef.current?.play().catch(() => {})
    } else {
      videoRef.current?.pause()
      previewVideoRef.current?.pause()
    }
  }

  const onPublishClick = (action: "schedule" | "now") => {
    const activeChs = channels.filter((c) => c.selected)
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

    const isYoutubeSelected = activeChs.some((c) => c.platform === "youtube")
    if (isYoutubeSelected && !title.trim()) {
      toast.error("YouTube Title is required", {
        description: "Please add a YouTube Title before publishing to YouTube.",
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
      {/* Unified Composer Header */}
      <ComposerHeader
        title={postId ? "Edit scheduled post" : "Create video post"}
        subtitle={
          postId
            ? "Update caption, time, or platforms"
            : "Draft and schedule multi-platform short video content"
        }
        onBack={onBack}
        onPublish={() => onPublishClick(isScheduled ? "schedule" : "now")}
        isPublishing={isPublishing}
        isScheduled={isScheduled}
        isEditMode={!!postId}
        disabled={isPublishing || isFetching}
      />

      {/* Target Accounts Selector */}
      <TargetAccountsSelector channels={channels} onToggleChannel={toggleChannel} />

      {/* Main Grid: Left inputs, Right preview/scheduler */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column - Form fields */}
        <div className={videoSrc ? "lg:col-span-7 space-y-6" : "lg:col-span-8 space-y-6"}>
          {postId ? (
            <LockedMediaCard
              description="Scheduled posts cannot change media. To swap videos, delete this post and create a new one."
            >
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
            </LockedMediaCard>
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
                previewPlatform === "youtube" && youtubeTitle
                  ? youtubeTitle
                  : title
              }
              caption={
                (previewPlatform === "youtube"
                  ? youtubeCaption
                  : previewPlatform === "tiktok"
                  ? tiktokCaption
                  : instagramCaption) || caption
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
        selectedPlatforms={selectedChannels.map((c) => c.platform)}
        previewData={{
          title: watch("title"),
          caption: watch("caption"),
          imageSrc: thumbnailDataUrl || undefined,
          videoSrc: videoFile ? URL.createObjectURL(videoFile) : undefined,
        }}
        fileSizeBytes={videoFile?.size}
      />
    </div>
  )
}
