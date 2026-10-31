"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { ModalShell } from "@/components/ui/modal-shell"
import { Button } from "@/components/ui/button"
import { updateDeveloperApplication } from "../api/developer-api"
import {
  applyFormServerErrors,
  extractErrorMessage,
} from "@/shared/lib/extract-error-message"
import type { DeveloperApplication } from "../types"

interface EditAppModalProps {
  isOpen: boolean
  onClose: () => void
  app: DeveloperApplication | null
  onSuccess: (updatedApp: DeveloperApplication) => void
}

interface FormValues {
  name: string
  redirect_uris: string
  allowed_origins: string
}

export function EditAppModal({
  isOpen,
  onClose,
  app,
  onSuccess,
}: EditAppModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      redirect_uris: "",
      allowed_origins: "",
    },
  })

  useEffect(() => {
    if (app) {
      reset({
        name: app.name || "",
        redirect_uris:
          app.redirect_uris_list?.length > 0
            ? app.redirect_uris_list.join("\n")
            : app.redirect_uris || "",
        allowed_origins:
          app.allowed_origins_list?.length > 0
            ? app.allowed_origins_list.join("\n")
            : app.allowed_origins || "",
      })
    }
  }, [app, reset])

  const handleFormSubmit = async (values: FormValues) => {
    if (!app) return
    setIsSubmitting(true)
    try {
      const redirectUris = values.redirect_uris.trim()
      const allowedOrigins = values.allowed_origins.trim()

      const updated = await updateDeveloperApplication(app.client_id, {
        name: values.name.trim(),
        redirect_uris: redirectUris,
        allowed_origins: allowedOrigins ? allowedOrigins : "",
      })

      toast.success("Application updated.")
      onSuccess(updated)
      onClose()
    } catch (error) {
      const hasFieldErrors = applyFormServerErrors<FormValues>(error, setError)
      if (!hasFieldErrors) {
        const msg = extractErrorMessage(error, "Failed to update application.")
        toast.error(msg)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={() => {
        if (!isSubmitting) onClose()
      }}
      title="Edit application"
      maxWidthClass="max-w-xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="edit-app-name"
            className="text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            Application name <span className="text-rose-500">*</span>
          </label>
          <input
            id="edit-app-name"
            type="text"
            {...register("name", {
              required: "Application name is required",
              minLength: { value: 3, message: "Name must be at least 3 characters" },
            })}
            className={`w-full rounded-xl border px-3.5 py-2 text-sm outline-none transition bg-white dark:bg-slate-900 ${
              errors.name
                ? "border-rose-500 focus:border-rose-600"
                : "border-black/10 dark:border-white/10 focus:border-slate-950 dark:focus:border-white"
            }`}
          />
          {errors.name && (
            <p className="text-xs text-rose-500 whitespace-pre-line mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="edit-redirect-uris"
            className="text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            Redirect URIs <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="edit-redirect-uris"
            rows={3}
            {...register("redirect_uris", {
              required: "At least one redirect URI is required",
            })}
            className={`w-full rounded-xl border px-3 py-2 font-mono text-xs outline-none transition bg-white dark:bg-slate-900 ${
              errors.redirect_uris
                ? "border-rose-500 focus:border-rose-600"
                : "border-black/10 dark:border-white/10 focus:border-slate-950 dark:focus:border-white"
            }`}
          />
          <p className="text-[11px] text-slate-400">
            One URL per line.
          </p>
          {errors.redirect_uris && (
            <p className="text-xs text-rose-500 whitespace-pre-line mt-1">
              {errors.redirect_uris.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="edit-allowed-origins"
            className="text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            Allowed origins <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="edit-allowed-origins"
            type="text"
            {...register("allowed_origins")}
            className={`w-full rounded-xl border px-3 py-2 text-xs outline-none transition bg-white dark:bg-slate-900 ${
              errors.allowed_origins
                ? "border-rose-500 focus:border-rose-600"
                : "border-black/10 dark:border-white/10 focus:border-slate-950 dark:focus:border-white"
            }`}
          />
          {errors.allowed_origins && (
            <p className="text-xs text-rose-500 whitespace-pre-line mt-1">
              {errors.allowed_origins.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-black/5 dark:border-white/5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="cursor-pointer text-xs h-9"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer bg-slate-950 text-white hover:bg-slate-800 text-xs h-9 gap-1.5"
          >
            {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
            <span>Save changes</span>
          </Button>
        </div>
      </form>
    </ModalShell>
  )
}
