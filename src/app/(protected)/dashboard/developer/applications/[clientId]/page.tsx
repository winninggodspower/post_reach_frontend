import { Suspense } from "react"
import { ApplicationDetailView } from "@/features/developer/components/application-detail-view"

export const metadata = {
  title: "Application Details | PostGlee Developer",
  description: "Manage OAuth 2.1 client credentials, callback URIs, and scopes.",
}

type PageProps = {
  params: Promise<{ clientId: string }>
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { clientId } = await params

  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-4xl px-6 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-8 w-64 bg-slate-200 rounded" />
            <div className="h-40 bg-slate-100 rounded-xl" />
          </div>
        </main>
      }
    >
      <main className="mx-auto w-full max-w-4xl px-6 py-8 min-w-0 overflow-x-hidden space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
        <ApplicationDetailView clientId={clientId} />
      </main>
    </Suspense>
  )
}

