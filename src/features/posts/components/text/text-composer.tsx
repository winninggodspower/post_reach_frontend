"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { useAuth } from "@/features/auth/store/auth-store"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useTargetChannels } from "../../hooks/use-target-channels"
import { usePostSubmit } from "../../hooks/use-post-submit"
import { usePostHydration } from "../../hooks/use-post-hydration"
import { publishTextPost, updateScheduledPost } from "../../api/server"
import { UploadStatusModal } from "../upload-status-modal"
import { TargetAccountsSelector } from "../target-accounts-selector"
import { format, addDays } from "date-fns"
import { CompositionDetails } from "../composition-details"
import { SchedulerWidget } from "../scheduler-widget"
import { TextPreviewPhone } from "./text-preview-phone"
import { ComposerHeader } from "../composer-header"
import type { TextPostFormValues } from "../../types/composer"
import { buildPlatformSettings } from "../../lib/composer-utils"
import { Loader2 } from "lucide-react"

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
  const { register, watch, setValue, getValues } = useForm<TextPostFormValues>({
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

  // Hydrate post data when editing
  const { isFetching } = usePostHydration({
    postId,
    setValue,
    setChannels,
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

      setUploadProgress(20)
      return publishTextPost(
        {
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
      {isFetching && (
        <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
          <Loader2 className="size-8 text-accent-brand animate-spin" />
        </div>
      )}

      {/* Unified Composer Header */}
      <ComposerHeader
        title={postId ? "Edit scheduled post" : "Create text post"}
        subtitle={
          postId
            ? "Update caption, time, or platforms"
            : "Draft and schedule text-only posts across platforms"
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
        selectedPlatforms={selectedChannels.map((c) => c.platform)}
        previewData={{
          title: "Text Post",
          caption: caption,
        }}
      />
    </div>
  )
}
