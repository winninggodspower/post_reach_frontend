import type { ReactNode } from "react"

import { ProtectedRoute } from "@/features/auth/components/protected-route"

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
