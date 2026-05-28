import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"

import { authOptions } from "@/auth"

type DashboardLayoutProps = {
  children: ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/signin?callbackUrl=/dashboard")
  }

  return <>{children}</>
}
