"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { ModalShell } from "@/components/ui/modal-shell"
import { Button } from "@/components/ui/button"
import { createDeveloperApplication } from "../api/developer-api"
import {
  applyFormServerErrors,
  extractErrorMessage,
} from "@/shared/lib/extract-error-message"
import type {
  ClientType,
  DeveloperApplication,
} from "../types"

interface CreateAppModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (app: DeveloperApplication) => void
}

interface FormValues {
  name: string
  client_type: ClientType
  redirect_uris: string
  allowed_origins: string
}

export function CreateAppModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateAppModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      client_type: "confidential",
      redirect_uris: "",
      allowed_origins: "",
    },
  })

  const selectedClientType = watch("client_type")

  const handleFormSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      const redirectUris = values.redirect_uris.trim()
      const allowedOrigins = values.allowed_origins.trim()

      const createdApp = await createDeveloperApplication({
        name: values.name.trim(),
        client_type: values.client_type,
        redirect_uris: redirectUris,
        allowed_origins: allowedOrigins ? allowedOrigins : undefined,
      })

      toast.success("Application created.")
      reset()
      onSuccess(createdApp)
    } catch (error) {
      const hasFieldErrors = applyFormServerErrors<FormValues>(error, setError)
      if (!hasFieldErrors) {
        const msg = extractErrorMessage(error, "Failed to create application.")
        toast.error(msg)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModalClose = () => {
    if (!isSubmitting) {
      reset()
      onClose()
    }
  }

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Create application"
      maxWidthClass="max-w-xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Name */}
        <div className="space-y-1">
          <label
            htmlFor="app-name"
            className="text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            Application name <span className="text-rose-500">*</span>
          </label>
          <input
            id="app-name"
            type="text"
            placeholder="e.g. Social Bot, My AI Agent"
            {...register("name", {
              required: "Application name is required",
              minLength: { value: 3, message: "Name must be at least 3 characters" },
            })}
            className={`w-full rounded-xl border px-3.5 py-2 text-sm outline-none transition bg-white dark:bg-slate-900 ${errors.name
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

        {/* Client Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Client type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setValue("client_type", "confidential")}
              className={`flex flex-col text-left p-3 rounded-xl border transition cursor-pointer ${selectedClientType === "confidential"
                  ? "border-slate-900 bg-slate-50 dark:border-white dark:bg-slate-800"
                  : "border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 hover:border-slate-400"
                }`}
            >
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Confidential
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                For backend servers, AI tools & daemons. Generates a Client Secret.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setValue("client_type", "public")}
              className={`flex flex-col text-left p-3 rounded-xl border transition cursor-pointer ${selectedClientType === "public"
                  ? "border-slate-900 bg-slate-50 dark:border-white dark:bg-slate-800"
                  : "border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 hover:border-slate-400"
                }`}
            >
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Public
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                For SPAs, mobile or desktop apps using PKCE. No client secret.
              </p>
            </button>
          </div>
        </div>

        {/* Redirect URIs */}
        <div className="space-y-1">
          <label
            htmlFor="redirect-uris"
            className="text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            Redirect URIs <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="redirect-uris"
            rows={3}
            placeholder={`https://chatgpt.com/aip/callback\nhttps://example.com/oauth/callback`}
            {...register("redirect_uris", {
              required: "At least one redirect URI is required",
            })}
            className={`w-full rounded-xl border px-3 py-2 font-mono text-xs outline-none transition bg-white dark:bg-slate-900 ${errors.redirect_uris
                ? "border-rose-500 focus:border-rose-600"
                : "border-black/10 dark:border-white/10 focus:border-slate-950 dark:focus:border-white"
              }`}
          />
          <p className="text-[11px] text-slate-400">
            One URL per line. Must be HTTPS or localhost.
          </p>
          {errors.redirect_uris && (
            <p className="text-xs text-rose-500 whitespace-pre-line mt-1">
              {errors.redirect_uris.message}
            </p>
          )}
        </div>

        {/* Allowed Origins */}
        <div className="space-y-1">
          <label
            htmlFor="allowed-origins"
            className="text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            Allowed origins <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="allowed-origins"
            type="text"
            placeholder="https://example.com"
            {...register("allowed_origins")}
            className={`w-full rounded-xl border px-3 py-2 text-xs outline-none transition bg-white dark:bg-slate-900 ${errors.allowed_origins
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

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-black/5 dark:border-white/5">
          <Button
            type="button"
            variant="outline"
            onClick={handleModalClose}
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
            <span>Create application</span>
          </Button>
        </div>
      </form>
    </ModalShell>
  )
}
