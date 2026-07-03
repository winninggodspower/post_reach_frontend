"use client"

import Link from "next/link"
import { Calendar, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export interface ScheduledPost {
  id: string
  content: string
  platforms: string[]
  scheduledAt: string
  mediaUrl?: string
  mediaName?: string
  type: string
}

interface ScheduledQueueProps {
  posts: ScheduledPost[]
  onClear: () => void
}

export function ScheduledQueue({ posts, onClear }: ScheduledQueueProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-950">Scheduled Queue</h3>
        {posts.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
          >
            Clear Queue
          </button>
        )}
      </div>

      {posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-black/8 bg-white/70 backdrop-blur-xs"
            >
              <div className="flex items-start gap-3 min-w-0">
                {post.mediaUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.mediaUrl}
                    alt=""
                    className="size-12 rounded-lg object-cover border border-black/5 shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {post.content}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {post.platforms.map((plat) => (
                      <span
                        key={plat}
                        className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                      >
                        {plat}
                      </span>
                    ))}
                    <span className="text-[10px] text-slate-400 font-medium">
                      • Scheduled for {new Date(post.scheduledAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-1 text-[10px] font-semibold text-accent-dark border border-orange-200/50">
                  {post.type === "repost" ? "Repost" : "Original Post"}
                </span>
              </div>
            </div>
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
