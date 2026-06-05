"use client"

import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"

import { useAuth } from "@/features/auth/store/auth-store"

type AuthLayoutProps = {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
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

  if (user) {
    return null
  }

  return <>{children}</>
}
