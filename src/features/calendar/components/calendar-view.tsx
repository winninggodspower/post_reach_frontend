"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { ScheduledPost } from "@/features/dashboard/components/scheduled-queue"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export function CalendarView() {
  const [mounted, setMounted] = useState(false)
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    setMounted(true)
    setSelectedDate(new Date())
    const postsKey = "postreach-scheduled-posts"
    const postsStr = localStorage.getItem(postsKey)
    if (postsStr) {
      try {
        setScheduledPosts(JSON.parse(postsStr))
      } catch {
        setScheduledPosts([])
      }
    }
  }, [])

  if (!mounted) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200 rounded" />
          <div className="h-4 w-72 bg-slate-200 rounded" />
          <div className="h-96 bg-slate-100 rounded-xl" />
        </div>
      </main>
    )
  }

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  // Get date parameters
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay()
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate()
  const prevMonthTotalDays = new Date(currentYear, currentMonth, 0).getDate()

  // Calendar cells array
  const cells: { date: Date; isCurrentMonth: boolean }[] = []

  // Previous month padding cells
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    cells.push({
      date: new Date(currentYear, currentMonth - 1, prevMonthTotalDays - i),
      isCurrentMonth: false,
    })
  }

  // Current month cells
  for (let i = 1; i <= totalDays; i++) {
    cells.push({
      date: new Date(currentYear, currentMonth, i),
      isCurrentMonth: true,
    })
  }

  // Next month padding cells to complete the grid (usually 42 cells total)
  const remainingCells = 42 - cells.length
  for (let i = 1; i <= remainingCells; i++) {
    cells.push({
      date: new Date(currentYear, currentMonth + 1, i),
      isCurrentMonth: false,
    })
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter((post) => {
      const postDate = new Date(post.scheduledAt)
      return (
        postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date: Date) => {
    if (!selectedDate) return false
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const selectedDatePosts = selectedDate ? getPostsForDate(selectedDate) : []

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8 min-w-0 overflow-x-hidden space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Calendar
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Visualize your content posting pipeline and schedule posts on specific days.
          </p>
        </div>
        <Link href="/dashboard/posts">
          <Button className="bg-slate-950 hover:bg-slate-800 text-white font-semibold cursor-pointer shrink-0">
            <Plus className="mr-1.5 size-4" />
            Create Post
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Calendar Grid card */}
        <div className="lg:col-span-3 border border-black/8 bg-white rounded-3xl p-5 shadow-sm space-y-4">
          {/* Header Month / controls */}
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-lg font-bold text-slate-950">
              {MONTHS[currentMonth]} {currentYear}
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="p-2 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition border border-black/5 cursor-pointer"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition border border-black/5 cursor-pointer"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition border border-black/5 cursor-pointer"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Weekdays row */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((day) => (
              <span key={day} className="text-xs font-bold text-slate-400 py-1 uppercase tracking-wider">
                {day}
              </span>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell, idx) => {
              const posts = getPostsForDate(cell.date)
              const hasPosts = posts.length > 0
              const dayIsToday = isToday(cell.date)
              const dayIsSelected = isSelected(cell.date)

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(cell.date)}
                  className={`min-h-24 sm:min-h-28 flex flex-col p-2 items-start justify-between rounded-xl border transition text-left cursor-pointer group ${
                    cell.isCurrentMonth
                      ? "bg-white text-slate-950 hover:border-slate-400"
                      : "bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100/50"
                  } ${
                    dayIsSelected
                      ? "border-slate-950 ring-1 ring-slate-950/20 bg-slate-50/20"
                      : "border-black/5"
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center size-6 text-xs font-bold rounded-full transition ${
                      dayIsToday
                        ? "bg-accent-brand text-white shadow-xs"
                        : "text-slate-700 group-hover:text-slate-950"
                    }`}
                  >
                    {cell.date.getDate()}
                  </span>

                  {/* Badges or post count */}
                  {hasPosts && (
                    <div className="w-full space-y-1 mt-2">
                      <div className="hidden sm:block space-y-1">
                        {posts.slice(0, 2).map((post) => (
                          <div
                            key={post.id}
                            className="text-[9px] font-semibold bg-slate-100 hover:bg-slate-200 border border-black/5 rounded px-1.5 py-0.5 text-slate-700 truncate w-full flex items-center gap-1"
                          >
                            <span className="w-1 h-1 rounded-full bg-accent-brand shrink-0" />
                            <span className="truncate">{post.content}</span>
                          </div>
                        ))}
                        {posts.length > 2 && (
                          <div className="text-[8px] font-bold text-slate-400 pl-1">
                            + {posts.length - 2} more
                          </div>
                        )}
                      </div>
                      <div className="sm:hidden flex flex-wrap gap-1">
                        <span className="size-2 rounded-full bg-accent-brand block" />
                        {posts.length > 1 && (
                          <span className="size-2 rounded-full bg-slate-400 block" />
                        )}
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected date pane card */}
        <div className="border border-black/8 bg-slate-50/50 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-black/8">
              <CalendarIcon className="size-4 text-slate-500" />
              <h3 className="text-sm font-bold text-slate-950">
                {selectedDate ? selectedDate.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric"
                }) : "Select a date"}
              </h3>
            </div>

            <div className="mt-4 space-y-3">
              {selectedDatePosts.length > 0 ? (
                selectedDatePosts.map((post) => (
                  <div key={post.id} className="bg-white border border-black/5 rounded-xl p-3 space-y-2 shadow-xs">
                    <p className="text-xs font-semibold text-slate-900 line-clamp-3">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-1">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" />
                        {new Date(post.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div className="flex gap-1">
                        {post.platforms.map((plat) => (
                          <span key={plat} className="uppercase font-bold tracking-wider text-[8px] bg-slate-100 text-slate-600 rounded px-1">
                            {plat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center space-y-2">
                  <div className="inline-flex size-10 items-center justify-center rounded-full bg-white border border-black/5 text-slate-400">
                    <CalendarIcon className="size-4.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-700">No posts scheduled</h4>
                  <p className="text-[10px] text-slate-400 max-w-[180px] mx-auto">
                    Nothing is scheduled for publication on this day.
                  </p>
                </div>
              )}
            </div>
          </div>

          {selectedDate && (
            <Link
              href={`/dashboard/posts?date=${selectedDate.toISOString().split("T")[0]}`}
              className="mt-6 block w-full"
            >
              <Button variant="outline" className="w-full border-black/8 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer">
                <Plus className="mr-1.5 size-3.5" />
                Schedule for this day
              </Button>
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}
