"use client"

import React from "react"
import {
  ExternalLink,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MousePointerClick,
  Users,
  TrendingUp,
} from "lucide-react"
import { formatDistanceToNow, parseISO } from "date-fns"
import { getPlatformMeta } from "@/features/posts/components/upload-status/utils"
import type { PostPlatformMetric } from "../types/post-analytics"

export interface PlatformMetricRowProps {
  platformMetric: PostPlatformMetric
}

const formatCompact = (num: number): string => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K"
  return num.toLocaleString()
}

export function PlatformMetricRow({ platformMetric }: PlatformMetricRowProps) {
  const meta = getPlatformMeta(platformMetric.platform)

  const syncedAgo = platformMetric.last_synced_at
    ? (() => {
        try {
          return `${formatDistanceToNow(parseISO(platformMetric.last_synced_at), { addSuffix: true })}`
        } catch {
          return new Date(platformMetric.last_synced_at).toLocaleString()
        }
      })()
    : null

  const isFailed = (platformMetric.status || "").toLowerCase() === "failed"
  const isPosted = (platformMetric.status || "").toLowerCase() === "posted"
  const isPending = (platformMetric.status || "").toLowerCase() === "pending" || (platformMetric.status || "").toLowerCase() === "scheduled"
  
  const statusBadgeClass = isPosted
    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50"
    : isFailed
    ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800/50"
    : isPending
    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800/50"
    : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/50"

  return (
    <div className="group rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 sm:p-5 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700">
      {/* Platform Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={meta.icon} alt={meta.label} className="size-4.5 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {meta.label}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadgeClass}`}>
                {platformMetric.status}
              </span>
            </div>
            {syncedAgo && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                Synced {syncedAgo}
              </span>
            )}
          </div>
        </div>

        {/* Engagement Rate Badge & Post Link */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60 text-xs font-bold">
            <TrendingUp className="size-3.5 text-purple-600 dark:text-purple-400" />
            <span>{platformMetric.engagement_rate.toFixed(2)}% ER</span>
          </div>

          {platformMetric.post_url && (
            <a
              href={platformMetric.post_url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title="Open post on platform"
            >
              <span>View</span>
              <ExternalLink className="size-3 text-slate-400" />
            </a>
          )}
        </div>
      </div>

      {/* Metrics Row Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-3.5">
        <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 p-2.5 flex flex-col">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[11px] font-medium">
            <Eye className="size-3" />
            <span>Views</span>
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
            {formatCompact(platformMetric.views)}
          </span>
        </div>

        <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 p-2.5 flex flex-col">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[11px] font-medium">
            <Users className="size-3" />
            <span>Reach</span>
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
            {formatCompact(platformMetric.reach)}
          </span>
        </div>

        <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 p-2.5 flex flex-col">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[11px] font-medium">
            <Heart className="size-3 text-rose-500" />
            <span>Likes</span>
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
            {formatCompact(platformMetric.likes)}
          </span>
        </div>

        <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 p-2.5 flex flex-col">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[11px] font-medium">
            <MessageSquare className="size-3 text-blue-500" />
            <span>Comments</span>
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
            {formatCompact(platformMetric.comments)}
          </span>
        </div>

        <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 p-2.5 flex flex-col">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[11px] font-medium">
            <Share2 className="size-3 text-emerald-500" />
            <span>Shares</span>
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
            {formatCompact(platformMetric.shares)}
          </span>
        </div>

        <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 p-2.5 flex flex-col">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[11px] font-medium">
            <Bookmark className="size-3 text-amber-500" />
            <span>Saves</span>
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
            {formatCompact(platformMetric.saves)}
          </span>
        </div>

        <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 p-2.5 flex flex-col">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[11px] font-medium">
            <MousePointerClick className="size-3 text-purple-500" />
            <span>Clicks</span>
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
            {formatCompact(platformMetric.clicks)}
          </span>
        </div>
      </div>
    </div>
  )
}
