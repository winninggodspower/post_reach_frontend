"use client"

import * as React from "react"
import { Heart, MessageCircle, Repeat, Send, MoreHorizontal } from "lucide-react"
import { ChannelAvatar } from "../channel-avatar"

type ThreadsPostPreviewProps = {
  avatar?: string
  handle: string
  name?: string
  caption: string
  media?: React.ReactNode
}

export function ThreadsPostPreview({
  avatar,
  handle,
  name,
  caption,
  media,
}: ThreadsPostPreviewProps) {
  const renderFormattedPreviewCaption = (text: string) => {
    if (!text) return <span className="text-slate-400 dark:text-slate-500 italic">Start a thread...</span>
    const words = text.split(" ")
    return words.map((word, i) => {
      if (word.startsWith("#") || word.startsWith("@")) {
        return (
          <span key={i} className="text-blue-500 dark:text-blue-400 font-medium hover:underline cursor-pointer">
            {word}{" "}
          </span>
        )
      }
      return word + " "
    })
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black text-slate-900 dark:text-white text-[11px] leading-normal font-sans">
      {/* Post container */}
      <div className="p-3.5 flex gap-3 text-left">
        {/* Left column: Avatar and thread connector line */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative">
            <ChannelAvatar
              src={avatar || ""}
              platform="threads"
              alt="Avatar"
              className="size-8 rounded-full object-cover border border-slate-200 dark:border-zinc-800"
            />
          </div>
          <div className="w-[1.5px] grow bg-slate-200 dark:bg-zinc-800 my-1 rounded-full min-h-[30px]" />
        </div>

        {/* Right column: Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-[11px] truncate">{handle.replace(/^@/, "")}</span>
              <span className="text-slate-400 dark:text-zinc-500 text-[10px]">· 2h</span>
            </div>
            <MoreHorizontal className="size-3.5 text-slate-400 dark:text-zinc-500 shrink-0" />
          </div>

          {/* Caption */}
          <p className="text-[11px] leading-relaxed break-words whitespace-pre-wrap">
            {renderFormattedPreviewCaption(caption)}
          </p>

          {/* Optional Media */}
          {media && (
            <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-zinc-800/80 my-2">
              {media}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-1 text-slate-700 dark:text-zinc-300">
            <button type="button" className="hover:text-red-500 transition-colors">
              <Heart className="size-4" />
            </button>
            <button type="button" className="hover:text-blue-500 transition-colors">
              <MessageCircle className="size-4" />
            </button>
            <button type="button" className="hover:text-emerald-500 transition-colors">
              <Repeat className="size-4" />
            </button>
            <button type="button" className="hover:text-sky-500 transition-colors">
              <Send className="size-4" />
            </button>
          </div>

          {/* Engagement */}
          <div className="text-[9px] text-slate-400 dark:text-zinc-500 pt-0.5">
            <span>24 replies · 156 likes</span>
          </div>
        </div>
      </div>
    </div>
  )
}
