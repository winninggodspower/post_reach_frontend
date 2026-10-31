"use client"

import { useState } from "react"
import { Check, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getApiBaseDomain } from "../api/developer-api"

export function McpConnections() {
  const [copiedEndpoint, setCopiedEndpoint] = useState(false)
  const [copiedConfig, setCopiedConfig] = useState(false)
  const [activePreset, setActivePreset] = useState<"claude" | "cursor" | "cli">("claude")

  const baseDomain = getApiBaseDomain()
  const mcpEndpoint = `${baseDomain}/mcp`

  const claudeConfigSnippet = JSON.stringify(
    {
      mcpServers: {
        postglee: {
          command: "npx",
          args: [
            "-y",
            "mcp-remote",
            mcpEndpoint,
            "--header",
            "Authorization: Bearer YOUR_OAUTH_TOKEN",
          ],
        },
      },
    },
    null,
    2,
  )

  const cursorConfigSnippet = JSON.stringify(
    {
      mcpServers: {
        postglee: {
          type: "sse",
          url: mcpEndpoint,
          headers: {
            Authorization: "Bearer YOUR_OAUTH_TOKEN",
          },
        },
      },
    },
    null,
    2,
  )

  const cliSnippet = `npx -y mcp-remote ${mcpEndpoint} --header "Authorization: Bearer YOUR_OAUTH_TOKEN"`

  const currentSnippet =
    activePreset === "claude"
      ? claudeConfigSnippet
      : activePreset === "cursor"
      ? cursorConfigSnippet
      : cliSnippet

  const handleCopyEndpoint = async () => {
    await navigator.clipboard.writeText(mcpEndpoint)
    setCopiedEndpoint(true)
    setTimeout(() => setCopiedEndpoint(false), 2000)
  }

  const handleCopyConfig = async () => {
    await navigator.clipboard.writeText(currentSnippet)
    setCopiedConfig(true)
    setTimeout(() => setCopiedConfig(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Intro Box */}
      <div className="rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900 p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Model Context Protocol (MCP)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Connect Claude Desktop, Cursor, and custom AI agents directly to PostGlee to view brands, schedule posts, and manage your content calendar.
            </p>
          </div>

          <a
            href="https://modelcontextprotocol.io"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/10 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition shrink-0"
          >
            <span>Protocol documentation</span>
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>

      {/* Endpoint Box */}
      <div className="rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Remote MCP Endpoint (SSE / POST)
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-950 px-3 py-2 font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
            {mcpEndpoint}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyEndpoint}
            className="shrink-0 h-9 gap-1.5 cursor-pointer text-xs"
          >
            {copiedEndpoint ? (
              <>
                <Check className="size-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-medium">Copied</span>
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

      {/* Configuration Snippet Generator */}
      <div className="rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Client Configuration
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Add this block to your MCP client config file.
            </p>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
            <button
              type="button"
              onClick={() => setActivePreset("claude")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
                activePreset === "claude"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Claude Desktop
            </button>
            <button
              type="button"
              onClick={() => setActivePreset("cursor")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
                activePreset === "cursor"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Cursor
            </button>
            <button
              type="button"
              onClick={() => setActivePreset("cli")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
                activePreset === "cli"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              CLI / Agent
            </button>
          </div>
        </div>

        {/* Code Snippet */}
        <div className="relative group">
          <pre className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-950 p-4 font-mono text-xs text-slate-100 overflow-x-auto leading-relaxed">
            <code>{currentSnippet}</code>
          </pre>
          <Button
            type="button"
            size="sm"
            onClick={handleCopyConfig}
            className="absolute top-3 right-3 h-7 text-xs gap-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 text-white"
          >
            {copiedConfig ? (
              <>
                <Check className="size-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>

        {/* Setup Steps */}
        <div className="pt-2 border-t border-black/5 dark:border-white/5">
          <ol className="space-y-1.5 text-xs text-slate-500 list-decimal list-inside leading-relaxed">
            <li>
              Generate an access token using your confidential application or OAuth authorization flow.
            </li>
            <li>
              {activePreset === "claude" ? (
                <span>
                  Paste the snippet into{" "}
                  <code className="rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                    claude_desktop_config.json
                  </code>{" "}
                  under <code className="font-mono">mcpServers</code>.
                </span>
              ) : activePreset === "cursor" ? (
                <span>
                  Configure Cursor under Settings &gt; Features &gt; MCP or in{" "}
                  <code className="rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                    .cursor/mcp.json
                  </code>
                  .
                </span>
              ) : (
                <span>
                  Run the CLI command or spawn <code className="font-mono">mcp-remote</code> in your pipeline.
                </span>
              )}
            </li>
            <li>
              Restart your client and ask Claude or Cursor to view scheduled posts or publish updates.
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
