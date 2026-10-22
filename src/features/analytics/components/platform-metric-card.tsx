"use client"

import React from "react"
import { ExternalLink, Film, Play, Quote, FileText, ChevronRight } from "lucide-react"
import { formatDistanceToNow, parseISO } from "date-fns"
import { getPlatformMeta } from "@/features/posts/components/upload-status/utils"
import type { PostPlatformMetric } from "../types/post-analytics"

export interface PlatformMetricCardProps {
  platformMetric: PostPlatformMetric
  caption?: string
  contentType?: string
  mediaUrl?: string | null
}

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K"
  return num.toLocaleString()
}

export function PlatformMetricCard({
  platformMetric,
  caption,
  contentType,
  mediaUrl,
}: PlatformMetricCardProps) {
  const meta = getPlatformMeta(platformMetric.platform)
  const isVideo = contentType === "video"

  const syncedAgo = platformMetric.last_synced_at
    ? (() => {
        try {
          return formatDistanceToNow(parseISO(platformMetric.last_synced_at), { addSuffix: true })
        } catch {
          return new Date(platformMetric.last_synced_at).toLocaleDateString()
        }
      })()
    : null

  return (
    <div className="group flex flex-col h-full rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-lg hover:shadow-black/5 hover:border-slate-300 transition-all duration-300 overflow-hidden">
      {/* Media Preview Area (aspect 16/10) matching ScheduledPostCard */}
      <div className="relative w-full aspect-16/10 bg-slate-100 overflow-hidden border-b border-slate-100">
        {mediaUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl}
              alt=""
              className="size-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="size-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-md group-hover:scale-110 transition-transform">
                  <Play className="size-4.5 fill-current ml-0.5" />
                </div>
              </div>
            )}
          </>
        ) : (
          /* Text-only aesthetic preview matching ScheduledPostCard */
          <div className="relative size-full bg-linear-to-br from-amber-500/5 via-orange-500/5 to-slate-50 p-5 flex flex-col justify-between overflow-hidden">
            <div className="absolute -right-2 -bottom-2 text-slate-200/60 pointer-events-none select-none">
              <Quote className="size-20 rotate-180" />
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <FileText className="size-3.5 text-emerald-600" />
              <span>Text Post</span>
            </div>
            <p className="text-xs font-medium text-slate-700 line-clamp-3 italic z-10 leading-relaxed">
              &ldquo;{caption || "No text preview"}&rdquo;
            </p>
            <div className="h-1 w-8 rounded-full bg-accent-brand/40" />
          </div>
        )}

        {/* Floating Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
          {/* Platform Identity Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full backdrop-blur-md bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-xs border border-slate-200/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={meta.icon} alt={meta.label} className="size-3.5 object-contain" />
            <span>{meta.label}</span>
          </span>

          {/* Engagement Rate Pill */}
          <span className="inline-flex items-center gap-1 rounded-full backdrop-blur-md bg-black/70 text-white px-2.5 py-1 text-[10px] font-bold shadow-xs">
            <span>{platformMetric.engagement_rate.toFixed(1)}% ER</span>
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4">
        {/* Caption snippet */}
        <div>
          <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">
            {caption || "Untitled post"}
          </p>
        </div>

        {/* Clean Metrics Grid */}
        <div className="grid grid-cols-3 gap-2.5 py-3 border-y border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Views
            </span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">
              {formatNumber(platformMetric.views)}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Reach
            </span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">
              {formatNumber(platformMetric.reach)}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Likes
            </span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">
              {formatNumber(platformMetric.likes)}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Comments
            </span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">
              {formatNumber(platformMetric.comments)}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Shares
            </span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">
              {formatNumber(platformMetric.shares)}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Saves
            </span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">
              {formatNumber(platformMetric.saves)}
            </span>
          </div>
        </div>

        {/* Card Footer: Status/Sync Time on Left, Link on Right */}
        <div className="flex items-center justify-between gap-2 pt-1 text-xs">
          {(() => {
            const isFailed = (platformMetric.status || "").toLowerCase() === "failed"
            const isPosted = (platformMetric.status || "").toLowerCase() === "posted"
            const isPending = (platformMetric.status || "").toLowerCase() === "pending" || (platformMetric.status || "").toLowerCase() === "scheduled"
            const dotClass = isPosted ? "bg-emerald-500" : isFailed ? "bg-red-500" : isPending ? "bg-blue-500" : "bg-amber-500 animate-pulse"
            const statusLabel = isFailed ? "Publishing failed" : syncedAgo ? `Synced ${syncedAgo}` : isPosted ? "Published" : platformMetric.status

            return (
              <div className={`flex items-center gap-1.5 text-[11px] font-medium min-w-0 ${isFailed ? "text-red-500" : "text-slate-500"}`}>
                <span className={`size-1.5 rounded-full shrink-0 ${dotClass}`} />
                <span className="truncate">{statusLabel}</span>
              </div>
            )
          })()}

          {platformMetric.post_url ? (
            <a
              href={platformMetric.post_url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[11px] font-semibold text-slate-600 hover:text-slate-950 inline-flex items-center gap-1 shrink-0 transition-colors"
            >
              <span>View post</span>
              <ExternalLink className="size-3 text-slate-400" />
            </a>
          ) : (platformMetric.status || "").toLowerCase() === "failed" ? (
            <span className="text-[11px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-md border border-red-200/50">
              Failed
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 capitalize">{platformMetric.status}</span>
          )}
        </div>
      </div>
    </div>
  )
}
