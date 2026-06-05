"use client"

import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"

import { useAuth } from "@/features/auth/store/auth-store"

type RedirectIfAuthenticatedProps = {
  children: ReactNode
}

/**
 * Redirects authenticated users away from auth pages (signin, signup, etc.)
 * to the dashboard (or a callback URL if provided).
 */
export function RedirectIfAuthenticated({
  children,
}: RedirectIfAuthenticatedProps) {
  const router = useRouter()
  const user = useAuth((state) => state.user)
  const isHydrated = useAuth((state) => state.isHydrated)
  const isLoadingUser = useAuth((state) => state.isLoadingUser)

  useEffect(() => {
    if (!isHydrated || isLoadingUser) {
      return
    }

    if (user) {
      router.replace("/dashboard")
    }
  }, [user, isHydrated, isLoadingUser, router])

  if (!isHydrated || isLoadingUser) {
    return (
      <main className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 py-24">
        <p className="text-sm text-slate-500">Loading...</p>
      </main>
    )
  }

  // If user is authenticated, show nothing while the redirect fires
  if (user) {
    return null
  }

  return <>{children}</>
}
