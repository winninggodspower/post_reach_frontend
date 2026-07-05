"use client"

import * as React from "react"
import { Check, Plus } from "lucide-react"

export type AccountChannel = {
  id: string
  platform: string
  name: string
  handle: string
  avatar: string
  selected: boolean
}

type TargetAccountsSelectorProps = {
  channels: AccountChannel[]
  onToggleChannel: (id: string) => void
  getPlatformIcon: (platformId: string) => string
}

export function TargetAccountsSelector({
  channels,
  onToggleChannel,
  getPlatformIcon,
}: TargetAccountsSelectorProps) {
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
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => onToggleChannel(channel.id)}
            className="group relative cursor-pointer focus:outline-hidden"
            title={`${channel.name} (${channel.handle})`}
          >
            <div className="relative">
              <div
                className={`size-12 rounded-full overflow-hidden border-2 p-0.5 transition-all duration-300 ${
                  channel.selected
                    ? "border-emerald-500 dark:border-emerald-400 ring-4 ring-emerald-500/15 scale-105"
                    : "border-slate-200 dark:border-slate-800 group-hover:border-slate-400 group-hover:scale-102"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={channel.avatar}
                  alt={channel.name}
                  className={`size-full object-cover rounded-full transition duration-300 ${
                    channel.selected ? "grayscale-0" : "grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100"
                  }`}
                />
              </div>

              {channel.selected && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-500 text-white border border-white shadow-xs">
                  <Check className="size-3 stroke-3" />
                </span>
              )}

              <div className="absolute -bottom-1 -right-0.5 size-5 bg-white dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center p-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getPlatformIcon(channel.platform)}
                  alt={channel.platform}
                  className="size-full object-contain"
                />
              </div>
            </div>
          </button>
        ))}

        <button
          onClick={() => window.open("/dashboard/connections", "_blank")}
          className="group relative cursor-pointer focus:outline-hidden"
          title="Connect a new account"
        >
          <div className="size-12 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center bg-slate-50/50 dark:bg-slate-950/20 text-slate-400 group-hover:border-accent-brand group-hover:text-accent-brand transition duration-300">
            <Plus className="size-5" />
          </div>
        </button>
      </div>
    </div>
  )
}
