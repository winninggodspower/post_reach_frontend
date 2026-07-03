"use client"

import { useEffect, useState } from "react"
import { ScheduledQueue, type ScheduledPost } from "@/features/dashboard/components/scheduled-queue"

export function ScheduledView() {
  const [mounted, setMounted] = useState(false)
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])

  useEffect(() => {
    setMounted(true)
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

  const handleClearQueue = () => {
    localStorage.removeItem("postreach-scheduled-posts")
    setScheduledPosts([])
  }

  if (!mounted) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200 rounded" />
          <div className="h-4 w-72 bg-slate-200 rounded" />
          <div className="h-40 bg-slate-100 rounded-xl" />
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8 min-w-0 overflow-x-hidden space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Scheduled Posts
        </h1>
        <p className="text-sm text-slate-500 mt-1.5">
          View, manage, and monitor your upcoming queue of automated social media posts.
        </p>
      </div>

      <div className="border border-black/5 bg-slate-50/50 rounded-2xl p-6 sm:p-8">
        <ScheduledQueue
          posts={scheduledPosts}
          onClear={handleClearQueue}
        />
      </div>
    </main>
  )
}
