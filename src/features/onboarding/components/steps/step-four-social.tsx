"use client"

import type { OnboardingPlatform, OnboardingSubmission } from "@/features/onboarding/types"

import { Button } from "@/components/ui/button"

import { PLATFORM_OPTIONS, SocialPlatformIcon, StatusPill } from "./shared"

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
        {PLATFORM_OPTIONS.map((option) => {
          const connected = form.connected_platforms.includes(option.id)

          return (
            <div
              key={option.id}
              className={`flex items-center gap-4 rounded-[24px] border bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-32px_rgba(15,23,42,0.35)] ${
                connected ? "border-emerald-500/20 bg-emerald-50/70" : "border-black/8"
              }`}
            >
              <SocialPlatformIcon option={option} />

              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-slate-950">{option.label}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Connect for publishing and performance insights.
                </p>
              </div>

              <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                <StatusPill connected={connected} />
                <Button
                  type="button"
                  variant={connected ? "outline" : "default"}
                  size="sm"
                  onClick={() => togglePlatform(option.id)}
                >
                  {connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
