"use client"

import { useEffect, useState, useRef } from "react"
import { Loader2 } from "lucide-react"
import { getFacebookPages, type FacebookPage } from "@/features/onboarding/api/server"

type FacebookPageSelectProps = {
  code: string
  redirectUri: string
  onSelect: (pageId: string) => void
  onError: (error: string) => void
}

export function FacebookPageSelect({ code, redirectUri, onSelect, onError }: FacebookPageSelectProps) {
  const [pages, setPages] = useState<FacebookPage[]>([])
  const [loading, setLoading] = useState(true)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    const fetchPages = async () => {
      try {
        const res = await getFacebookPages(code, redirectUri)
        console.log(res)
        if (res.success && res.data?.pages?.length > 0) {
          setPages(res.data.pages)
        } else {
          onError("No Facebook pages found.")
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to fetch Facebook pages."
        try {
          const parsed = JSON.parse(message)
          onError(parsed.message || "Failed to fetch Facebook pages.")
        } catch {
          onError(message)
        }
      } finally {
        setLoading(false)
      }
    }

    void fetchPages()
  }, [code, redirectUri, onError])

  if (loading) {
    return (
      <div className="space-y-4 text-center">
        <Loader2 className="mx-auto size-8 animate-spin text-slate-500" />
        <h1 className="text-xl font-semibold text-slate-950">
          Loading Facebook pages...
        </h1>
        <p className="text-sm text-slate-500">
          Please wait while we retrieve your pages.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-left">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold text-slate-950">
          Select a Facebook Page
        </h1>
        <p className="text-sm text-slate-500">
          Choose the page you want to connect to Post Reach.
        </p>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => onSelect(page.id)}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-slate-300 hover:bg-slate-50"
          >
            {page.picture_url ? (
              <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={page.picture_url}
                  alt={page.name}
                  className="size-full object-cover"
                />
              </div>
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            <span className="font-medium text-slate-900 line-clamp-1">{page.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
