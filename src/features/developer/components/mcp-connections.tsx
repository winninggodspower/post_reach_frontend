"use client"

import { useState } from "react"
import { Check, Copy, ExternalLink, HelpCircle, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getApiBaseDomain } from "../api/developer-api"
import type { DeveloperApplication } from "../types"

interface McpConnectionsProps {
  applications?: DeveloperApplication[]
}

export function McpConnections({ applications = [] }: McpConnectionsProps) {
  const [copiedEndpoint, setCopiedEndpoint] = useState(false)
  const [copiedConfig, setCopiedConfig] = useState(false)
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null)
  const [activePreset, setActivePreset] = useState<"claude" | "cursor" | "cli">("claude")
  const [userToken, setUserToken] = useState("")

  const baseDomain = getApiBaseDomain()
  const mcpEndpoint = `${baseDomain}/mcp`
  const tokenValue = userToken.trim() || "YOUR_OAUTH_TOKEN"

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
            `Authorization: Bearer ${tokenValue}`,
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
            Authorization: `Bearer ${tokenValue}`,
          },
        },
      },
    },
    null,
    2,
  )

  const cliSnippet = `npx -y mcp-remote ${mcpEndpoint} --header "Authorization: Bearer ${tokenValue}"`

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

  const samplePrompts = [
    "What social media accounts are connected to my PostGlee brand?",
    "Show me all posts scheduled on our calendar for this upcoming week.",
    "Draft a celebratory post for Twitter and LinkedIn and schedule it for Friday at 10 AM.",
  ]

  const handleCopyPrompt = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedPromptIndex(index)
    setTimeout(() => setCopiedPromptIndex(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Beginner-friendly Explainer */}
      <div className="rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900 p-5 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Control PostGlee with AI (Claude Desktop & Cursor)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
              Model Context Protocol (MCP) connects desktop AI assistants directly to PostGlee. Once connected, your AI assistant can review your schedule, suggest content, and publish or reschedule posts on your behalf.
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

      {/* Step-by-Step Setup */}
      <div className="rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900 p-5 space-y-5 shadow-2xs">
        {/* Step 1: Token */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-bold">
              1
            </span>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Provide your OAuth Access Token
            </h4>
          </div>
          <p className="text-xs text-slate-500 pl-7">
            Paste your access token below to automatically customize the configuration snippet with your credentials.
          </p>
          <div className="pl-7 max-w-lg">
            <input
              type="text"
              value={userToken}
              onChange={(e) => setUserToken(e.target.value)}
              placeholder="Paste your OAuth access token (or leave default)..."
              className="w-full rounded-xl border border-black/10 dark:border-white/10 px-3 py-2 text-xs font-mono outline-none transition focus:border-slate-950 dark:focus:border-white bg-slate-50 dark:bg-slate-950"
            />
          </div>
        </div>

        {/* Step 2: Choose Client & Copy Configuration */}
        <div className="space-y-3 pt-3 border-t border-black/5 dark:border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-bold">
                2
              </span>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Copy your client configuration snippet
              </h4>
            </div>

            {/* Tool Selector Tabs */}
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
              <button
                type="button"
                onClick={() => setActivePreset("claude")}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
                  activePreset === "claude"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold"
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
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold"
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
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                CLI / Terminal
              </button>
            </div>
          </div>

          {/* Snippet box */}
          <div className="relative group pl-7">
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
                  <span>Copy Snippet</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Step 3: Clear Instructions */}
        <div className="space-y-2 pt-3 border-t border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-bold">
              3
            </span>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              How to install in {activePreset === "claude" ? "Claude Desktop" : activePreset === "cursor" ? "Cursor" : "your agent"}
            </h4>
          </div>

          <div className="pl-7 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            {activePreset === "claude" && (
              <div className="space-y-1.5 leading-relaxed bg-slate-50/70 dark:bg-slate-950 p-3.5 rounded-xl border border-black/5 dark:border-white/5">
                <p>
                  1. Open <strong>Claude Desktop</strong> on your computer.
                </p>
                <p>
                  2. In the top application menu bar, go to <strong>Claude</strong> &gt; <strong>Settings...</strong> &gt; <strong>Developer</strong> and click <strong>Edit Config</strong>.
                </p>
                <p className="text-slate-400 text-[11px]">
                  (This automatically opens your <code className="font-mono">claude_desktop_config.json</code> in your text editor).
                </p>
                <p>
                  3. Paste the snippet you copied in Step 2 into the file, save, and close the editor.
                </p>
                <p>
                  4. Completely <strong>quit and restart Claude Desktop</strong>. A small plug or tools icon will appear in the prompt bar, confirming PostGlee is active!
                </p>
              </div>
            )}

            {activePreset === "cursor" && (
              <div className="space-y-1.5 leading-relaxed bg-slate-50/70 dark:bg-slate-950 p-3.5 rounded-xl border border-black/5 dark:border-white/5">
                <p>
                  1. Open Cursor and go to <strong>Settings</strong> (gear icon or press <code className="font-mono">Cmd + ,</code> / <code className="font-mono">Ctrl + ,</code>).
                </p>
                <p>
                  2. In the settings search bar, find <strong>MCP</strong> or navigate to <strong>Features &gt; MCP</strong>.
                </p>
                <p>
                  3. Click <strong>Add New MCP Server</strong>:
                </p>
                <ul className="list-disc list-inside pl-2 space-y-0.5 text-slate-500">
                  <li>Name: <code className="font-mono text-slate-700 dark:text-slate-300">postglee</code></li>
                  <li>Type: <code className="font-mono text-slate-700 dark:text-slate-300">SSE</code></li>
                  <li>Server URL: <code className="font-mono text-slate-700 dark:text-slate-300">{mcpEndpoint}</code></li>
                </ul>
                <p>
                  4. Save the configuration and start asking Cursor Composer to interact with PostGlee.
                </p>
              </div>
            )}

            {activePreset === "cli" && (
              <div className="space-y-1.5 leading-relaxed bg-slate-50/70 dark:bg-slate-950 p-3.5 rounded-xl border border-black/5 dark:border-white/5">
                <p>
                  Run the command from Step 2 directly in your terminal or integrate it into your custom agent pipeline using <code className="font-mono">npx -y mcp-remote</code>.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Remote Endpoint Reference */}
        <div className="pt-2 border-t border-black/5 dark:border-white/5 pl-7 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-slate-400">
            Raw MCP URL: <code className="font-mono text-slate-700 dark:text-slate-300">{mcpEndpoint}</code>
          </span>
          <button
            type="button"
            onClick={handleCopyEndpoint}
            className="text-xs text-blue-600 hover:underline cursor-pointer flex items-center gap-1 self-start sm:self-auto"
          >
            {copiedEndpoint ? <Check className="size-3" /> : <Copy className="size-3" />}
            <span>{copiedEndpoint ? "Copied URL" : "Copy raw URL"}</span>
          </button>
        </div>
      </div>

      {/* Example Prompts Card */}
      <div className="rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-2xs">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <MessageSquare className="size-4 text-blue-600 dark:text-blue-400" />
            <span>Example Prompts to Try</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Once connected, try asking your AI assistant any of these requests:
          </p>
        </div>

        <div className="space-y-2">
          {samplePrompts.map((prompt, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 p-3 rounded-xl border border-black/6 dark:border-white/6 bg-slate-50/60 dark:bg-slate-950 text-xs"
            >
              <span className="text-slate-800 dark:text-slate-200">
                "{prompt}"
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleCopyPrompt(prompt, idx)}
                className="h-7 text-xs text-slate-400 hover:text-slate-800 cursor-pointer shrink-0 gap-1"
              >
                {copiedPromptIndex === idx ? (
                  <>
                    <Check className="size-3 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
