"use client"

import { useState } from "react"
import { Check, ChevronRight, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CLAUDE_CONNECTOR_URL, MCP_ENDPOINT } from "./types"

export function ClaudeSetup() {
  const [isOtherWaysOpen, setIsOtherWaysOpen] = useState(false)
  const [copiedEndpoint, setCopiedEndpoint] = useState(false)
  const [copiedSnippet, setCopiedSnippet] = useState(false)

  const handleCopyEndpoint = async () => {
    try {
      await navigator.clipboard.writeText(MCP_ENDPOINT)
      setCopiedEndpoint(true)
      toast.success("Endpoint URL copied to clipboard")
      setTimeout(() => setCopiedEndpoint(false), 2000)
    } catch {
      toast.error("Failed to copy URL")
    }
  }

  const claudeDesktopConfigJson = JSON.stringify(
    {
      mcpServers: {
        postglee: {
          command: "npx",
          args: ["-y", "mcp-remote", MCP_ENDPOINT],
        },
      },
    },
    null,
    2,
  )

  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(claudeDesktopConfigJson)
      setCopiedSnippet(true)
      toast.success("Configuration snippet copied to clipboard")
      setTimeout(() => setCopiedSnippet(false), 2000)
    } catch {
      toast.error("Failed to copy snippet")
    }
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Open Connectors */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-5 items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            1
          </span>
          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Open Claude Connectors
          </h4>
        </div>

        <p className="text-xs text-slate-500 pl-7.5 leading-relaxed">
          Open the Claude connector management page in your browser:
        </p>

        <div className="pl-7.5">
          <a
            href={CLAUDE_CONNECTOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto min-w-[200px] h-9 px-4 bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-medium text-xs rounded-xl shadow-2xs cursor-pointer inline-flex items-center justify-center gap-2 transition"
          >
            <span>Add to Claude</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      {/* Step 2: Add Custom Connector */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-5 items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            2
          </span>
          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Add custom connector & paste server URL
          </h4>
        </div>

        <p className="text-xs text-slate-500 pl-7.5 leading-relaxed">
          In Claude, click <strong>Add connector</strong>, choose <strong>Custom connector</strong>, set the name to <code className="font-mono text-slate-700 dark:text-slate-300">PostGlee</code>, and paste the MCP server URL:
        </p>

        {/* Quick Copy Endpoint */}
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
              {copiedEndpoint ? (
                <>
                  <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy URL</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Step 3: Connect and approve */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <span className="flex size-5 items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            3
          </span>
          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Connect and approve
          </h4>
        </div>
        <p className="text-xs text-slate-500 pl-7.5 leading-relaxed">
          Select <strong>Connect</strong> and approve the authorization window that opens. To change permissions or workspace accounts later, simply reconnect.
        </p>
      </div>

      {/* Collapsible Manual Setup */}
      <div className="pt-2 border-t border-black/5 dark:border-white/5">
        <button
          type="button"
          onClick={() => setIsOtherWaysOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition cursor-pointer"
        >
          <ChevronRight
            className={`size-3.5 transition-transform duration-200 ${
              isOtherWaysOpen ? "rotate-90" : ""
            }`}
          />
          <span>Other ways to set up (Claude Desktop config)</span>
        </button>

        {isOtherWaysOpen && (
          <div className="mt-3 pl-5 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <p className="text-xs text-slate-500 leading-relaxed">
              If you use Claude Desktop instead of the web app, add PostGlee to your <code className="font-mono text-slate-700 dark:text-slate-300">claude_desktop_config.json</code>:
            </p>

            <div className="relative group">
              <pre className="rounded-xl border border-black/8 dark:border-white/8 bg-slate-950 p-4 font-mono text-xs text-slate-100 overflow-x-auto leading-relaxed">
                <code>{claudeDesktopConfigJson}</code>
              </pre>
              <Button
                type="button"
                size="sm"
                onClick={handleCopySnippet}
                className="absolute top-2.5 right-2.5 h-7 text-xs gap-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 text-white"
              >
                {copiedSnippet ? (
                  <>
                    <Check className="size-3 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Copy JSON</span>
                  </>
                )}
              </Button>
            </div>
            <p className="text-[11px] text-slate-400">
              Config paths: macOS (<code className="font-mono">~/Library/Application Support/Claude/claude_desktop_config.json</code>) or Windows (<code className="font-mono">%APPDATA%\Claude\claude_desktop_config.json</code>).
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
