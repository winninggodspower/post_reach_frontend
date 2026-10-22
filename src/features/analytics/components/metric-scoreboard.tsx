"use client"

import React from "react"

export interface MetricScoreboardData {
  views: number
  reach: number
  engagementRate: number
  likes: number
  comments: number
  shares: number
  saves: number
  clicks: number
}

interface MetricScoreboardProps {
  metrics: MetricScoreboardData
  platformLabel?: string
}

const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

export function MetricScoreboard({ metrics, platformLabel }: MetricScoreboardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-slate-100 overflow-hidden shadow-2xs">
      {/* Responsive Scoreboard Grid using gap-px for hairline borders on all screen sizes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px">
        {/* Views */}
        <div className="bg-white p-3.5 sm:p-5 flex flex-col justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Views
          </span>
          <div className="mt-2 sm:mt-2.5">
            <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatNumber(metrics.views)}
            </p>
            <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 block truncate">
              {platformLabel ? `On ${platformLabel}` : "Total impressions"}
            </span>
          </div>
        </div>

        {/* Reach */}
        <div className="bg-white p-3.5 sm:p-5 flex flex-col justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Reach
          </span>
          <div className="mt-2 sm:mt-2.5">
            <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatNumber(metrics.reach)}
            </p>
            <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 block truncate">
              Unique audience
            </span>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="bg-white p-3.5 sm:p-5 flex flex-col justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Engagement
          </span>
          <div className="mt-2 sm:mt-2.5">
            <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              {metrics.engagementRate.toFixed(2)}%
            </p>
            <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 block truncate">
              Rate per view
            </span>
          </div>
        </div>

        {/* Likes */}
        <div className="bg-white p-3.5 sm:p-5 flex flex-col justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Likes
          </span>
          <div className="mt-2 sm:mt-2.5">
            <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatNumber(metrics.likes)}
            </p>
            <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 block truncate">
              Reactions
            </span>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white p-3.5 sm:p-5 flex flex-col justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Comments
          </span>
          <div className="mt-2 sm:mt-2.5">
            <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatNumber(metrics.comments)}
            </p>
            <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 block truncate">
              Discussions
            </span>
          </div>
        </div>

        {/* Shares */}
        <div className="bg-white p-3.5 sm:p-5 flex flex-col justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Shares
          </span>
          <div className="mt-2 sm:mt-2.5">
            <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatNumber(metrics.shares)}
            </p>
            <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 block truncate">
              Reposts & sends
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Row: Saves & Clicks (Only shown if data exists) */}
      {(metrics.saves > 0 || metrics.clicks > 0) && (
        <div className="px-4 py-2.5 sm:px-5 sm:py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-slate-600">
          {metrics.saves > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-400">Saves:</span>
              <span className="font-bold text-slate-900">{formatNumber(metrics.saves)}</span>
            </div>
          )}
          {metrics.clicks > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-400">Link Clicks:</span>
              <span className="font-bold text-slate-900">{formatNumber(metrics.clicks)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
