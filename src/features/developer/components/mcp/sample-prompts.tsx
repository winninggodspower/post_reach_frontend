"use client"

import { useState } from "react"
import {
  CalendarDays,
  Check,
  Copy,
  Layers,
  PenTool,
  SlidersHorizontal,
} from "lucide-react"
import { toast } from "sonner"

interface CreativePrompt {
  id: string
  title: string
  category: string
  icon: React.ComponentType<{ className?: string }>
  badgeClass: string
  hoverBorder: string
  prompt: string
}

const CREATIVE_PROMPTS: CreativePrompt[] = [
  {
    id: "brand-voice",
    title: "Match My Writing Style",
    category: "Brand Voice",
    icon: PenTool,
    badgeClass:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    hoverBorder: "hover:border-orange-500/30",
    prompt:
      "From all the information you have about my brand and my previous posts on PostGlee, analyze my writing style and come up with 3 fresh post ideas for tomorrow using my exact tone and voice.",
  },
  {
    id: "calendar-audit",
    title: "Fill Schedule Gaps",
    category: "Calendar Audit",
    icon: CalendarDays,
    badgeClass:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    hoverBorder: "hover:border-blue-500/30",
    prompt:
      "Review my past posts and find open gaps on our calendar for this upcoming week. Draft tailored, high-hook posts to fill those slots and prepare them for scheduling.",
  },
  {
    id: "repurpose",
    title: "Multi-Platform Repurpose",
    category: "Repurposing",
    icon: Layers,
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    hoverBorder: "hover:border-emerald-500/30",
    prompt:
      "Look at my connected accounts and turn this raw milestone note into distinct, platform-optimized drafts for X, LinkedIn, and Instagram, matching the best format for each.",
  },
  {
    id: "queue-optimization",
    title: "Audit Upcoming Queue",
    category: "Optimization",
    icon: SlidersHorizontal,
    badgeClass:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    hoverBorder: "hover:border-purple-500/30",
    prompt:
      "Audit all posts currently scheduled for next week. Flag any repetitive themes, tone inconsistencies, or weak opening hooks, and suggest sharper revisions.",
  },
]

export function SamplePrompts() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (prompt: string, id: string) => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopiedId(id)
      toast.success("Prompt copied to clipboard")
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      toast.error("Failed to copy prompt")
    }
  }

  return (
    <div className="space-y-3.5 pt-3">
      {/* Prominent, Confident Section Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Example Prompts
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Select or copy a workflow prompt to test with your connected agent:
        </p>
      </div>

      {/* 2-Column Balanced Prompt Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {CREATIVE_PROMPTS.map((item) => {
          const Icon = item.icon
          const isCopied = copiedId === item.id

          return (
            <div
              key={item.id}
              onClick={() => handleCopy(item.prompt, item.id)}
              className={`group flex flex-col justify-between rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900 p-4 transition-all duration-200 ${item.hoverBorder} hover:shadow-xs cursor-pointer`}
            >
              {/* Header: Category Pill & Discrete Copy Button */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-semibold tracking-wide ${item.badgeClass}`}
                >
                  <Icon className="size-3" />
                  <span>{item.category}</span>
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopy(item.prompt, item.id)
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
                    isCopied
                      ? "border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "border-black/6 dark:border-white/6 bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  aria-label="Copy prompt"
                >
                  {isCopied ? (
                    <>
                      <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                      <span className="text-[11px] font-medium">Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Title */}
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {item.title}
              </h4>

              {/* Prompt Body in Dedicated Inner Payload Container */}
              <div className="rounded-lg border border-black/5 dark:border-white/5 bg-slate-50/70 dark:bg-slate-950/60 p-3 transition-colors group-hover:bg-slate-50 dark:group-hover:bg-slate-950">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {item.prompt}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
