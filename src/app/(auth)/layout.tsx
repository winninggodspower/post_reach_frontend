"use client"

import { AuthGuard } from "@/features/auth/components/auth-guard"
import { Suspense, type ReactNode } from "react"

type AuthLayoutProps = {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 py-24">
          <p className="text-sm text-slate-500">Loading...</p>
        </main>
      }
    >
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  )
}
