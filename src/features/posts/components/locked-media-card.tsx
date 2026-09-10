"use client"

import * as React from "react"
import { Lock } from "lucide-react"

export interface LockedMediaCardProps {
  title?: string
  description?: string
  children: React.ReactNode
  containerClassName?: string
}

export function LockedMediaCard({
  title = "Media Locked",
  description = "Scheduled posts cannot change media.",
  children,
  containerClassName = "",
}: LockedMediaCardProps) {
  return (
    <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 overflow-hidden shadow-xs">
      <div className="w-full bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200/50 dark:border-amber-500/20 px-4 py-3 flex items-start sm:items-center gap-3">
        <div className="bg-amber-100 dark:bg-amber-500/20 p-1.5 rounded-full shrink-0 mt-0.5 sm:mt-0">
          <Lock className="size-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            {title}
          </p>
          <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className={`p-6 sm:p-8 flex items-center justify-center relative ${containerClassName}`}>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,64,60,0.02)_25%,rgba(68,64,60,0.02)_50%,transparent_50%,transparent_75%,rgba(68,64,60,0.02)_75%,rgba(68,64,60,0.02)_100%)] bg-[length:20px_20px] dark:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%,rgba(255,255,255,0.02)_100%)] pointer-events-none" />
        {children}
      </div>
    </div>
  )
}
