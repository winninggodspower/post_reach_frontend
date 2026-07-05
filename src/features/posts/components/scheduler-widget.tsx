"use client"

import * as React from "react"
import { Calendar, Clock, Info, Sparkles } from "lucide-react"
import { UseFormRegister } from "react-hook-form"
import type { VideoPostFormValues } from "./video-composer"

type SchedulerWidgetProps = {
  register: UseFormRegister<VideoPostFormValues>
  isScheduled: boolean
  onChangeIsScheduled: (val: boolean) => void
  scheduleDate: string
  scheduleTime: string
  onPublish: (action: "schedule" | "now") => void
}

export function SchedulerWidget({
  register,
  isScheduled,
  onChangeIsScheduled,
  scheduleDate,
  scheduleTime,
  onPublish,
}: SchedulerWidgetProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-[1.75rem] p-6 shadow-xs space-y-4">
      {/* Header with Switch */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <Calendar className="size-4.5 text-accent-brand" />
          <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-200">
            Schedule Post
          </h3>
        </div>

        <button
          type="button"
          onClick={() => onChangeIsScheduled(!isScheduled)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
            isScheduled ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
          }`}
          role="switch"
          aria-checked={isScheduled}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              isScheduled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Date Time Picker Fields */}
      {isScheduled ? (
        <div className="grid grid-cols-2 gap-3 py-2 animate-fade-in">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="size-3" />
              <span>Date</span>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:outline-hidden focus:ring-1 focus:ring-accent-brand"
              {...register("scheduleDate")}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="size-3" />
              <span>Time</span>
            </label>
            <input
              type="time"
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:outline-hidden focus:ring-1 focus:ring-accent-brand"
              {...register("scheduleTime")}
            />
          </div>
        </div>
      ) : (
        <div className="py-2 text-xs text-slate-400 leading-normal flex items-start gap-2 bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <Info className="size-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            Your video post will be published immediately after you confirm final uploads. Turn on
            scheduling to queue it for later.
          </span>
        </div>
      )}

      {/* Info Badge */}
      {isScheduled && (
        <p className="text-[11px] text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg text-center font-medium border border-slate-100 dark:border-slate-855">
          Your post will be posted at{" "}
          <span className="text-slate-800 dark:text-slate-200 font-bold">{scheduleTime}</span> on{" "}
          <span className="text-slate-800 dark:text-slate-200 font-bold">{scheduleDate}</span> in
          your local time zone.
        </p>
      )}

      {/* Call to action buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => onPublish(isScheduled ? "schedule" : "now")}
          className="w-full py-3 rounded-xl bg-linear-to-r from-accent-dark to-accent-brand hover:brightness-105 transition font-semibold text-xs tracking-wider uppercase text-white shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          {isScheduled ? (
            <>
              <Calendar className="size-4" />
              <span>Schedule post</span>
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              <span>Publish now</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
