"use client"

import { useAuth } from "@/features/auth/store/auth-store"

import { PlatformConnectCard } from "@/features/onboarding/components/platform-connect-card"

import { PLATFORM_OPTIONS } from "./shared"

export function OnboardingStepFourSocial() {
  const brand = useAuth((state) => state.user?.brand)
  const connectedCount = brand?.connected_accounts?.length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-dark">
          Step 4
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
          Connect your accounts
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          This step is optional. Add accounts now or finish later.
        </p>
      </div>

      <div className="space-y-3">
        {PLATFORM_OPTIONS.map((option) => (
          <PlatformConnectCard key={option.id} option={option} />
        ))}
      </div>

      <div className="text-sm text-slate-500">
        {connectedCount > 0
          ? `${connectedCount} platform${connectedCount === 1 ? "" : "s"} connected`
          : "No accounts connected yet"}
      </div>
    </div>
  )
}
