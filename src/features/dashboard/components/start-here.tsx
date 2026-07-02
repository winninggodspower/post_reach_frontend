"use client"

import Link from "next/link"
import { ArrowRight, Calendar, Repeat, Rocket } from "lucide-react"

interface StartHereProps {
  scheduledCount: number
}

export function StartHere({ scheduledCount }: StartHereProps) {
  return (
    <section className="mt-8 rounded-3xl border border-white/60 bg-linear-to-b from-orange-50/50 via-orange-50/10 to-transparent p-6 shadow-xs backdrop-blur-md sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-orange-100 p-1.5 text-accent-dark">
              <Rocket className="size-4 animate-bounce" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-dark">
              Getting Started
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Start Here
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
            Publishing to social networks is easier than ever. Follow these steps to schedule your first post or reshare a piece of content.
          </p>
        </div>

        {scheduledCount > 0 && (
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50/80 px-4 py-2 text-xs font-bold text-emerald-800 backdrop-blur-xs">
            <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
            {scheduledCount} post{scheduledCount === 1 ? "" : "s"} scheduled!
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Card 1: Schedule Content */}
        <Link
          href="/dashboard/posts"
          className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-black/8 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/20 hover:shadow-[0_22px_50px_-24px_rgba(251,146,60,0.25)] cursor-pointer"
        >
          {/* Accent Glow Background */}
          <div className="absolute -top-16 -right-16 size-32 rounded-full bg-orange-200/20 blur-2xl group-hover:bg-orange-300/35 transition duration-300" />

          <div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-orange-50 text-accent-dark shadow-inner transition group-hover:scale-105">
              <Calendar className="size-6 text-accent-dark" />
            </div>
            <h3 className="mt-5 font-heading text-lg font-bold text-slate-950">
              Schedule a post
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
              Compose a brand new post, attach media assets, select target networks (Instagram, X, YouTube, etc.), and pick a publishing date.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-dark">
            <span>Schedule Post</span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </div>
        </Link>

        {/* Card 2: Connect Social Accounts */}
        <Link
          href="/dashboard/settings"
          className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-black/8 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/20 hover:shadow-[0_22px_50px_-24px_rgba(59,130,246,0.25)] cursor-pointer"
        >
          {/* Accent Glow Background */}
          <div className="absolute -top-16 -right-16 size-32 rounded-full bg-blue-200/20 blur-2xl group-hover:bg-blue-300/35 transition duration-300" />

          <div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 shadow-inner transition group-hover:scale-105">
              <Repeat className="size-6 text-blue-500" />
            </div>
            <h3 className="mt-5 font-heading text-lg font-bold text-slate-950">
              Connect social accounts
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
              Connect your YouTube, Facebook, TikTok, Instagram, LinkedIn, or X profiles to enable multi-platform publishing and dashboard statistics.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-500">
            <span>Manage Accounts</span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </div>
        </Link>
      </div>
    </section>
  )
}
