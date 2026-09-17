"use client"

import Link from "next/link"
import { ShieldAlert, ArrowLeft, RefreshCw } from "lucide-react"

interface AccessDeniedViewProps {
  onRetry?: () => void
}

export function AccessDeniedView({ onRetry }: AccessDeniedViewProps) {
  return (
    <div className="mx-auto flex min-h-[65vh] w-full max-w-xl flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="relative mb-6">
        <div className="absolute -inset-2 rounded-full bg-rose-500/10 blur-xl" />
        <div className="relative flex size-20 items-center justify-center rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-600 shadow-sm">
          <ShieldAlert className="size-10 stroke-[1.8]" />
        </div>
      </div>

      <span className="mb-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rose-800">
        403 Forbidden
      </span>

      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
        Administrator Access Required
      </h1>

      <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-md">
        This dashboard provides platform-wide analytics and requires administrator privileges.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition shadow-sm"
        >
          <ArrowLeft className="size-4" />
          <span>Return to Dashboard</span>
        </Link>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <RefreshCw className="size-4" />
            <span>Retry Connection</span>
          </button>
        )}
      </div>
    </div>
  )
}
