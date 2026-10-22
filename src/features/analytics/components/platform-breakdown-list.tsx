"use client"

import React from "react"
import { ExternalLink, Eye, Heart, MessageSquare, Share2 } from "lucide-react"
import { formatDistanceToNow, parseISO } from "date-fns"
import { getPlatformMeta } from "@/features/posts/components/upload-status/utils"
import type { PostPlatformMetric } from "../types/post-analytics"

interface PlatformBreakdownListProps {
  platforms: PostPlatformMetric[]
  onSelectPlatform?: (platform: string) => void
  activePlatform?: string
}

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K"
  return num.toLocaleString()
}

const getStatusBadgeStyles = (status: string) => {
  const normalized = (status || "").toLowerCase()
  switch (normalized) {
    case "posted":
      return {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
        dot: "bg-emerald-500",
      }
    case "failed":
      return {
        badge: "bg-red-50 text-red-700 border-red-200/60",
        dot: "bg-red-500",
      }
    case "processing":
    case "uploading":
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-200/60",
        dot: "bg-amber-500 animate-pulse",
      }
    case "scheduled":
    case "pending":
    default:
      return {
        badge: "bg-blue-50 text-blue-700 border-blue-200/60",
        dot: "bg-blue-500",
      }
  }
}

const getPlatformBrandBorder = (platformKey: string) => {
  const p = (platformKey || "").toLowerCase()
  switch (p) {
    case "instagram":
      return "border-l-pink-500"
    case "youtube":
      return "border-l-red-500"
    case "tiktok":
      return "border-l-slate-900 dark:border-l-cyan-400"
    case "facebook":
      return "border-l-blue-600"
    case "twitter":
    case "x":
      return "border-l-slate-800 dark:border-l-slate-200"
    case "linkedin":
      return "border-l-[#0A66C2]"
    default:
      return "border-l-slate-400"
  }
}

export function PlatformBreakdownList({
  platforms,
  onSelectPlatform,
  activePlatform,
}: PlatformBreakdownListProps) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs divide-y divide-slate-100">
      {platforms.map((plat) => {
        const meta = getPlatformMeta(plat.platform)
        const isSelected = activePlatform === plat.platform
        const isFailed = (plat.status || "").toLowerCase() === "failed"
        const statusStyles = getStatusBadgeStyles(plat.status)
        const brandBorder = isFailed ? "border-l-red-400" : getPlatformBrandBorder(plat.platform)

        const syncedAgo = plat.last_synced_at
          ? (() => {
              try {
                return formatDistanceToNow(parseISO(plat.last_synced_at), { addSuffix: true })
              } catch {
                return new Date(plat.last_synced_at).toLocaleDateString()
              }
            })()
          : null

        return (
          <div
            key={plat.platform_post_id || plat.platform}
            onClick={() => onSelectPlatform?.(plat.platform)}
            className={`p-3.5 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 transition-all cursor-pointer border-l-4 ${brandBorder} ${
              isSelected ? "bg-slate-50/90" : "hover:bg-slate-50/50"
            }`}
          >
            {/* Top row: Platform Identity & Live Post Link */}
            <div className="flex items-center justify-between gap-3 min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-9 sm:size-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={meta.icon} alt={meta.label} className="size-4.5 sm:size-5 object-contain" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 truncate">{meta.label}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border shrink-0 ${statusStyles.badge}`}
                    >
                      <span className={`size-1.5 rounded-full shrink-0 ${statusStyles.dot}`} />
                      {plat.status}
                    </span>
                  </div>
                  <div
                    className={`text-[11px] sm:text-xs mt-0.5 truncate ${
                      isFailed ? "text-red-500 font-medium" : "text-slate-400"
                    }`}
                  >
                    {isFailed
                      ? "Publishing failed"
                      : syncedAgo
                      ? `Updated ${syncedAgo}`
                      : "Direct platform sync"}
                  </div>
                </div>
              </div>

              {/* View Live Post Button (Visible on all screens) */}
              <div onClick={(e) => e.stopPropagation()}>
                {plat.post_url ? (
                  <a
                    href={plat.post_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-950 transition-colors border border-slate-200 rounded-lg px-2.5 py-1 hover:bg-slate-50 cursor-pointer shrink-0"
                    title="Open live post"
                  >
                    <span>View</span>
                    <ExternalLink className="size-3 text-slate-400" />
                  </a>
                ) : isFailed ? (
                  <span className="text-[11px] font-semibold text-red-600 bg-red-50 border border-red-200/60 rounded-md px-2 py-0.5 shrink-0">
                    Failed
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 italic shrink-0">No link</span>
                )}
              </div>
            </div>

            {/* Mobile View (< md): Clean 4-column compact grid */}
            <div className="grid grid-cols-4 md:hidden gap-2 pt-2.5 border-t border-slate-100 text-left">
              <div>
                <span className="text-[10px] font-medium text-slate-400 block">Views</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5 font-mono tabular-nums">
                  {formatNumber(plat.views)}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-medium text-slate-400 block">Likes</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5 font-mono tabular-nums">
                  {formatNumber(plat.likes)}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-medium text-slate-400 block">Comments</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5 font-mono tabular-nums">
                  {formatNumber(plat.comments)}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-medium text-slate-400 block">Eng. Rate</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5 font-mono tabular-nums">
                  {plat.engagement_rate.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Desktop View (md and up): Inline row */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8 shrink-0">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-sm">
                <Eye className="size-3.5 text-slate-400" />
                <span className="font-mono tabular-nums">{formatNumber(plat.views)}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-sm">
                <Heart className="size-3.5 text-slate-400" />
                <span className="font-mono tabular-nums">{formatNumber(plat.likes)}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-sm">
                <MessageSquare className="size-3.5 text-slate-400" />
                <span className="font-mono tabular-nums">{formatNumber(plat.comments)}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-sm">
                <Share2 className="size-3.5 text-slate-400" />
                <span className="font-mono tabular-nums">{formatNumber(plat.shares)}</span>
              </div>

              <div className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg font-mono tabular-nums">
                {plat.engagement_rate.toFixed(1)}% ER
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
