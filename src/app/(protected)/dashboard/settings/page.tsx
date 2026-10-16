import { Suspense } from "react"
import { SettingsView } from "@/features/settings/components/settings-view"

export const metadata = {
  title: "Settings | PostGlee",
  description: "Configure your personal profile details and brand preferences.",
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-4xl px-6 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-slate-200 rounded" />
            <div className="h-4 w-72 bg-slate-200 rounded" />
            <div className="h-40 bg-slate-100 rounded-xl" />
          </div>
        </main>
      }
    >
      <SettingsView />
    </Suspense>
  )
}
