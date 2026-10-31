"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { ModalShell } from "@/components/ui/modal-shell"
import { Button } from "@/components/ui/button"
import {
  extractDeveloperApiError,
  regenerateApplicationSecret,
} from "../api/developer-api"
import type { DeveloperApplication, RegenerateSecretResponse } from "../types"

interface RegenerateSecretModalProps {
  isOpen: boolean
  onClose: () => void
  app: DeveloperApplication | null
  onSuccess: (data: RegenerateSecretResponse) => void
}

export function RegenerateSecretModal({
  isOpen,
  onClose,
  app,
  onSuccess,
}: RegenerateSecretModalProps) {
  const [isRegenerating, setIsRegenerating] = useState(false)

  if (!app) return null

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    try {
      const data = await regenerateApplicationSecret(app.client_id)
      toast.success("Client secret regenerated.")
      onSuccess(data)
      onClose()
    } catch (error) {
      const msg = extractDeveloperApiError(
        error,
        "Failed to regenerate client secret.",
      )
      toast.error(msg)
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={() => {
        if (!isRegenerating) onClose()
      }}
      title="Regenerate secret"
      maxWidthClass="max-w-md"
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Regenerating the secret for <strong>{app.name}</strong> will immediately invalidate the current secret.
        </p>

        <p className="text-xs text-slate-500">
          Any services or AI connections currently using the previous secret will fail until updated.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-black/5 dark:border-white/5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isRegenerating}
            className="cursor-pointer text-xs h-9"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="cursor-pointer text-xs h-9 bg-amber-600 hover:bg-amber-700 text-white gap-1.5"
          >
            {isRegenerating && <Loader2 className="size-3.5 animate-spin" />}
            <span>Regenerate secret</span>
          </Button>
        </div>
      </div>
    </ModalShell>
  )
}
