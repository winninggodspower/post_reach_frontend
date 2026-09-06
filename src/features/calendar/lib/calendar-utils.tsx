import { Film, Image as ImageIcon, FileText } from "lucide-react"
import type { CalendarItem } from "@/features/posts/api/server"

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

export const FULL_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export function getStartOfWeek(d: Date) {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day
  const sunday = new Date(date.setDate(diff))
  sunday.setHours(0, 0, 0, 0)
  return sunday
}

export function getDaysOfWeek(startOfWeek: Date) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    return d
  })
}

export function getMonthDays(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const days: { date: Date; isCurrentMonth: boolean }[] = []

  const startPadding = firstDay.getDay()
  for (let i = startPadding; i > 0; i--) {
    const d = new Date(year, month, 1 - i)
    days.push({ date: d, isCurrentMonth: false })
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(year, month, i), isCurrentMonth: true })
  }

  const endPadding = 7 - (days.length % 7)
  if (endPadding < 7) {
    for (let i = 1; i <= endPadding; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
    }
  }

  return days
}

export function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  )
}

export function isToday(date: Date) {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export function getContentTypeIcon(type: CalendarItem["content_type"]) {
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
