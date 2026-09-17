"use client"

import React from "react"
import {
  Send,
  Calendar,
  Clock,
  UploadCloud,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Video,
  Image as ImageIcon,
  FileText,
  TrendingUp,
  Share2,
} from "lucide-react"
import { AdminPostsMetrics } from "../types"

interface ContentPipelineSectionProps {
  metrics: AdminPostsMetrics
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string
    icon: React.ComponentType<{ className?: string }>
    color: string
    bgColor: string
    borderColor: string
    badgeClass: string
  }
> = {
  posted: {
    label: "Posted",
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
    borderColor: "border-emerald-200 dark:border-emerald-800/60",
    badgeClass: "bg-emerald-500",
  },
  scheduled: {
    label: "Scheduled",
    icon: Calendar,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/40",
    borderColor: "border-blue-200 dark:border-blue-800/60",
    badgeClass: "bg-blue-500",
  },
  processing: {
    label: "Processing",
    icon: Cpu,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/40",
    borderColor: "border-purple-200 dark:border-purple-800/60",
    badgeClass: "bg-purple-500",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/40",
    borderColor: "border-amber-200 dark:border-amber-800/60",
    badgeClass: "bg-amber-500",
  },
  uploading: {
    label: "Uploading",
    icon: UploadCloud,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/40",
    borderColor: "border-indigo-200 dark:border-indigo-800/60",
    badgeClass: "bg-indigo-500",
  },
  failed: {
    label: "Failed",
    icon: AlertTriangle,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950/40",
    borderColor: "border-rose-200 dark:border-rose-800/60",
    badgeClass: "bg-rose-500",
  },
}

export const ContentPipelineSection: React.FC<ContentPipelineSectionProps> = ({
  metrics,
}) => {
  const totalPosts = Math.max(metrics.total_posts || 0, 1)
  const statusEntries = Object.entries(metrics.status_breakdown || {})
  const failedCount = metrics.status_breakdown?.failed || 0

  const contentTypes = [
    {
      key: "video",
      label: "Video",
      count: metrics.content_types_breakdown?.video || 0,
      icon: Video,
      color: "from-purple-500 to-indigo-600",
      textColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      key: "photo",
      label: "Photo / Carousel",
      count: metrics.content_types_breakdown?.photo || 0,
      icon: ImageIcon,
      color: "from-blue-500 to-cyan-600",
      textColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      key: "text",
      label: "Text Only",
      count: metrics.content_types_breakdown?.text || 0,
      icon: FileText,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
    },
  ]

  const totalContentCount = Math.max(
    contentTypes.reduce((acc, curr) => acc + curr.count, 0),
    1
  )

  const platformPublishEntries = Object.entries(
    metrics.published_by_platform || {}
  ).sort(([, a], [, b]) => b - a)

  const maxPlatformCount = Math.max(
    ...platformPublishEntries.map(([, count]) => count),
    1
  )

  return (
    <div className="space-y-6">
      {/* Activity Velocity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Created Today
            </span>
            <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
            {(metrics.activity?.posts_created_today ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-2">Posts registered in past 24h</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Created This Week
            </span>
            <div className="size-8 rounded-xl bg-orange-50 text-accent-brand border border-orange-100 flex items-center justify-center">
              <Calendar className="size-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
            {(metrics.activity?.posts_created_this_week ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-2">Rolling 7-day creations</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Created This Month
            </span>
            <div className="size-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Send className="size-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
            {(metrics.activity?.posts_created_this_month ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-2">Rolling 30-day creations</p>
        </div>
      </div>

      {/* Failure Alert (if any failed posts exist) */}
      {failedCount > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-rose-800">
          <AlertTriangle className="size-5 shrink-0 text-rose-600 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold">Publishing Pipeline Alert:</span>{" "}
            {failedCount} post{failedCount > 1 ? "s" : ""} flagged with delivery errors. Check provider API tokens or network rate limits.
          </div>
        </div>
      )}

      {/* Pipeline Status Breakdown */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Publishing Pipeline Status</h3>
            <p className="text-xs text-slate-500">
              Real-time lifecycle distribution across all {metrics.total_posts.toLocaleString()} system posts
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <Send className="size-3.5 text-accent-brand" />
            <span>{metrics.live_posts_count.toLocaleString()} Live Published</span>
          </div>
        </div>

        {/* Stacked Proportional Bar */}
        <div className="mt-6">
          <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-100">
            {statusEntries.map(([status, count]) => {
              const config = STATUS_CONFIG[status]
              const pct = (count / totalPosts) * 100
              if (pct === 0) return null
              return (
                <div
                  key={status}
                  style={{ width: `${pct}%` }}
                  title={`${config?.label || status}: ${count} (${pct.toFixed(1)}%)`}
                  className={`${config?.badgeClass || "bg-accent-brand"} transition-all duration-500`}
                />
              )
            })}
          </div>
        </div>

        {/* Status Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          {Object.keys(STATUS_CONFIG).map((statusKey) => {
            const config = STATUS_CONFIG[statusKey]
            const count = metrics.status_breakdown?.[statusKey] ?? 0
            const pct = ((count / totalPosts) * 100).toFixed(1)
            const Icon = config.icon

            return (
              <div
                key={statusKey}
                className={`rounded-xl border ${config.borderColor} ${config.bgColor} p-3.5 transition-all hover:scale-[1.02] flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-600">
                    {config.label}
                  </span>
                  <Icon className={`size-3.5 ${config.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 leading-none">
                    {count.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 mt-1">
                    {pct}%
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Formats & Platform Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Formats */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Content Formats</h3>
            <p className="text-xs text-slate-500">
              Media breakdown across scheduled and published items
            </p>

            <div className="space-y-4 mt-6">
              {contentTypes.map((item) => {
                const pct = ((item.count / totalContentCount) * 100).toFixed(1)
                const Icon = item.icon
                return (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 font-medium text-slate-800">
                        <div className={`p-1.5 rounded-lg ${item.bgColor}`}>
                          <Icon className={`size-4 ${item.textColor}`} />
                        </div>
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-slate-900">
                          {item.count.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          ({pct}%)
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Classified Media</span>
            <span className="font-semibold text-slate-900">
              {totalContentCount.toLocaleString()} items
            </span>
          </div>
        </div>

        {/* Platform Publishing Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">Platform Deliveries</h3>
                <p className="text-xs text-slate-500">
                  Publications across social networks
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-accent-dark bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                <Share2 className="size-3" />
                <span>{metrics.platform_posts_published.toLocaleString()} total</span>
              </div>
            </div>

            <div className="space-y-3.5 mt-6">
              {platformPublishEntries.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No platform posts published yet.
                </div>
              ) : (
                platformPublishEntries.map(([platform, count]) => {
                  const pct = ((count / maxPlatformCount) * 100).toFixed(0)
                  return (
                    <div key={platform} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="capitalize font-semibold text-slate-800">
                          {platform}
                        </span>
                        <span className="font-bold text-slate-900 font-mono">
                          {count.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-accent-brand to-accent-dark transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Aggregated Platform Dispatches</span>
            <span className="font-semibold text-slate-900">
              {metrics.platform_posts_published.toLocaleString()} broadcasts
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
