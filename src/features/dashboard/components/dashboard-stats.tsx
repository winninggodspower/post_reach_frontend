"use client"

import { Calendar, Link2 } from "lucide-react"

interface DashboardStatsProps {
  scheduledCount: number
  connectedCount: number
}

export function DashboardStats({ scheduledCount, connectedCount }: DashboardStatsProps) {
  return (
    <section className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-3">
      {/* Card 1: Scheduled Posts */}
      <article className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300 flex flex-col justify-between">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Scheduled Posts</h2>
            <div className="flex size-7 sm:size-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
              <Calendar className="size-3.5 sm:size-4" />
            </div>
          </div>
          <div className="mt-1.5 sm:mt-2 flex items-center gap-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">{scheduledCount}</p>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <span className="inline-flex size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active queue</span>
            </div>
          </div>
        </div>
      </article>

      {/* Card 2: Connected Channels */}
      <article className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300 flex flex-col justify-between">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Connected Channels</h2>
            <div className="flex size-7 sm:size-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
              <Link2 className="size-3.5 sm:size-4" />
            </div>
          </div>
          <div className="mt-1.5 sm:mt-2 flex items-center gap-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">{connectedCount}</p>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
              {connectedCount > 0 ? "Channels active" : "None linked"}
            </div>
          </div>
        </div>
      </article>

      {/* Card 3: Time Saved */}
      <article className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300 flex flex-col justify-between">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Time Saved</h2>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-emerald-600 border border-emerald-100/50">
              +18%
            </span>
          </div>
          <p className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            14.5<span className="text-sm sm:text-lg text-slate-400 font-bold ml-1">hrs</span>
          </p>
        </div>
        {/* Sparkline SVG Chart */}
        <div className="absolute bottom-0 left-0 right-0 h-12 w-full opacity-30 group-hover:opacity-70 transition-opacity duration-300">
          <svg className="h-full w-full" viewBox="0 0 100 30" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(251, 146, 60, 0.4)" />
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
  )
}
