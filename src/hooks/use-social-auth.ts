"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { getAuthUrl } from "@/features/onboarding/api/server"
import { useAuth } from "@/features/auth/store/auth-store"
import type { OnboardingPlatform } from "@/features/onboarding/types"

const POPUP_WIDTH = 600
const POPUP_HEIGHT = 700

function openPopup(url: string) {
  const left = window.screenX + (window.outerWidth - POPUP_WIDTH) / 2
  const top = window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2

  return window.open(
    url,
    "oauth-popup",
    `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top}`,
  )
}

const tryExtractMessage = (err: unknown): string => {
  if (err instanceof Error) {
    try {
      const parsed = JSON.parse(err.message)
      return parsed.message || "Something went wrong."
    } catch {
      return err.message || "Something went wrong."
    }
  }
  return "Something went wrong."
}

export function useSocialAuth(platform: OnboardingPlatform) {
  const [loading, setLoading] = useState(false)
  const cleanupRef = useRef<(() => void) | null>(null)
  const setBrandConnection = useAuth((state) => state.setBrandConnection)
  const loadUser = useAuth((state) => state.loadUser)

  const connect = useCallback(async () => {
    setLoading(true)

    try {
      const redirectUri = `${window.location.origin}/social/oauth/${platform}/callback`
      const result = await getAuthUrl(platform, redirectUri)

      const url = result.data?.auth_url
      if (!url) return

      const popup = openPopup(url)

      if (!popup) {
        window.location.assign(url)
        return
      }

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return

        const data = event.data

        if (data?.type === "oauth-success") {
          setBrandConnection(platform)
          void loadUser()
          cleanupRef.current?.()
        }

        if (data?.type === "oauth-error") {
          toast.error(data?.error || "Failed to connect account.")
          cleanupRef.current?.()
        }
      }

      window.addEventListener("message", handleMessage)

      cleanupRef.current = () => {
        window.removeEventListener("message", handleMessage)
      }
    } catch (err) {
      toast.error(tryExtractMessage(err), {
        description: `Unable to connect your ${platform} account.`,
      })
    } finally {
      setLoading(false)
    }
  }, [platform, setBrandConnection])

  useEffect(() => {
    return () => cleanupRef.current?.()
  }, [])

  return { connect, loading }
}
