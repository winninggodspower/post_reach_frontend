"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, type ReactNode } from "react"

import { isBackendOAuthAuthorizeUrl } from "@/features/auth/lib/redirect"
import { useAuth } from "@/features/auth/store/auth-store"

type AuthGuardProps = {
  children: ReactNode
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

    const callbackUrl = nextParam ?? searchParams?.get("callbackUrl")

    if (!user.has_completed_onboarding) {
      const nextUrl = callbackUrl
        ? `/onboarding?next=${encodeURIComponent(callbackUrl)}`
        : "/onboarding"

      router.replace(nextUrl)
    } else {
      router.replace(callbackUrl ?? "/dashboard")
    }
  }, [user, isHydrated, isLoadingUser, router, searchParams, nextParam, isOAuthFlow])

  if (!isHydrated || isLoadingUser) {
    return null
  }

  if (user && !isOAuthFlow) {
    return null
  }

  return <>{children}</>
}
