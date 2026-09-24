"use client"

import { type ReactNode, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { useAuth } from "@/features/auth/store/auth-store"
import { useAuthStatus } from "@/features/auth/hooks/use-auth-status"

type ProtectedLayoutProps = {
  children: ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isHydrated, isLoadingUser } = useAuthStatus()
  const user = useAuth((state) => state.user)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !isHydrated || (!user && isLoadingUser)) {
      return
    }

    if (!isAuthenticated) {
      const callbackUrl = encodeURIComponent(pathname || "/dashboard")
      router.replace(`/signin?callbackUrl=${callbackUrl}`)
    }
  }, [isAuthenticated, isHydrated, isLoadingUser, mounted, pathname, router, user])

  if (!mounted || !isHydrated || (!user && isLoadingUser) || !isAuthenticated) {
    return (
      <main className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 py-24">
        <p className="text-sm text-slate-500">Loading...</p>
      </main>
    )
  }

  return <>{children}</>
}
