"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Copy, ArrowRight, ExternalLink } from "lucide-react"
import { ClaudeIcon, OpenAIIcon } from "@/features/developer/components/mcp/agent-icons"
import { CLAUDE_CONNECTOR_URL, MCP_ENDPOINT } from "@/features/developer/components/mcp/types"

export type AgentKey = "claude" | "chatgpt" | "cursor"

export interface AgentData {
  key: AgentKey
  name: string
  icon: React.ReactNode
  title: string
  steps: { title: string; desc: string }[]
  buttonText: string
  buttonHref?: string
  buttonAction?: "link" | "copy"
  assistantTitle: string
  assistantAvatar: React.ReactNode
  samplePrompt: string
  tools: { name: string; arg: string }[]
  replyText: string
}

function CursorIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l16 5.33-7.56 2.67-2.67 7.56L4 4z" />
      <path d="M12.44 12.44L20 20" />
    </svg>
  )
}

const AGENTS: Record<AgentKey, AgentData> = {
  claude: {
    key: "claude",
    name: "Claude",
    icon: <ClaudeIcon className="size-3.5" />,
    title: "Connect PostGlee to Claude",
    steps: [
      {
        title: "Click “Add to Claude” below",
        desc: "Opens Claude's connector settings directly in your browser (claude.ai/customize/connectors).",
      },
      {
        title: "Add Custom Connector",
        desc: "Click “Add connector” → “Custom connector”, enter PostGlee, and paste your server URL.",
      },
      {
        title: "Sign in and Start Posting",
        desc: "Authorize with your PostGlee account. Claude is ready to write, draft, and publish.",
      },
    ],
    buttonText: "Add to Claude",
    buttonHref: CLAUDE_CONNECTOR_URL,
    buttonAction: "link",
    assistantTitle: "Claude",
    assistantAvatar: <ClaudeIcon className="size-4" />,
    samplePrompt: "Post this launch image to Instagram, LinkedIn, and X with our announcement caption.",
    tools: [
      { name: "upload_media", arg: "launch.png" },
      { name: "create_post", arg: "3 channels" },
    ],
    replyText: "Done! Published to Instagram, LinkedIn, and X with your image and formatted tags.",
  },
  chatgpt: {
    key: "chatgpt",
    name: "ChatGPT",
    icon: <OpenAIIcon className="size-3.5 text-slate-800" />,
    title: "Connect PostGlee to ChatGPT",
    steps: [
      {
        title: "Open Connected Apps",
        desc: "In ChatGPT, navigate to Settings > Connected apps and click Add (+).",
      },
      {
        title: "Paste Server URL",
        desc: "Paste your PostGlee MCP endpoint and select OAuth for authentication.",
      },
      {
        title: "Post & Automate",
        desc: "Ask ChatGPT to draft, schedule, and publish posts across all accounts.",
      },
    ],
    buttonText: "Copy Server URL",
    buttonAction: "copy",
    assistantTitle: "ChatGPT",
    assistantAvatar: <OpenAIIcon className="size-4 text-slate-800" />,
    samplePrompt: "Draft an announcement for our new feature and post it with this image across X and LinkedIn.",
    tools: [
      { name: "upload_media", arg: "product.png" },
      { name: "create_post", arg: "X & LinkedIn" },
    ],
    replyText: "Drafted and published natively to X and LinkedIn with your product image attached!",
  },
  cursor: {
    key: "cursor",
    name: "Cursor",
    icon: <CursorIcon className="size-3.5 text-blue-600" />,
    title: "Connect PostGlee to Cursor",
    steps: [
      {
        title: "Open Cursor Settings",
        desc: "Go to Cursor Settings > Features > MCP and click “Add New MCP Server”.",
      },
      {
        title: "Add Server URL",
        desc: "Select HTTP/SSE and paste the PostGlee MCP endpoint URL.",
      },
      {
        title: "Publish from Editor",
        desc: "Ship a feature in your codebase and prompt Cursor to post the announcement.",
      },
    ],
    buttonText: "Copy Server URL",
    buttonAction: "copy",
    assistantTitle: "Cursor Composer",
    assistantAvatar: <CursorIcon className="size-4 text-blue-600" />,
    samplePrompt: "Post this release changelog and screenshot across X and LinkedIn.",
    tools: [
      { name: "upload_media", arg: "changelog.png" },
      { name: "create_post", arg: "X & LinkedIn" },
    ],
    replyText: "Changelog posted to X and LinkedIn with your release screenshot attached!",
  },
}

