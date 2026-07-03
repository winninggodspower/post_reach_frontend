"use client"

interface DashboardStatsProps {
  scheduledCount: number
  connectedCount: number
}

export function DashboardStats({ scheduledCount, connectedCount }: DashboardStatsProps) {
  return (
    <section className="grid gap-4 grid-cols-1 lg:grid-cols-3">
      {/* Card 1: Scheduled Posts */}
      <article className="rounded-2xl border border-black/8 bg-white p-5 shadow-xs transition hover:shadow-md duration-200">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Scheduled Posts</h2>
        <p className="mt-2.5 text-3xl font-bold text-slate-950">{scheduledCount}</p>
        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
          <span className="inline-flex size-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Active queue</span>
        </div>
      </article>

      {/* Card 2: Connected Channels */}
      <article className="rounded-2xl border border-black/8 bg-white p-5 shadow-xs transition hover:shadow-md duration-200">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Connected Channels</h2>
        <p className="mt-2.5 text-3xl font-bold text-slate-950">{connectedCount}</p>
        <div className="mt-3 text-[11px] font-medium text-slate-500">
          {connectedCount > 0 ? "Channels active" : "No channels linked"}
        </div>
      </article>

      {/* Card 3: Time Saved */}
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
  )
}
