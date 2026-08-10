"use client"

import * as React from "react"
import { MessageCircle, Repeat, Heart, BarChart2, Share, MoreHorizontal } from "lucide-react"

type XPostPreviewProps = {
  avatar?: string
  name: string
  handle: string
  caption: string
  media?: React.ReactNode
}

export function XPostPreview({
  avatar,
  name,
  handle,
  caption,
  media,
}: XPostPreviewProps) {
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
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-900 shrink-0">
        <span className="font-bold text-[12px]">Post</span>
        <div className="w-4 h-4 rounded-full bg-slate-900 dark:bg-white dark:text-slate-900 flex items-center justify-center text-white text-[8px] font-black">X</div>
      </div>

      {/* Tweet content scroll area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3 space-y-3">
        {/* Profile info */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar || "/placeholder-avatar.svg"}
              alt="Avatar"
              className="size-8 rounded-full object-cover border border-slate-100 dark:border-slate-800"
            />
            <div className="text-left">
              <p className="font-bold text-[11.5px] leading-tight flex items-center gap-0.5">
                {name || "Channel"}
                <span className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center text-white text-[6px]">✓</span>
              </p>
              <p className="text-[9.5px] text-slate-400 dark:text-slate-500 leading-none mt-0.5">
                {handle}
              </p>
            </div>
          </div>
          <MoreHorizontal className="size-4 text-slate-400" />
        </div>

        {/* Caption */}
        <p className="text-[11.5px] text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-wrap text-left">
          {renderFormattedPreviewCaption(caption)}
        </p>

        {/* Media Card */}
        {media && (
          <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-850">
            {media}
          </div>
        )}

        {/* Info timestamp */}
        <div className="py-2 border-t border-b border-slate-100 dark:border-slate-900 flex items-center gap-3 text-[9.5px] text-slate-400 dark:text-slate-500">
          <span>2:15 PM • Aug 10, 2026</span>
          <span>•</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">12.4K</span> Views
        </div>

        {/* Engagement Icons */}
        <div className="flex items-center justify-between py-0.5 px-1 text-slate-400 dark:text-slate-500 text-[10px]">
          <span className="flex items-center gap-1.5"><MessageCircle className="size-3.5" /> 24</span>
          <span className="flex items-center gap-1.5"><Repeat className="size-3.5" /> 82</span>
          <span className="flex items-center gap-1.5"><Heart className="size-3.5" /> 342</span>
          <span className="flex items-center gap-1.5"><BarChart2 className="size-3.5" /></span>
          <span className="flex items-center gap-1.5"><Share className="size-3.5" /></span>
        </div>
      </div>
    </div>
  )
}