export function McpSetupInstructions() {
  const [selectedAgent, setSelectedAgent] = useState<AgentKey>("claude")
  const [copied, setCopied] = useState(false)
  const agent = AGENTS[selectedAgent]

  const handleCopyEndpoint = async () => {
    try {
      await navigator.clipboard.writeText(MCP_ENDPOINT)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <section id="mcp-setup" className="relative px-6 py-16 md:py-24 bg-slate-50/50 border-t border-slate-200/80 overflow-hidden">
      {/* Subtle ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-400/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* Header - Stays strictly on one line on desktop/tablets */}
        <div className="text-center max-w-4xl mx-auto mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-black tracking-tight leading-tight sm:whitespace-nowrap">
            Connect your agent in <span className="font-playfair italic font-medium text-accent-brand">minutes</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base mt-2 max-w-xl mx-auto leading-relaxed">
            Pick your assistant below to see the exact setup steps and what drafting and posting looks like live.
          </p>
        </div>

        {/* Framer Motion Sliding Pill Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-full bg-slate-200/70 border border-slate-300/60 shadow-inner max-w-full overflow-x-auto scrollbar-none">
            {(Object.keys(AGENTS) as AgentKey[]).map((key) => {
              const item = AGENTS[key]
              const isActive = selectedAgent === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSelectedAgent(key)
                    setCopied(false)
                  }}
                  className="relative inline-flex items-center gap-2 px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm whitespace-nowrap cursor-pointer select-none transition-colors duration-200"
                >
                  {/* Sliding active pill indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="activeMcpTab"
                      className="absolute inset-0 rounded-full bg-white shadow-sm"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {item.icon}
                    <span className={isActive ? "text-slate-900 font-semibold" : "text-slate-600 hover:text-slate-900 font-medium"}>
                      {item.name}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Side-by-Side Cards (Equal Height Grid with Hanging 3D Perspective) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch [perspective:1400px]">
          
          {/* Left Card: Setup Steps & Action Button */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={`left-${selectedAgent}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                    {agent.title}
                  </h3>
                </div>

                {/* Numbered Steps */}
                <div className="space-y-3">
                  {agent.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="size-5 rounded-full bg-orange-50 text-accent-dark font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-orange-200/80">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
                          {step.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Server URL Box */}
                <div className="pt-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 font-medium">
                    <span>Server Endpoint URL</span>
                    <span className="text-orange-600 font-semibold">PostGlee MCP</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/90 px-3 py-2 hover:border-orange-200 transition-colors">
                    <span className="font-mono text-[11px] text-slate-700 select-all truncate mr-2">
                      {MCP_ENDPOINT}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyEndpoint}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 hover:text-orange-700 shrink-0 cursor-pointer bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs hover:bg-orange-50/50 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="size-3 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Action CTA Button */}
            <div className="pt-6">
              {agent.buttonAction === "link" && agent.buttonHref ? (
                <a
                  href={agent.buttonHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-orange-300 w-full inline-flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-semibold cursor-pointer shadow-sm group"
                >
                  <span>{agent.buttonText}</span>
                  <ExternalLink className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={handleCopyEndpoint}
                  className="btn-primary hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-orange-300 w-full inline-flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-semibold cursor-pointer shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check className="size-4" />
                      <span>Endpoint URL Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" />
                      <span>{agent.buttonText}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right Card: Simulated Assistant Chat Window with Hanging / Slightly Bent 3D Tilt */}
          <div className="rounded-3xl border border-slate-200/90 bg-white flex flex-col justify-between shadow-[0_24px_50px_-12px_rgba(0,0,0,0.09),0_8px_20px_-6px_rgba(0,0,0,0.03)] hover:shadow-2xl md:[transform:rotateX(2.5deg)_rotateY(-3.5deg)_rotateZ(1.2deg)] md:hover:[transform:rotateX(0deg)_rotateY(0deg)_rotateZ(0deg)] transition-all duration-500 ease-out overflow-hidden">
            {/* macOS Window Chrome Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50/90 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#FF5F56]" />
                <span className="size-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="size-2.5 rounded-full bg-[#27C93F]" />
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                {agent.icon}
                <span>{agent.assistantTitle}</span>
              </div>

              {/* Real-time Status with Subtle Ping Indicator */}
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70 flex items-center gap-1.5 shadow-2xs">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                </span>
                Connected
              </span>
            </div>

            {/* Chat Body - Staggered Framer Motion Reveal */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`chat-${selectedAgent}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="p-6 sm:p-7 space-y-4 text-left flex-1 flex flex-col justify-center"
              >
                {/* User Message Bubble */}
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, delay: 0.04 }}
                  className="flex justify-end"
                >
                  <div className="max-w-[88%] bg-orange-50 border border-orange-200/70 text-slate-800 rounded-2xl rounded-tr-xs px-4 py-3 text-xs sm:text-[13px] leading-relaxed shadow-2xs">
                    {agent.samplePrompt}
                  </div>
                </motion.div>

                {/* Tool Execution Chips with subtle spring entrance */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="flex flex-wrap items-center gap-2 py-1"
                >
                  {agent.tools.map((tool, i) => (
                    <div
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200 hover:border-orange-200 hover:bg-orange-50/30 text-slate-700 text-[11px] font-mono shadow-2xs transition-colors"
                    >
                      <span className="size-1.5 rounded-full bg-accent-brand animate-pulse" />
                      <span className="font-semibold text-slate-900">{tool.name}</span>
                      <span className="text-slate-500 font-normal">{tool.arg}</span>
                      <Check className="size-3 text-emerald-600 stroke-[3]" />
                    </div>
                  ))}
                </motion.div>

                {/* Assistant Response with Avatar */}
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, delay: 0.16 }}
                  className="flex items-start gap-2.5 pt-1"
                >
                  <div className="size-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    {agent.assistantAvatar}
                  </div>
                  <div className="max-w-[85%] bg-slate-50 border border-slate-200/80 text-slate-700 rounded-2xl rounded-tl-xs px-4 py-3 text-xs sm:text-[13px] leading-relaxed shadow-2xs">
                    {agent.replyText}
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Footer strip */}
            <div className="px-6 py-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Model Context Protocol (MCP)</span>
              <Link
                href="/dashboard/developer"
                className="font-medium text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 transition-colors"
              >
                <span>Developer Portal</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
