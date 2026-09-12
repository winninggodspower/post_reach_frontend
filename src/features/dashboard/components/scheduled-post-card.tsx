"use client"

import { Clock, FileText, Film, Image as ImageIcon, Play, ChevronRight, Quote } from "lucide-react"
import { format, parseISO } from "date-fns"

import type { CalendarItem } from "@/features/posts/api/server"
import { getPlatformMeta } from "@/features/posts/components/upload-status/utils"

export interface ScheduledPostCardProps {
  post: CalendarItem
  onClick?: (post: CalendarItem) => void
  className?: string
}

const formatFullScheduledTime = (dateStr: string | null) => {
  if (!dateStr) return "Scheduled"
  try {
    return format(parseISO(dateStr), "MMM d, yyyy 'at' h:mm a")
  } catch {
    return new Date(dateStr).toLocaleString()
  }
}

const formatScheduledTime = (dateStr: string | null) => {
  if (!dateStr) return "Scheduled"
  try {
    return format(parseISO(dateStr), "MMM d · h:mm a")
  } catch {
    return new Date(dateStr).toLocaleDateString()
  }
}

const getContentTypeMeta = (type: CalendarItem["content_type"]) => {
  switch (type) {
    case "video":
      return {
        label: "Video",
        icon: Film,
        className: "bg-purple-50 text-purple-700 border-purple-200/50",
        badgeClass: "bg-purple-500/10 text-purple-700 border-purple-200",
      }
    case "photo":
      return {
        label: "Photo",
        icon: ImageIcon,
        className: "bg-blue-50 text-blue-700 border-blue-200/50",
        badgeClass: "bg-blue-500/10 text-blue-700 border-blue-200",
      }
    case "text":
    default:
      return {
        label: "Text",
        icon: FileText,
        className: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
        badgeClass: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
      }
  }
}

export function ScheduledPostCard({ post, onClick, className = "" }: ScheduledPostCardProps) {
  const typeMeta = getContentTypeMeta(post.content_type)
  const TypeIcon = typeMeta.icon
  const mediaUrl = post.thumbnail_url || (post.media_urls && post.media_urls[0])
  const isVideo = post.content_type === "video"

  return (
    <div onClick={() => onClick?.(post)} className={`cursor-pointer ${className}`}>
      {/* ── Mobile Layout: Exact Original Horizontal Card (< sm) ── */}
      <div className="group flex sm:hidden items-start justify-between gap-3.5 p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-xl hover:shadow-black/5 hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5">
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          {mediaUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaUrl}
              alt=""
              className="size-14 rounded-xl object-cover border border-slate-200 shrink-0 shadow-xs"
            />
          ) : (
            <div className="size-14 rounded-xl bg-linear-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center shrink-0 shadow-inner">
              <TypeIcon className="size-6 text-slate-400 drop-shadow-xs" />
            </div>
          )}

          <div className="min-w-0 flex-1 py-0.5 space-y-2">
            <p className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-accent-brand transition-colors">
              {post.caption || "Untitled post"}
            </p>

            <div className="flex flex-wrap items-center gap-1.5">
              {post.platforms.map((plat) => {
                const meta = getPlatformMeta(plat.platform)
                return (
                  <span
                    key={plat.id || plat.platform}
                    className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600 border border-slate-200/50"
                  >
                    {meta.label}
                  </span>
                )
              })}
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
              <Clock className="size-3.5 shrink-0 text-slate-400" />
              <span className="truncate">Scheduled for {formatFullScheduledTime(post.scheduled_at)}</span>
            </div>
          </div>
        </div>

        {/* Content Type Badge on Right */}
        <div className="shrink-0 mt-0.5">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${typeMeta.className}`}
          >
            <TypeIcon className="size-2.5" />
            {typeMeta.label}
          </span>
        </div>
      </div>

      {/* ── Desktop Layout: Modern Vertical Card (sm and up) ── */}
      <div className="group hidden sm:flex flex-col h-full rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-xl hover:shadow-black/5 hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        {/* Media Preview Area (16:10 aspect ratio) */}
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
            /* Text-only post aesthetic preview */
            <div className="relative size-full bg-linear-to-br from-amber-500/5 via-orange-500/5 to-slate-50 p-5 flex flex-col justify-between overflow-hidden">
              <div className="absolute -right-2 -bottom-2 text-slate-200/60 pointer-events-none select-none">
                <Quote className="size-20 rotate-180" />
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <FileText className="size-3.5 text-emerald-600" />
                <span>Text Post</span>
              </div>
              <p className="text-xs font-medium text-slate-700 line-clamp-3 italic z-10 leading-relaxed">
                &ldquo;{post.caption || "No text preview"}&rdquo;
              </p>
              <div className="h-1 w-8 rounded-full bg-accent-brand/40" />
            </div>
          )}

          {/* Floating Top Badges */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
            {/* Content Type Pill */}
            <span
              className={`inline-flex items-center gap-1 rounded-full backdrop-blur-md bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-xs border ${typeMeta.badgeClass}`}
            >
              <TypeIcon className="size-3" />
              {typeMeta.label}
            </span>

            {/* Scheduled Time Pill */}
            <span className="inline-flex items-center gap-1 rounded-full backdrop-blur-md bg-black/65 text-white px-2.5 py-1 text-[10px] font-semibold shadow-xs">
              <Clock className="size-3 text-white/80" />
              <span>{formatScheduledTime(post.scheduled_at)}</span>
            </span>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3.5">
          <div>
            <p className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-accent-brand transition-colors leading-snug">
              {post.caption || "Untitled post"}
            </p>
          </div>

          {/* Footer: Target Platforms and Details Link */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            {/* Platform badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {post.platforms.map((plat) => {
                const meta = getPlatformMeta(plat.platform)
                return (
                  <span
                    key={plat.id || plat.platform}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200/70 px-2 py-1 text-[10px] font-bold text-slate-700 shadow-2xs"
                    title={meta.label}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={meta.icon}
                      alt=""
                      className="size-3.5 rounded-full object-cover"
                    />
                    <span className="capitalize">{meta.label}</span>
                  </span>
                )
              })}
            </div>

            {/* Details CTA */}
            <span className="text-[11px] font-semibold text-slate-400 group-hover:text-accent-brand transition-colors inline-flex items-center gap-0.5 shrink-0">
              View
              <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ScheduledPostCardSkeleton() {
  return (
    <>
      {/* Mobile Skeleton */}
      <div className="flex sm:hidden items-start gap-3.5 p-4 rounded-2xl border border-slate-200 bg-white animate-pulse">
        <div className="size-14 rounded-xl bg-slate-100 shrink-0" />
        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="h-4 bg-slate-100 rounded-md w-3/4" />
          <div className="flex gap-1.5">
            <div className="h-4.5 bg-slate-100 rounded-md w-16" />
            <div className="h-4.5 bg-slate-100 rounded-md w-16" />
          </div>
          <div className="h-3.5 bg-slate-100 rounded-md w-36" />
        </div>
        <div className="h-6 w-14 bg-slate-100 rounded-full shrink-0" />
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden sm:flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden animate-pulse">
        <div className="w-full aspect-16/10 bg-slate-100" />
        <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-slate-100 rounded-md w-4/5" />
            <div className="h-4 bg-slate-100 rounded-md w-2/3" />
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex gap-1.5">
              <div className="h-6 w-16 bg-slate-100 rounded-lg" />
              <div className="h-6 w-16 bg-slate-100 rounded-lg" />
            </div>
            <div className="h-4 w-10 bg-slate-100 rounded-md" />
          </div>
        </div>
      </div>
    </>
  )
}
