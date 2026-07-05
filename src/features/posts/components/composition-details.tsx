"use client"

import * as React from "react"
import { UseFormRegister, UseFormSetValue } from "react-hook-form"
import type { VideoPostFormValues } from "./video-composer"

type CompositionDetailsProps = {
  register: UseFormRegister<VideoPostFormValues>
  setValue: UseFormSetValue<VideoPostFormValues>
  caption: string
}

export function CompositionDetails({
  register,
  setValue,
  caption,
}: CompositionDetailsProps) {
  return (
    <div className="space-y-5 pt-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 font-sans">
        Composition Details
      </h3>

      {/* Video Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          YouTube Title (Optional)
        </label>
        <input
          type="text"
          placeholder="YouTube Shorts title, X tweet topic..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-sm focus:outline-hidden focus:ring-1 focus:ring-accent-brand focus:border-accent-brand"
          {...register("title")}
        />
      </div>

      {/* Video Main Caption */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Main Caption
          </label>
          <span className={`text-[10px] font-semibold ${caption.length > 2900 ? "text-red-500" : "text-slate-400"}`}>
            {caption.length} / 3000
          </span>
        </div>
        <div className="relative">
          <textarea
            placeholder="Tell your audience about your video. Use #hashtags or @mentions..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-sm focus:outline-hidden focus:ring-1 focus:ring-accent-brand focus:border-accent-brand resize-y scrollbar-thin"
            {...register("caption", {
              maxLength: 3000
            })}
          />
        </div>
      </div>

      {/* Quick buttons bar */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={() => setValue("caption", caption + " #foryou #fyp #trending")}
          className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-slate-50 dark:bg-slate-855 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer transition"
        >
          # Add Tags
        </button>
        <button
          onClick={() => setValue("caption", caption + " @postreach")}
          className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-slate-50 dark:bg-slate-855 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer transition"
        >
          @ Mention Brand
        </button>
      </div>
    </div>
  )
}
