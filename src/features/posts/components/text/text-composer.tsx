"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { useAuth } from "@/features/auth/store/auth-store"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { toast } from "sonner"
import { useTargetChannels } from "../../hooks/use-target-channels"
import { usePostSubmit } from "../../hooks/use-post-submit"
import { publishTextPost, fetchPostById, updateScheduledPost } from "../../api/server"
import { UploadStatusModal } from "../upload-status-modal"
import { TargetAccountsSelector } from "../target-accounts-selector"
import { format, addDays, parseISO } from "date-fns"
import { CompositionDetails } from "../composition-details"
import { SchedulerWidget } from "../scheduler-widget"
import { TextPreviewPhone } from "./text-preview-phone"

type TextComposerProps = {
  postId?: string
  onBack?: () => void
}

export function TextComposer({ postId, onBack }: TextComposerProps = {}) {
  const router = useRouter()
  const user = useAuth((state) => state.user)
  const brand = user?.brand

  // Target Accounts using hook
  const { channels, toggleChannel, selectedChannels, setChannels } = useTargetChannels(
    brand?.connected_accounts,
    ["facebook", "linkedin", "twitter", "x"]
  )

  // React Hook Form
  const { register, watch, setValue, getValues } = useForm({
    defaultValues: {
      title: "",
      caption: "",
      isScheduled: false,
      scheduleDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      scheduleTime: "14:00",
      customizePerPlatform: false,
      facebookCaption: "",
      linkedinCaption: "",
      xCaption: "",
    },
  })

  const caption = watch("caption")
  const isScheduled = watch("isScheduled")
  const scheduleDate = watch("scheduleDate")
  const scheduleTime = watch("scheduleTime")
  const customizePerPlatform = watch("customizePerPlatform")
  const facebookCaption = watch("facebookCaption")
  const linkedinCaption = watch("linkedinCaption")
  const xCaption = watch("xCaption")

  const [isFetching, setIsFetching] = React.useState(!!postId)

  React.useEffect(() => {
    if (!postId) return

    setIsFetching(true)
    fetchPostById(postId)
      .then(res => {
        if (!res.success || !res.data) throw new Error("Failed to load post")
        const data = res.data

        setValue("caption", data.caption)

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

        // Hydrate custom captions
        let hasCustom = false
        data.platforms.forEach(p => {
          if (p.caption && p.caption !== data.caption) {
            hasCustom = true
            const plat = p.platform.toLowerCase()
            if (plat === 'facebook') setValue('facebookCaption', p.caption)
            if (plat === 'linkedin') setValue('linkedinCaption', p.caption)
            if (plat === 'twitter' || plat === 'x') setValue('xCaption', p.caption)
          }
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
      const activeChs = channels.filter((c) => c.selected)
      const mappedPlatforms = activeChs.map((c) => (c.platform === "x" ? "twitter" : c.platform))

      const platformSettings: Record<string, any> = {}
      if (customizePerPlatform) {
        if (mappedPlatforms.includes("facebook") && facebookCaption) {
          platformSettings.facebook = { caption: facebookCaption }
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

      setUploadProgress(20)
      return publishTextPost(
        {
          caption: caption || "",
          platforms: mappedPlatforms,
          platformSettings: Object.keys(platformSettings).length > 0 ? platformSettings : undefined,
          scheduledAt,
        },
        (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || progressEvent.loaded)
          )
          setUploadProgress(percent)
        }
      )
    }
  })

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.push("/dashboard/posts")
    }
  }

  const onPublishClick = async (action: "schedule" | "now") => {
    const activeChs = channels.filter((c) => c.selected)
    if (activeChs.length === 0) {
      toast.error("No channels selected", {
        description: "Please select at least one social media channel to post to.",
      })
      return
    }

    if (!caption && !customizePerPlatform) {
      toast.error("Content is empty", {
        description: "Please write something before posting.",
      })
      return
    }

    handlePublish(action, scheduleDate, scheduleTime)
  }

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
              Create text post
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Draft and schedule text-only posts across platforms
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
      <TargetAccountsSelector channels={channels} onToggleChannel={toggleChannel} />

      {/* Main Grid: Left inputs, Right preview/scheduler */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column - Form fields */}
        <div className="lg:col-span-7 space-y-6">
          <CompositionDetails
            register={register as any}
            setValue={setValue as any}
            watch={watch as any}
            channels={channels}
          />
        </div>

        {/* Right Column - Preview & Scheduler widget */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
          <TextPreviewPhone
            caption={caption || ""}
            customizePerPlatform={customizePerPlatform}
            facebookCaption={facebookCaption}
            linkedinCaption={linkedinCaption}
            xCaption={xCaption}
            channels={channels}
          />

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
        postType="text"
        isScheduled={isScheduled}
        selectedPlatforms={selectedChannels.map(c => c.platform)}
        previewData={{
          title: "Text Post",
          caption: caption,
        }}
      />
    </div>
  )
}
