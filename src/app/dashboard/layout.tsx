import type { ReactNode } from "react"

import { ProtectedRoute } from "@/components/auth/protected-route"

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
