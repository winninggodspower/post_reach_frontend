"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/features/auth/store/auth-store"
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header"
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats"
import { ScheduledContent } from "@/features/dashboard/components/scheduled-content"
import { CalendarPostDetails } from "@/features/calendar/components/calendar-post-details"
import { getScheduledPosts, type CalendarItem } from "@/features/posts/api/server"

export default function DashboardPage() {
  const user = useAuth((state) => state.user)
  const [scheduledPosts, setScheduledPosts] = useState<CalendarItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<CalendarItem | null>(null)

  const brand = user?.brand
  const connectedAccountsCount = brand?.connected_accounts?.length ?? 0

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getScheduledPosts()
      if (response.success && Array.isArray(response.data)) {
        setScheduledPosts(response.data)
      } else {
        setScheduledPosts([])
      }
    } catch {
      setScheduledPosts([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleDeletePost = (id: string) => {
    setScheduledPosts((prev) => prev.filter((p) => p.id !== id))
    setSelectedPost(null)
  }

  // Display top 5 upcoming posts on dashboard preview widget
  const displayedPosts = scheduledPosts.slice(0, 5)

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 min-w-0 overflow-x-hidden space-y-12 animate-in fade-in duration-300">
      {/* Header Greeting & Action buttons */}
      <DashboardHeader
        userName={user?.first_name || "Creator"}
        hasPosts={scheduledPosts.length > 0}
        postsCount={scheduledPosts.length}
      />

      {/* Empty State Banner (Only shown if queue is empty, before Stats Cards) */}
      {!isLoading && scheduledPosts.length === 0 && (
        <ScheduledContent
          posts={[]}
          isLoading={false}
        />
      )}

      {/* Loading Skeleton if initial load */}
      {isLoading && (
        <ScheduledContent
          posts={[]}
          isLoading={true}
        />
      )}

      {/* Stats Cards */}
      <DashboardStats
        scheduledCount={scheduledPosts.length}
        connectedCount={connectedAccountsCount}
      />

      {/* Scheduled Queue section (Only shown if queue has active posts, after Stats Cards) */}
      {!isLoading && scheduledPosts.length > 0 && (
        <ScheduledContent
          posts={displayedPosts}
          viewAllHref={scheduledPosts.length > 5 ? "/dashboard/scheduled" : undefined}
          onPostClick={(post) => setSelectedPost(post)}
        />
      )}

      {/* Post Details Slide-out Sheet */}
      <CalendarPostDetails
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onDelete={handleDeletePost}
      />
    </main>
  )
}
