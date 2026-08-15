"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Film, Image as ImageIcon, FileText, CheckCircle2 } from "lucide-react"

import { getCalendarItems } from "@/features/posts/api/server"
import type { CalendarItem } from "@/features/posts/api/server"
import { ModalShell } from "@/components/ui/modal-shell"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]
const FULL_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export function CalendarView() {
  const [mounted, setMounted] = useState(false)
  const [scheduledPosts, setScheduledPosts] = useState<CalendarItem[]>([])
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [selectedPost, setSelectedPost] = useState<CalendarItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"week" | "month">("week")

  // Get start of the week (Sunday) immutably
  const getStartOfWeek = (d: Date) => {
    const date = new Date(d)
    const day = date.getDay()
    const diff = date.getDate() - day
    const sunday = new Date(date.setDate(diff))
    sunday.setHours(0, 0, 0, 0)
    return sunday
  }

  const startOfWeek = getStartOfWeek(currentDate)

  // Generate 7 days of the active week for "week" view
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    return d
  })

  // Generate days for "month" view
  const getMonthDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const days = []

    // Padding days before (from Sunday to firstDay's day of week)
    const startPadding = firstDay.getDay()
    for (let i = startPadding; i > 0; i--) {
      const d = new Date(year, month, 1 - i)
      days.push({ date: d, isCurrentMonth: false })
    }

    // Days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true })
    }

    // Padding days after (to complete the 7-day row)
    const endPadding = 7 - (days.length % 7)
    if (endPadding < 7) {
      for (let i = 1; i <= endPadding; i++) {
        days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
      }
    }

    return days
  }

  const monthDays = getMonthDays(currentDate)

  // Format label based on view mode
  const getRangeLabel = () => {
    if (viewMode === "month") {
      return `${FULL_MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
    }

    const start = daysOfWeek[0]
    const end = daysOfWeek[6]

    if (start.getFullYear() !== end.getFullYear()) {
      return `${MONTHS[start.getMonth()]} ${start.getDate()}, ${start.getFullYear()} - ${MONTHS[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`
    }
    if (start.getMonth() !== end.getMonth()) {
      return `${MONTHS[start.getMonth()]} ${start.getDate()} - ${MONTHS[end.getMonth()]} ${end.getDate()}, ${start.getFullYear()}`
    }
    return `${MONTHS[start.getMonth()]} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`
  }

  // Fetch posts from API
  useEffect(() => {
    setMounted(true)

    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        let startStr, endStr

        if (viewMode === "week") {
          startStr = daysOfWeek[0].toISOString().split("T")[0]
          endStr = daysOfWeek[6].toISOString().split("T")[0]
        } else {
          startStr = monthDays[0].date.toISOString().split("T")[0]
          endStr = monthDays[monthDays.length - 1].date.toISOString().split("T")[0]
        }

        const res = await getCalendarItems(startStr, endStr)
        if (res.success && res.data) {
          setScheduledPosts(res.data)
        }
      } catch (err) {
        console.error("Failed to fetch calendar items", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [currentDate, viewMode])

  if (!mounted) {
    return (
      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-96 bg-slate-100 dark:bg-slate-900 rounded-xl" />
        </div>
      </main>
    )
  }

  const handlePrev = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter((post) => {
      if (!post.scheduled_at) return false
      const postDate = new Date(post.scheduled_at)
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

  const getContentTypeIcon = (type: CalendarItem["content_type"]) => {
    switch (type) {
      case "video":
        return <Film className="size-3" />
      case "photo":
        return <ImageIcon className="size-3" />
      case "text":
      default:
        return <FileText className="size-3" />
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 md:px-8 py-10 space-y-8 animate-fade-in text-slate-805 dark:text-slate-200 flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Calendar
          </h1>
          {isLoading && <span className="text-xs text-slate-400 font-bold animate-pulse">Syncing...</span>}
        </div>

        <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-6 w-full md:w-auto">
          {/* Calendar Controls */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 shrink-0 relative bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800 shadow-xs">
            <button onClick={handlePrev} className="text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition">
              <ChevronLeft className="size-4.5" />
            </button>
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 min-w-[140px] text-center">
              {getRangeLabel()}
            </h2>
            <button onClick={handleNext} className="text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition">
              <ChevronRight className="size-4.5" />
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-lg p-0.5 shadow-xs">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer flex items-center ${viewMode === "month"
                  ? "bg-accent-dark text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
            >
              <CalendarIcon className="size-3.5 mr-1.5" />
              Month
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer flex items-center ${viewMode === "week"
                  ? "bg-accent-dark text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
            >
              <FileText className="size-3.5 mr-1.5" />
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[600px]">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0">
          {WEEKDAYS.map((day, idx) => {
            const isTodayHeader = viewMode === "week" && isToday(daysOfWeek[idx])

            return (
              <div key={day} className={`py-3 text-center border-r last:border-r-0 border-slate-100 dark:border-slate-800/80`}>
                <span className={`text-xs font-bold ${isTodayHeader ? "text-accent-dark" : "text-slate-500"}`}>
                  {day} {viewMode === "week" && daysOfWeek[idx].getDate()}
                </span>
              </div>
            )
          })}
        </div>

        {/* Calendar Body */}
        {viewMode === "week" ? (
          <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800/80 overflow-y-auto">
            {daysOfWeek.map((date, idx) => {
              const posts = getPostsForDate(date)
              const today = isToday(date)
              return (
                <div key={idx} className={`flex flex-col p-2 gap-2 ${today ? "bg-accent-dark/[0.03] dark:bg-accent-dark/[0.05]" : ""}`}>
                  {posts.length === 0 ? (
                    <div className="text-center pt-8 text-[10px] font-bold text-slate-300 dark:text-slate-700 select-none">
                      No posts
                    </div>
                  ) : (
                    posts.map(post => (
                      <button
                        key={post.id}
                        onClick={() => setSelectedPost(post)}
                        className="text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-2.5 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] font-bold text-slate-500">
                            {new Date(post.scheduled_at!).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                          </span>
                          <div className="text-slate-400 group-hover:text-accent-dark transition-colors">
                            {getContentTypeIcon(post.content_type)}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {post.platforms.map(p => (
                            <span key={p.id} className="text-[8px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded-sm text-slate-700 dark:text-slate-300">
                              {p.platform.slice(0, 2)}
                            </span>
                          ))}
                        </div>

                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 line-clamp-2 leading-snug">
                          {post.caption}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-7 auto-rows-fr divide-y divide-x divide-slate-100 dark:divide-slate-800/80">
            {monthDays.map((item, idx) => {
              const posts = getPostsForDate(item.date)
              const today = isToday(item.date)

              return (
                <div key={idx} className={`p-1.5 md:p-2 flex flex-col ${item.isCurrentMonth ? "" : "bg-slate-50/50 dark:bg-slate-950/50 opacity-50"} ${today ? "bg-accent-dark/[0.03] dark:bg-accent-dark/[0.05]" : ""}`}>
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <span className={`text-[10px] md:text-xs font-bold ${today ? "bg-accent-dark text-white rounded px-1.5 py-0.5" : "text-slate-500"}`}>
                      {item.date.getDate()}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar">
                    {posts.length === 0 && item.isCurrentMonth ? (
                      <div className="text-center pt-2 md:pt-4 text-[9px] md:text-[10px] font-bold text-slate-300 dark:text-slate-700 select-none">
                        No posts
                      </div>
                    ) : (
                      posts.map(post => (
                        <button
                          key={post.id}
                          onClick={() => setSelectedPost(post)}
                          className={`text-left text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-1 rounded truncate transition cursor-pointer shadow-xs ${post.content_type === "video" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50 hover:bg-purple-200" :
                              post.content_type === "photo" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-200" :
                                "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 hover:bg-blue-200"
                            }`}
                        >
                          <span className="opacity-75 mr-1 hidden md:inline">
                            {new Date(post.scheduled_at!).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(' ', '')}
                          </span>
                          {post.caption}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Post Details Modal */}
      <ModalShell
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        title="Post Details"
      >
        {selectedPost && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${selectedPost.content_type === "video" ? "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400" :
                  selectedPost.content_type === "photo" ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400" :
                    "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
                }`}>
                {getContentTypeIcon(selectedPost.content_type)}
                {selectedPost.content_type}
              </span>
              <span className="text-xs font-bold text-slate-400">
                {new Date(selectedPost.scheduled_at!).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 break-words leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              {selectedPost.caption}
            </p>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-bold">
              <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                <Clock className="size-3.5" />
                {new Date(selectedPost.scheduled_at!).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedPost.platforms.map((plat) => (
                  <span
                    key={plat.id}
                    className="uppercase font-bold tracking-wider text-[10px] bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 rounded px-2 py-1 shadow-xs"
                  >
                    {plat.platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </ModalShell>
    </main>
  )
}
