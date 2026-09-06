"use client"

import type { CalendarItem } from "@/features/posts/api/server"
import { isToday, WEEKDAYS } from "../lib/calendar-utils"
import { DesktopWeekCard, DesktopMonthBadge } from "./calendar-cards"

type CalendarDesktopViewProps = {
  viewMode: "week" | "month"
  daysOfWeek: Date[]
  monthDays: { date: Date; isCurrentMonth: boolean }[]
  getPostsForDate: (date: Date) => CalendarItem[]
  onSelectPost: (post: CalendarItem) => void
}

export function CalendarDesktopView({
  viewMode,
  daysOfWeek,
  monthDays,
  getPostsForDate,
  onSelectPost,
}: CalendarDesktopViewProps) {
  return (
    <div className="hidden md:flex bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-sm flex-col">
      {/* Days Header */}
      <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0">
        {WEEKDAYS.map((day, idx) => {
          const isTodayHeader = viewMode === "week" && isToday(daysOfWeek[idx])

          return (
            <div
              key={day}
              className="py-3 text-center border-r last:border-r-0 border-slate-100 dark:border-slate-800/80"
            >
              <span
                className={`text-xs font-bold ${
                  isTodayHeader ? "text-accent-dark" : "text-slate-500"
                }`}
              >
                {day} {viewMode === "week" && daysOfWeek[idx].getDate()}
              </span>
            </div>
          )
        })}
      </div>

      {/* Calendar Body */}
      {viewMode === "week" ? (
        <div className="grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800/80 overflow-y-auto min-h-[400px]">
          {daysOfWeek.map((date, idx) => {
            const posts = getPostsForDate(date)
            const today = isToday(date)

            return (
              <div
                key={idx}
                className={`flex flex-col p-2 gap-2 ${
                  today ? "bg-accent-dark/[0.03] dark:bg-accent-dark/[0.05]" : ""
                }`}
              >
                {posts.length === 0 ? (
                  <div className="text-center pt-8 text-[10px] font-bold text-slate-300 dark:text-slate-700 select-none">
                    No posts
                  </div>
                ) : (
                  posts.map((post) => (
                    <DesktopWeekCard key={post.id} post={post} onClick={() => onSelectPost(post)} />
                  ))
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)] divide-y divide-x divide-slate-100 dark:divide-slate-800/80">
          {monthDays.map((item, idx) => {
            const posts = getPostsForDate(item.date)
            const today = isToday(item.date)

            return (
              <div
                key={idx}
                className={`p-1.5 md:p-2 flex flex-col ${
                  item.isCurrentMonth
                    ? ""
                    : "bg-slate-50/50 dark:bg-slate-950/50 opacity-50"
                } ${today ? "bg-accent-dark/[0.03] dark:bg-accent-dark/[0.05]" : ""}`}
              >
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span
                    className={`text-[10px] md:text-xs font-bold ${
                      today
                        ? "bg-accent-dark text-white rounded px-1.5 py-0.5"
                        : "text-slate-500"
                    }`}
                  >
                    {item.date.getDate()}
                  </span>
                </div>

                <div className="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar">
                  {posts.length === 0 && item.isCurrentMonth ? (
                    <div className="text-center pt-2 md:pt-4 text-[9px] md:text-[10px] font-bold text-slate-300 dark:text-slate-700 select-none">
                      No posts
                    </div>
                  ) : (
                    posts.map((post) => (
                      <DesktopMonthBadge
                        key={post.id}
                        post={post}
                        onClick={() => onSelectPost(post)}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
