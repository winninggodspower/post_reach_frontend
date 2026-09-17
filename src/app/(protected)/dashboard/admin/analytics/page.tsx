import type { Metadata } from "next"
import { AdminAnalyticsView } from "@/features/admin/components/admin-analytics-view"

export const metadata: Metadata = {
  title: "Superadmin Telemetry & Analytics | PostReach",
  description: "Live platform telemetry, user growth velocity, content pipeline, and storage monitoring.",
}

export default function AdminAnalyticsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 min-w-0">
      <AdminAnalyticsView />
    </main>
  )
}
