"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
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
  const router = useRouter()
  const user = useAuth((state) => state.user)
  const logout = useAuth((state) => state.logout)
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
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-dark">
            Dashboard
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">Welcome back</h1>
          <p className="mt-2 text-slate-600">
            Signed in as {user?.email ?? "your account"}
          </p>
        </div>

        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              logout()
              router.replace("/signin")
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Start Here / Onboarding widget */}
      <StartHere
        scheduledCount={scheduledPosts.length}
      />

      {/* Stats Cards */}
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:shadow-md duration-200">
          <h2 className="text-sm font-semibold text-slate-500">Scheduled Posts</h2>
          <p className="mt-2 text-3xl font-bold text-slate-950">{scheduledPosts.length}</p>
        </article>
        <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:shadow-md duration-200">
          <h2 className="text-sm font-semibold text-slate-500">Connected Accounts</h2>
          <p className="mt-2 text-3xl font-bold text-slate-950">{connectedAccountsCount}</p>
        </article>
        <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:shadow-md duration-200">
          <h2 className="text-sm font-semibold text-slate-500">Workspaces</h2>
          <p className="mt-2 text-3xl font-bold text-slate-950">1</p>
        </article>
      </section>

      {/* Scheduled Posts list preview if any */}
      {scheduledPosts.length > 0 && (
        <section className="mt-10">
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
