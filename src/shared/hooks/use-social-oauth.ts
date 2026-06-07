"use client"

import { useCallback, useRef, useState } from "react"

import { api } from "@/lib/api"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type OAuthMessage =
  | {
      type: "oauth-success"
      platform: string
    }
  | {
      type: "oauth-error"
      platform: string
      error?: string
    }

type OAuthPlatform = string

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const POPUP_WIDTH = 600
const POPUP_HEIGHT = 700

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Open a centered popup window for OAuth.
 * Returns the popup Window instance, or `null` if the popup was blocked.
 */
export function openOAuthPopup(url: string): Window | null {
  const left = window.screenX + (window.outerWidth - POPUP_WIDTH) / 2
  const top = window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2

  return window.open(
    url,
    "oauth-popup",
    `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},popup=1`,
  )
}

/**
 * Wait for an OAuth popup to complete by listening for postMessage events.
 *
 * - Registers a `message` listener **before** the popup opens.
 * - Validates that the message origin matches `window.location.origin`.
 * - Resolves when an `oauth-success` message is received for the given platform.
 * - Rejects when an `oauth-error` message is received, or when the popup is
 *   closed before completion.
 * - Cleans up all listeners and intervals on resolution / rejection.
 */
export function waitForOAuth(
  platform: OAuthPlatform,
  popup: Window | null,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    // Guard against popup being blocked
    if (!popup || popup.closed) {
      reject(new Error("Popup was blocked or closed before OAuth could start."))
      return
    }

    let settled = false

    const cleanup = () => {
      settled = true
      window.removeEventListener("message", onMessage)
      if (closeCheckInterval !== null) {
        clearInterval(closeCheckInterval)
      }
    }

    // --- postMessage listener ------------------------------------------------
    const onMessage = (event: MessageEvent<OAuthMessage>) => {
      // Only accept messages from our own origin
      if (event.origin !== window.location.origin) return

      const { data } = event

      if (data.type === "oauth-success" && data.platform === platform) {
        cleanup()
        resolve()
      }

      if (data.type === "oauth-error" && data.platform === platform) {
        cleanup()
        reject(new Error(data.error ?? "OAuth authorization was denied."))
      }
    }

    window.addEventListener("message", onMessage)

    // --- Popup-closed detection ----------------------------------------------
    let closeCheckInterval: ReturnType<typeof setInterval> | null = setInterval(
      () => {
        if (settled) return

        if (!popup || popup.closed) {
          cleanup()
          reject(
            new Error(
              "OAuth popup was closed before the connection could complete.",
            ),
          )
        }
      },
      500,
    )
  })
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export type UseSocialOAuthOptions = {
  /** Called after a successful OAuth flow so the caller can refresh data. */
  onSuccess?: (platform: OAuthPlatform) => void | Promise<void>
}

export type UseSocialOAuthReturn = {
  /** Initiate the OAuth flow for the given platform. */
  connect: (platform: OAuthPlatform) => Promise<void>
  /** `true` while an OAuth flow is in progress. */
  connecting: boolean
}

/**
 * Reusable hook that handles the full OAuth popup flow for any social
 * platform.
 *
 * Usage:
 * ```ts
 * const { connect, connecting } = useSocialOAuth({
 *   onSuccess: (platform) => refreshAccounts(),
 * })
 *
 * await connect("youtube")
 * ```
 */
export function useSocialOAuth(
  options?: UseSocialOAuthOptions,
): UseSocialOAuthReturn {
  const [connecting, setConnecting] = useState(false)
  const connectingRef = useRef(false)

  const connect = useCallback(
    async (platform: OAuthPlatform) => {
      // Prevent concurrent connections
      if (connectingRef.current) return
      connectingRef.current = true
      setConnecting(true)

      try {
        // 1. Fetch the auth URL from the backend
        const { data } = await api.get<{
          success: boolean
          data: { auth_url: string }
          message?: string
        }>(`/social_accounts/${platform}/auth-url/`)

        if (!data.success || !data.data?.auth_url) {
          throw new Error(data.message ?? `Failed to get auth URL for ${platform}.`)
        }

        // 2. Open the popup
        const popup = openOAuthPopup(data.data.auth_url)

        if (!popup) {
          // Popup was blocked — fall back to full-page redirect
          window.location.assign(data.data.auth_url)
          // This will navigate away, so we don't resolve/reject
          return
        }

        // 3. Wait for the OAuth flow to complete
        await waitForOAuth(platform, popup)

        // 4. Notify the caller so it can refresh account data
        await options?.onSuccess?.(platform)
      } finally {
        connectingRef.current = false
        setConnecting(false)
      }
    },
    [options],
  )

  return { connect, connecting }
}
