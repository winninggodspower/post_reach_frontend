"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, type ReactNode } from "react"

import { useAuth } from "@/features/auth/store/auth-store"

type AuthLayoutProps = {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
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
    return (
      <main className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 py-24">
        <p className="text-sm text-slate-500">Loading...</p>
      </main>
    )
  }

  if (user) {
    return null
  }

  return <>{children}</>
}
