"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { exchangeYouTubeCode } from "@/features/onboarding/api/server"

export default function YouTubeCallbackPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const processedRef = useRef(false)

  useEffect(() => {
    // Prevent double execution in strict mode
    if (processedRef.current) return
    processedRef.current = true

    const code = searchParams?.get("code")
    const state = searchParams?.get("state")
    const error = searchParams?.get("error")

    if (error) {
      setStatus("error")
      setErrorMessage("You denied the authorization request.")

      // Notify the opener (popup parent) about the error
      if (window.opener) {
        window.opener.postMessage(
          { type: "youtube-oauth-error", error: "You denied the authorization request." },
          window.location.origin,
        )
      }

      return
    }

    if (!code || !state) {
      setStatus("error")
      setErrorMessage("Missing authorization code or state parameter.")

      if (window.opener) {
        window.opener.postMessage(
          { type: "youtube-oauth-error", error: "Missing authorization code or state parameter." },
          window.location.origin,
        )
      }

      return
    }

    const handleCallback = async () => {
      try {
        const redirectUri = `${window.location.origin}/social/youtube/callback`

        await exchangeYouTubeCode({
          code,
          redirect_uri: redirectUri,
          state,
        })

        setStatus("success")

        // Notify the opener (popup parent) that YouTube connected successfully
        if (window.opener) {
          window.opener.postMessage(
            { type: "youtube-oauth-success" },
            window.location.origin,
          )

          // Close the popup after a brief delay
          setTimeout(() => {
            window.close()
          }, 1500)
        }
      } catch (err) {
        setStatus("error")
        const message =
          err instanceof Error
            ? (() => {
                try {
                  const parsed = JSON.parse(err.message) as { message?: string }
                  return parsed.message || "Failed to connect YouTube account."
                } catch {
                  return err.message || "Failed to connect YouTube account."
                }
              })()
            : "Failed to connect YouTube account."

        setErrorMessage(message)

        if (window.opener) {
          window.opener.postMessage(
            { type: "youtube-oauth-error", error: message },
            window.location.origin,
          )
        }
      }
    }

    void handleCallback()
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
