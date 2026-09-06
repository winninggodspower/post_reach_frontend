"use client"

import { useEffect, useState } from "react"

import { getCalendarItems } from "@/features/posts/api/server"
import type { CalendarItem } from "@/features/posts/api/server"
import {
  FULL_MONTHS,
  getDaysOfWeek,
  getMonthDays,
  getStartOfWeek,
  MONTHS,
} from "../lib/calendar-utils"
import { CalendarDesktopView } from "./calendar-desktop-view"
import { CalendarHeader } from "./calendar-header"
import { CalendarMobileView } from "./calendar-mobile-view"
import { CalendarPostDetails } from "./calendar-post-details"

export function CalendarView() {
  const [mounted, setMounted] = useState(false)
  const [scheduledPosts, setScheduledPosts] = useState<CalendarItem[]>([])
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [selectedDay, setSelectedDay] = useState<Date>(() => new Date())
  const [selectedPost, setSelectedPost] = useState<CalendarItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"week" | "month">("week")

  const startOfWeek = getStartOfWeek(currentDate)
  const daysOfWeek = getDaysOfWeek(startOfWeek)
  const monthDays = getMonthDays(currentDate)

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

  useEffect(() => {
    setMounted(true)

    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        let startStr: string
        let endStr: string

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

    void fetchPosts()
  }, [currentDate, viewMode])

  const handlePrev = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7)
      setSelectedDay(new Date(newDate))
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
      setSelectedDay(new Date(newDate.getFullYear(), newDate.getMonth(), 1))
    }
    setCurrentDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7)
      setSelectedDay(new Date(newDate))
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
      setSelectedDay(new Date(newDate.getFullYear(), newDate.getMonth(), 1))
    }
    setCurrentDate(newDate)
  }

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter((post) => {
      const postDate = new Date(post.scheduled_at || post.created_at)
      return (
        postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear()
      )
    })
  }

  if (!mounted) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 md:px-8 py-6 md:py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-96 bg-slate-100 dark:bg-slate-900 rounded-xl" />
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 md:px-8 py-6 md:py-10 space-y-6 md:space-y-8 animate-fade-in text-slate-800 dark:text-slate-200 flex flex-col min-w-0 overflow-x-hidden">
      {/* Header with Title, Controls, and Mode Switcher */}
      <CalendarHeader
        isLoading={isLoading}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        rangeLabel={getRangeLabel()}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      {/* Mobile Experience (Day Strip / Month Picker + Agenda Feed) */}
      <CalendarMobileView
        viewMode={viewMode}
        daysOfWeek={daysOfWeek}
        monthDays={monthDays}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        getPostsForDate={getPostsForDate}
        onSelectPost={setSelectedPost}
      />

      {/* Desktop Experience (7-Column Week & Month Grids) */}
      <CalendarDesktopView
        viewMode={viewMode}
        daysOfWeek={daysOfWeek}
        monthDays={monthDays}
        getPostsForDate={getPostsForDate}
        onSelectPost={setSelectedPost}
      />

      {/* Post Details Drawer */}
      <CalendarPostDetails
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onDelete={(deletedId) =>
          setScheduledPosts((prev) => prev.filter((p) => p.id !== deletedId))
        }
      />
    </main>
  )
}
