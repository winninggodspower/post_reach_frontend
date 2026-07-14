"use client"

import * as React from "react"
import { CheckCircle2, XCircle, Loader2, ExternalLink } from "lucide-react"
import { ModalShell } from "@/components/ui/modal-shell"
import { PLATFORM_OPTIONS } from "@/features/onboarding/components/steps/shared"
import { useAuth } from "@/features/auth/store/auth-store"
import { SocialAccountAvatar } from "@/components/ui/social-account-avatar"
import { getPostStatus } from "../api/server"
import type { PlatformPostStatus } from "../api/server"
import confetti from "canvas-confetti"
import { useRouter } from "next/navigation"
import { SuccessCheckIcon } from "@/components/ui/success-check-icon"

type UploadStatusModalProps = {
  isOpen: boolean
  onClose: () => void
  postId: string | null
  uploadProgress: number
  postType?: "video" | "photo" | "text"
  isScheduled?: boolean
}

export function UploadStatusModal({
  isOpen,
  onClose,
  postId,
  uploadProgress,
  postType,
  isScheduled = false,
}: UploadStatusModalProps) {
  const router = useRouter()
  const user = useAuth((state) => state.user)
  const connectedAccounts = user?.brand?.connected_accounts || []
  const [platformStatuses, setPlatformStatuses] = React.useState<PlatformPostStatus[]>([])
  const [contentType, setContentType] = React.useState<"video" | "photo" | "text" | null>(postType || null)
  const [error, setError] = React.useState<string | null>(null)

  // Determine terminal states
  const isFinished = React.useMemo(() => {
    if (isScheduled) return postType === "text" ? !!postId : uploadProgress === 100
    if (platformStatuses.length === 0) return false
    return platformStatuses.every((p) => p.status === "posted" || p.status === "failed")
  }, [platformStatuses, isScheduled, uploadProgress, postType, postId])

  // Helper to determine success counts
  const publishSummary = React.useMemo(() => {
    if (platformStatuses.length === 0) return null
    const postedCount = platformStatuses.filter((p) => p.status === "posted").length
    const failedCount = platformStatuses.filter((p) => p.status === "failed").length
    const totalCount = platformStatuses.length

    return {
      postedCount,
      failedCount,
      totalCount,
    }
  }, [platformStatuses])

  const confettiFiredRef = React.useRef(false)

  // Reset confetti state when modal is opened for a new post
  React.useEffect(() => {
    if (isOpen) {
      confettiFiredRef.current = false
    }
  }, [isOpen, postId])

  // Trigger confetti when at least one platform successfully publishes or when post is successfully scheduled
  React.useEffect(() => {
    const isScheduledSuccess = isScheduled && (postType === "text" ? !!postId : uploadProgress === 100)
    const isNormalSuccess = !isScheduled && isFinished && publishSummary && publishSummary.postedCount > 0

    if ((isScheduledSuccess || isNormalSuccess) && !confettiFiredRef.current) {
      confettiFiredRef.current = true
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [isFinished, publishSummary, isScheduled, uploadProgress, postType, postId])

  // Poll status endpoint
  React.useEffect(() => {
    if (!isOpen || !postId || isFinished || isScheduled) return

    let isMounted = true
    const pollInterval = setInterval(async () => {
      try {
        const response = await getPostStatus(postId)
        if (isMounted && response.success && response.data) {
          setPlatformStatuses(response.data.platforms || [])
          if (response.data.content_type) {
            setContentType(response.data.content_type as any)
          }
        }
      } catch (err: any) {
        console.error("Error polling post status:", err)
      }
    }, 2500)

    return () => {
      isMounted = false
      clearInterval(pollInterval)
    }
  }, [isOpen, postId, isFinished, isScheduled])

  // Get matching icon and accent for platforms
  const getPlatformMeta = (platformKey: string) => {
    // Backend returns 'twitter' but frontend uses 'x'
    const matchKey = platformKey === "twitter" ? "x" : platformKey
    const opt = PLATFORM_OPTIONS.find((p) => p.id.toLowerCase() === matchKey.toLowerCase())
    return {
      label: opt?.label || platformKey,
      icon: opt?.icon || "/placeholder-avatar.svg",
    }
  }

  const getPostUrl = (platform: string, platformPostId: string | null): string | null => {
    if (!platformPostId) return null
    switch (platform.toLowerCase()) {
      case "youtube":
        return contentType === "photo" ? null : `https://youtube.com/shorts/${platformPostId}`
      case "instagram":
        return `https://instagram.com/p/${platformPostId}`
      case "tiktok":
        return `https://www.tiktok.com/video/${platformPostId}`
      case "facebook":
        return contentType === "video"
          ? `https://facebook.com/watch/?v=${platformPostId}`
          : `https://facebook.com/${platformPostId}`
      case "linkedin":
        return `https://www.linkedin.com/feed/update/${platformPostId}`
      case "twitter":
      case "x":
        return `https://x.com/i/status/${platformPostId}`
      default:
        return null
    }
  }

  const renderStatusBadge = (status: PlatformPostStatus["status"]) => {
    switch (status) {
      case "posted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-250/20 shadow-2xs">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Published
          </span>
        )
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-250/20 shadow-2xs">
            <span className="size-1.5 rounded-full bg-rose-500" />
            Failed
          </span>
        )
      case "uploading":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-250/20 shadow-2xs">
            <Loader2 className="size-3 text-blue-500 dark:text-blue-455 animate-spin shrink-0" />
            Uploading
          </span>
        )
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-50 dark:bg-slate-950/20 text-slate-650 dark:text-slate-400 border border-slate-205/50 shadow-2xs">
            <span className="size-1.5 rounded-full bg-slate-405 animate-pulse" />
            Queued
          </span>
        )
    }
  }

  const titleText = React.useMemo(() => {
    if (postId) return "Publishing Status"
    if (contentType === "video") return "Uploading Video"
    if (contentType === "photo") return "Uploading Photos"
    if (contentType === "text") return "Creating Text Post"
    return "Uploading Media"
  }, [postId, contentType])

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={titleText}
      showPulseAccent={!isFinished}
      maxWidthClass="max-w-2xl"
      footerContent={
        <button
          onClick={() => {
            if (isFinished) {
              router.push("/dashboard/calendar")
            } else {
              onClose()
            }
          }}
          className={`w-full sm:w-auto px-6 py-2.5 text-xs font-bold rounded-xl transition duration-300 shadow-md cursor-pointer ${
            isFinished
              ? "bg-linear-to-r from-accent-dark to-accent-brand hover:brightness-105 text-white"
              : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-205 dark:text-slate-900"
          }`}
        >
          {isFinished ? "Done" : "Keep Publishing in Background"}
        </button>
      }
    >
      <div className="space-y-6">
        {/* Upload Progress Section */}
        {postType !== "text" && uploadProgress < 100 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>
                {contentType === "video"
                  ? "Uploading video to servers..."
                  : contentType === "photo"
                  ? "Uploading photos to servers..."
                  : contentType === "text"
                  ? "Publishing text post to servers..."
                  : "Uploading media to servers..."}
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-accent-dark to-accent-brand transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
              Uploading file... You can close this modal; the upload will continue in the background.
            </p>
          </div>
        )}

        {/* Polling Multi-platform publishing status */}
        {(uploadProgress === 100 || postType === "text") && (
          <div className="space-y-5">
            <div className="py-1">
              {isScheduled ? (
                <div className="text-center py-6 animate-fade-in space-y-4">
                  <SuccessCheckIcon />
                  <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-100">
                    Post successfully scheduled!
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    Your content has been successfully queued in your publishing calendar. You can view it anytime on the calendar.
                  </p>
                </div>
              ) : !isFinished ? (
                <div className="flex flex-col gap-2 text-center text-xs font-semibold text-slate-650 dark:text-slate-355 bg-slate-50 dark:bg-slate-950/20 py-3.5 px-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="size-4 text-accent-brand animate-spin" />
                    <span>
                      {contentType === "video"
                        ? "Processing and distributing video to platforms..."
                        : contentType === "photo"
                        ? "Processing and distributing photos to platforms..."
                        : contentType === "text"
                        ? "Processing and distributing text post to platforms..."
                        : "Processing and distributing media to platforms..."}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 font-medium">
                    You can safely close this modal or navigate away. Publishing runs in the background.
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 animate-fade-in space-y-4">
                  {publishSummary?.failedCount === 0 ? (
                    <>
                      <SuccessCheckIcon />
                      <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-100">
                        Post successfully published!
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                        🎉 Success! Your content is now live across all platforms!
                      </p>
                    </>
                  ) : publishSummary?.postedCount === 0 ? (
                    <div className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold text-sm shadow-xs mx-auto">
                      <span>⚠️ Publishing failed</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-sm shadow-xs mx-auto">
                      <span>⚡ Partial success</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* List of Platforms and Statuses */}
            {!isScheduled && platformStatuses.length > 0 && (
              <div className="space-y-3">
                {platformStatuses.map((status) => {
                  const matchKey = status.platform === "twitter" ? "x" : status.platform
                  const connectedAccount = connectedAccounts.find(
                    (acc) => acc.platform.toLowerCase() === matchKey.toLowerCase()
                  )
                  const meta = getPlatformMeta(status.platform)
                  
                  return (
                    <div
                      key={status.id}
                      className="border border-slate-100 dark:border-slate-800/60 rounded-2xl p-4 bg-slate-50/30 dark:bg-slate-950/10 hover:border-slate-200/80 dark:hover:border-slate-800 transition duration-300 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <SocialAccountAvatar
                            avatarUrl={connectedAccount?.profile_picture_url}
                            accountName={connectedAccount?.account_name}
                            platformIconUrl={meta.icon}
                            platformLabel={meta.label}
                            size="sm"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                              {meta.label}
                            </span>
                            {connectedAccount?.account_name && (
                              <span className="text-[10px] text-slate-450 dark:text-slate-500 truncate font-medium">
                                @{connectedAccount.account_name.toLowerCase().replace(/\s+/g, "")}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {status.status === "posted" && status.platform_post_id && (
                            <a
                              href={getPostUrl(status.platform, status.platform_post_id) || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl mr-1.5 flex items-center gap-1.5 transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                            >
                              <span>View Post</span>
                              <ExternalLink className="size-3" />
                            </a>
                          )}
                          <div className="flex items-center gap-1.5">
                            {renderStatusBadge(status.status)}
                          </div>
                        </div>
                      </div>

                      {/* Error message detail */}
                      {status.status === "failed" && status.error_message && (
                        <p className="text-[10px] text-rose-600 dark:text-rose-450 bg-rose-500/5 dark:bg-rose-950/10 p-2.5 rounded-xl leading-normal font-medium border border-rose-500/10">
                          {status.error_message}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </ModalShell>
  )
}
