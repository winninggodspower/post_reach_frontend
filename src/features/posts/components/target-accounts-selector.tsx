"use client"

import * as React from "react"
import { Check, Plus, AlertTriangle } from "lucide-react"
import { PLATFORM_OPTIONS } from "@/features/onboarding/components/steps/shared"

export type AccountChannel = {
  id: string
  platform: string
  name: string
  handle: string
  avatar: string
  selected: boolean
  expired?: boolean
}

type TargetAccountsSelectorProps = {
  channels: AccountChannel[]
  onToggleChannel: (id: string) => void
}

export function TargetAccountsSelector({
  channels,
  onToggleChannel,
}: TargetAccountsSelectorProps) {
  const getPlatformIcon = (platformId: string) => {
    const opt = PLATFORM_OPTIONS.find(p => p.id === platformId)
    return opt ? opt.icon : "/social-icons/tiktok-circle.png"
  }
  return (
    <div className="mb-8 space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 font-sans">
          Target Accounts
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Select which channels you want to schedule this video to
        </p>
      </div>

      {/* Circular Avatar List */}
      <div className="flex flex-wrap items-center gap-4.5">
        {channels.map((channel) => {
          const isExpired = !!channel.expired
          return (
            <button
              key={channel.id}
              onClick={() => onToggleChannel(channel.id)}
              className="group relative cursor-pointer focus:outline-hidden"
              title={isExpired ? `${channel.name} (${channel.handle}) - Connection Expired` : `${channel.name} (${channel.handle})`}
            >
              <div className="relative">
                <div
                  className={`size-11 rounded-full transition-all duration-300 ${
                    isExpired
                      ? "ring-2 ring-rose-500 ring-offset-2 dark:ring-offset-slate-950 opacity-65"
                      : channel.selected
                        ? "ring-1 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-950 scale-105"
                        : "group-hover:scale-102"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={channel.avatar}
                    alt={channel.name}
                    className={`size-full object-cover rounded-full border border-white dark:border-slate-900 shadow-sm transition duration-300 ${
                      isExpired
                        ? "grayscale"
                        : channel.selected
                          ? "grayscale-0"
                          : "grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100"
                    }`}
                  />
                </div>

                {channel.selected && !isExpired && (
                  <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-500 text-white border border-white shadow-xs z-10">
                    <Check className="size-3 stroke-3" />
                  </span>
                )}

                {isExpired && (
                  <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-white border border-white shadow-xs z-10">
                    <AlertTriangle className="size-2.5" />
                  </span>
                )}

                <div className="absolute -bottom-1 -right-1 size-5 bg-white dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center p-0.5 shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getPlatformIcon(channel.platform)}
                    alt={channel.platform}
                    className="size-full object-contain"
                  />
                </div>
              </div>
            </button>
          )
        })}

        <button
          onClick={() => window.open("/dashboard/connections", "_blank")}
          className="group relative cursor-pointer focus:outline-hidden"
          title="Connect a new account"
        >
          <div className="size-11 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center bg-slate-50/50 dark:bg-slate-950/20 text-slate-400 group-hover:border-accent-brand group-hover:text-accent-brand transition duration-300">
            <Plus className="size-5" />
          </div>
        </button>
      </div>
    </div>
  )
}
