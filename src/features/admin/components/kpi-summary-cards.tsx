"use client"

import React from "react"
import {
  Users,
  UserCheck,
  Send,
  Link2,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react"
import type { AdminAnalyticsData } from "../types"

interface KpiSummaryCardsProps {
  data: AdminAnalyticsData
}

export function KpiSummaryCards({ data }: KpiSummaryCardsProps) {
  const { summary, users, brands, social_accounts, posts } = data

  // Resolve values either from data.summary or from the detailed objects
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

  const activeUserRatio =
    totalUsers > 0
      ? Math.round(((users.active_users || totalUsers) / totalUsers) * 100)
      : 0

  const connectedBrandRatio =
    brands.total_brands > 0
      ? Math.round(
          (brands.brands_with_connected_accounts / brands.total_brands) * 100
        )
      : 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {/* 1. Total & Active Users */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Users
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-100/70 transition-colors">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
              {totalUsers.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
              {activeUserRatio}% Active
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>{users.active_users} active</span>
          <span className="flex items-center gap-1 font-semibold text-blue-600 text-[11px]">
            <TrendingUp className="size-3" />
            +{users.growth?.joined_this_month ?? 0} mo
          </span>
        </div>
      </div>

      {/* 2. Onboarding Conversion */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Onboarding Health
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:bg-emerald-100/70 transition-colors">
              <UserCheck className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
              {Number(onboardingPct).toFixed(0)}%
            </span>
            <span className="text-xs font-medium text-slate-500">
              ({completedOnboarding}/{totalUsers})
            </span>
          </div>
        </div>
        <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-2.5">
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, onboardingPct))}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>{users.pending_onboarding ?? 0} pending</span>
            <span className="font-semibold text-emerald-600">
              {completedOnboarding} done
            </span>
          </div>
        </div>
      </div>

      {/* 3. Live Posts Count (PostReach Brand Orange) */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300 flex flex-col justify-between">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Posts
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-orange-50 text-accent-brand border border-orange-100 group-hover:bg-orange-100/70 transition-colors">
              <Send className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
              {livePosts.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-500">
              of {totalPosts} total
            </span>
          </div>
        </div>

        {/* Sparkline decoration in brand orange */}
        <div className="absolute bottom-0 left-0 right-0 h-10 w-full opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
          <svg className="h-full w-full" viewBox="0 0 100 30" preserveAspectRatio="none">
            <defs>
              <linearGradient id="brandSparklineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(251, 146, 60, 0.4)" />
                <stop offset="100%" stopColor="rgba(251, 146, 60, 0.0)" />
              </linearGradient>
            </defs>
            <path
              d="M0,25 Q15,18 35,12 T70,16 T100,4"
              fill="none"
              stroke="rgb(251, 146, 60)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M0,25 Q15,18 35,12 T70,16 T100,4 L100,30 L0,30 Z"
              fill="url(#brandSparklineGrad)"
            />
          </svg>
        </div>

        <div className="relative z-10 mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>{posts.platform_posts_published?.toLocaleString() ?? 0} broadcasts</span>
          <span className="flex items-center gap-1 font-semibold text-accent-dark text-[11px]">
            <Sparkles className="size-3" />
            +{posts.activity?.posts_created_today ?? 0} today
          </span>
        </div>
      </div>

      {/* 4. Connected Channels */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Connected Channels
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100 group-hover:bg-purple-100/70 transition-colors">
              <Link2 className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
              {totalConnected.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-full border border-purple-100">
              {connectedBrandRatio}% Brands
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>{brands.brands_with_connected_accounts} brands linked</span>
          <span className="font-semibold text-slate-700 text-[11px]">Ecosystem</span>
        </div>
      </div>

      {/* 5. Delivery Health */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Delivery Health
            </span>
            <div
              className={`flex size-8 items-center justify-center rounded-xl border transition-colors ${
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
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-extrabold leading-none ${
                failedPosts === 0 ? "text-emerald-700" : "text-rose-600"
              }`}
            >
              {failedPosts === 0 ? "100%" : `${failedPosts} Err`}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {failedPosts === 0 ? "Operational" : "Failures"}
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span
              className={`size-1.5 rounded-full ${
                failedPosts === 0
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-rose-500"
              }`}
            />
            {failedPosts === 0 ? "Pipeline healthy" : "Requires attention"}
          </span>
          <span className="font-semibold text-slate-700 text-[11px]">
            {posts.status_breakdown?.posted ?? 0} posted
          </span>
        </div>
      </div>
    </div>
  )
}
