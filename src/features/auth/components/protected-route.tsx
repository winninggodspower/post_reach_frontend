"use client"

import { type ReactNode, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { useAuthStatus } from "@/features/auth/hooks/use-auth-status"

type ProtectedRouteProps = {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isHydrated, isLoadingUser } = useAuthStatus()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !isHydrated || isLoadingUser) {
      return
    }

    if (!isAuthenticated) {
      const callbackUrl = encodeURIComponent(pathname || "/dashboard")
      router.replace(`/signin?callbackUrl=${callbackUrl}`)
    }
  }, [isAuthenticated, isHydrated, isLoadingUser, mounted, pathname, router])

  if (!mounted || !isHydrated || isLoadingUser || !isAuthenticated) {
    return (
      <main className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 py-24">
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </main>
    )
  }

  return <>{children}</>
}
