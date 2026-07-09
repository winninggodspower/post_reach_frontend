"use client"

import { useState } from "react"
import { useAuth } from "@/features/auth/store/auth-store"
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header"
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats"
import { ScheduledQueue, type ScheduledPost } from "@/features/dashboard/components/scheduled-queue"

export default function DashboardPage() {
  const user = useAuth((state) => state.user)
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(() => {
    if (typeof window !== "undefined") {
      const postsKey = "postreach-scheduled-posts"
      const postsStr = localStorage.getItem(postsKey)
      if (postsStr) {
        try {
          return JSON.parse(postsStr)
        } catch {
          return []
        }
      }
    }
    return []
  })

  const brand = user?.brand
  const connectedAccountsCount = brand?.connected_accounts?.length ?? 0

  const handleClearQueue = () => {
    localStorage.removeItem("postreach-scheduled-posts")
    setScheduledPosts([])
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8 min-w-0 overflow-x-hidden space-y-8">
      {/* Header Greeting & Action buttons */}
      <DashboardHeader
        userName={user?.first_name || "Creator"}
        hasPosts={scheduledPosts.length > 0}
        postsCount={scheduledPosts.length}
      />

      {/* Empty State Banner (Only shown if queue is empty, before Stats Cards) */}
      {scheduledPosts.length === 0 && (
        <ScheduledQueue
          posts={scheduledPosts}
          onClear={handleClearQueue}
        />
      )}

      {/* Stats Cards */}
      <DashboardStats
        scheduledCount={scheduledPosts.length}
        connectedCount={connectedAccountsCount}
      />

      {/* Scheduled Queue section (Only shown if queue has active posts, after Stats Cards) */}
      {scheduledPosts.length > 0 && (
        <ScheduledQueue
          posts={scheduledPosts}
          onClear={handleClearQueue}
        />
      )}
    </main>
  )
}
