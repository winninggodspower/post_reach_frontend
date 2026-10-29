"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, type ReactNode } from "react"

import { isBackendOAuthAuthorizeUrl } from "@/features/auth/lib/redirect"
import { useAuth } from "@/features/auth/store/auth-store"

type AuthGuardProps = {
  children: ReactNode
}

const getSafeInternalCallbackUrl = (value: string | null | undefined): string | null => {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !isBackendOAuthAuthorizeUrl(trimmed)) {
    return trimmed
  }

  return null
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const user = useAuth((state) => state.user)
  const isHydrated = useAuth((state) => state.isHydrated)
  const isLoadingUser = useAuth((state) => state.isLoadingUser)
  const hasRedirected = useRef(false)
  const nextParam = searchParams?.get("next")
  const isOAuthFlow = isBackendOAuthAuthorizeUrl(nextParam)

  useEffect(() => {
    if (isOAuthFlow || !isHydrated || isLoadingUser || !user || hasRedirected.current) {
      return
    }

    hasRedirected.current = true

    const callbackUrl = getSafeInternalCallbackUrl(
      nextParam ?? searchParams?.get("callbackUrl"),
    )

    if (!user.has_completed_onboarding) {
      const nextUrl = callbackUrl
        ? `/onboarding?next=${encodeURIComponent(callbackUrl)}`
        : "/onboarding"

      router.replace(nextUrl)
    } else {
      router.replace(callbackUrl ?? "/dashboard")
    }
  }, [user, isHydrated, isLoadingUser, router, searchParams, nextParam, isOAuthFlow])

  if (isOAuthFlow) {
    return <>{children}</>
  }

  if (!isHydrated || isLoadingUser) {
    return null
  }

  if (user) {
    return null
  }

  return <>{children}</>
}
