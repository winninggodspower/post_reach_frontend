"use client"

import Link from "next/link"
import { Calendar, Plus, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { CalendarItem } from "@/features/posts/api/server"
import {
  ScheduledPostCard,
  ScheduledPostCardSkeleton,
} from "./scheduled-post-card"

export interface ScheduledContentProps {
  posts: CalendarItem[]
  isLoading?: boolean
  hideTitle?: boolean
  viewAllHref?: string
  onPostClick?: (post: CalendarItem) => void
}

export function ScheduledContent({
  posts,
  isLoading = false,
  hideTitle = false,
  viewAllHref,
  onPostClick,
}: ScheduledContentProps) {
  if (isLoading) {
    return (
      <div className="space-y-5">
        {!hideTitle && (
          <div className="flex items-center justify-between">
            <div className="h-7 w-48 bg-slate-200 rounded-lg animate-pulse" />
          </div>
        )}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <ScheduledPostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {(!hideTitle || viewAllHref) && (
        <div className="flex items-center justify-between">
          {!hideTitle && (
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Scheduled Content</h3>
          )}
          {viewAllHref && posts.length > 0 && (
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-brand hover:text-accent-dark transition-colors"
            >
              View full queue
              <ArrowRight className="size-3.5" />
            </Link>
          )}
        </div>
      )}

      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <ScheduledPostCard
              key={post.id}
              post={post}
              onClick={onPostClick}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/8 bg-white/50 p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 border border-black/5">
            <Calendar className="size-5" />
          </div>
          <h4 className="mt-4 text-sm font-semibold text-slate-900">No scheduled posts yet</h4>
          <p className="mt-1.5 text-xs text-slate-500 max-w-sm">
            Draft your post, attach media assets, select platforms, and schedule it to publish automatically.
          </p>
          <Link href="/dashboard/posts" className="mt-5">
            <Button size="sm" className="bg-slate-950 text-white hover:bg-slate-800 text-xs font-semibold cursor-pointer">
              <Plus className="mr-1.5 size-3.5" />
              Schedule Post
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export { ScheduledPostCard, ScheduledPostCardSkeleton }
