"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/store/auth-store"

export default function DashboardPage() {
  const router = useRouter()
  const user = useAuth((state) => state.user)
  const logout = useAuth((state) => state.logout)
  const isHydrated = useAuth((state) => state.isHydrated)
  const isLoadingUser = useAuth((state) => state.isLoadingUser)

  const hasCompletedOnboarding = user?.onboarded ?? false

  useEffect(() => {
    if (!isHydrated || isLoadingUser) {
      return
    }

    if (!hasCompletedOnboarding) {
      router.replace("/onboarding")
    }
  }, [hasCompletedOnboarding, isHydrated, isLoadingUser, router])

  if (!isHydrated || isLoadingUser || !hasCompletedOnboarding) {
    return (
      <main className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 py-24">
        <p className="text-sm text-slate-500">Loading setup...</p>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-dark">
        Dashboard
      </p>
      <h1 className="mt-3 text-4xl font-semibold text-slate-950">Welcome back</h1>
      <p className="mt-3 text-slate-600">
        Signed in as {user?.email ?? "your account"}
      </p>

      <div className="mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            logout()
            router.replace("/signin")
          }}
        >
          Logout
        </Button>
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Scheduled Posts</h2>
          <p className="mt-2 text-3xl font-bold text-slate-950">0</p>
        </article>
        <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Connected Accounts</h2>
          <p className="mt-2 text-3xl font-bold text-slate-950">0</p>
        </article>
        <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Workspaces</h2>
          <p className="mt-2 text-3xl font-bold text-slate-950">1</p>
        </article>
      </section>
    </main>
  )
}
