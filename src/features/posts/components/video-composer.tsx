"use client"

import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useAuth } from "@/features/auth/store/auth-store"
import { useRouter } from "next/navigation"
import { PLATFORM_OPTIONS, PLAIN_AVATAR } from "@/features/onboarding/components/steps/shared"
import { publishVideoPost } from "../api/server"

// Sub-components
import { TargetAccountsSelector } from "./target-accounts-selector"
import type { AccountChannel } from "./target-accounts-selector"
import { MediaFileUploader } from "./media-file-uploader"
import { CompositionDetails } from "./composition-details"
import { LivePreviewPhone } from "./live-preview-phone"
import { SchedulerWidget } from "./scheduler-widget"
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
  const [isPublishing, setIsPublishing] = React.useState(false)

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.push("/dashboard/posts")
    }
  }

  // Target Accounts initial state
  const [channels, setChannels] = React.useState<AccountChannel[]>(() => {
    if (brand?.connected_accounts && brand.connected_accounts.length > 0) {
      return brand.connected_accounts.map((conn) => {
        const opt = PLATFORM_OPTIONS.find((p) => p.id.toLowerCase() === conn.platform.toLowerCase())
        return {
          id: conn.external_id,
          platform: conn.platform.toLowerCase(),
          name: conn.account_name,
          handle: `@${conn.account_name.toLowerCase().replace(/\s+/g, "")}`,
          avatar: conn.profile_picture_url || PLAIN_AVATAR,
          selected: true,
        }
      })
    }

    return []
  })

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
  const [videoDuration, setVideoDuration] = React.useState("0:00")
  const [videoSize, setVideoSize] = React.useState("")
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

  const getPlatformIcon = (platformId: string) => {
    const opt = PLATFORM_OPTIONS.find(p => p.id === platformId)
    return opt ? opt.icon : "/social-icons/tiktok-circle.png"
  }

  const toggleChannel = (id: string) => {
    setChannels(prev =>
      prev.map(c => (c.id === id ? { ...c, selected: !c.selected } : c))
    )
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const loadVideo = (file: File) => {
    if (!file.type.startsWith("video/")) {
      toast.error("Invalid file format", {
        description: "Please upload a valid MP4, WebM, or MOV video file.",
      })
      return
    }

    setVideoFile(file)
    const url = URL.createObjectURL(file)
    setVideoSrc(url)
    setIsPlaying(true)

    // Clear cover image when media is replaced/updated
    setThumbnailDataUrl("")
    setValue("coverImageTimestamp", undefined)

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1)
    setVideoSize(`${sizeInMB} MB`)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadVideo(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      loadVideo(e.target.files[0])
    }
  }

  const triggerFileSelect = () => {
    const input = document.getElementById("video-upload-input")
    input?.click()
  }

  const removeVideo = () => {
    if (videoSrc) {
      URL.revokeObjectURL(videoSrc)
    }
    setVideoFile(null)
    setVideoSrc("")
    setVideoDuration("0:00")
    setVideoSize("")
    setIsPlaying(false)
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

  const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget
    const minutes = Math.floor(video.duration / 60)
    const seconds = Math.floor(video.duration % 60)
    setVideoDuration(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`)
  }

  const handlePublish = async (action: "schedule" | "now") => {
    if (isPublishing) return

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

    if (action === "schedule") {
      toast.error("Scheduling not supported yet", {
        description: "Scheduled posting is not supported in this version. Please select 'Publish Now'.",
      })
      return
    }

    setIsPublishing(true)
    const toastId = toast.loading("Publishing video post...", {
      description: "Uploading and publishing your video post immediately.",
    })

    try {
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

      await publishVideoPost({
        video: videoFile,
        caption: caption || "",
        platforms: mappedPlatforms,
        platformSettings: Object.keys(platformSettings).length > 0 ? platformSettings : undefined,
      })

      toast.success("Video post published!", {
        id: toastId,
        description: "Successfully published to the selected platform(s).",
        duration: 5000,
      })
      router.push("/dashboard/posts")
    } catch (err: any) {
      setIsPublishing(false)
      const errorMsg = err.response?.data?.message || err.message || "Something went wrong while publishing."
      toast.error("Failed to publish", {
        id: toastId,
        description: errorMsg,
      })
    }
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
            onClick={() => handlePublish(isScheduled ? "schedule" : "now")}
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
        getPlatformIcon={getPlatformIcon}
      />

      {/* Main Grid: Left inputs, Right preview/scheduler */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column - Form fields */}
        <div className={videoSrc ? "lg:col-span-7 space-y-6" : "lg:col-span-8 space-y-6"}>

          <MediaFileUploader
            videoSrc={videoSrc}
            videoFile={videoFile}
            videoDuration={videoDuration}
            videoSize={videoSize}
            isPlaying={isPlaying}
            videoRef={videoRef}
            thumbnailDataUrl={thumbnailDataUrl}
            onTogglePlay={togglePlay}
            onRemoveVideo={removeVideo}
            onTriggerFileSelect={triggerFileSelect}
            onOpenThumbnailPicker={() => setShowThumbnailPicker(true)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onFileChange={handleFileChange}
            onVideoLoadedMetadata={handleVideoLoadedMetadata}
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
            onPublish={handlePublish}
            disabled={isPublishing}
          />

        </div>

      </div>

    </div>
  )
}
