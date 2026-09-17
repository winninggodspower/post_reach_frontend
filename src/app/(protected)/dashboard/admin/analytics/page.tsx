import type { Metadata } from "next"
import { AdminAnalyticsView } from "@/features/admin/components/admin-analytics-view"

export const metadata: Metadata = {
  title: "Platform Analytics | PostReach",
  description: "Real-time user growth, content publishing health, and workspace analytics across the platform.",
}

export default function AdminAnalyticsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 min-w-0">
      <AdminAnalyticsView />
    </main>
  )
}
