"use client"

import React from "react"
import type { PostAnalyticsData } from "../types/post-analytics"

export interface PerformanceOverviewProps {
  data: PostAnalyticsData
}

const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

export function PerformanceOverview({ data }: PerformanceOverviewProps) {
  const totalEngagements =
    data.total_likes + data.total_comments + data.total_shares + data.total_saves

  return (
    <section className="space-y-4">
      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Views */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Views
          </span>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatNumber(data.total_views)}
            </p>
            <span className="text-xs text-slate-400 mt-1 block">
              Across all connected channels
            </span>
          </div>
        </div>

        {/* Total Reach */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Reach
          </span>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatNumber(data.total_reach)}
            </p>
            <span className="text-xs text-slate-400 mt-1 block">
              Unique accounts reached
            </span>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Engagement Rate
            </span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
              Active
            </span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {data.overall_engagement_rate.toFixed(2)}%
            </p>
            <span className="text-xs text-slate-400 mt-1 block">
              Interactions relative to views
            </span>
          </div>
        </div>

        {/* Total Engagements */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Engagements
          </span>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatNumber(totalEngagements)}
            </p>
            <span className="text-xs text-slate-400 mt-1 block">
              Likes, comments, shares & saves
            </span>
          </div>
        </div>
      </div>

      {/* Clean Interaction Breakdown Bar (No icon noise) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Engagement Breakdown
          </span>
          <span className="text-xs text-slate-400">
            Audience interactions by type
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="pt-2 sm:pt-0 sm:px-3 first:pl-0">
            <span className="text-[11px] font-semibold text-slate-400 block">Likes</span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">
              {formatNumber(data.total_likes)}
            </span>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-3">
            <span className="text-[11px] font-semibold text-slate-400 block">Comments</span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">
              {formatNumber(data.total_comments)}
            </span>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-3">
            <span className="text-[11px] font-semibold text-slate-400 block">Shares</span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">
              {formatNumber(data.total_shares)}
            </span>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-3">
            <span className="text-[11px] font-semibold text-slate-400 block">Saves</span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">
              {formatNumber(data.total_saves)}
            </span>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-3">
            <span className="text-[11px] font-semibold text-slate-400 block">Link Clicks</span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">
              {formatNumber(data.total_clicks)}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
