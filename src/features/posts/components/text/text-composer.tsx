"use client"

import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useAuth } from "@/features/auth/store/auth-store"
import { useRouter } from "next/navigation"
import { PLAIN_AVATAR } from "@/features/onboarding/components/steps/shared"
import { publishTextPost } from "../../api/server"
import { UploadStatusModal } from "../upload-status-modal"
import { TargetAccountsSelector } from "../target-accounts-selector"
import type { AccountChannel } from "../target-accounts-selector"
import { CompositionDetails } from "../composition-details"
import { SchedulerWidget } from "../scheduler-widget"
import { TextPreviewPhone } from "./text-preview-phone"

export function TextComposer() {
  const router = useRouter()
  const user = useAuth((state) => state.user)
  const brand = user?.brand
  const [isPublishing, setIsPublishing] = React.useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [createdPostId, setCreatedPostId] = React.useState<string | null>(null)

  // Target Accounts initial state - Text-only platforms
  const [channels, setChannels] = React.useState<AccountChannel[]>(() => {
    if (brand?.connected_accounts && brand.connected_accounts.length > 0) {
      let firstActiveSelected = false
      return brand.connected_accounts
        .filter((conn) => 
          ["facebook", "linkedin", "twitter", "x"].includes(conn.platform.toLowerCase())
        )
        .map((conn) => {
          const isExpired = !!conn.is_expired
          let shouldSelect = false
          if (!isExpired && !firstActiveSelected) {
            shouldSelect = true
            firstActiveSelected = true
          }

          return {
            id: conn.external_id,
            platform: conn.platform.toLowerCase(),
            name: conn.account_name,
            handle: `@${conn.account_name.toLowerCase().replace(/\s+/g, "")}`,
            avatar: conn.profile_picture_url || PLAIN_AVATAR,
            selected: shouldSelect,
            expired: isExpired,
          }
        })
    }
    return []
  })

  // React Hook Form
  const { register, watch, setValue, getValues } = useForm({
    defaultValues: {
      title: "",
      caption: "",
      isScheduled: false,
      scheduleDate: "2026-10-16",
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

  const handleBack = () => {
    router.push("/dashboard/posts")
  }

  const toggleChannel = (id: string) => {
    const channel = channels.find((c) => c.id === id)
    if (channel?.expired) {
      toast.error("Account connection expired", {
        description: `Please reconnect your ${channel.name} account in Connections settings.`,
      })
      return
    }

    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    )
  }

  const handlePublish = async (action: "schedule" | "now") => {
    if (isPublishing) return

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

    if (action === "schedule") {
      toast.error("Scheduling not supported yet", {
        description: "Scheduled posting is not supported in this version. Please select 'Publish Now'.",
      })
      return
    }

    setUploadProgress(0)
    setCreatedPostId(null)
    setIsStatusModalOpen(true)
    setIsPublishing(true)

    try {
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

      // Progress bar simulation since there are no actual files uploaded
      setUploadProgress(20)
      const response = await publishTextPost(
        {
          caption: caption || "",
          platforms: mappedPlatforms,
          platformSettings: Object.keys(platformSettings).length > 0 ? platformSettings : undefined,
        },
        (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || progressEvent.loaded)
          )
          setUploadProgress(percent)
        }
      )

      setUploadProgress(100)

      if (response && response.success && response.data) {
        setCreatedPostId(response.data.id)
      } else {
        throw new Error("Failed to retrieve created post details.")
      }
    } catch (err: any) {
      setIsPublishing(false)
      setIsStatusModalOpen(false)
      const errorMsg =
        err.response?.data?.message || err.message || "Something went wrong while publishing."
      toast.error("Failed to publish", {
        description: errorMsg,
      })
    }
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
            disabled={isPublishing}
            onClick={() => handlePublish(isScheduled ? "schedule" : "now")}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-linear-to-r from-accent-dark to-accent-brand text-white shadow-md hover:brightness-105 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? "Publishing..." : isScheduled ? "Schedule Post" : "Publish Now"}
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
            onPublish={handlePublish}
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
      />
    </div>
  )
}
