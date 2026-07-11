"use client"

import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/store/auth-store"

import { SocialPlatformIcon, StatusPill, PLAIN_AVATAR } from "./steps/shared"
import type { PlatformOption } from "./steps/shared"
import { useSocialAuth } from "@/hooks/use-social-auth"

type PlatformConnectCardProps = {
  option: PlatformOption
}

export function PlatformConnectCard({
  option,
}: PlatformConnectCardProps) {
  const user = useAuth((state) => state.user)

  const connectedAccount = user?.brand?.connected_accounts?.find(
    (acc) => acc.platform.toLowerCase() === option.id.toLowerCase()
  )
  const connected = !!connectedAccount

  const { connect, loading: connecting } = useSocialAuth(option.id)

  const handleClick = () => {
    if (!connected) {
      void connect()
    }
  }

  return (
    <div
      className={`flex items-center gap-4 rounded-[24px] border bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-32px_rgba(15,23,42,0.35)] ${connected ? "border-emerald-500/20 bg-emerald-50/70" : "border-black/8"
        }`}
    >
      <div className="relative shrink-0">
        <SocialPlatformIcon option={option} />
        {connected && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={connectedAccount?.profile_picture_url || PLAIN_AVATAR}
              alt={connectedAccount?.account_name || "Profile"}
              className="absolute inset-0 h-11 w-11 rounded-full object-cover border border-white dark:border-slate-900 shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white border border-slate-100 flex items-center justify-center p-0.5 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={option.icon}
                alt={option.label}
                className="h-full w-full object-contain"
              />
            </div>
          </>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold text-slate-950 flex flex-wrap items-center gap-x-2">
          <span>{option.label}</span>
          {connected && connectedAccount?.account_name && (
            <span className="text-xs font-normal text-slate-500 truncate max-w-[150px]">
              ({connectedAccount.account_name})
            </span>
          )}
        </h3>
        <p className="mt-1 text-sm text-slate-500 truncate">
          {connected && connectedAccount
            ? `Connected on ${new Date(connectedAccount.connected_at).toLocaleDateString()}`
            : "Connect for publishing and performance insights."}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
        <StatusPill connected={connected} />
        <Button
          type="button"
          variant={connected ? "outline" : "default"}
          size="sm"
          disabled={connecting || connected}
          onClick={handleClick}
        >
          {connecting ? (
            <>
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              Connecting...
            </>
          ) : connected ? (
            "Connected"
          ) : (
            "Connect"
          )}
        </Button>
      </div>
    </div>
  )
}

