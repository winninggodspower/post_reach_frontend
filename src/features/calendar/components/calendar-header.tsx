"use client"

import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, FileText } from "lucide-react"
import { motion } from "framer-motion"

type CalendarHeaderProps = {
  isLoading: boolean
  viewMode: "week" | "month"
  onViewModeChange: (mode: "week" | "month") => void
  rangeLabel: string
  onPrev: () => void
  onNext: () => void
}

export function CalendarHeader({
  isLoading,
  viewMode,
  onViewModeChange,
  rangeLabel,
  onPrev,
  onNext,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 shrink-0 w-full min-w-0">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Calendar
        </h1>
        {isLoading && (
          <span className="text-xs text-slate-400 font-bold animate-pulse">Syncing...</span>
        )}
      </div>

      <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-4 w-full md:w-auto min-w-0">
        {/* Navigation Controls (shrinks naturally with truncate on narrow screens) */}
        <div className="flex items-center justify-between sm:justify-center gap-1 sm:gap-3 flex-1 sm:flex-initial min-w-0 relative bg-slate-50 dark:bg-slate-900 px-2 sm:px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800 shadow-xs">
          <button
            type="button"
            onClick={onPrev}
            className="text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition shrink-0 p-0.5"
            aria-label="Previous"
          >
            <ChevronLeft className="size-4 sm:size-4.5" />
          </button>
          <h2 className="text-xs sm:text-sm font-bold sm:font-black text-slate-800 dark:text-slate-200 min-w-0 truncate text-center px-1">
            {rangeLabel}
          </h2>
          <button
            type="button"
            onClick={onNext}
            className="text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition shrink-0 p-0.5"
            aria-label="Next"
          >
            <ChevronRight className="size-4 sm:size-4.5" />
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-lg p-0.5 shadow-xs relative shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange("month")}
            className={`relative px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-md transition cursor-pointer flex items-center z-10 ${
              viewMode === "month"
                ? "text-white"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {viewMode === "month" && (
              <motion.div
                layoutId="view-toggle-bg"
                className="absolute inset-0 bg-accent-dark rounded-md shadow-sm -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <CalendarIcon className="size-3.5 mr-1 sm:mr-1.5" />
            Month
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("week")}
            className={`relative px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-md transition cursor-pointer flex items-center z-10 ${
              viewMode === "week"
                ? "text-white"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {viewMode === "week" && (
              <motion.div
                layoutId="view-toggle-bg"
                className="absolute inset-0 bg-accent-dark rounded-md shadow-sm -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <FileText className="size-3.5 mr-1 sm:mr-1.5" />
            Week
          </button>
        </div>
      </div>
    </div>
  )
}
