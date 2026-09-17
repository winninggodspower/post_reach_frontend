"use client"

import React from "react"
import { Users, UserCheck, Send, Link2, AlertTriangle, CheckCircle2 } from "lucide-react"
import type { AdminAnalyticsData } from "../types"

interface KpiSummaryCardsProps {
  data: AdminAnalyticsData
}

export function KpiSummaryCards({ data }: KpiSummaryCardsProps) {
  const { summary, users, brands, social_accounts, posts } = data

  const totalUsers = summary?.total_users ?? users.total_users ?? 0
  const completedOnboarding =
    summary?.completed_onboarding ?? users.completed_onboarding ?? 0
  const onboardingPct =
    summary?.onboarding_completion_rate_percentage ??
    users.onboarding_completion_rate_percentage ??
    0
  const totalConnected =
    summary?.total_connected_accounts ??
    social_accounts.total_connected_accounts ??
    0
  const livePosts = summary?.live_posts_count ?? posts.live_posts_count ?? 0
  const totalPosts = summary?.total_posts ?? posts.total_posts ?? 0
  const failedPosts =
    summary?.failed_posts_count ?? posts.status_breakdown?.failed ?? 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {/* 1. Total Users */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Users
          </span>
          <div className="flex size-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Users className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-extrabold text-slate-900 leading-none">
            {totalUsers.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            {users.active_users ?? totalUsers} active users
          </p>
        </div>
      </div>

      {/* 2. Percentage Onboarded */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Percentage Onboarded
          </span>
          <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <UserCheck className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-extrabold text-slate-900 leading-none">
            {Number(onboardingPct).toFixed(0)}%
          </p>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            {completedOnboarding} of {totalUsers} completed
          </p>
        </div>
      </div>

      {/* 3. Live Posts */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Live Posts
          </span>
          <div className="flex size-8 items-center justify-center rounded-xl bg-orange-50 text-accent-brand border border-orange-100">
            <Send className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-extrabold text-slate-900 leading-none">
            {livePosts.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Out of {totalPosts} created posts
          </p>
        </div>
      </div>

      {/* 4. Connected Channels */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Connected Channels
          </span>
          <div className="flex size-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <Link2 className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-extrabold text-slate-900 leading-none">
            {totalConnected.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Across {brands.brands_with_connected_accounts} brands
          </p>
        </div>
      </div>

      {/* 5. Failed Posts */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Failed Posts
          </span>
          <div
            className={`flex size-8 items-center justify-center rounded-xl border ${
              failedPosts === 0
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-rose-50 text-rose-600 border-rose-100"
            }`}
          >
            {failedPosts === 0 ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <AlertTriangle className="size-4" />
            )}
          </div>
        </div>
        <div className="mt-3">
          <p
            className={`text-3xl font-extrabold leading-none ${
              failedPosts === 0 ? "text-slate-900" : "text-rose-600"
            }`}
          >
            {failedPosts.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            {failedPosts === 0 ? "All posts published cleanly" : "Needs review"}
          </p>
        </div>
      </div>
    </div>
  )
}
