"use client"

import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export interface ComposerHeaderProps {
  title: string
  subtitle: string
  onBack?: () => void
  onPublish: () => void
  isPublishing?: boolean
  isScheduled?: boolean
  isEditMode?: boolean
  disabled?: boolean
  publishButtonText?: string
}

export function ComposerHeader({
  title,
  subtitle,
  onBack,
  onPublish,
  isPublishing = false,
  isScheduled = false,
  isEditMode = false,
  disabled = false,
  publishButtonText,
}: ComposerHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.push("/dashboard/posts")
    }
  }

  const getButtonLabel = () => {
    if (publishButtonText) return publishButtonText
    if (isPublishing) {
      return isEditMode ? "Updating..." : "Publishing..."
    }
    if (isEditMode) return "Update Post"
    return isScheduled ? "Schedule Post" : "Publish Now"
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 transition cursor-pointer"
          aria-label="Back to selection"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Action Header publish shortcut */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled || isPublishing}
          onClick={onPublish}
          className="px-5 py-2 text-xs font-semibold rounded-xl bg-linear-to-r from-accent-dark to-accent-brand text-white shadow-md hover:brightness-105 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {getButtonLabel()}
        </button>
      </div>
    </div>
  )
}
