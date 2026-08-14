"use client"

import * as React from "react"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react"
import { ChannelAvatar } from "../channel-avatar"

type InstagramPostPreviewProps = {
  avatar?: string
  handle: string
  caption: string
  media?: React.ReactNode
}

export function InstagramPostPreview({
  avatar,
  handle,
  caption,
  media,
}: InstagramPostPreviewProps) {
  const renderFormattedPreviewCaption = (text: string) => {
    if (!text) return <span className="text-slate-400 dark:text-slate-500 italic">Enter your caption here...</span>
    const words = text.split(" ")
    return words.map((word, i) => {
      if (word.startsWith("#") || word.startsWith("@")) {
        return (
          <span key={i} className="text-sky-500 font-medium hover:underline cursor-pointer">
            {word}{" "}
          </span>
        )
      }
      return word + " "
    })
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-[11px] leading-normal font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-900 shrink-0">
        <div className="flex items-center gap-2">
          <ChannelAvatar
            src={avatar || ""}
            platform="instagram"
            alt="Avatar"
            className="size-7.5 rounded-full object-cover border border-slate-100 dark:border-slate-800"
          />
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold leading-none">{handle}</span>
            <span className="text-[8px] text-slate-400 dark:text-slate-500 mt-0.5 leading-none">Original Audio</span>
          </div>
        </div>
        <MoreHorizontal className="size-4 text-slate-450 dark:text-slate-500" />
      </div>

      {/* Media Area */}
      {media}

      {/* Action Bar */}
      <div className="px-3 py-2 flex items-center justify-between text-slate-850 dark:text-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <Heart className="size-[18px]" />
          <MessageCircle className="size-[18px]" />
          <Send className="size-[18px]" />
        </div>
        <Bookmark className="size-[18px]" />
      </div>

      {/* Likes & Caption Scroll Area */}
      <div className="px-3 pb-4 space-y-1 text-left flex-1 overflow-y-auto scrollbar-thin">
        <p className="font-bold text-[10px] leading-none">9,425 likes</p>
        <p className="text-[10px] leading-snug break-words">
          <span className="font-bold mr-1.5">{handle}</span>
          {renderFormattedPreviewCaption(caption)}
        </p>
        <p className="text-[8px] text-slate-400 dark:text-slate-500 uppercase mt-2">2 Hours Ago</p>
      </div>
    </div>
  )
}
