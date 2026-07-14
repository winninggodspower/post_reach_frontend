"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Film, Image as ImageIcon, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getCalendarItems } from "@/features/posts/api/server"
import type { CalendarItem } from "@/features/posts/api/server"

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6) // 6 AM to 11 PM

export function CalendarView() {
  const [mounted, setMounted] = useState(false)
  const [scheduledPosts, setScheduledPosts] = useState<CalendarItem[]>([])
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [selectedPost, setSelectedPost] = useState<CalendarItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const gridContainerRef = useRef<HTMLDivElement>(null)

  // Get start of the week (Monday) immutably
  const getStartOfWeek = (d: Date) => {
    const date = new Date(d)
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Sunday (0) to get Monday
    const monday = new Date(date.setDate(diff))
    monday.setHours(0, 0, 0, 0)
    return monday
  }

  const startOfWeek = getStartOfWeek(currentDate)

  // Generate 7 days of the active week
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    return d
  })

  // Format month and year label for active week
  const getWeekRangeLabel = () => {
    const start = daysOfWeek[0]
    const end = daysOfWeek[6]
    
    if (start.getFullYear() !== end.getFullYear()) {
      return `${MONTHS[start.getMonth()]} ${start.getFullYear()} – ${MONTHS[end.getMonth()]} ${end.getFullYear()}`
    }
    if (start.getMonth() !== end.getMonth()) {
      return `${MONTHS[start.getMonth()]} – ${MONTHS[end.getMonth()]} ${start.getFullYear()}`
    }
    return `${MONTHS[start.getMonth()]} ${start.getFullYear()}`
  }

  // Fetch week posts from API
  useEffect(() => {
    setMounted(true)
    
    const fetchWeekPosts = async () => {
      setIsLoading(true)
      try {
        const startStr = daysOfWeek[0].toISOString().split("T")[0]
        const endStr = daysOfWeek[6].toISOString().split("T")[0]
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
    
    fetchWeekPosts()
  }, [currentDate])

  // Scroll to starting working hours (e.g. 8 AM) by default
  useEffect(() => {
    if (mounted && gridContainerRef.current) {
      // 8 AM row is at index 2 (8 - 6)
      gridContainerRef.current.scrollTop = 2 * 72
    }
  }, [mounted])

  if (!mounted) {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-96 bg-slate-100 dark:bg-slate-900 rounded-xl" />
        </div>
      </main>
    )
  }

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const handleNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const getPostsForSlot = (date: Date, hour: number) => {
    return scheduledPosts.filter((post) => {
      if (!post.scheduled_at) return false
      const postDate = new Date(post.scheduled_at)
      return (
        postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear() &&
        postDate.getHours() === hour
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

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM"
    if (hour === 12) return "12 PM"
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`
  }

  const getContentTypeIcon = (type: CalendarItem["content_type"]) => {
    switch (type) {
      case "video":
        return <Film className="size-3 text-purple-500" />
      case "photo":
        return <ImageIcon className="size-3 text-emerald-500" />
      case "text":
      default:
        return <FileText className="size-3 text-blue-500" />
    }
  }

  const getContentTypeClass = (type: CalendarItem["content_type"]) => {
    switch (type) {
      case "video":
        return "border-purple-200 bg-purple-50/50 dark:border-purple-950/30 dark:bg-purple-950/10 text-purple-700 dark:text-purple-400"
      case "photo":
        return "border-emerald-200 bg-emerald-50/50 dark:border-emerald-950/30 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-400"
      case "text":
      default:
        return "border-blue-200 bg-blue-50/50 dark:border-blue-950/30 dark:bg-blue-950/10 text-blue-700 dark:text-blue-400"
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8 space-y-6 animate-fade-in text-slate-805 dark:text-slate-200">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Calendar
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage, schedule, and view your upcoming week's publishing pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Week selection */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-xl p-1 shadow-xs">
            <button
              onClick={handlePrevWeek}
              className="p-2 text-slate-500 hover:text-slate-955 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="Previous Week"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-350 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={handleNextWeek}
              className="p-2 text-slate-500 hover:text-slate-955 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="Next Week"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <Link href="/dashboard/posts">
            <Button className="bg-linear-to-r from-accent-dark to-accent-brand hover:brightness-105 text-white font-bold cursor-pointer rounded-xl h-10 px-5 shadow-md">
              <Plus className="mr-1.5 size-4" />
              Create Post
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4 items-start">
        {/* Weekly Time Grid */}
        <div className="lg:col-span-3 border border-black/8 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-xs flex flex-col">
          {/* Header Row: Month Name and Year */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-brand" />
              {getWeekRangeLabel()}
            </h2>
            {isLoading && (
              <span className="text-xs font-semibold text-slate-400 animate-pulse">
                Syncing calendar...
              </span>
            )}
          </div>

          {/* Days Grid Header */}
          <div className="grid grid-cols-[80px_1fr] border-b border-slate-100 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-955">
            <div className="border-r border-slate-100 dark:border-slate-900" />
            <div className="grid grid-cols-7 text-center">
              {daysOfWeek.map((date, idx) => {
                const isDayToday = isToday(date)
                return (
                  <div
                    key={idx}
                    className={`py-3 flex flex-col items-center justify-center gap-1 border-r last:border-r-0 border-slate-100 dark:border-slate-900 ${
                      isDayToday ? "bg-accent-brand/5 dark:bg-accent-brand/10" : ""
                    }`}
                  >
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                      isDayToday ? "text-accent-brand" : "text-slate-400 dark:text-slate-500"
                    }`}>
                      {WEEKDAYS[idx]}
                    </span>
                    <span className={`inline-flex items-center justify-center size-8 text-base font-black rounded-full transition-all ${
                      isDayToday
                        ? "bg-accent-brand text-white shadow-xs scale-105"
                        : "text-slate-700 dark:text-slate-355"
                    }`}>
                      {date.getDate()}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Time Scroll Area */}
          <div
            ref={gridContainerRef}
            className="overflow-y-auto max-h-[620px] min-h-[400px] scroll-smooth divide-y divide-slate-100 dark:divide-slate-900/60"
          >
            {HOURS.map((hour) => (
              <div key={hour} className="grid grid-cols-[80px_1fr] min-h-[72px] relative group/row">
                {/* Hour Label */}
                <div className="py-2.5 px-3 border-r border-slate-100 dark:border-slate-900/80 text-right text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50/10 dark:bg-slate-955 sticky left-0 select-none">
                  {formatHour(hour)}
                </div>

                {/* 7 Day Slots */}
                <div className="grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-900/80 relative">
                  {daysOfWeek.map((date, dayIdx) => {
                    const posts = getPostsForSlot(date, hour)
                    return (
                      <div
                        key={dayIdx}
                        className={`p-1.5 min-h-[72px] flex flex-col gap-1.5 transition-colors relative hover:bg-slate-50/40 dark:hover:bg-slate-900/20 ${
                          isToday(date) ? "bg-accent-brand/[0.01] dark:bg-accent-brand/[0.02]" : ""
                        }`}
                      >
                        {posts.map((post) => (
                          <button
                            key={post.id}
                            onClick={() => setSelectedPost(post)}
                            className={`w-full text-left p-2 rounded-xl border text-[11px] font-medium leading-tight shadow-xs hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer select-none ${getContentTypeClass(
                              post.content_type
                            )}`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="inline-flex items-center gap-1">
                                {getContentTypeIcon(post.content_type)}
                                <span className="text-[9px] font-black uppercase tracking-wider opacity-90">
                                  {post.content_type}
                                </span>
                              </span>
                              <span className="text-[9px] font-extrabold opacity-75">
                                {new Date(post.scheduled_at!).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="line-clamp-2 break-words opacity-90 font-semibold">
                              {post.caption}
                            </p>
                          </button>
                        ))}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected / Info Panel */}
        <div className="border border-black/8 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[480px]">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
              <Clock className="size-4.5 text-accent-brand shrink-0" />
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                Post Details
              </h3>
            </div>

            <div className="mt-5 space-y-4">
              {selectedPost ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getContentTypeClass(
                        selectedPost.content_type
                      )}`}>
                        {getContentTypeIcon(selectedPost.content_type)}
                        <span className="ml-0.5">{selectedPost.content_type}</span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {new Date(selectedPost.scheduled_at!).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-850 dark:text-slate-200 break-words leading-relaxed whitespace-pre-wrap">
                      {selectedPost.caption}
                    </p>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-3.5 text-slate-400" />
                        {new Date(selectedPost.scheduled_at!).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {selectedPost.platforms.map((plat) => (
                          <span
                            key={plat.id}
                            className="uppercase font-bold tracking-wider text-[8px] bg-slate-100 dark:bg-slate-855 text-slate-650 dark:text-slate-350 rounded px-1.5 py-0.5 border border-slate-200/30 dark:border-slate-800/50"
                          >
                            {plat.platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center space-y-3 select-none">
                  <div className="inline-flex size-12 items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 text-slate-400 shadow-xs">
                    <CalendarIcon className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-305">
                      No post selected
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-505 max-w-[200px] mx-auto mt-1 leading-normal">
                      Click on any card in the timeline to view full description and status detail.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-6">
            <Link
              href="/dashboard/posts"
              className="block w-full"
            >
              <Button
                variant="outline"
                className="w-full border-slate-200/80 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-305 text-xs font-bold cursor-pointer rounded-xl h-10 shadow-xs"
              >
                <Plus className="mr-1.5 size-4" />
                Schedule new post
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
