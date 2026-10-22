"use client"

import React from "react"
import type { LucideIcon } from "lucide-react"

export interface MetricStatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  subtext?: string
  variant?: "primary" | "emerald" | "purple" | "blue" | "amber" | "rose" | "slate"
  isPercentage?: boolean
}

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
  }
  if (num >= 10_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K"
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K"
  }
  return num.toLocaleString()
}

const VARIANT_STYLES: Record<
  NonNullable<MetricStatCardProps["variant"]>,
  {
    iconBg: string
    iconColor: string
    badgeBg: string
    borderHover: string
  }
> = {
  primary: {
    iconBg: "bg-accent-brand/10 dark:bg-accent-brand/20",
    iconColor: "text-accent-brand",
    badgeBg: "bg-accent-brand/10 text-accent-brand",
    borderHover: "hover:border-accent-brand/40",
  },
  purple: {
    iconBg: "bg-purple-100 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    badgeBg: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300",
    borderHover: "hover:border-purple-300 dark:hover:border-purple-700/60",
  },
  blue: {
    iconBg: "bg-blue-100 dark:bg-blue-950/60",
    iconColor: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
    borderHover: "hover:border-blue-300 dark:hover:border-blue-700/60",
  },
  emerald: {
    iconBg: "bg-emerald-100 dark:bg-emerald-950/60",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
    borderHover: "hover:border-emerald-300 dark:hover:border-emerald-700/60",
  },
  amber: {
    iconBg: "bg-amber-100 dark:bg-amber-950/60",
    iconColor: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
    borderHover: "hover:border-amber-300 dark:hover:border-amber-700/60",
  },
  rose: {
    iconBg: "bg-rose-100 dark:bg-rose-950/60",
    iconColor: "text-rose-600 dark:text-rose-400",
    badgeBg: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300",
    borderHover: "hover:border-rose-300 dark:hover:border-rose-700/60",
  },
  slate: {
    iconBg: "bg-slate-100 dark:bg-slate-800",
    iconColor: "text-slate-600 dark:text-slate-300",
    badgeBg: "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    borderHover: "hover:border-slate-300 dark:hover:border-slate-700",
  },
}

export function MetricStatCard({
  label,
  value,
  icon: Icon,
  subtext,
  variant = "slate",
  isPercentage = false,
}: MetricStatCardProps) {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.slate

  const displayValue =
    typeof value === "number"
      ? isPercentage
        ? `${value.toFixed(2)}%`
        : formatNumber(value)
      : value

  const fullValue = typeof value === "number" ? value.toLocaleString() : value

  return (
    <div
      title={typeof value === "number" && !isPercentage ? `Full count: ${fullValue}` : undefined}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-4 backdrop-blur-md shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${styles.borderHover}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
          {label}
        </span>
        <div
          className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconColor} transition-transform duration-200 group-hover:scale-110`}
        >
          <Icon className="size-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {displayValue}
        </span>
        {subtext && (
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {subtext}
          </span>
        )}
      </div>
    </div>
  )
}
