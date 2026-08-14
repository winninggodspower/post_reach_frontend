"use client"

import * as React from "react"
import { ThumbsUp, MessageSquare, Repeat, Send, Globe, MoreHorizontal } from "lucide-react"
import { ChannelAvatar } from "../channel-avatar"

type LinkedInPostPreviewProps = {
  avatar?: string
  name: string
  caption: string
  media?: React.ReactNode
}

export function LinkedInPostPreview({
  avatar,
  name,
  caption,
  media,
}: LinkedInPostPreviewProps) {
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
    <div className="flex flex-col h-full bg-[#f4f2ee] dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-[11px] leading-normal font-sans">
      {/* Header */}
      <div className="bg-white dark:bg-slate-950 px-3 py-2 border-b border-slate-200 dark:border-slate-850 shrink-0 flex items-center justify-between">
        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">Feed Post</span>
        <span className="text-[9.5px] text-blue-700 dark:text-blue-400 font-bold">in</span>
      </div>

      {/* Post Card */}
      <div className="flex-1 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-850 overflow-y-auto scrollbar-thin flex flex-col">
        <div>
          {/* Profile Header */}
          <div className="px-3 pt-3 pb-2 flex items-start gap-2">
            <ChannelAvatar
              src={avatar || ""}
              platform="linkedin"
              alt="Avatar"
              className="size-8 rounded-md object-cover border border-slate-100 dark:border-slate-800"
            />
            <div className="text-left flex-1 min-w-0">
              <p className="font-bold text-slate-900 dark:text-slate-100 text-[11.5px] truncate">
                {name || "Channel"}
              </p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate mt-[-2px]">
                Professional Profile • Active Member
              </p>
              <p className="text-[8.5px] text-slate-400 dark:text-slate-500 mt-[-1px] flex items-center gap-1">
                1h • Edited • <Globe className="size-2.5" />
              </p>
            </div>
            <MoreHorizontal className="size-4 text-slate-450" />
          </div>

          {/* Caption Text */}
          <p className="px-3 pb-2.5 text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-wrap text-left text-[11.5px]">
            {renderFormattedPreviewCaption(caption)}
          </p>

          {/* Media banner */}
          {media}
        </div>

        {/* Likes counter and Actions */}
        <div>
          <div className="px-3 py-1.5 flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-900">
            <span className="flex items-center gap-1">
              <span className="bg-blue-500 text-white w-3 h-3 rounded-full flex items-center justify-center text-[7px]">👍</span>
              48 likes
            </span>
            <span>12 comments</span>
          </div>

          <div className="flex items-center justify-around py-1 text-slate-500 dark:text-slate-400 font-semibold text-[9.5px]">
            <span className="flex items-center gap-1 py-0.5"><ThumbsUp className="size-3" /> Like</span>
            <span className="flex items-center gap-1 py-0.5"><MessageSquare className="size-3" /> Comment</span>
            <span className="flex items-center gap-1 py-0.5"><Repeat className="size-3" /> Repost</span>
            <span className="flex items-center gap-1 py-0.5"><Send className="size-3" /> Send</span>
          </div>
        </div>
      </div>
    </div>
  )
}
