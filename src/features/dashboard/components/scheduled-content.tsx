"use client"

import Link from "next/link"
import { Calendar, Plus, Clock, FileText } from "lucide-react"

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

interface ScheduledContentProps {
  posts: ScheduledPost[]
  hideTitle?: boolean
}

export function ScheduledContent({ posts, hideTitle = false }: ScheduledContentProps) {
  return (
    <div className="space-y-5">
      {(!hideTitle || posts.length > 0) && (
        <div className={`flex items-center ${hideTitle ? "justify-end" : "justify-between"}`}>
          {!hideTitle && (
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Scheduled Content</h3>
          )}
        </div>
      )}

      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:shadow-xl hover:shadow-black/5 hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="flex items-start gap-3 sm:gap-4 min-w-0 w-full">
                {post.mediaUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.mediaUrl}
                    alt=""
                    className="size-12 sm:size-16 rounded-xl object-cover border border-slate-200 shrink-0 shadow-sm"
                  />
                ) : (
                  <div className="size-12 sm:size-16 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center shrink-0 shadow-inner">
                    <FileText className="size-5 sm:size-6 text-slate-400 drop-shadow-sm" />
                  </div>
                )}
                
                <div className="min-w-0 flex-1 py-0.5 space-y-2 sm:space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-accent-brand transition-colors leading-snug">
                      {post.content}
                    </p>
                    {/* Mobile Badge */}
                    <div className="sm:hidden shrink-0 mt-0.5">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${post.type === "repost" ? "bg-purple-50 text-purple-700 border-purple-200/50" : "bg-orange-50 text-accent-dark border-orange-200/50"}`}>
                        {post.type === "repost" ? "Repost" : "Original"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {post.platforms.map((plat) => (
                      <span
                        key={plat}
                        className="inline-flex items-center rounded-md sm:rounded-lg bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-600 border border-slate-200/50"
                      >
                        {plat}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 font-medium">
                    <Clock className="size-3 sm:size-3.5 shrink-0" />
                    <span className="truncate">Scheduled for {new Date(post.scheduledAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Desktop Badge */}
              <div className="hidden sm:block shrink-0">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider border ${post.type === "repost" ? "bg-purple-50 text-purple-700 border-purple-200/50" : "bg-orange-50 text-accent-dark border-orange-200/50"}`}>
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
