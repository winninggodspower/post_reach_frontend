"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Check,
  CheckSquare,
  Copy,
  Edit2,
  ExternalLink,
  KeyRound,
  Loader2,
  Square,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  extractDeveloperApiError,
  fetchDeveloperApplication,
  getApiBaseDomain,
} from "../api/developer-api"
import type {
  DeveloperApplication,
  RegenerateSecretResponse,
} from "../types"
import { EditAppModal } from "./edit-app-modal"
import { DeleteAppModal } from "./delete-app-modal"
import { RegenerateSecretModal } from "./regenerate-secret-modal"
import { SecretModal } from "./secret-modal"

interface ApplicationDetailViewProps {
  clientId: string
}

export function ApplicationDetailView({ clientId }: ApplicationDetailViewProps) {
  const router = useRouter()
  const [app, setApp] = useState<DeveloperApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Copy states
  const [copiedClientId, setCopiedClientId] = useState(false)
  const [copiedAuthUrl, setCopiedAuthUrl] = useState(false)
  const [copiedUriIndex, setCopiedUriIndex] = useState<number | null>(null)

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false)
  const [revealedSecret, setRevealedSecret] = useState<{
    isOpen: boolean
    clientId: string
    clientSecret: string
    message?: string
  }>({
    isOpen: false,
    clientId: "",
    clientSecret: "",
  })

  // Scopes for the tester
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    "accounts:read",
    "posts:read",
    "posts:write",
  ])

  const loadApp = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchDeveloperApplication(clientId)
      setApp(data)
    } catch (error) {
      const msg = extractDeveloperApiError(
        error,
        "Failed to load application details.",
      )
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    void loadApp()
  }, [loadApp])

  const handleCopyClientId = async () => {
    if (!app) return
    await navigator.clipboard.writeText(app.client_id)
    setCopiedClientId(true)
    setTimeout(() => setCopiedClientId(false), 2000)
  }

  const handleCopyUri = async (uri: string, index: number) => {
    await navigator.clipboard.writeText(uri)
    setCopiedUriIndex(index)
    setTimeout(() => setCopiedUriIndex(null), 2000)
  }

  const toggleScope = (scopeKey: string) => {
    if (selectedScopes.includes(scopeKey)) {
      setSelectedScopes(selectedScopes.filter((s) => s !== scopeKey))
    } else {
      setSelectedScopes([...selectedScopes, scopeKey])
    }
  }

  const baseDomain = getApiBaseDomain()

  const redirectUris =
    app?.redirect_uris_list?.length
      ? app.redirect_uris_list
      : app?.redirect_uris
      ? app.redirect_uris.split(/\s+/).filter(Boolean)
      : []

  const allowedOrigins =
    app?.allowed_origins_list?.length
      ? app.allowed_origins_list
      : app?.allowed_origins
      ? app.allowed_origins.split(/\s+/).filter(Boolean)
      : []

  const primaryRedirectUri = redirectUris[0] || "https://example.com/oauth/callback"

  const sampleAuthUrl = app
    ? `${baseDomain}/oauth/authorize/?response_type=code&client_id=${
        app.client_id
      }&redirect_uri=${encodeURIComponent(
        primaryRedirectUri,
      )}&scope=${encodeURIComponent(selectedScopes.join(" "))}`
    : ""

  const handleSecretRegenerated = (res: RegenerateSecretResponse) => {
    setRevealedSecret({
      isOpen: true,
      clientId: res.client_id,
      clientSecret: res.client_secret,
      message:
        res.message ||
        "Client secret regenerated successfully. Make sure to update your application environment now.",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-40 bg-slate-100 dark:bg-slate-900 rounded-xl" />
        <div className="h-40 bg-slate-100 dark:bg-slate-900 rounded-xl" />
      </div>
    )
  }

  if (!app) {
    return (
      <div className="space-y-4 text-center py-12">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Application not found
        </h3>
        <p className="text-xs text-slate-500">
          The requested application does not exist or has been deleted.
        </p>
        <Link href="/dashboard/developer">
          <Button variant="outline" size="sm" className="text-xs mt-2">
            Return to applications
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Link / Breadcrumb */}
      <div>
        <Link
          href="/dashboard/developer"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to applications</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-black/5 dark:border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {app.name}
            </h1>
            <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 capitalize">
              {app.client_type}
            </span>
            {app.active_users_count > 0 && (
              <span className="text-[11px] text-slate-400">
                • {app.active_users_count} active user{app.active_users_count === 1 ? "" : "s"}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Created {new Date(app.created).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="cursor-pointer text-xs h-9 gap-1.5"
          >
            <Edit2 className="size-3.5" />
            <span>Edit application</span>
          </Button>
        </div>
      </div>

      {/* Section 1: Credentials */}
      <div className="rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-2xs">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Client Credentials
        </h3>

        {/* Client ID */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Client ID
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-950 px-3 py-2 font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
              {app.client_id}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyClientId}
              className="shrink-0 h-9 gap-1.5 cursor-pointer text-xs"
            >
              {copiedClientId ? (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Client Secret (Confidential) */}
        {app.client_type === "confidential" ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Client Secret
              </label>
              <button
                type="button"
                onClick={() => setIsRegenerateModalOpen(true)}
                className="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 font-medium cursor-pointer"
              >
                Regenerate secret
              </button>
            </div>
            <div className="rounded-lg border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-950 px-3 py-2 font-mono text-xs text-slate-400">
              ••••••••••••••••••••••••••••••••••••••••
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your client secret is stored securely hashed and cannot be shown again. If misplaced, regenerate a new secret above.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Client Secret
            </label>
            <p className="text-xs text-slate-500">
              Public clients use PKCE (Proof Key for Code Exchange) and do not use a client secret.
            </p>
          </div>
        )}

        <div className="pt-2 border-t border-black/5 dark:border-white/5">
          <span className="text-xs text-slate-500">
            Grant type: <code className="font-mono text-slate-700 dark:text-slate-300">{app.authorization_grant_type || "authorization-code"}</code>
          </span>
        </div>
      </div>

      {/* Section 2: OAuth Configuration */}
      <div className="rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            OAuth Configuration
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="text-xs h-7 text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            Edit
          </Button>
        </div>

        {/* Redirect URIs */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Redirect URIs
          </label>
          {redirectUris.length > 0 ? (
            <div className="space-y-1.5">
              {redirectUris.map((uri, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 rounded-lg border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-950 px-3 py-2"
                >
                  <code className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
                    {uri}
                  </code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 text-slate-400 hover:text-slate-800 cursor-pointer"
                    onClick={() => handleCopyUri(uri, idx)}
                  >
                    {copiedUriIndex === idx ? (
                      <Check className="size-3 text-emerald-600" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No redirect URIs specified</p>
          )}
        </div>

        {/* Allowed Origins */}
        <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Allowed Origins (CORS)
          </label>
          {allowedOrigins.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {allowedOrigins.map((origin, idx) => (
                <span
                  key={idx}
                  className="rounded border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 font-mono text-xs text-slate-700 dark:text-slate-300"
                >
                  {origin}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">None specified</p>
          )}
        </div>
      </div>

      {/* Section 3: Test Authorization Flow */}
      <div className="rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-2xs">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Test Authorization Flow
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Use this pre-configured URL to test the consent screen with this application.
          </p>
        </div>

        {/* Scope Checkboxes */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Requested scopes
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { scope: "accounts:read", label: "Read Brands & Accounts" },
              { scope: "posts:read", label: "Read Posts & Calendar" },
              { scope: "posts:write", label: "Publish & Edit Posts" },
            ].map((s) => {
              const isChecked = selectedScopes.includes(s.scope)
              return (
                <button
                  key={s.scope}
                  type="button"
                  onClick={() => toggleScope(s.scope)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition cursor-pointer ${
                    isChecked
                      ? "border-slate-900 bg-slate-50 dark:border-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      : "border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-400"
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="size-3.5 text-slate-900 dark:text-white shrink-0" />
                  ) : (
                    <Square className="size-3.5 text-slate-400 shrink-0" />
                  )}
                  <span>{s.scope}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* URL Output */}
        <div className="relative">
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-950 p-3 pr-24 font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all leading-relaxed">
            {sampleAuthUrl}
          </div>
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={async () => {
                await navigator.clipboard.writeText(sampleAuthUrl)
                setCopiedAuthUrl(true)
                setTimeout(() => setCopiedAuthUrl(false), 2000)
              }}
              className="h-7 text-xs gap-1 cursor-pointer bg-white dark:bg-slate-800"
            >
              {copiedAuthUrl ? (
                <>
                  <Check className="size-3 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy</span>
                </>
              )}
            </Button>
            <a
              href={sampleAuthUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center size-7 rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-300 transition"
              title="Open authorization consent in new tab"
            >
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Section 4: Danger Zone */}
      <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-2xs">
        <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-400">
          Danger Zone
        </h3>

        <div className="space-y-3 divide-y divide-rose-100 dark:divide-rose-950/40 text-xs">
          {app.client_type === "confidential" && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 first:pt-0">
              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100">
                  Regenerate Client Secret
                </h4>
                <p className="text-slate-500 mt-0.5">
                  Immediately revokes the current client secret. Active connections using the old secret will stop working.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsRegenerateModalOpen(true)}
                className="shrink-0 text-amber-700 hover:bg-amber-50 dark:text-amber-400 border-amber-200 dark:border-amber-900/40 cursor-pointer h-8 text-xs"
              >
                Regenerate secret
              </Button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                Delete Application
              </h4>
              <p className="text-slate-500 mt-0.5">
                Permanently deletes this application and immediately revokes all issued access and refresh tokens.
              </p>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              className="shrink-0 bg-rose-600 hover:bg-rose-700 text-white cursor-pointer h-8 text-xs gap-1.5"
            >
              <Trash2 className="size-3.5" />
              <span>Delete application</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditAppModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        app={app}
        onSuccess={(updated) => setApp(updated)}
      />

      <RegenerateSecretModal
        isOpen={isRegenerateModalOpen}
        onClose={() => setIsRegenerateModalOpen(false)}
        app={app}
        onSuccess={handleSecretRegenerated}
      />

      <SecretModal
        isOpen={revealedSecret.isOpen}
        onClose={() =>
          setRevealedSecret((prev) => ({ ...prev, isOpen: false }))
        }
        appName={app.name}
        clientId={revealedSecret.clientId}
        clientSecret={revealedSecret.clientSecret}
        customMessage={revealedSecret.message}
      />

      <DeleteAppModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        app={app}
        onSuccess={() => {
          router.push("/dashboard/developer")
        }}
      />
    </div>
  )
}

