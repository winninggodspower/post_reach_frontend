"use client"

import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/store/auth-store"
import { PlatformConnectCard } from "@/features/onboarding/components/platform-connect-card"

import { PLATFORM_OPTIONS } from "./shared"

type OnboardingStepFourSocialProps = {
  onSkip?: () => void
  isSaving?: boolean
}

export function OnboardingStepFourSocial({
  onSkip,
  isSaving,
}: OnboardingStepFourSocialProps) {
  const brand = useAuth((state) => state.user?.brand)
  const connectedCount = brand?.connected_accounts?.length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-dark">
          Step 4
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
            Connect your accounts
          </h1>

          {onSkip ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSkip}
              disabled={isSaving}
              className="rounded-full border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300 transition-all cursor-pointer shadow-xs gap-1.5 shrink-0"
            >
              {connectedCount > 0 ? "Complete setup" : "Skip for now"}
              <ArrowRight className="size-3.5" />
            </Button>
          ) : null}
        </div>

        <p className="mt-2 max-w-xl text-base leading-7 text-slate-600">
          This step is optional. You can connect your accounts now or anytime later from your dashboard.
        </p>
      </div>

      <div className="text-xs font-medium text-slate-500">
        {connectedCount > 0
          ? `${connectedCount} platform${connectedCount === 1 ? "" : "s"} connected`
          : "Available platforms:"}
      </div>

      <div className="space-y-3">
        {PLATFORM_OPTIONS.map((option) => (
          <PlatformConnectCard key={option.id} option={option} />
        ))}
      </div>
    </div>
  )
}
