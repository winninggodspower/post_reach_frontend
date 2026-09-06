"use client"

import { Calendar as CalendarIcon } from "lucide-react"
import type { CalendarItem } from "@/features/posts/api/server"
import { isSameDay, isToday, WEEKDAYS } from "../lib/calendar-utils"
import { MobileAgendaCard } from "./calendar-cards"

type CalendarMobileViewProps = {
  viewMode: "week" | "month"
  daysOfWeek: Date[]
  monthDays: { date: Date; isCurrentMonth: boolean }[]
  selectedDay: Date
  onSelectDay: (date: Date) => void
  getPostsForDate: (date: Date) => CalendarItem[]
  onSelectPost: (post: CalendarItem) => void
}

export function CalendarMobileView({
  viewMode,
  daysOfWeek,
  monthDays,
  selectedDay,
  onSelectDay,
  getPostsForDate,
  onSelectPost,
}: CalendarMobileViewProps) {
  const selectedDayPosts = getPostsForDate(selectedDay)

  return (
    <div className="md:hidden flex flex-col gap-5 w-full min-w-0 max-w-full">
      {viewMode === "week" ? (
        /* Week Day Strip */
        <div className="grid grid-cols-7 gap-1 p-1 sm:gap-1.5 sm:p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 w-full min-w-0">
          {daysOfWeek.map((date, idx) => {
            const isSelected = isSameDay(selectedDay, date)
            const dayIsToday = isToday(date)
            const posts = getPostsForDate(date)

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectDay(date)}
                className={`flex flex-col items-center justify-center py-2 px-0.5 sm:px-1 rounded-xl text-center transition-all cursor-pointer relative min-w-0 w-full ${
                  isSelected
                    ? "bg-accent-dark text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60"
                }`}
              >
                <span
                  className={`text-[9px] sm:text-[10px] font-medium uppercase tracking-wider truncate w-full ${
                    isSelected ? "text-white/80" : "text-slate-400"
                  }`}
                >
                  {WEEKDAYS[date.getDay()]}
                </span>
                <span
                  className={`text-xs sm:text-sm font-bold mt-0.5 truncate ${
                    isSelected
                      ? "text-white"
                      : dayIsToday
                        ? "text-accent-dark"
                        : "text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {date.getDate()}
                </span>

                {/* Indicator dot */}
                <span
                  className={`size-1 sm:size-1.5 rounded-full mt-1 ${
                    posts.length > 0
                      ? isSelected
                        ? "bg-white"
                        : "bg-accent-dark"
                      : "bg-transparent"
                  }`}
                />
              </button>
            )
          })}
        </div>
      ) : (
        /* Month Compact Grid */
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-2.5 sm:p-3 shadow-sm w-full min-w-0">
          <div className="grid grid-cols-7 mb-1.5 text-center">
            {WEEKDAYS.map((day) => (
              <span key={day} className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider py-1 truncate">
                {day}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {monthDays.map((item, idx) => {
              const isSelected = isSameDay(selectedDay, item.date)
              const dayIsToday = isToday(item.date)
              const posts = getPostsForDate(item.date)

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectDay(item.date)}
                  className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition cursor-pointer relative min-h-[38px] sm:min-h-[44px] min-w-0 w-full ${
                    isSelected
                      ? "bg-accent-dark text-white shadow-sm"
                      : item.isCurrentMonth
                        ? "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                        : "text-slate-300 dark:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                  }`}
                >
                  <span
                    className={`text-[11px] sm:text-xs font-bold truncate ${
                      isSelected ? "text-white" : dayIsToday ? "text-accent-dark" : ""
                    }`}
                  >
                    {item.date.getDate()}
                  </span>

                  <div className="flex items-center gap-0.5 mt-0.5 h-1.5">
                    {posts.length > 0 && (
                      <span className={`size-1 sm:size-1.5 rounded-full ${isSelected ? "bg-white" : "bg-accent-dark"}`} />
                    )}
                    {posts.length > 1 && (
                      <span className={`size-1 sm:size-1.5 rounded-full ${isSelected ? "bg-white/80" : "bg-accent-brand"}`} />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Selected Day Agenda Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>
              {selectedDay.toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            {isToday(selectedDay) && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent-dark/10 text-accent-dark">
                Today
              </span>
            )}
          </h3>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {selectedDayPosts.length} {selectedDayPosts.length === 1 ? "post" : "posts"}
          </span>
        </div>

        {selectedDayPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-white dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl text-center">
            <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 mb-3">
              <CalendarIcon className="size-5" />
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No posts scheduled</p>
            <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
              There are no scheduled posts for this day.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {selectedDayPosts.map((post) => (
              <MobileAgendaCard key={post.id} post={post} onClick={() => onSelectPost(post)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
