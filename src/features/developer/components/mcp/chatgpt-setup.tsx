"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { MCP_ENDPOINT } from "./types"

export function ChatGptSetup() {
  const [copied, setCopied] = useState(false)

  const handleCopyEndpoint = async () => {
    try {
      await navigator.clipboard.writeText(MCP_ENDPOINT)
      setCopied(true)
      toast.success("Endpoint URL copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy URL")
    }
  }

  return (
    <div className="space-y-6">
      {/* Step 1 */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <span className="flex size-5 items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            1
          </span>
          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Open Plugins
          </h4>
        </div>
        <p className="text-xs text-slate-500 pl-7.5 leading-relaxed">
          In ChatGPT on the web, go to <strong>Settings</strong> &gt; <strong>Connected apps</strong> (or <strong>Plugins</strong>) and select <strong>Add (+)</strong>.
        </p>
      </div>

      {/* Step 2 */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-5 items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            2
          </span>
          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Add custom MCP server
          </h4>
        </div>
        <p className="text-xs text-slate-500 pl-7.5 leading-relaxed">
          Paste the server URL. Choose OAuth for authentication, then select Create as a plugin.
        </p>

        {/* URL Box */}
        <div className="pl-7.5">
          <div className="flex items-center justify-between rounded-xl border border-black/8 dark:border-white/8 bg-slate-50/80 dark:bg-slate-950 px-3.5 py-2">
            <span className="font-mono text-xs text-slate-800 dark:text-slate-200 select-all truncate mr-2">
              {MCP_ENDPOINT}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopyEndpoint}
              className="h-7 px-2.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer shrink-0 gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
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
      </div>

      {/* Step 3 */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <span className="flex size-5 items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            3
          </span>
          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Connect to MCP
          </h4>
        </div>
        <p className="text-xs text-slate-500 pl-7.5 leading-relaxed">
          Select Connect and complete the PostGlee authentication flow.
        </p>
      </div>
    </div>
  )
}

