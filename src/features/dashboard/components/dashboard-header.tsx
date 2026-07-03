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
    <div className="space-y-6 mb-10 mt-6 sm:mb-15 sm:mt-10">
      {/* Dynamic Header Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Welcome back, {userName}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {hasPosts
            ? `You have ${postsCount} post${postsCount === 1 ? "" : "s"} active in your schedule queue.`
            : "Connect your social channels and schedule your first post to get started."}
        </p>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/posts">
          <Button className="bg-linear-to-r from-accent-dark to-accent-brand text-white shadow-xs hover:brightness-95 transition-all duration-300 font-semibold cursor-pointer">
            <PenSquare className="mr-1.5 size-4" />
            New Post
          </Button>
        </Link>
        <Link href="/dashboard/settings">
          <Button variant="outline" className="border-black/8 hover:bg-slate-50 font-semibold cursor-pointer text-slate-700">
            <Settings className="mr-1.5 size-4 text-slate-400" />
            Manage Channels
          </Button>
        </Link>
        <Link href="/dashboard/calendar">
          <Button variant="outline" className="border-black/8 hover:bg-slate-50 font-semibold cursor-pointer text-slate-700">
            <Calendar className="mr-1.5 size-4 text-slate-400" />
            View Calendar
          </Button>
        </Link>
      </div>
    </div>
  )
}
