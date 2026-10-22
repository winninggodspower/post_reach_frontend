"use client"

import React from "react"
import { getPlatformMeta } from "@/features/posts/components/upload-status/utils"
import type { PostPlatformMetric } from "../types/post-analytics"

interface AudienceShareBarProps {
  platforms: PostPlatformMetric[]
  activePlatform?: string
  onSelectPlatform?: (platform: string) => void
}

const getPlatformBrandColor = (platformKey: string) => {
  const p = (platformKey || "").toLowerCase()
  switch (p) {
    case "instagram":
      return {
        bar: "bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500",
        dot: "bg-gradient-to-r from-purple-500 to-pink-500",
        text: "text-pink-600",
      }
    case "youtube":
      return {
        bar: "bg-[#FF0000]",
        dot: "bg-[#FF0000]",
        text: "text-red-600",
      }
    case "tiktok":
      return {
        bar: "bg-slate-900 dark:bg-cyan-400",
        dot: "bg-slate-900 dark:bg-cyan-400",
        text: "text-slate-900 dark:text-cyan-400",
      }
    case "facebook":
      return {
        bar: "bg-[#1877F2]",
        dot: "bg-[#1877F2]",
        text: "text-blue-600",
      }
    case "twitter":
    case "x":
      return {
        bar: "bg-slate-800 dark:bg-slate-200",
        dot: "bg-slate-800 dark:bg-slate-200",
        text: "text-slate-800 dark:text-slate-200",
      }
    case "linkedin":
      return {
        bar: "bg-[#0A66C2]",
        dot: "bg-[#0A66C2]",
        text: "text-blue-700",
      }
    default:
      return {
        bar: "bg-slate-600",
        dot: "bg-slate-600",
        text: "text-slate-600",
      }
  }
}

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K"
  return num.toLocaleString()
}

export function AudienceShareBar({
  platforms,
  activePlatform,
  onSelectPlatform,
}: AudienceShareBarProps) {
  // Only calculate for platforms with posted status
  const publishedPlatforms = platforms.filter(
    (p) => (p.status || "").toLowerCase() === "posted"
  )

  const totalViews = publishedPlatforms.reduce((acc, p) => acc + (p.views || 0), 0)

  if (publishedPlatforms.length <= 1 || totalViews === 0) {
    return null
  }

  // Calculate percentages
  const shares = publishedPlatforms.map((plat) => {
    const views = plat.views || 0
    const percentage = totalViews > 0 ? (views / totalViews) * 100 : 0
    return {
      plat,
      views,
      percentage,
      brand: getPlatformBrandColor(plat.platform),
      meta: getPlatformMeta(plat.platform),
    }
  })

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Audience Distribution
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500 font-medium">Cross-platform views share</span>
        </div>
        <span className="text-slate-400 text-[11px] font-mono tabular-nums">
          {formatNumber(totalViews)} total views
        </span>
      </div>

      {/* Segmented Multi-Platform Distribution Bar */}
      <div className="relative h-2.5 w-full rounded-full bg-slate-100 overflow-hidden flex gap-0.5 p-0.5 border border-slate-200/60 shadow-inner">
        {shares.map(({ plat, percentage, brand }) => {
          if (percentage <= 0) return null
          const isSelected = activePlatform === plat.platform
          const isDimmed = activePlatform && activePlatform !== "all" && !isSelected

          return (
            <div
              key={plat.platform}
              style={{ width: `${percentage}%` }}
              title={`${plat.platform}: ${percentage.toFixed(1)}% (${formatNumber(plat.views)} views)`}
              onClick={() => onSelectPlatform?.(plat.platform)}
              className={`h-full rounded-full ${brand.bar} transition-all duration-300 cursor-pointer ${
                isDimmed ? "opacity-35" : "opacity-100 hover:brightness-110"
              }`}
            />
          )
        })}
      </div>

      {/* Interactive Legend Pills */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-0.5 text-xs">
        {shares.map(({ plat, percentage, views, brand, meta }) => {
          const isSelected = activePlatform === plat.platform

          return (
            <button
              key={plat.platform}
              type="button"
              onClick={() => onSelectPlatform?.(plat.platform)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                isSelected
                  ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                  : "border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/80 text-slate-700"
              }`}
            >
              <span
                className={`size-2 rounded-full shrink-0 ${
                  isSelected ? "bg-white" : brand.dot
                }`}
              />
              <span className="font-semibold">{meta.label}</span>
              <span
                className={`font-mono tabular-nums ${
                  isSelected ? "text-slate-300" : "text-slate-400"
                }`}
              >
                {percentage.toFixed(0)}% ({formatNumber(views)})
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
