"use client"

import Link from "next/link"
import { PenSquare, Settings, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  userName: string
  hasPosts: boolean
  postsCount: number
}

export function DashboardHeader({ userName, hasPosts, postsCount }: DashboardHeaderProps) {
  return (
    <div className="space-y-6 relative">
      {/* Dynamic Header Greeting */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-accent-brand/20 blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/20 blur-[100px]" />
        
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-brand to-orange-300">{userName}</span>
          </h1>
          <p className="mt-2 sm:mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-300">
            {hasPosts
              ? `You have ${postsCount} post${postsCount === 1 ? "" : "s"} active in your schedule queue.`
              : "Connect your social channels and schedule your first post to get started."}
          </p>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="flex flex-wrap gap-2.5 sm:gap-3">
        <Link href="/dashboard/posts">
          <Button className="h-9 sm:h-11 text-xs sm:text-sm bg-gradient-to-r from-accent-brand to-accent-dark text-white shadow-lg shadow-accent-brand/25 hover:shadow-xl hover:shadow-accent-brand/40 hover:-translate-y-0.5 transition-all duration-300 font-bold cursor-pointer rounded-lg sm:rounded-xl px-4 sm:px-6">
            <PenSquare className="mr-1.5 sm:mr-2 size-3.5 sm:size-4.5" />
            New Post
          </Button>
        </Link>
        <Link href="/dashboard/settings">
          <Button variant="outline" className="h-9 sm:h-11 text-xs sm:text-sm border-slate-200 hover:border-slate-300 hover:bg-slate-50 font-semibold cursor-pointer text-slate-700 rounded-lg sm:rounded-xl px-3 sm:px-5 hover:-translate-y-0.5 shadow-xs transition-all">
            <Settings className="mr-1.5 sm:mr-2 size-3.5 sm:size-4 text-slate-400" />
            Manage Channels
          </Button>
        </Link>
        <Link href="/dashboard/calendar">
          <Button variant="outline" className="h-9 sm:h-11 text-xs sm:text-sm border-slate-200 hover:border-slate-300 hover:bg-slate-50 font-semibold cursor-pointer text-slate-700 rounded-lg sm:rounded-xl px-3 sm:px-5 hover:-translate-y-0.5 shadow-xs transition-all">
            <Calendar className="mr-1.5 sm:mr-2 size-3.5 sm:size-4 text-slate-400" />
            View Calendar
          </Button>
        </Link>
      </div>
    </div>
  )
}
