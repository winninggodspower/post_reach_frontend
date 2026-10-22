"use client"

import React from "react"
import {
  BarChart3,
  Bookmark,
  Eye,
  Film,
  Heart,
  Image as ImageIcon,
  FileText,
  Loader2,
  MessageSquare,
  MousePointerClick,
  RefreshCw,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
  AlertCircle,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { usePostAnalytics } from "../hooks/use-post-analytics"
import { MetricStatCard } from "./metric-stat-card"
import { PlatformMetricRow } from "./platform-metric-row"

export interface PostAnalyticsDialogProps {
  isOpen: boolean
  onClose: () => void
  postId: string | null
  initialPost?: {
    caption?: string | null
    content_type?: "video" | "photo" | "text" | string
    thumbnail_url?: string | null
    media_urls?: string[] | null
    created_at?: string | null
  } | null
}

export function PostAnalyticsDialog({
  isOpen,
  onClose,
  postId,
  initialPost,
}: PostAnalyticsDialogProps) {
  const { data, isLoading, isRefreshing, error, refresh, reload } = usePostAnalytics(
    postId,
    { enabled: isOpen && !!postId }
  )

  // Listen for escape key press to close modal
  React.useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const caption = data?.caption || initialPost?.caption || ""
  const contentType = data?.content_type || initialPost?.content_type || "post"
  const mediaUrl =
    initialPost?.thumbnail_url ||
    (initialPost?.media_urls && initialPost.media_urls[0]) ||
    null

  const getContentTypeIcon = () => {
    switch (contentType) {
      case "video":
        return <Film className="size-3" />
      case "photo":
        return <ImageIcon className="size-3" />
      case "text":
      default:
        return <FileText className="size-3" />
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-accent-brand/10 text-accent-brand">
              <BarChart3 className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Post Performance & Analytics
                </h2>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
                  <Sparkles className="size-2.5 text-purple-600 dark:text-purple-400" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Consolidated metrics & platform breakdown
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Force Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading || isRefreshing}
              onClick={() => void refresh()}
              className="h-9 px-3.5 rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <RefreshCw
                className={`size-3.5 ${isRefreshing ? "animate-spin text-accent-brand" : ""}`}
              />
              <span className="hidden sm:inline">
                {isRefreshing ? "Syncing..." : "Sync Live Data"}
              </span>
            </Button>

            <button
              onClick={onClose}
              className="size-9 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
              title="Close modal"
            >
              <X className="size-4.5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Post Header Strip (Preview + Caption Snippet) */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            {mediaUrl ? (
              <div className="relative size-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mediaUrl} alt="Thumbnail" className="size-full object-cover" />
                {contentType === "video" && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Film className="size-3.5 text-white" />
                  </div>
                )}
              </div>
            ) : (
              <div className="size-14 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 flex items-center justify-center shrink-0">
                <FileText className="size-5 text-slate-400" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {getContentTypeIcon()}
                  {contentType}
                </span>
                {data?.created_at && (
                  <span className="text-xs text-slate-400">
                    Published {new Date(data.created_at).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {caption || <span className="italic text-slate-400">No caption</span>}
              </p>
            </div>
          </div>

          {/* Loading Skeleton */}
          {isLoading && !data && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-2xl w-full" />
                ))}
              </div>
              <div className="space-y-3 pt-2">
                <Skeleton className="h-6 w-48 rounded-lg" />
                <Skeleton className="h-32 rounded-2xl w-full" />
                <Skeleton className="h-32 rounded-2xl w-full" />
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-6 flex flex-col items-center text-center">
              <div className="size-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-3">
                <AlertCircle className="size-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Unable to Load Analytics
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mt-1">
                {error}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void reload()}
                className="mt-4 rounded-xl cursor-pointer"
              >
                <RefreshCw className="mr-2 size-3.5" />
                Retry
              </Button>
            </div>
          )}

          {/* Analytics Loaded Content */}
          {data && (
            <>
              {/* Primary Engagement Overview (8 Grid Cards) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total Performance
                  </h3>
                  <span className="text-xs text-slate-400">
                    Calculated across {data.platforms.length}{" "}
                    {data.platforms.length === 1 ? "platform" : "platforms"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <MetricStatCard
                    label="Total Views"
                    value={data.total_views}
                    icon={Eye}
                    variant="blue"
                  />
                  <MetricStatCard
                    label="Total Reach"
                    value={data.total_reach}
                    icon={Users}
                    variant="purple"
                  />
                  <MetricStatCard
                    label="Engagement Rate"
                    value={data.overall_engagement_rate}
                    icon={TrendingUp}
                    variant="primary"
                    isPercentage
                  />
                  <MetricStatCard
                    label="Total Likes"
                    value={data.total_likes}
                    icon={Heart}
                    variant="rose"
                  />
                  <MetricStatCard
                    label="Comments"
                    value={data.total_comments}
                    icon={MessageSquare}
                    variant="blue"
                  />
                  <MetricStatCard
                    label="Shares"
                    value={data.total_shares}
                    icon={Share2}
                    variant="emerald"
                  />
                  <MetricStatCard
                    label="Saves"
                    value={data.total_saves}
                    icon={Bookmark}
                    variant="amber"
                  />
                  <MetricStatCard
                    label="Link Clicks"
                    value={data.total_clicks}
                    icon={MousePointerClick}
                    variant="purple"
                  />
                </div>
              </div>

              {/* Platform Breakdown Section */}
              <div className="space-y-3 pt-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Platform Breakdown
                  </h3>
                  <span className="text-xs text-slate-400">
                    Individual network engagement
                  </span>
                </div>

                <div className="space-y-3">
                  {data.platforms && data.platforms.length > 0 ? (
                    data.platforms.map((plat) => (
                      <PlatformMetricRow
                        key={plat.platform_post_id || plat.platform}
                        platformMetric={plat}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
                      No destination platform breakdown data available yet.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <span className="text-xs text-slate-400">
            Metrics sync automatically every 60 minutes.
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl px-4 cursor-pointer"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
