"use client"

import type { OnboardingPlatform, OnboardingSubmission } from "@/features/onboarding/types"

import { PlatformConnectCard } from "@/features/onboarding/components/platform-connect-card"

import { PLATFORM_OPTIONS } from "./shared"

type OnboardingStepFourSocialProps = {
  form: OnboardingSubmission
  togglePlatform: (platform: OnboardingPlatform) => void
}

export function OnboardingStepFourSocial({
  form,
  togglePlatform,
}: OnboardingStepFourSocialProps) {
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
          <PlatformConnectCard
            key={option.id}
            option={option}
            connected={form.connected_platforms.includes(option.id)}
            onToggle={togglePlatform}
          />
        ))}
      </div>
    </div>
  )
}
