"use client"

import { useState } from "react"
import { Check, Copy, Eye, EyeOff } from "lucide-react"
import { ModalShell } from "@/components/ui/modal-shell"
import { Button } from "@/components/ui/button"

interface SecretModalProps {
  isOpen: boolean
  onClose: () => void
  appName?: string
  clientId: string
  clientSecret: string
  customMessage?: string
}

export function SecretModal({
  isOpen,
  onClose,
  appName,
  clientId,
  clientSecret,
  customMessage,
}: SecretModalProps) {
  const [showSecret, setShowSecret] = useState(false)
  const [copiedId, setCopiedId] = useState(false)
  const [copiedSecret, setCopiedSecret] = useState(false)

  const handleCopyId = async () => {
    await navigator.clipboard.writeText(clientId)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  const handleCopySecret = async () => {
    await navigator.clipboard.writeText(clientSecret)
    setCopiedSecret(true)
    setTimeout(() => setCopiedSecret(false), 2000)
  }

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Client secret generated"
      maxWidthClass="max-w-lg"
      footerContent={
        <div className="flex items-center justify-end w-full">
          <Button
            type="button"
            className="cursor-pointer bg-slate-900 text-white hover:bg-slate-800 text-xs h-9"
            onClick={onClose}
          >
            I have saved the secret
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Warning banner */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
          <p className="font-semibold text-amber-900 dark:text-amber-100">
            Copy your secret now
          </p>
          <p className="mt-0.5 leading-relaxed text-[11px] opacity-90">
            {customMessage ||
              "For security, this secret will not be displayed again. Store it securely in your environment variables."}
          </p>
        </div>

        {appName && (
          <div>
            <span className="text-slate-400 font-medium">Application</span>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
              {appName}
            </p>
          </div>
        )}

        {/* Client ID */}
        <div className="space-y-1">
          <label className="font-medium text-slate-700 dark:text-slate-300">
            Client ID
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
              {clientId}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyId}
              className="shrink-0 h-9 gap-1.5 cursor-pointer text-xs"
            >
              {copiedId ? (
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

        {/* Client Secret */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="font-medium text-slate-700 dark:text-slate-300">
              Client Secret
            </label>
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              {showSecret ? (
                <>
                  <EyeOff className="size-3" />
                  <span>Hide</span>
                </>
              ) : (
                <>
                  <Eye className="size-3" />
                  <span>Reveal</span>
                </>
              )}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-amber-300/80 dark:border-amber-700/60 bg-amber-50/50 dark:bg-amber-950/20 px-3 py-2 font-mono text-xs text-amber-900 dark:text-amber-200 break-all select-all">
              {showSecret ? clientSecret : "•".repeat(Math.min(clientSecret.length, 36))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopySecret}
              className="shrink-0 h-9 gap-1.5 cursor-pointer text-xs border-amber-300 dark:border-amber-800 hover:bg-amber-50"
            >
              {copiedSecret ? (
                <>
                  <Check className="size-3 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3 text-amber-700 dark:text-amber-300" />
                  <span className="text-amber-900 dark:text-amber-200">
                    Copy secret
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </ModalShell>
  )
}
