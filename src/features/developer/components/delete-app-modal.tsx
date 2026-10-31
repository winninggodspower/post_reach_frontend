"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { ModalShell } from "@/components/ui/modal-shell"
import { Button } from "@/components/ui/button"
import { deleteDeveloperApplication } from "../api/developer-api"
import { extractErrorMessage } from "@/shared/lib/extract-error-message"
import type { DeveloperApplication } from "../types"

interface DeleteAppModalProps {
  isOpen: boolean
  onClose: () => void
  app: DeveloperApplication | null
  onSuccess: (deletedClientId: string) => void
}

export function DeleteAppModal({
  isOpen,
  onClose,
  app,
  onSuccess,
}: DeleteAppModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!app) return null

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteDeveloperApplication(app.client_id)
      toast.success("Application deleted.")
      onSuccess(app.client_id)
      onClose()
    } catch (error) {
      const msg = extractErrorMessage(error, "Failed to delete application.")
      toast.error(msg)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={() => {
        if (!isDeleting) onClose()
      }}
      title="Delete application"
      maxWidthClass="max-w-md"
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Are you sure you want to delete <strong>{app.name}</strong>? All active OAuth tokens issued to this application will be revoked immediately.
        </p>

        <p className="text-xs text-slate-500">
          This action cannot be undone. Integrations using these credentials will stop functioning.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-black/5 dark:border-white/5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="cursor-pointer text-xs h-9"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="cursor-pointer text-xs h-9 bg-rose-600 hover:bg-rose-700 text-white gap-1.5"
          >
            {isDeleting && <Loader2 className="size-3.5 animate-spin" />}
            <span>Delete application</span>
          </Button>
        </div>
      </div>
    </ModalShell>
  )
}
