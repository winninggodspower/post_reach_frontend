import { Suspense } from "react"
import { DeveloperPortal } from "@/features/developer/components/developer-portal"

export const metadata = {
  title: "Developer Portal | PostGlee",
  description:
    "OAuth 2.1 applications, AI & MCP connections, and Developer API reference.",
}

export default function DeveloperPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-5xl px-6 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-slate-200 rounded" />
            <div className="h-4 w-72 bg-slate-200 rounded" />
            <div className="h-40 bg-slate-100 rounded-xl" />
          </div>
        </main>
      }
    >
      <main className="mx-auto w-full max-w-5xl px-6 py-8 min-w-0 overflow-x-hidden space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
        <DeveloperPortal />
      </main>
    </Suspense>
  )
}

