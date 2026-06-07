"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { OnboardingPlatform } from "@/features/onboarding/types"

import { SocialPlatformIcon, StatusPill } from "./steps/shared"
import type { PlatformOption } from "./steps/shared"
import { getYouTubeAuthUrl } from "../api/server"

type PlatformConnectCardProps = {
  option: PlatformOption
  connected: boolean
  onToggle: (platform: OnboardingPlatform) => void
}

const POPUP_WIDTH = 600
const POPUP_HEIGHT = 700

function openPopup(url: string): Window | null {
  const left = window.screenX + (window.outerWidth - POPUP_WIDTH) / 2
  const top = window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2

  return window.open(
    url,
    "oauth-popup",
    `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},popup=1`,
  )
}

export function PlatformConnectCard({
  option,
  connected,
  onToggle,
}: PlatformConnectCardProps) {
  const [connecting, setConnecting] = useState(false)

  const handleYouTubeConnect = async () => {
    const redirectUri = `${window.location.origin}/social/youtube/callback`

    try {
      const result = await getYouTubeAuthUrl(redirectUri)

      if (result.data?.auth_url) {
        const popup = openPopup(result.data.auth_url)

        if (!popup) {
          // Popup was blocked — fall back to full-page redirect
          window.location.assign(result.data.auth_url)
          return
        }

        // Listen for a message from the popup when the OAuth flow completes
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return

          if (event.data?.type === "youtube-oauth-success") {
            onToggle(option.id)
            window.removeEventListener("message", handleMessage)
          }

          if (event.data?.type === "youtube-oauth-error") {
            window.removeEventListener("message", handleMessage)
          }
        }

        window.addEventListener("message", handleMessage)
      }
    } catch {
      // Connection failed — don't mark as connected
    }
  }

  const handleConnect = async () => {
    setConnecting(true)

    try {
      // YouTube uses a two-step OAuth flow (GET auth URL, then POST to exchange)
      if (option.id === "youtube") {
        await handleYouTubeConnect()
        return
      }
      else if (option.id == 'facebook'){
        // handle facebook connect logic here
        return
      }

    } catch {
      // Connection failed — don't mark as connected
    } finally {
      setConnecting(false)
    }
  }

  const handleClick = () => {
    if (connected) {
      onToggle(option.id)
    } else {
      void handleConnect()
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
