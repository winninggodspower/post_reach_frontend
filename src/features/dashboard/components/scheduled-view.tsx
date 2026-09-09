"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Plus, RefreshCw, Layers, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScheduledContent } from "@/features/dashboard/components/scheduled-content"
import { CalendarPostDetails } from "@/features/calendar/components/calendar-post-details"
import { getScheduledPosts, type CalendarItem } from "@/features/posts/api/server"
import { PLATFORM_OPTIONS } from "@/features/onboarding/components/steps/shared"

const CONTENT_TYPE_OPTIONS = [
  { id: "all", label: "All Formats" },
  { id: "video", label: "Videos" },
  { id: "photo", label: "Photos" },
  { id: "text", label: "Text" },
]

export function ScheduledView() {
  const [scheduledPosts, setScheduledPosts] = useState<CalendarItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all")
  const [selectedContentType, setSelectedContentType] = useState<string>("all")
  const [selectedPost, setSelectedPost] = useState<CalendarItem | null>(null)

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getScheduledPosts({
        platform: selectedPlatform === "all" ? undefined : selectedPlatform,
        content_type: selectedContentType === "all" ? undefined : selectedContentType,
      })
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
  }, [selectedPlatform, selectedContentType])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleDeletePost = (id: string) => {
    setScheduledPosts((prev) => prev.filter((p) => p.id !== id))
    setSelectedPost(null)
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8 min-w-0 overflow-x-hidden space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Header Row: Title on Left, Circle Refresh + Schedule CTA on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
            Scheduled Posts
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View, manage, and monitor your upcoming queue of automated social media posts.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Circle Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={fetchPosts}
            disabled={isLoading}
            title="Refresh queue"
            className="size-10 rounded-full border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-50 shadow-xs cursor-pointer transition-transform active:scale-95"
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin text-accent-brand" : ""}`} />
            <span className="sr-only">Refresh queue</span>
          </Button>

          {/* Primary Action Button */}
          <Link href="/dashboard/posts">
            <Button
              size="sm"
              className="h-10 bg-linear-to-r from-accent-brand to-accent-dark text-white font-bold cursor-pointer rounded-xl px-5 shadow-sm hover:brightness-105"
            >
              <Plus className="mr-1.5 size-4" />
              Schedule Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Toolbar on New Line */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Platform Filter */}
          <div className="relative flex items-center">
            <Globe className="pointer-events-none absolute left-3 size-3.5 text-slate-400" />
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="h-9 rounded-xl border border-slate-200/90 bg-slate-50/60 pl-8.5 pr-8 text-xs font-semibold text-slate-700 outline-none transition focus:border-slate-950 focus:bg-white shadow-2xs hover:border-slate-300 cursor-pointer appearance-none"
            >
              <option value="all">All Platforms</option>
              {PLATFORM_OPTIONS.map((plat) => (
                <option key={plat.id} value={plat.id}>
                  {plat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Content Type Filter */}
          <div className="relative flex items-center">
            <Layers className="pointer-events-none absolute left-3 size-3.5 text-slate-400" />
            <select
              value={selectedContentType}
              onChange={(e) => setSelectedContentType(e.target.value)}
              className="h-9 rounded-xl border border-slate-200/90 bg-slate-50/60 pl-8.5 pr-8 text-xs font-semibold text-slate-700 outline-none transition focus:border-slate-950 focus:bg-white shadow-2xs hover:border-slate-300 cursor-pointer appearance-none"
            >
              {CONTENT_TYPE_OPTIONS.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Count Indicator */}
        {!isLoading && (
          <span className="text-xs font-medium text-slate-500 pr-1">
            {scheduledPosts.length} {scheduledPosts.length === 1 ? "post" : "posts"} in queue
          </span>
        )}
      </div>

      {/* Posts List */}
      <div className="rounded-2xl">
        <ScheduledContent
          posts={scheduledPosts}
          isLoading={isLoading}
          hideTitle
          onPostClick={(post) => setSelectedPost(post)}
        />
      </div>

      {/* Post Details Slide-out Sheet */}
      <CalendarPostDetails
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onDelete={handleDeletePost}
      />
    </main>
  )
}
