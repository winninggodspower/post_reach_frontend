"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { SuccessCheckIcon } from "@/components/ui/success-check-icon"

import { exchangeOAuthCode } from "@/features/onboarding/api/server"
import { platformLabelMap } from "@/features/onboarding/components/steps/shared"
import { FacebookPageSelect } from "@/features/onboarding/components/facebook-page-select"
import type { OnboardingPlatform } from "@/features/onboarding/types"

export default function OAuthCallbackPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"processing" | "select_page" | "success" | "error">("processing")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const processedRef = useRef(false)

  // Direct access from Next.js route params: /social/oauth/[platform]/callback
  const platformParam = typeof params?.platform === "string" ? params.platform.toLowerCase() : ""
  const isTwitter = platformParam === "twitter" || platformParam === "x"
  const platform = (isTwitter ? "twitter" : platformParam) as OnboardingPlatform
  const platformLabel = isTwitter ? "X" : platformParam ? (platformLabelMap[platform] ?? platformParam) : ""

  // Read params synchronously from window.location.search to prevent hydration delays
  const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null

  const code = urlParams?.get("code") ?? searchParams?.get("code")
  const state = urlParams?.get("state") ?? searchParams?.get("state")
  const error = urlParams?.get("error") ?? searchParams?.get("error")
  const denied = urlParams?.get("denied") ?? searchParams?.get("denied")
  const oauthToken = urlParams?.get("oauth_token") ?? searchParams?.get("oauth_token")
  const oauthVerifier = urlParams?.get("oauth_verifier") ?? searchParams?.get("oauth_verifier")

  const handlePageSelect = async (pageId: string) => {
    if (!platform || !code || !state) return
    setStatus("processing")
    try {
      const redirectUri = `${window.location.origin}/social/oauth/${platformParam}/callback`
      await exchangeOAuthCode({
        platform,
        code,
        redirect_uri: redirectUri,
        state,
        page_id: pageId,
      })

      setStatus("success")

      if (window.opener) {
        try {
          window.opener.postMessage(
            { type: `oauth-success` },
            window.location.origin,
          )
        } catch {
          // ignore cross-origin error
        }
      }

      setTimeout(() => {
        if (window.opener) {
          window.close()
        }
        router.replace("/dashboard")
      }, 1500)
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
    if (!platformParam) return

    // If Twitter, wait until OAuth 1.0a tokens or denial arrive before processing
    if (isTwitter && !oauthToken && !oauthVerifier && !error && !denied) {
      return
    }

    // If OAuth 2.0, wait until code or error/denial arrive before processing
    if (!isTwitter && !code && !error && !denied) {
      return
    }

    if (processedRef.current) return
    processedRef.current = true

    if (error || denied) {
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

    if (isTwitter) {
      // Twitter OAuth 1.0a flow: only validates oauth_token and oauth_verifier
      if (!oauthToken || !oauthVerifier) {
        setStatus("error")
        setErrorMessage("Missing Twitter authorization parameters (oauth_token or oauth_verifier).")

        if (window.opener) {
          window.opener.postMessage(
            {
              type: `oauth-error`,
              error: "Missing Twitter authorization parameters (oauth_token or oauth_verifier).",
            },
            window.location.origin,
          )
        }
        return
      }
    } else {
      // Standard OAuth 2.0 flow: validates code and state
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
    }

    const handleCallback = async () => {
      try {
        const redirectUri = `${window.location.origin}/social/oauth/${platformParam}/callback`

        if (platform === "facebook") {
          setStatus("select_page")
          return // FacebookPageSelect component will handle the fetch
        }

        if (isTwitter) {
          await exchangeOAuthCode({
            platform: "twitter",
            oauth_token: oauthToken!,
            oauth_verifier: oauthVerifier!,
          })
        } else {
          await exchangeOAuthCode({
            platform,
            code: code!,
            redirect_uri: redirectUri,
            state: state ?? undefined,
          })
        }

        setStatus("success")

        if (window.opener) {
          try {
            window.opener.postMessage(
              { type: `oauth-success` },
              window.location.origin,
            )
          } catch {
            // ignore cross-origin error
          }
        }

        setTimeout(() => {
          if (window.opener) {
            window.close()
          }
          router.replace("/dashboard")
        }, 1500)
      } catch (err) {
        handleError(err)
      }
    }

    void handleCallback()
  }, [platformParam, isTwitter, platform, platformLabel, code, state, error, denied, oauthToken, oauthVerifier])

  if (!platformParam) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-6">
        <div className="w-full rounded-[24px] border border-black/8 bg-white p-8 text-center shadow-sm">
          <div className="space-y-4">
            <Loader2 className="mx-auto size-8 animate-spin text-slate-500" />
            <p className="text-sm text-slate-500">Connecting account...</p>
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
              Redirecting you back to your workspace...
            </p>
            <button
              type="button"
              onClick={() => router.replace("/dashboard")}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 cursor-pointer shadow-xs"
            >
              Continue to Dashboard
            </button>
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
