"use client"

import { useState } from "react"
import type { DeveloperApplication } from "../types"
import {
  AVAILABLE_AGENTS,
  AgentSelector,
  ChatGptSetup,
  ClaudeSetup,
  SamplePrompts,
  type AgentOption,
} from "./mcp"

interface McpConnectionsProps {
  applications?: DeveloperApplication[]
}

export function McpConnections({ applications = [] }: McpConnectionsProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentOption>(AVAILABLE_AGENTS[0])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Connect Agents
        </h2>
        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
          Choose the AI assistant you use, then follow its steps. It gets the MCP servers and skills you&apos;ve connected to your PostGlee account.
        </p>
      </div>

      {/* Stepper Container */}
      <div className="relative pl-6">
        {/* Continuous vertical timeline connector line */}
        <div className="absolute left-[7px] top-3.5 bottom-6 w-px bg-slate-200 dark:bg-slate-800" />

        {/* STEP 1: Pick your agent */}
        <div className="relative pb-8">
          <div className="absolute -left-6 top-1.5 size-3.5 rounded-full bg-slate-950 dark:bg-white ring-4 ring-white dark:ring-slate-950" />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Pick your agent
            </h3>

            {/* Agent Cards */}
            <AgentSelector
              selectedAgent={selectedAgent}
              onSelect={setSelectedAgent}
            />
          </div>
        </div>

        {/* STEP 2: Set up [Selected Agent] */}
        <div className="relative">
          <div className="absolute -left-6 top-1.5 size-3.5 rounded-full border-2 border-slate-950 dark:border-white bg-white dark:bg-slate-950 ring-4 ring-white dark:ring-slate-950" />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Set up {selectedAgent.name}
            </h3>

            {/* Setup Container Card */}
            <div className="rounded-2xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900/80 p-6 shadow-2xs">
              {selectedAgent.id === "chatgpt" ? <ChatGptSetup /> : <ClaudeSetup />}
            </div>
          </div>
        </div>
      </div>

      {/* Example Prompts */}
      <SamplePrompts />
    </div>
  )
}
