"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import {
  extractDeveloperApiError,
  fetchDeveloperApplications,
} from "../api/developer-api"
import type {
  DeveloperApplication,
  RegenerateSecretResponse,
} from "../types"
import { AppList } from "./app-list"
import { CreateAppModal } from "./create-app-modal"
import { EditAppModal } from "./edit-app-modal"
import { DeleteAppModal } from "./delete-app-modal"
import { RegenerateSecretModal } from "./regenerate-secret-modal"
import { SecretModal } from "./secret-modal"
import { McpConnections } from "./mcp-connections"
import { OAuthReference } from "./oauth-reference"
import { ApiReference } from "./api-reference"

export function DeveloperPortal() {
  const [activeSubTab, setActiveSubTab] = useState<
    "apps" | "mcp" | "oauth" | "docs"
  >("apps")

  const [applications, setApplications] = useState<DeveloperApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<DeveloperApplication | null>(null)
  const [deletingApp, setDeletingApp] = useState<DeveloperApplication | null>(null)
  const [regeneratingApp, setRegeneratingApp] = useState<DeveloperApplication | null>(null)

  // Secret display modal (for creation or regeneration)
  const [revealedSecret, setRevealedSecret] = useState<{
    isOpen: boolean
    appName?: string
    clientId: string
    clientSecret: string
    message?: string
  }>({
    isOpen: false,
    clientId: "",
    clientSecret: "",
  })

  const loadApplications = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchDeveloperApplications()
      setApplications(data)
    } catch (error) {
      const msg = extractDeveloperApiError(
        error,
        "Failed to load developer applications.",
      )
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadApplications()
  }, [loadApplications])

  const handleAppCreated = (newApp: DeveloperApplication) => {
    setIsCreateModalOpen(false)
    setApplications((prev) => [newApp, ...prev])

    // If application is confidential and returned client_secret, display warning modal immediately
    if (newApp.client_type === "confidential" && newApp.client_secret) {
      setRevealedSecret({
        isOpen: true,
        appName: newApp.name,
        clientId: newApp.client_id,
        clientSecret: newApp.client_secret,
        message:
          "Save your Client Secret immediately! It will never be shown again. If you lose it, you will need to regenerate a new secret.",
      })
    }
  }

  const handleAppUpdated = (updatedApp: DeveloperApplication) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.client_id === updatedApp.client_id ? updatedApp : app,
      ),
    )
  }

  const handleAppDeleted = (deletedClientId: string) => {
    setApplications((prev) =>
      prev.filter((app) => app.client_id !== deletedClientId),
    )
  }

  const handleSecretRegenerated = (res: RegenerateSecretResponse) => {
    setRevealedSecret({
      isOpen: true,
      appName: regeneratingApp?.name,
      clientId: res.client_id,
      clientSecret: res.client_secret,
      message:
        res.message ||
        "Client secret regenerated successfully. Make sure to update your integrations now as the previous secret was invalidated.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Developer Settings
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage applications, connect AI assistants via MCP, and integrate with the PostGlee API.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-black/8 dark:border-white/8 gap-6 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab("apps")}
          className={`pb-3 text-sm font-medium border-b-2 transition duration-200 cursor-pointer whitespace-nowrap ${
            activeSubTab === "apps"
              ? "border-slate-950 text-slate-950 dark:border-white dark:text-white font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          Applications
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("mcp")}
          className={`pb-3 text-sm font-medium border-b-2 transition duration-200 cursor-pointer whitespace-nowrap ${
            activeSubTab === "mcp"
              ? "border-slate-950 text-slate-950 dark:border-white dark:text-white font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          AI & MCP
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("oauth")}
          className={`pb-3 text-sm font-medium border-b-2 transition duration-200 cursor-pointer whitespace-nowrap ${
            activeSubTab === "oauth"
              ? "border-slate-950 text-slate-950 dark:border-white dark:text-white font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          OAuth 2.1
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("docs")}
          className={`pb-3 text-sm font-medium border-b-2 transition duration-200 cursor-pointer whitespace-nowrap ${
            activeSubTab === "docs"
              ? "border-slate-950 text-slate-950 dark:border-white dark:text-white font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          API Reference
        </button>
      </div>

      {/* Sub-Tab Contents */}
      {activeSubTab === "apps" && (
        <AppList
          applications={applications}
          isLoading={isLoading}
          onRefresh={loadApplications}
          onCreateNew={() => setIsCreateModalOpen(true)}
          onEditApp={(app) => setEditingApp(app)}
          onRegenerateSecret={(app) => setRegeneratingApp(app)}
          onDeleteApp={(app) => setDeletingApp(app)}
        />
      )}

      {activeSubTab === "mcp" && <McpConnections />}

      {activeSubTab === "oauth" && (
        <OAuthReference applications={applications} />
      )}

      {activeSubTab === "docs" && <ApiReference />}

      {/* Modals */}
      <CreateAppModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleAppCreated}
      />

      <EditAppModal
        isOpen={Boolean(editingApp)}
        onClose={() => setEditingApp(null)}
        app={editingApp}
        onSuccess={handleAppUpdated}
      />

      <DeleteAppModal
        isOpen={Boolean(deletingApp)}
        onClose={() => setDeletingApp(null)}
        app={deletingApp}
        onSuccess={handleAppDeleted}
      />

      <RegenerateSecretModal
        isOpen={Boolean(regeneratingApp)}
        onClose={() => setRegeneratingApp(null)}
        app={regeneratingApp}
        onSuccess={handleSecretRegenerated}
      />

      <SecretModal
        isOpen={revealedSecret.isOpen}
        onClose={() =>
          setRevealedSecret((prev) => ({ ...prev, isOpen: false }))
        }
        appName={revealedSecret.appName}
        clientId={revealedSecret.clientId}
        clientSecret={revealedSecret.clientSecret}
        customMessage={revealedSecret.message}
      />
    </div>
  )
}
