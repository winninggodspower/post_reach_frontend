"use client"

import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useAuth } from "@/features/auth/store/auth-store"
import { PLATFORM_OPTIONS } from "@/features/onboarding/components/steps/shared"

// Sub-components
import { TargetAccountsSelector } from "./target-accounts-selector"
import type { AccountChannel } from "./target-accounts-selector"
import { MediaFileUploader } from "./media-file-uploader"
import { CompositionDetails } from "./composition-details"
import { LivePreviewPhone } from "./live-preview-phone"
import { SchedulerWidget } from "./scheduler-widget"

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
}

type VideoComposerProps = {
  onBack: () => void
}

export function VideoComposer({ onBack }: VideoComposerProps) {
  const user = useAuth((state) => state.user)
  const brand = user?.brand

  // Target Accounts initial state
  const [channels, setChannels] = React.useState<AccountChannel[]>([
    {
      id: "ch-tiktok-1",
      platform: "tiktok",
      name: brand?.name || user?.first_name || "Jack Ingy",
      handle: "@jack_tok",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      selected: brand?.is_tiktok_connected ?? true,
    },
    {
      id: "ch-youtube-1",
      platform: "youtube",
      name: `${brand?.name || user?.first_name || "Jack"} Shorts`,
      handle: "@jack_shorts",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      selected: brand?.is_youtube_connected ?? true,
    },
    {
      id: "ch-instagram-1",
      platform: "instagram",
      name: `${brand?.name || user?.first_name || "Jack"} Reels`,
      handle: "@jack_reels",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      selected: brand?.is_instagram_connected ?? false,
    },
    {
      id: "ch-facebook-1",
      platform: "facebook",
      name: brand?.name || "Jack Page",
      handle: "@jack_facebook",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
      selected: brand?.is_facebook_connected ?? false,
    },
    {
      id: "ch-linkedin-1",
      platform: "linkedin",
      name: `${user?.first_name} ${user?.last_name}`.trim() || "Jack Ingy",
      handle: "@jack_linkedin",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
      selected: brand?.is_linkedin_connected ?? false,
    },
    {
      id: "ch-x-1",
      platform: "x",
      name: brand?.name || "Jack X",
      handle: "@jack_tweets",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
      selected: brand?.is_x_connected ?? false,
    },
  ])

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

  const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget
    const minutes = Math.floor(video.duration / 60)
    const seconds = Math.floor(video.duration % 60)
    setVideoDuration(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`)
  }

  const handlePublish = (action: "schedule" | "now") => {
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
      toast.success("Video Post Scheduled!", {
        description: `Successfully scheduled to publish on ${activeChs.length} channel(s) on ${scheduleDate} at ${scheduleTime}.`,
        duration: 5000,
      })
    } else {
      toast.success("Publishing Post!", {
        description: "Uploading and publishing your video post immediately.",
        duration: 5000,
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
            onClick={onBack}
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
            onClick={() => handlePublish(isScheduled ? "schedule" : "now")}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-linear-to-r from-accent-dark to-accent-brand text-white shadow-md hover:brightness-105 transition cursor-pointer"
          >
            {isScheduled ? "Schedule Post" : "Publish Now"}
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
            onTogglePlay={togglePlay}
            onRemoveVideo={removeVideo}
            onTriggerFileSelect={triggerFileSelect}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onFileChange={handleFileChange}
            onVideoLoadedMetadata={handleVideoLoadedMetadata}
          />

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
          />

        </div>

      </div>

    </div>
  )
}
