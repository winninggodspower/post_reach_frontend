"use client"

import { useAuth } from "@/features/auth/store/auth-store"
import { PlatformConnectCard } from "@/features/onboarding/components/platform-connect-card"
import { PLATFORM_OPTIONS } from "@/features/onboarding/components/steps/shared"

export function ConnectionsView() {
  const brand = useAuth((state) => state.user?.brand)
  const isHydrated = useAuth((state) => state.isHydrated)

  const connectedCount = brand?.connected_accounts?.length ?? 0

  if (!isHydrated) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200 rounded" />
          <div className="h-4 w-72 bg-slate-200 rounded" />
          <div className="h-40 bg-slate-100 rounded-xl" />
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-8 min-w-0 overflow-x-hidden space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Connections
        </h1>
        <p className="text-sm text-slate-500 mt-1.5">
          Connect and authorize your social media channels to start scheduling posts and viewing performance analytics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {PLATFORM_OPTIONS.map((option) => (
          <PlatformConnectCard key={option.id} option={option} />
        ))}
      </div>

      <div className="rounded-2xl border border-black/5 bg-slate-50 p-5 text-sm text-slate-600 flex items-center justify-between">
        <span>Total active connections</span>
        <span className="font-bold text-slate-950 bg-white border border-black/8 px-3 py-1 rounded-full text-xs">
          {connectedCount} / {PLATFORM_OPTIONS.length} platforms
        </span>
      </div>
    </main>
  )
}
