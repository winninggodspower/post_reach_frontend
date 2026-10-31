"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Check,
  Copy,
  Edit2,
  KeyRound,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { DeveloperApplication } from "../types"

interface AppListProps {
  applications: DeveloperApplication[]
  isLoading: boolean
  onRefresh: () => void
  onCreateNew: () => void
  onSelectApp?: (app: DeveloperApplication) => void
  onEditApp: (app: DeveloperApplication) => void
  onRegenerateSecret: (app: DeveloperApplication) => void
  onDeleteApp: (app: DeveloperApplication) => void
}

export function AppList({
  applications,
  isLoading,
  onRefresh,
  onCreateNew,
  onSelectApp,
  onEditApp,
  onRegenerateSecret,
  onDeleteApp,
}: AppListProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedClientId, setCopiedClientId] = useState<string | null>(null)

  const handleOpenDetails = (app: DeveloperApplication) => {
    if (onSelectApp) {
      onSelectApp(app)
    }
    router.push(`/dashboard/developer/applications/${app.client_id}`)
  }

  const handleCopyId = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(id)
    setCopiedClientId(id)
    setTimeout(() => setCopiedClientId(null), 2000)
  }

  const filteredApps = applications.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.client_id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-black/10 dark:border-white/10 pl-9 pr-4 py-2 text-xs outline-none transition focus:border-slate-950 dark:focus:border-white bg-white dark:bg-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="cursor-pointer h-9 text-xs gap-1.5"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onCreateNew}
            className="cursor-pointer h-9 text-xs gap-1.5 bg-slate-950 text-white hover:bg-slate-800"
          >
            <Plus className="size-3.5" />
            <span>Create application</span>
          </Button>
        </div>
      </div>

      {/* Applications List */}
      {isLoading && applications.length === 0 ? (
        <div className="space-y-3 pt-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl border border-black/5 bg-slate-100 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/15 dark:border-white/15 bg-slate-50/50 dark:bg-slate-900/30 p-12 text-center">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {searchQuery ? "No matching applications" : "No applications yet"}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            {searchQuery
              ? "Try searching for a different application name or client ID."
              : "Create an application to obtain credentials for AI assistants, scripts, or third-party integrations."}
          </p>
          {!searchQuery && (
            <Button
              type="button"
              size="sm"
              onClick={onCreateNew}
              className="cursor-pointer text-xs bg-slate-950 text-white hover:bg-slate-800 gap-1.5"
            >
              <Plus className="size-3.5" />
              <span>Create application</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApps.map((app) => (
            <div
              key={app.id || app.client_id}
              onClick={() => handleOpenDetails(app)}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900 p-4 shadow-2xs hover:border-slate-400 dark:hover:border-slate-600 transition cursor-pointer"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {app.name}
                  </h4>

                  <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 capitalize">
                    {app.client_type}
                  </span>

                  {app.active_users_count > 0 && (
                    <span className="text-[11px] text-slate-400">
                      • {app.active_users_count} user{app.active_users_count === 1 ? "" : "s"}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-slate-400">Client ID:</span>
                  <div
                    onClick={(e) => handleCopyId(app.client_id, e)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-black/5 dark:border-white/5 bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 font-mono text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                    title="Click to copy Client ID"
                  >
                    <span className="truncate max-w-[220px] sm:max-w-xs">{app.client_id}</span>
                    {copiedClientId === app.client_id ? (
                      <Check className="size-3 text-emerald-600 shrink-0" />
                    ) : (
                      <Copy className="size-3 text-slate-400 shrink-0" />
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                  <span>Created {new Date(app.created).toLocaleDateString()}</span>
                  {app.redirect_uris_list?.length > 0 && (
                    <span className="truncate max-w-sm">
                      Callback: <span className="font-mono text-slate-500">{app.redirect_uris_list[0]}</span>
                      {app.redirect_uris_list.length > 1 && ` (+${app.redirect_uris_list.length - 1})`}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className="flex items-center gap-1.5 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDetails(app)}
                  className="h-8 text-xs cursor-pointer"
                >
                  Manage
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 cursor-pointer text-slate-500 hover:text-slate-900"
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                      onClick={() => onEditApp(app)}
                      className="gap-2 text-xs cursor-pointer"
                    >
                      <Edit2 className="size-3.5" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    {app.client_type === "confidential" && (
                      <DropdownMenuItem
                        onClick={() => onRegenerateSecret(app)}
                        className="gap-2 text-xs cursor-pointer text-amber-600 focus:text-amber-700"
                      >
                        <KeyRound className="size-3.5" />
                        <span>Regenerate secret</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDeleteApp(app)}
                      className="gap-2 text-xs cursor-pointer text-rose-600 focus:text-rose-700"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
