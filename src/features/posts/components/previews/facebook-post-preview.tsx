"use client"

import * as React from "react"
import { ThumbsUp, MessageSquare, Share2, Globe, MoreHorizontal } from "lucide-react"

type FacebookPostPreviewProps = {
  avatar?: string
  name: string
  caption: string
  media?: React.ReactNode
}

export function FacebookPostPreview({
  avatar,
  name,
  caption,
  media,
}: FacebookPostPreviewProps) {
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
      {/* Header bar */}
      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-900 shrink-0 flex items-center justify-between">
        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">Post</span>
        <span className="text-[9px] text-blue-600 font-bold bg-blue-50 dark:bg-blue-955/40 px-1.5 py-0.5 rounded">Facebook</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col justify-between">
        <div>
          {/* Profile row */}
          <div className="px-3 pt-3 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatar || "/placeholder-avatar.svg"}
                alt="Avatar"
                className="size-7.5 rounded-full object-cover border border-slate-100 dark:border-slate-800"
              />
              <div className="text-left">
                <p className="font-bold text-slate-900 dark:text-slate-100 text-[11px] leading-tight">
                  {name || "Channel"}
                </p>
                <p className="text-[8.5px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  2h • <Globe className="size-2.5" />
                </p>
              </div>
            </div>
            <MoreHorizontal className="size-4 text-slate-400" />
          </div>

          {/* Caption */}
          <p className="px-3 pb-2 text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-wrap text-left text-[11.5px]">
            {renderFormattedPreviewCaption(caption)}
          </p>

          {/* Media */}
          {media}
        </div>

        {/* Bottom stats and action bar */}
        <div>
          <div className="px-3 py-2 flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <span className="bg-blue-500 text-white w-3 h-3 rounded-full flex items-center justify-center text-[7px]">👍</span>
              72 likes
            </span>
            <span>8 comments • 2 shares</span>
          </div>

          <div className="flex items-center justify-around py-1.5 border-t border-b border-slate-100 dark:border-slate-900 text-slate-500 dark:text-slate-400 font-semibold text-[10px] bg-slate-50/50 dark:bg-slate-900/30">
            <span className="flex items-center gap-1"><ThumbsUp className="size-3.5" /> Like</span>
            <span className="flex items-center gap-1"><MessageSquare className="size-3.5" /> Comment</span>
            <span className="flex items-center gap-1"><Share2 className="size-3.5" /> Share</span>
          </div>
        </div>
      </div>
    </div>
  )
}
