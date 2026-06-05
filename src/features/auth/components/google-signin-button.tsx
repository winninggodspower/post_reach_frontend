"use client"

import {
  useGoogleLogin,
  useGoogleOAuth,
  type CodeResponse,
} from "@react-oauth/google"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { GoogleIcon } from "@/features/auth/components/google-icon"
import { useAuth } from "@/features/auth/store/auth-store"

type GoogleSignInButtonProps = {
  mode?: "signin" | "signup"
  onError?: (message: string | null) => void
}

type GoogleNonOAuthError = {
  type: "popup_failed_to_open" | "popup_closed" | "unknown"
}

const getGoogleErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    try {
      const parsed = JSON.parse(error.message) as { message?: string }
      return parsed.message ?? error.message
    } catch {
      return error.message
    }
  }

  if (typeof error === "string") {
    try {
      const parsed = JSON.parse(error) as { message?: string }
      return parsed.message ?? error
    } catch {
      return error
    }
  }

  return "Google sign-in failed."
}

const getPopupErrorMessage = (error: GoogleNonOAuthError) => {
  if (error.type === "popup_closed") {
    return "Google sign-in was closed before completion."
  }

  if (error.type === "popup_failed_to_open") {
    return "Google sign-in popup could not open."
  }

  return "Google sign-in failed."
}

export function GoogleSignInButton({
  mode = "signin",
  onError,
}: GoogleSignInButtonProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { googleLogin } = useAuth()
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSuccess = async (response: CodeResponse) => {
    try {
      if (!response.code) {
        throw new Error("Google did not return an authorization code.")
      }

      await googleLogin({
        authCode: response.code,
        redirectUri: window.location.origin,
      })

      if (mode === "signup") {
        const callbackUrl = searchParams?.get("callbackUrl")
        const nextUrl = callbackUrl
          ? `/onboarding?next=${encodeURIComponent(callbackUrl)}`
          : "/onboarding"

        router.replace(nextUrl)
      } else {
        const callbackUrl = searchParams?.get("callbackUrl") ?? "/dashboard"
        router.replace(callbackUrl)
      }

    } catch (error) {
      onError?.(getGoogleErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const startGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    scope: "openid email profile",
    overrideScope: true,
    ux_mode: "popup",
    onSuccess: handleGoogleSuccess,
    onError: () => {
      setIsLoading(false)
      onError?.("Google sign-in failed.")
    },
    onNonOAuthError: (error: GoogleNonOAuthError) => {
      setIsLoading(false)
      onError?.(getPopupErrorMessage(error))
    },
  })

  const isGoogleReady = Boolean(clientId) && scriptLoadedSuccessfully

  const handleGoogleSignIn = () => {
    if (!isGoogleReady || isLoading) {
      return
    }

    onError?.(null)
    setIsLoading(true)

    try {
      startGoogleLogin()
    } catch (error) {
      setIsLoading(false)
      onError?.(getGoogleErrorMessage(error))
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      disabled={!isGoogleReady || isLoading}
      onClick={handleGoogleSignIn}
      className="h-12 w-full justify-center rounded-xl border-black/10 bg-white text-slate-900 shadow-sm hover:bg-slate-50"
    >
      <GoogleIcon />
      {isLoading
        ? "Connecting..."
        : !clientId
          ? "Google unavailable"
          : scriptLoadedSuccessfully
            ? "Continue with Google"
            : "Loading Google..."}
    </Button>
  )
}
