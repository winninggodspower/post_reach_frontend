"use client"

import { useEffect, useState } from "react"
import { Check, CheckSquare, Copy, ExternalLink, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DeveloperApplication, OAuthScope } from "../types"
import { fetchSupportedScopes, getApiBaseDomain } from "../api/developer-api"

interface OAuthReferenceProps {
  applications: DeveloperApplication[]
}

const FALLBACK_SCOPES: OAuthScope[] = [
  {
    scope: "accounts:read",
    name: "Read Brands & Accounts",
    description: "Read accessible brands and connected social media accounts.",
  },
  {
    scope: "posts:read",
    name: "Read Posts & Calendar",
    description: "Read scheduled, draft, and published social posts and calendar.",
  },
  {
    scope: "posts:write",
    name: "Publish & Edit Posts",
    description: "Create, edit, schedule, and publish social posts.",
  },
]

export function OAuthReference({ applications }: OAuthReferenceProps) {
  const [scopes, setScopes] = useState<OAuthScope[]>(FALLBACK_SCOPES)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedTokenCurl, setCopiedTokenCurl] = useState(false)

  // URL Builder State
  const [selectedAppId, setSelectedAppId] = useState<string>("")
  const [customClientId, setCustomClientId] = useState<string>("")
  const [redirectUri, setRedirectUri] = useState<string>("https://example.com/oauth/callback")
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    "accounts:read",
    "posts:read",
    "posts:write",
  ])

  const baseDomain = getApiBaseDomain()

  useEffect(() => {
    fetchSupportedScopes()
      .then((res) => {
        if (res && res.length > 0) {
          setScopes(res)
        }
      })
      .catch(() => {
        // Fallback scopes already initialized
      })
  }, [])

  useEffect(() => {
    if (applications.length > 0 && !selectedAppId) {
      const first = applications[0]
      setSelectedAppId(first.client_id)
      const firstUri =
        first.redirect_uris_list?.[0] ||
        first.redirect_uris?.split(/\s+/)[0] ||
        "https://example.com/oauth/callback"
      setRedirectUri(firstUri)
    }
  }, [applications, selectedAppId])

  const handleAppSelect = (clientId: string) => {
    setSelectedAppId(clientId)
    if (clientId === "custom") {
      return
    }
    const app = applications.find((a) => a.client_id === clientId)
    if (app) {
      const firstUri =
        app.redirect_uris_list?.[0] ||
        app.redirect_uris?.split(/\s+/)[0] ||
        "https://example.com/oauth/callback"
      setRedirectUri(firstUri)
    }
  }

  const toggleScope = (scopeKey: string) => {
    if (selectedScopes.includes(scopeKey)) {
      setSelectedScopes(selectedScopes.filter((s) => s !== scopeKey))
    } else {
      setSelectedScopes([...selectedScopes, scopeKey])
    }
  }

  const activeClientId =
    selectedAppId === "custom" || !selectedAppId
      ? customClientId || "<CLIENT_ID>"
      : selectedAppId

  const generatedAuthUrl = `${baseDomain}/oauth/authorize/?response_type=code&client_id=${activeClientId}&redirect_uri=${encodeURIComponent(
    redirectUri,
  )}&scope=${encodeURIComponent(selectedScopes.join(" "))}`

  const tokenExchangeCurl = `curl -X POST "${baseDomain}/oauth/token/" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=authorization_code" \\
  -d "client_id=${activeClientId}" \\
  -d "client_secret=<CLIENT_SECRET>" \\
  -d "code=<AUTH_CODE>" \\
  -d "redirect_uri=${redirectUri}"`

  const oauthEndpoints = [
    {
      name: "Authorize",
      method: "GET",
      path: "/oauth/authorize/",
      description: "Consent screen where users grant requested permissions.",
    },
    {
      name: "Token Exchange",
      method: "POST",
      path: "/oauth/token/",
      description: "Exchanges authorization code for access_token and refresh_token.",
    },
    {
      name: "Token Revocation",
      method: "POST",
      path: "/oauth/revoke_token/",
      description: "Revokes an active access_token or refresh_token immediately.",
    },
    {
      name: "OIDC Discovery",
      method: "GET",
      path: "/.well-known/openid-configuration",
      description: "OpenID Connect discovery metadata.",
    },
  ]

  return (
    <div className="space-y-6">
      {/* OAuth 2.1 Endpoints Table */}
      <div className="rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-black/5 dark:border-white/5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            OAuth 2.1 Endpoints
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Standard endpoints for authorization code exchange and token management.
          </p>
        </div>

        <div className="divide-y divide-black/5 dark:divide-white/5">
          {oauthEndpoints.map((ep) => (
            <div
              key={ep.path}
              className="p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                      ep.method === "GET"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {ep.name}
                  </span>
                </div>
                <p className="text-slate-500">{ep.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <code className="rounded-md border border-black/8 dark:border-white/8 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 font-mono text-[11px] text-slate-800 dark:text-slate-200 break-all select-all">
                  {baseDomain}
                  {ep.path}
                </code>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 cursor-pointer text-slate-400 hover:text-slate-800"
                  onClick={() => navigator.clipboard.writeText(`${baseDomain}${ep.path}`)}
                  title="Copy URL"
                >
                  <Copy className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Authorization URL Generator */}
      <div className="rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900 p-4 space-y-4 shadow-2xs">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Authorization URL Generator
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate and test OAuth 2.1 user consent URLs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* App Selector */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Select application
            </label>
            <select
              value={selectedAppId}
              onChange={(e) => handleAppSelect(e.target.value)}
              className="w-full rounded-xl border border-black/10 dark:border-white/10 px-3 py-2 text-xs outline-none bg-white dark:bg-slate-900 cursor-pointer"
            >
              {applications.map((app) => (
                <option key={app.client_id} value={app.client_id}>
                  {app.name} ({app.client_type})
                </option>
              ))}
              <option value="custom">Custom client ID...</option>
            </select>
          </div>

          {/* Custom Client ID or Redirect URI */}
          {selectedAppId === "custom" ? (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Custom Client ID
              </label>
              <input
                type="text"
                placeholder="Enter client_id..."
                value={customClientId}
                onChange={(e) => setCustomClientId(e.target.value)}
                className="w-full rounded-xl border border-black/10 dark:border-white/10 px-3 py-2 font-mono text-xs outline-none bg-white dark:bg-slate-900"
              />
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Redirect URI
              </label>
              <input
                type="text"
                value={redirectUri}
                onChange={(e) => setRedirectUri(e.target.value)}
                placeholder="https://example.com/oauth/callback"
                className="w-full rounded-xl border border-black/10 dark:border-white/10 px-3 py-2 font-mono text-xs outline-none bg-white dark:bg-slate-900"
              />
            </div>
          )}
        </div>

        {/* Scope Checkboxes */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Request scopes
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {scopes.map((s) => {
              const isChecked = selectedScopes.includes(s.scope)
              return (
                <button
                  key={s.scope}
                  type="button"
                  onClick={() => toggleScope(s.scope)}
                  className={`flex items-start gap-2 p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    isChecked
                      ? "border-slate-900 bg-slate-50 dark:border-white dark:bg-slate-800"
                      : "border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 opacity-60 hover:opacity-100"
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="size-3.5 text-slate-900 dark:text-white shrink-0 mt-0.5" />
                  ) : (
                    <Square className="size-3.5 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <p className="font-mono text-xs font-medium text-slate-900 dark:text-slate-100">
                      {s.scope}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {s.name}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Live Generated Authorization URL */}
        <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Generated authorization URL
            </span>
            <a
              href={generatedAuthUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              <span>Test flow</span>
              <ExternalLink className="size-3" />
            </a>
          </div>

          <div className="relative">
            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-950 p-2.5 pr-20 font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all leading-relaxed">
              {generatedAuthUrl}
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={async () => {
                await navigator.clipboard.writeText(generatedAuthUrl)
                setCopiedUrl(true)
                setTimeout(() => setCopiedUrl(false), 2000)
              }}
              className="absolute top-1.5 right-1.5 h-7 text-xs gap-1.5 cursor-pointer bg-white dark:bg-slate-800"
            >
              {copiedUrl ? (
                <>
                  <Check className="size-3 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Code Exchange cURL Snippet */}
        <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/5">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Token exchange request
          </span>
          <div className="relative">
            <pre className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-950 p-3 font-mono text-xs text-slate-100 overflow-x-auto leading-relaxed">
              <code>{tokenExchangeCurl}</code>
            </pre>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={async () => {
                await navigator.clipboard.writeText(tokenExchangeCurl)
                setCopiedTokenCurl(true)
                setTimeout(() => setCopiedTokenCurl(false), 2000)
              }}
              className="absolute top-2 right-2 h-7 text-xs gap-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
            >
              {copiedTokenCurl ? (
                <>
                  <Check className="size-3 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Supported Scopes Reference List */}
      <div className="rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900 p-4 space-y-3 shadow-2xs">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Supported Scopes
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Permission scopes available for requesting during authorization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {scopes.map((s) => (
            <div
              key={s.scope}
              className="rounded-xl border border-black/6 dark:border-white/6 bg-slate-50/60 dark:bg-slate-800/40 p-3 space-y-1"
            >
              <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                {s.scope}
              </span>
              <h5 className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {s.name}
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
