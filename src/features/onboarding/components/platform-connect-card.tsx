"use client"

import * as React from "react"
import { Loader2, MoreVertical, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/store/auth-store"

import { SocialPlatformIcon, StatusPill, PLAIN_AVATAR } from "./steps/shared"
import type { PlatformOption } from "./steps/shared"
import { useSocialAuth } from "@/hooks/use-social-auth"

import { SocialAccountAvatar } from "@/components/ui/social-account-avatar"

type PlatformConnectCardProps = {
  option: PlatformOption
}

export function PlatformConnectCard({
  option,
}: PlatformConnectCardProps) {
  const user = useAuth((state) => state.user)
  const [showDropdown, setShowDropdown] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const connectedAccount = user?.brand?.connected_accounts?.find(
    (acc) => acc.platform.toLowerCase() === option.id.toLowerCase()
  )
  const connected = !!connectedAccount
  const expired = !!connectedAccount?.is_expired

  const { connect, loading: connecting } = useSocialAuth(option.id)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])



  const handleConnectClick = () => {
    if (!connected || expired) {
      void connect()
    }
  }

  const handleReconnectClick = () => {
    setShowDropdown(false)
    void connect()
  }

  return (
    <div
      className={`flex items-center gap-4 rounded-[24px] border bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-32px_rgba(15,23,42,0.35)] ${expired
          ? "border-rose-500/20 bg-rose-50/70"
          : connected
            ? "border-emerald-500/20 bg-emerald-50/70"
            : "border-black/8"
        }`}
    >
      <div className="relative shrink-0">
        {connected ? (
          <SocialAccountAvatar
            avatarUrl={connectedAccount?.profile_picture_url}
            accountName={connectedAccount?.account_name}
            platformIconUrl={option.icon}
            platformLabel={option.label}
            size="md"
          />
        ) : (
          <SocialPlatformIcon option={option} />
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
          {expired
            ? "Connection expired. Please reconnect."
            : connected && connectedAccount
              ? `Connected on ${new Date(connectedAccount.connected_at).toLocaleDateString()}`
              : "Connect for publishing and performance insights."}
        </p>
      </div>

      <div className="flex items-center gap-2 relative" ref={dropdownRef}>
        {connected && !expired ? (
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1.5 cursor-pointer border-emerald-500/30 hover:bg-slate-50 text-emerald-700 hover:text-emerald-800 transition"
              title="Account settings"
            >
              <span>Connected</span>
              <MoreVertical className="size-3.5" />
            </Button>

            {showDropdown && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl border border-slate-200/80 shadow-lg py-1 z-10 animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  type="button"
                  onClick={handleReconnectClick}
                  className="w-full px-3 py-2 text-xs text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="size-3.5" />
                  <span>Reconnect / Switch</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Button
            type="button"
            variant={expired ? "destructive" : "default"}
            size="sm"
            disabled={connecting}
            onClick={handleConnectClick}
          >
            {connecting ? (
              <>
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                Connecting...
              </>
            ) : expired ? (
              "Reconnect"
            ) : (
              "Connect"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
