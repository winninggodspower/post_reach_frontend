"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/features/auth/store/auth-store"
import { DashboardSidebar } from "@/features/dashboard/components/sidebar"

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

  return (
    <TooltipProvider delayDuration={0}>
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-sidebar-border transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <span className="text-sm text-muted-foreground">Dashboard</span>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
    </TooltipProvider>
  )
}
