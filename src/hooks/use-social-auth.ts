"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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

export function useSocialAuth(platform: OnboardingPlatform) {
  const [loading, setLoading] = useState(false)
  const cleanupRef = useRef<(() => void) | null>(null)
  const setBrandConnection = useAuth((state) => state.setBrandConnection)

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
          cleanupRef.current?.()
        }

        if (data?.type === "oauth-error") {
          cleanupRef.current?.()
        }
      }

      window.addEventListener("message", handleMessage)

      cleanupRef.current = () => {
        window.removeEventListener("message", handleMessage)
      }
    } finally {
      setLoading(false)
    }
  }, [platform, setBrandConnection])

  useEffect(() => {
    return () => cleanupRef.current?.()
  }, [])

  return { connect, loading }
}
