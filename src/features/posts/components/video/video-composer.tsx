"use client"

import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useAuth } from "@/features/auth/store/auth-store"
import { useRouter } from "next/navigation"
import { PLATFORM_OPTIONS, PLAIN_AVATAR } from "@/features/onboarding/components/steps/shared"
import { useTargetChannels } from "../../hooks/use-target-channels"
import { usePostSubmit } from "../../hooks/use-post-submit"
import { publishVideoPost } from "../../api/server"
import { UploadStatusModal } from "../upload-status-modal"

// Sub-components
import { TargetAccountsSelector } from "../target-accounts-selector"
import type { AccountChannel } from "../target-accounts-selector"
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
  coverImageTimestamp?: number
}

type VideoComposerProps = {
  onBack?: () => void
}

export function VideoComposer({ onBack }: VideoComposerProps) {
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
  const { channels, toggleChannel, selectedChannels } = useTargetChannels(
    brand?.connected_accounts,
    ["youtube", "instagram", "tiktok", "facebook", "linkedin", "twitter", "x"]
  )

  // React Hook Form
  const { register, watch, setValue } = useForm<VideoPostFormValues>({
    defaultValues: {
      title: "",
      caption: "",
      isScheduled: false,
      scheduleDate: "2026-10-16",
      scheduleTime: "14:00",
      customizePerPlatform: false,
      youtubeTitle: "",
      youtubeCaption: "",
      tiktokCaption: "",
      instagramCaption: "",
      facebookCaption: "",
      linkedinCaption: "",
      xCaption: "",
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

      const platformSettings: Record<string, any> = {}
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

      return publishVideoPost({
        video: videoFile!,
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
      return
    }

    setVideoFile(file)
    const url = URL.createObjectURL(file)
    setVideoSrc(url)
    setIsPlaying(true)

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

  const onPublishClick = async (action: "schedule" | "now") => {
    const activeChs = channels.filter(c => c.selected)
    if (activeChs.length === 0) {
      toast.error("No channels selected", {
        description: "Please select at least one social media channel to post to.",
      })
      return
    }

    if (!videoFile) {
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
            disabled={isPublishing}
            onClick={() => onPublishClick(isScheduled ? "schedule" : "now")}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-linear-to-r from-accent-dark to-accent-brand text-white shadow-md hover:brightness-105 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? "Publishing..." : (isScheduled ? "Schedule Post" : "Publish Now")}
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

          <MediaFileUploader
            videoSrc={videoSrc}
            videoFile={videoFile}
            isPlaying={isPlaying}
            videoRef={videoRef}
            thumbnailDataUrl={thumbnailDataUrl}
            onTogglePlay={togglePlay}
            onFileChange={handleFileChange}
            onOpenThumbnailPicker={() => setShowThumbnailPicker(true)}
          />

          {/* Thumbnail Picker Modal */}
          {showThumbnailPicker && videoSrc && (
            <ThumbnailPickerModal
              videoSrc={videoSrc}
              currentThumbnail={thumbnailDataUrl}
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
        isScheduled={isScheduled}
      />
    </div>
  )
}
