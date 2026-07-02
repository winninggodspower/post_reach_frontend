"use client"

import { useState } from "react"
import { useAuth } from "@/features/auth/store/auth-store"
import { StartHere } from "@/features/dashboard/components/start-here"

interface ScheduledPost {
  id: string
  content: string
  platforms: string[]
  scheduledAt: string
  mediaUrl?: string
  mediaName?: string
  type: string
}

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
  const connectedAccountsCount = brand
    ? [
      brand.is_youtube_connected,
      brand.is_instagram_connected,
      brand.is_tiktok_connected,
      brand.is_facebook_connected,
      brand.is_linkedin_connected,
      brand.is_x_connected,
    ].filter(Boolean).length
    : 0

  return (
    <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 min-w-0 overflow-x-hidden">
      {/* Start Here / Onboarding widget */}
      <StartHere
        scheduledCount={scheduledPosts.length}
      />

      {/* Stats Cards */}
      <section className="mt-8 grid gap-4 grid-cols-1 lg:grid-cols-3 p-6 sm:p-8">
        <article className="rounded-2xl border border-black/8 bg-white p-5 shadow-xs transition hover:shadow-md duration-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Scheduled Posts</h2>
          <p className="mt-2.5 text-3xl font-bold text-slate-950">{scheduledPosts.length}</p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
            <span className="inline-flex size-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Active queue</span>
          </div>
        </article>

        <article className="rounded-2xl border border-black/8 bg-white p-5 shadow-xs transition hover:shadow-md duration-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Connected Channels</h2>
          <p className="mt-2.5 text-3xl font-bold text-slate-950">{connectedAccountsCount}</p>
          <div className="mt-3 text-[11px] font-medium text-slate-500">
            {connectedAccountsCount > 0 ? "Channels active" : "No channels linked"}
          </div>
        </article>

        <article className="rounded-2xl border border-black/8 bg-white p-5 shadow-xs transition hover:shadow-md duration-200 flex flex-col justify-between min-h-[120px]">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Time Saved</h2>
              <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                +18%
              </span>
            </div>
            <p className="mt-1.5 text-3xl font-bold text-slate-950">14.5 hrs</p>
          </div>
          {/* Sparkline SVG Chart */}
          <div className="mt-3 h-6 w-full shrink-0">
            <svg className="h-full w-full" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(251, 146, 60, 0.25)" />
                  <stop offset="100%" stopColor="rgba(251, 146, 60, 0.0)" />
                </linearGradient>
              </defs>
              <path
                d="M0,25 Q15,20 30,12 T60,18 T90,5 L100,2"
                fill="none"
                stroke="rgb(251, 146, 60)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M0,25 Q15,20 30,12 T60,18 T90,5 L100,2 L100,30 L0,30 Z"
                fill="url(#sparklineGrad)"
              />
            </svg>
          </div>
        </article>
      </section>

      {/* Scheduled Posts list preview if any */}
      {scheduledPosts.length > 0 && (
        <section className="mt-10 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-950">Scheduled Queue</h3>
            <button
              onClick={() => {
                localStorage.removeItem("postreach-scheduled-posts")
                setScheduledPosts([])
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
            >
              Clear Queue
            </button>
          </div>
          <div className="space-y-3">
            {scheduledPosts.map((post) => (
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
        </section>
      )}
    </main>
  )
}
