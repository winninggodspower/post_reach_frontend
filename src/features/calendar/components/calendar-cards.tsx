"use client"

import { Clock, Film } from "lucide-react"
import type { CalendarItem } from "@/features/posts/api/server"
import { getPlatformMeta } from "@/features/posts/components/upload-status/utils"
import { getContentTypeIcon } from "../lib/calendar-utils"

// 1. Mobile Agenda Card (full-width, rich preview)
export function MobileAgendaCard({
  post,
  onClick,
}: {
  post: CalendarItem
  onClick: () => void
}) {
  const postTime = new Date(post.scheduled_at || post.created_at).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })
  const hasMedia = Boolean(post.thumbnail_url || (post.media_urls && post.media_urls.length > 0))
  const mediaSrc = post.thumbnail_url || post.media_urls?.[0]

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs hover:border-accent-dark/40 dark:hover:border-accent-dark/40 transition cursor-pointer flex flex-col gap-3 group"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-lg">
            <Clock className="size-3 text-slate-400" />
            {postTime}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-accent-dark transition-colors flex items-center gap-1">
            {getContentTypeIcon(post.content_type)}
            {post.content_type}
          </span>
        </div>

        <div className="flex items-center -space-x-1.5">
          {post.platforms.map((p, i) => {
            const meta = getPlatformMeta(p.platform)
            return (
              <div
                key={p.id}
                className="relative z-10 w-5 h-5 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs overflow-hidden ring-1 ring-slate-100 dark:ring-slate-800"
                style={{ zIndex: post.platforms.length - i }}
                title={meta.label}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={meta.icon} alt={meta.label} className="w-3 h-3 object-contain" />
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-start gap-3 w-full">
        {hasMedia && mediaSrc && (
          <div className="relative size-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaSrc}
              alt="Post media"
              className="size-full object-cover"
            />
            {post.content_type === "video" && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Film className="size-3 text-white drop-shadow-sm" />
              </div>
            )}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed">
            {post.caption || <span className="italic text-slate-400">No caption provided</span>}
          </p>
        </div>
      </div>
    </button>
  )
}

// 2. Desktop Week Column Card
export function DesktopWeekCard({
  post,
  onClick,
}: {
  post: CalendarItem
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-2.5 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col gap-2"
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-[10px] font-bold text-slate-500">
          {new Date(post.scheduled_at || post.created_at).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
        <div className="text-slate-400 group-hover:text-accent-dark transition-colors">
          {getContentTypeIcon(post.content_type)}
        </div>
      </div>

      <div className="flex items-center -space-x-1.5 mt-1">
        {post.platforms.map((p, i) => {
          const meta = getPlatformMeta(p.platform)
          return (
            <div
              key={p.id}
              className={`relative z-10 w-5 h-5 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm overflow-hidden ring-1 ring-slate-100 dark:ring-slate-800 ${
                p.post_url ? "cursor-pointer hover:z-20 hover:scale-110 transition-transform" : ""
              }`}
              style={{ zIndex: post.platforms.length - i }}
              title={p.post_url ? `View on ${meta.label}` : meta.label}
              onClick={(e) => {
                if (p.post_url) {
                  e.stopPropagation()
                  window.open(p.post_url, "_blank")
                }
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={meta.icon} alt={meta.label} className="w-3 h-3 object-contain" />
            </div>
          )
        })}
      </div>

      <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 line-clamp-2 leading-snug">
        {post.caption}
      </p>
    </button>
  )
}

// 3. Desktop Month View Badge
export function DesktopMonthBadge({
  post,
  onClick,
}: {
  post: CalendarItem
  onClick: () => void
}) {
  const badgeStyle =
    post.content_type === "video"
      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/50 hover:bg-purple-200"
      : post.content_type === "photo"
        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-200"
        : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50 hover:bg-blue-200"

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left text-[10px] md:text-[11px] font-bold px-2 py-1.5 rounded truncate transition cursor-pointer shadow-xs border ${badgeStyle}`}
    >
      <span className="opacity-75 mr-1 hidden md:inline">
        {new Date(post.scheduled_at || post.created_at)
          .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
          .replace(" ", "")}
      </span>
      {post.caption}
    </button>
  )
}
