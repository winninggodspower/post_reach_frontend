"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/features/auth/store/auth-store"

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const user = useAuth((state) => state.user)
  const isHydrated = useAuth((state) => state.isHydrated)
  const isLoadingUser = useAuth((state) => state.isLoadingUser)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const hasCompletedOnboarding = user?.has_completed_onboarding ?? false

  useEffect(() => {
    if (!mounted || !isHydrated || isLoadingUser) {
      return
    }

    if (!hasCompletedOnboarding) {
      router.replace("/onboarding")
    }
  }, [hasCompletedOnboarding, isHydrated, isLoadingUser, mounted, router])

  if (!mounted || !isHydrated || isLoadingUser || !hasCompletedOnboarding) {
    return (
      <main className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 py-24">
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </main>
    )
  }

  return <>{children}</>
}
