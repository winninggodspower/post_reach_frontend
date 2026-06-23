"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, type ReactNode } from "react"

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

  useEffect(() => {
    if (!isHydrated || isLoadingUser || !user || hasRedirected.current) {
      return
    }

    hasRedirected.current = true

    const callbackUrl = searchParams?.get("callbackUrl")

    if (!user.has_completed_onboarding) {
      const nextUrl = callbackUrl
        ? `/onboarding?next=${encodeURIComponent(callbackUrl)}`
        : "/onboarding"

      router.replace(nextUrl)
    } else {
      router.replace(callbackUrl ?? "/dashboard")
    }
  }, [user, isHydrated, isLoadingUser, router, searchParams])

  if (!isHydrated || isLoadingUser) {
    return null
  }

  if (user) {
    return null
  }

  return <>{children}</>
}