"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

/**
 * YouTube OAuth callback page.
 *
 * The backend handles the authorization code exchange and token storage.
 * This page simply:
 *  1. Shows a status UI while processing.
 *  2. Posts an `oauth-success` or `oauth-error` message to the opener.
 *  3. Closes the popup.
 *
 * The backend is expected to return an HTML page that does the same, but
 * this client-side fallback ensures the flow works even if the backend
 * redirects here with query params.
 */

const PLATFORM = "youtube"

export default function YouTubeCallbackPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const processedRef = useRef(false)

  useEffect(() => {
    // Prevent double execution in strict mode
    if (processedRef.current) return
    processedRef.current = true

    const error = searchParams?.get("error")

    if (error) {
      setStatus("error")
      setErrorMessage("You denied the authorization request.")

      if (window.opener) {
        window.opener.postMessage(
          {
            type: "oauth-error",
            platform: PLATFORM,
            error: "You denied the authorization request.",
          },
          window.location.origin,
        )
      }

      return
    }

    // If we have a code, the backend has already processed it
    // (or will process it). We just need to notify the opener.
    const code = searchParams?.get("code")

    if (!code) {
      setStatus("error")
      setErrorMessage("Missing authorization code.")

      if (window.opener) {
        window.opener.postMessage(
          {
            type: "oauth-error",
            platform: PLATFORM,
            error: "Missing authorization code.",
          },
          window.location.origin,
        )
      }

      return
    }

    // Success — the backend has stored the tokens
    setStatus("success")

    if (window.opener) {
      window.opener.postMessage(
        { type: "oauth-success", platform: PLATFORM },
        window.location.origin,
      )

      // Close the popup after a brief delay so the user sees the success UI
      setTimeout(() => {
        window.close()
      }, 1500)
    }
  }, [searchParams])


  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-6">
      <div className="w-full rounded-[24px] border border-black/8 bg-white p-8 text-center shadow-sm">
        {status === "processing" && (
          <div className="space-y-4">
            <Loader2 className="mx-auto size-8 animate-spin text-slate-500" />
            <h1 className="text-xl font-semibold text-slate-950">
              Connecting your YouTube account...
            </h1>
            <p className="text-sm text-slate-500">
              Please wait while we complete the connection.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100">
              <svg
                className="size-6 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-slate-950">
              YouTube account connected!
            </h1>
            <p className="text-sm text-slate-500">
              This window will close automatically.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="size-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-slate-950">
              Connection failed
            </h1>
            <p className="text-sm text-red-600">
              {errorMessage || "Something went wrong."}
            </p>
            <button
              type="button"
              onClick={() => window.close()}
              className="mt-4 text-sm font-medium text-slate-500 underline underline-offset-4 transition hover:text-slate-800"
            >
              Close this window
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
