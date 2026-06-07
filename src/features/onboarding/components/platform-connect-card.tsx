"use client"

import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { OnboardingPlatform } from "@/features/onboarding/types"

import { SocialPlatformIcon, StatusPill } from "./steps/shared"
import type { PlatformOption } from "./steps/shared"
import { useSocialAuth } from "@/hooks/use-social-auth"

type PlatformConnectCardProps = {
  option: PlatformOption
  connected: boolean
  onToggle: (platform: OnboardingPlatform) => void
}

export function PlatformConnectCard({
  option,
  connected,
  onToggle,
}: PlatformConnectCardProps) {
  const { connect, loading: connecting } = useSocialAuth({
    platform: option.id,
    onSuccess: () => onToggle(option.id),
  })

  const handleClick = () => {
    if (connected) {
      onToggle(option.id)
    } else {
      void connect()
    }
  }

  return (
    <div
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
          disabled={connecting}
          onClick={handleClick}
        >
          {connecting ? (
            <>
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              Connecting...
            </>
          ) : connected ? (
            "Disconnect"
          ) : (
            "Connect"
          )}
        </Button>
      </div>
    </div>
  )
}
