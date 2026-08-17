"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { SuccessCheckIcon } from "@/components/ui/success-check-icon"

import { exchangeOAuthCode } from "@/features/onboarding/api/server"
import { platformLabelMap } from "@/features/onboarding/components/steps/shared"
import { FacebookPageSelect } from "@/features/onboarding/components/facebook-page-select"
import type { OnboardingPlatform } from "@/features/onboarding/types"

export default function OAuthCallbackPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"processing" | "select_page" | "success" | "error">("processing")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const processedRef = useRef(false)

  const platform = params?.platform as OnboardingPlatform | undefined
  const platformLabel = platform ? (platformLabelMap[platform] ?? platform) : ""

  const code = searchParams?.get("code")
  const state = searchParams?.get("state")
  const error = searchParams?.get("error")

  const handlePageSelect = async (pageId: string) => {
    if (!platform || !code || !state) return
    setStatus("processing")
    try {
      const redirectUri = `${window.location.origin}/social/oauth/${platform}/callback`
      await exchangeOAuthCode({
        platform,
        code,
        redirect_uri: redirectUri,
        state,
        page_id: pageId,
      })

      setStatus("success")

      if (window.opener) {
        window.opener.postMessage(
          { type: `oauth-success` },
          window.location.origin,
        )

        setTimeout(() => {
          window.close()
        }, 1500)
      }
    } catch (err) {
      handleError(err)
    }
  }

  const handleError = (err: unknown) => {
    setStatus("error")
    const message =
      err instanceof Error
        ? (() => {
            try {
              const parsed = JSON.parse(err.message) as { message?: string }
              return parsed.message || `Failed to connect ${platformLabel} account.`
            } catch {
              return err.message || `Failed to connect ${platformLabel} account.`
            }
          })()
        : `Failed to connect ${platformLabel} account.`

    setErrorMessage(message)

    if (window.opener) {
      window.opener.postMessage(
        { type: `oauth-error`, error: message },
        window.location.origin,
      )
    }
  }

  useEffect(() => {
    if (processedRef.current) return
    if (!platform) return
    processedRef.current = true

    if (error) {
      setStatus("error")
      setErrorMessage("You denied the authorization request.")

      if (window.opener) {
        window.opener.postMessage(
          { type: `oauth-error`, error: "You denied the authorization request." },
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
          { type: `oauth-error`, error: "Missing authorization code or state parameter." },
          window.location.origin,
        )
      }
      return
    }

    const handleCallback = async () => {
      try {
        const redirectUri = `${window.location.origin}/social/oauth/${platform}/callback`

        if (platform === "facebook") {
          setStatus("select_page")
          return // FacebookPageSelect component will handle the fetch
        }

        await exchangeOAuthCode({
          platform,
          code,
          redirect_uri: redirectUri,
          state,
        })

        setStatus("success")

        if (window.opener) {
          window.opener.postMessage(
            { type: `oauth-success` },
            window.location.origin,
          )

          setTimeout(() => {
            window.close()
          }, 1500)
        }
      } catch (err) {
        handleError(err)
      }
    }

    void handleCallback()
  }, [platform, platformLabel, code, state, error])

  if (!platform) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-6">
        <div className="w-full rounded-[24px] border border-black/8 bg-white p-8 text-center shadow-sm">
          <div className="space-y-4">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100">
              <svg className="size-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-slate-950">Invalid platform</h1>
            <p className="text-sm text-slate-500">No platform was specified in the callback URL.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-6 py-12">
      <div className="w-full rounded-[24px] border border-black/8 bg-white p-8 text-center shadow-sm">
        {status === "processing" && (
          <div className="space-y-4">
            <Loader2 className="mx-auto size-8 animate-spin text-slate-500" />
            <h1 className="text-xl font-semibold text-slate-950">
              Connecting your {platformLabel} account...
            </h1>
            <p className="text-sm text-slate-500">
              Please wait while we complete the connection.
            </p>
          </div>
        )}

        {status === "select_page" && code && (
          <FacebookPageSelect
            code={code}
            redirectUri={`${typeof window !== "undefined" ? window.location.origin : ""}/social/oauth/${platform}/callback`}
            onSelect={handlePageSelect}
            onError={(err) => {
              setErrorMessage(err)
              setStatus("error")
              if (window.opener) {
                window.opener.postMessage(
                  { type: `oauth-error`, error: err },
                  window.location.origin,
                )
              }
            }}
          />
        )}

        {status === "success" && (
          <div className="space-y-4">
            <SuccessCheckIcon />
            <h1 className="text-xl font-semibold text-slate-950">
              {platformLabel} account connected!
            </h1>
            <p className="text-sm text-slate-500">
              This window will close automatically.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100">
              <svg className="size-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-slate-950">Connection failed</h1>
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
