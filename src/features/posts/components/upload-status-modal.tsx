"use client"

import * as React from "react"
import { CheckCircle2, XCircle, Loader2, ExternalLink } from "lucide-react"
import { ModalShell } from "@/components/ui/modal-shell"
import { PLATFORM_OPTIONS } from "@/features/onboarding/components/steps/shared"
import { getPostStatus } from "../api/server"
import type { PlatformPostStatus } from "../api/server"

type UploadStatusModalProps = {
  isOpen: boolean
  onClose: () => void
  postId: string | null
  uploadProgress: number
}

export function UploadStatusModal({
  isOpen,
  onClose,
  postId,
  uploadProgress,
}: UploadStatusModalProps) {
  const [platformStatuses, setPlatformStatuses] = React.useState<PlatformPostStatus[]>([])
  const [error, setError] = React.useState<string | null>(null)

  // Determine terminal states
  const isFinished = React.useMemo(() => {
    if (platformStatuses.length === 0) return false
    return platformStatuses.every((p) => p.status === "posted" || p.status === "failed")
  }, [platformStatuses])

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

  // Poll status endpoint
  React.useEffect(() => {
    if (!isOpen || !postId || isFinished) return

    let isMounted = true
    const pollInterval = setInterval(async () => {
      try {
        const response = await getPostStatus(postId)
        if (isMounted && response.success && response.data) {
          setPlatformStatuses(response.data.platforms || [])
        }
      } catch (err: any) {
        console.error("Error polling post status:", err)
      }
    }, 2500)

    return () => {
      isMounted = false
      clearInterval(pollInterval)
    }
  }, [isOpen, postId, isFinished])

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
        return `https://youtube.com/shorts/${platformPostId}`
      case "instagram":
        return `https://instagram.com/p/${platformPostId}`
      case "tiktok":
        return `https://www.tiktok.com/video/${platformPostId}`
      case "facebook":
        return `https://facebook.com/watch/?v=${platformPostId}`
      case "linkedin":
        return `https://www.linkedin.com/feed/update/${platformPostId}`
      case "twitter":
      case "x":
        return `https://x.com/i/status/${platformPostId}`
      default:
        return null
    }
  }

  const renderStatusIcon = (status: PlatformPostStatus["status"]) => {
    switch (status) {
      case "posted":
        return <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
      case "failed":
        return <XCircle className="size-5 text-rose-500 shrink-0" />
      case "uploading":
      case "pending":
      default:
        return <Loader2 className="size-5 text-accent-brand animate-spin shrink-0" />
    }
  }

  const renderStatusBadge = (status: PlatformPostStatus["status"]) => {
    switch (status) {
      case "posted":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50">
            Published
          </span>
        )
      case "failed":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200/50">
            Failed
          </span>
        )
      case "uploading":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-200/50">
            Uploading
          </span>
        )
      case "pending":
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 dark:bg-slate-950/20 text-slate-600 dark:text-slate-400 border border-slate-200/50">
            Queued
          </span>
        )
    }
  }

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={() => {
        if (isFinished) {
          onClose()
        }
      }}
      title={postId ? "Publishing Status" : "Uploading Video"}
      showPulseAccent={!isFinished}
      maxWidthClass="max-w-2xl"
      footerContent={
        isFinished && (
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 shadow-md transition cursor-pointer"
          >
            Close Summary
          </button>
        )
      }
    >
      <div className="space-y-6">
        {/* Upload Progress Section */}
        {uploadProgress < 100 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Uploading to servers...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-accent-dark to-accent-brand transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
              Please do not close this tab or navigate away.
            </p>
          </div>
        )}

        {/* Polling Multi-platform publishing status */}
        {uploadProgress === 100 && (
          <div className="space-y-4">
            <div className="py-2">
              {!isFinished ? (
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-650 dark:text-slate-350 bg-slate-50 dark:bg-slate-950/20 py-3 px-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  <Loader2 className="size-4 text-accent-brand animate-spin" />
                  <span>Processing and distributing video to platforms...</span>
                </div>
              ) : (
                <div className="text-center py-2 animate-fade-in">
                  {publishSummary?.failedCount === 0 ? (
                    <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5 justify-center">
                      🎉 Success! Your content is live!
                    </h4>
                  ) : publishSummary?.postedCount === 0 ? (
                    <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1.5 justify-center">
                      ⚠️ Publishing failed
                    </h4>
                  ) : (
                    <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1.5 justify-center">
                      ⚡ Partial success
                    </h4>
                  )}
                </div>
              )}
            </div>

            {/* List of Platforms and Statuses */}
            {platformStatuses.length > 0 && (
              <div className="space-y-3">
                {platformStatuses.map((status) => {
                  const meta = getPlatformMeta(status.platform)
                  return (
                    <div
                      key={status.id}
                      className="border border-slate-100 dark:border-slate-800/80 rounded-xl p-3.5 bg-slate-50/50 dark:bg-slate-950/20 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={meta.icon}
                            alt={meta.label}
                            className="size-6 object-contain"
                          />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {meta.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {status.status === "posted" && status.platform_post_id && (
                            <a
                              href={getPostUrl(status.platform, status.platform_post_id) || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-semibold text-accent-brand hover:text-accent-dark dark:hover:text-accent-brand/80 mr-2 flex items-center gap-1 transition-colors"
                            >
                              <span>View Post</span>
                              <ExternalLink className="size-3" />
                            </a>
                          )}
                          {renderStatusBadge(status.status)}
                          {renderStatusIcon(status.status)}
                        </div>
                      </div>

                      {/* Error message detail */}
                      {status.status === "failed" && status.error_message && (
                        <p className="text-[10px] text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/10 p-2 rounded-lg leading-normal font-medium border border-rose-100/50 dark:border-rose-900/35">
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
