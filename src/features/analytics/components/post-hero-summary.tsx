"use client"

import React, { useState } from "react"
import { Play, FileText, ImageIcon, ExternalLink } from "lucide-react"
import { getPlatformMeta } from "@/features/posts/components/upload-status/utils"
import type { PostPlatformMetric } from "../types/post-analytics"

interface PostHeroSummaryProps {
  caption: string
  contentType: string
  mediaUrl: string | null
  publishedAt: string | null
  platforms: PostPlatformMetric[]
}

const getContentTypeDisplay = (contentType: string) => {
  const type = (contentType || "").toLowerCase()
  switch (type) {
    case "video":
      return {
        icon: Play,
        bg: "bg-slate-50",
        border: "border-slate-200",
        color: "text-slate-400",
      }
    case "photo":
    case "image":
      return {
        icon: ImageIcon,
        bg: "bg-slate-50",
        border: "border-slate-200",
        color: "text-slate-400",
      }
    case "text":
    default:
      return {
        icon: FileText,
        bg: "bg-slate-50",
        border: "border-slate-200",
        color: "text-slate-400",
      }
  }
}

export function PostHeroSummary({
  caption,
  contentType,
  mediaUrl,
  publishedAt,
  platforms,
}: PostHeroSummaryProps) {
  const [mediaError, setMediaError] = useState(false)
  const isVideo = (contentType || "").toLowerCase() === "video"
  const typeDisplay = getContentTypeDisplay(contentType)
  const TypeIcon = typeDisplay.icon

  // Check if mediaUrl directly points to a video file (.mp4, .mov, .webm)
  const isDirectVideoUrl = Boolean(
    mediaUrl &&
      (isVideo && (/\.(mp4|mov|webm|ogg|m4v)($|\?)/i.test(mediaUrl) || !mediaUrl.includes("thumb")))
  )

  const showMedia = Boolean(mediaUrl && !mediaError)

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
        {/* Left: Media + Info */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
          {/* Thumbnail / Media Badge */}
          {showMedia ? (
            <div className="relative size-14 sm:size-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0">
              {isDirectVideoUrl ? (
                <video
                  src={`${mediaUrl}#t=0.001`}
                  preload="metadata"
                  playsInline
                  muted
                  className="size-full object-cover"
                  onError={() => setMediaError(true)}
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={mediaUrl!}
                  alt="Thumbnail"
                  className="size-full object-cover"
                  onError={() => setMediaError(true)}
                />
              )}
              {isVideo && (
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
                  <Play className="size-3.5 sm:size-4 fill-white text-white ml-0.5" />
                </div>
              )}
            </div>
          ) : isVideo ? (
            <div className="size-14 sm:size-16 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
              <Play className="size-5 sm:size-6 text-slate-400 fill-slate-400 ml-0.5" />
            </div>
          ) : (
            <div
              className={`size-14 sm:size-16 rounded-xl ${typeDisplay.bg} border ${typeDisplay.border} flex items-center justify-center shrink-0 shadow-2xs`}
            >
              <TypeIcon className={`size-5 sm:size-6 ${typeDisplay.color}`} />
            </div>
          )}

          {/* Title & Metadata */}
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug">
              {caption || "Untitled Post"}
            </h2>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs text-slate-500">
              {formattedDate && <span>Published {formattedDate}</span>}
              <span>·</span>
              <span className="capitalize">{contentType}</span>
              <span>·</span>
              <span>
                {platforms.length} {platforms.length === 1 ? "destination" : "destinations"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Destination Quick Links (Wraps cleanly on mobile) */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-100">
          {platforms.map((plat) => {
            const meta = getPlatformMeta(plat.platform)
            const isFailed = (plat.status || "").toLowerCase() === "failed"
            const Wrapper = plat.post_url ? "a" : "div"

            return (
              <Wrapper
                key={plat.platform}
                href={plat.post_url || undefined}
                target={plat.post_url ? "_blank" : undefined}
                rel={plat.post_url ? "noreferrer" : undefined}
                className={`group flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border transition-colors text-[11px] sm:text-xs font-semibold shadow-2xs ${
                  isFailed
                    ? "border-red-200 bg-red-50/60 text-red-700"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                }`}
                title={isFailed ? `Publishing failed on ${meta.label}` : plat.post_url ? `View on ${meta.label}` : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={meta.icon} alt={meta.label} className="size-3.5 object-contain" />
                <span>{meta.label}</span>
                {isFailed ? (
                  <span className="size-1.5 rounded-full bg-red-500 shrink-0" />
                ) : (
                  plat.post_url && <ExternalLink className="size-3 text-slate-400 group-hover:text-slate-700" />
                )}
              </Wrapper>
            )
          })}
        </div>
      </div>
    </div>
  )
}
