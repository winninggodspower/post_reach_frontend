"use client"

import * as React from "react"
import { X } from "lucide-react"

type ModalShellProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  showPulseAccent?: boolean
  maxWidthClass?: string // e.g. "max-w-2xl", "max-w-md"
  children: React.ReactNode
  footerContent?: React.ReactNode
}

export function ModalShell({
  isOpen,
  onClose,
  title,
  showPulseAccent = false,
  maxWidthClass = "max-w-lg",
  children,
  footerContent,
}: ModalShellProps) {
  // Listen for escape key press to close modal
  React.useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs animate-fade-in overflow-y-auto p-4 md:p-6 m-0"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full ${maxWidthClass} overflow-hidden border border-slate-200 dark:border-slate-800 transition-all flex flex-col my-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            {showPulseAccent && (
              <span className="size-2 rounded-full bg-accent-brand animate-pulse" />
            )}
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {children}
        </div>

        {/* Footer */}
        {footerContent && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
            {footerContent}
          </div>
        )}
      </div>
    </div>
  )
}
