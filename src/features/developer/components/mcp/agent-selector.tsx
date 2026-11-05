"use client"

import React from "react"
import type { AgentOption } from "./types"
import { ClaudeIcon, OpenAIIcon } from "./agent-icons"

export const AVAILABLE_AGENTS: AgentOption[] = [
  {
    id: "claude-desktop",
    name: "Claude Desktop",
    icon: ClaudeIcon,
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: OpenAIIcon,
  },
]

interface AgentSelectorProps {
  selectedAgent: AgentOption
  onSelect: (agent: AgentOption) => void
}

export function AgentSelector({ selectedAgent, onSelect }: AgentSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {AVAILABLE_AGENTS.map((agent) => {
        const isSelected = selectedAgent.id === agent.id
        const IconComponent = agent.icon
        return (
          <button
            key={agent.id}
            type="button"
            onClick={() => onSelect(agent)}
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer ${
              isSelected
                ? "border-2 border-slate-950 dark:border-white bg-white dark:bg-slate-900 shadow-2xs"
                : "border border-black/8 dark:border-white/8 bg-white/70 dark:bg-slate-900/50 hover:border-black/15 dark:hover:border-white/15 hover:bg-white dark:hover:bg-slate-900"
            }`}
          >
            <IconComponent />
            <span
              className={`text-xs ${
                isSelected
                  ? "font-semibold text-slate-950 dark:text-white"
                  : "font-medium text-slate-600 dark:text-slate-300"
              }`}
            >
              {agent.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}

