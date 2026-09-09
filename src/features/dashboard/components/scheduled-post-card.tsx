"use client"

import { Clock, FileText, Film, Image as ImageIcon } from "lucide-react"
import { format, parseISO } from "date-fns"

import type { CalendarItem } from "@/features/posts/api/server"
import { getPlatformMeta } from "@/features/posts/components/upload-status/utils"

export interface ScheduledPostCardProps {
  post: CalendarItem
  onClick?: (post: CalendarItem) => void
  className?: string
}

const formatScheduledTime = (dateStr: string | null) => {
  if (!dateStr) return "Scheduled"
  try {
    return format(parseISO(dateStr), "MMM d, yyyy 'at' h:mm a")
  } catch {
    return new Date(dateStr).toLocaleString()
  }
}

const getContentTypeMeta = (type: CalendarItem["content_type"]) => {
  switch (type) {
    case "video":
      return {
        label: "Video",
        icon: Film,
        className: "bg-purple-50 text-purple-700 border-purple-200/50",
      }
    case "photo":
      return {
        label: "Photo",
        icon: ImageIcon,
        className: "bg-blue-50 text-blue-700 border-blue-200/50",
      }
    case "text":
    default:
      return {
        label: "Text",
        icon: FileText,
        className: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
      }
  }
}

export function ScheduledPostCard({ post, onClick, className = "" }: ScheduledPostCardProps) {
  const typeMeta = getContentTypeMeta(post.content_type)
  const TypeIcon = typeMeta.icon
  const mediaUrl = post.thumbnail_url || (post.media_urls && post.media_urls[0])

  return (
    <div
      onClick={() => onClick?.(post)}
      className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:shadow-xl hover:shadow-black/5 hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${className}`}
    >
      <div className="flex items-start gap-3 sm:gap-4 min-w-0 w-full">
        {mediaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl}
            alt=""
            className="size-14 sm:size-16 rounded-xl object-cover border border-slate-200 shrink-0 shadow-xs"
          />
        ) : (
          <div className="size-14 sm:size-16 rounded-xl bg-linear-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center shrink-0 shadow-inner">
            <TypeIcon className="size-5 sm:size-6 text-slate-400 drop-shadow-xs" />
          </div>
        )}

        <div className="min-w-0 flex-1 py-0.5 space-y-2 sm:space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-accent-brand transition-colors leading-snug">
              {post.caption || "Untitled post"}
            </p>
            {/* Mobile Badge */}
            <div className="sm:hidden shrink-0 mt-0.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${typeMeta.className}`}
              >
                <TypeIcon className="size-2.5" />
                {typeMeta.label}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {post.platforms.map((plat) => {
              const meta = getPlatformMeta(plat.platform)
              return (
                <span
                  key={plat.id || plat.platform}
                  className="inline-flex items-center gap-1 rounded-md sm:rounded-lg bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-600 border border-slate-200/50"
                >
                  {meta.label}
                </span>
              )
            })}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 font-medium">
            <Clock className="size-3 sm:size-3.5 shrink-0" />
            <span className="truncate">Scheduled for {formatScheduledTime(post.scheduled_at)}</span>
          </div>
        </div>
      </div>

      {/* Desktop Badge */}
      <div className="hidden sm:block shrink-0">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider border ${typeMeta.className}`}
        >
          <TypeIcon className="size-3" />
          {typeMeta.label}
        </span>
      </div>
    </div>
  )
}

export function ScheduledPostCardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white animate-pulse">
      <div className="size-14 sm:size-16 rounded-xl bg-slate-100 shrink-0" />
      <div className="min-w-0 flex-1 space-y-2.5">
        <div className="h-4 bg-slate-100 rounded-md w-3/4" />
        <div className="flex gap-2">
          <div className="h-5 bg-slate-100 rounded-md w-16" />
          <div className="h-5 bg-slate-100 rounded-md w-16" />
        </div>
        <div className="h-3 bg-slate-100 rounded-md w-36" />
      </div>
    </div>
  )
}
