import * as React from "react"
import { PLAIN_AVATAR } from "@/features/onboarding/components/steps/shared"

type SocialAccountAvatarProps = {
  avatarUrl?: string | null
  accountName?: string | null
  platformIconUrl?: string
  platformLabel?: string
  size?: "sm" | "md" | "lg"
}

export function SocialAccountAvatar({
  avatarUrl,
  accountName,
  platformIconUrl,
  platformLabel,
  size = "md"
}: SocialAccountAvatarProps) {
  const sizeClasses = {
    sm: {
      container: "h-9 w-9",
      badge: "h-4.5 w-4.5 p-0.5",
    },
    md: {
      container: "h-11 w-11",
      badge: "h-5 w-5 p-0.5",
    },
    lg: {
      container: "h-14 w-14",
      badge: "h-6 w-6 p-0.5",
    }
  }

  const selectedSize = sizeClasses[size]

  return (
    <div className={`relative shrink-0 ${selectedSize.container}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatarUrl || PLAIN_AVATAR}
        alt={accountName || "Social Profile"}
        className="h-full w-full rounded-full object-cover border border-white dark:border-slate-900 shadow-sm"
      />
      {platformIconUrl && (
        <div className={`absolute -bottom-1 -right-1 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-xs ${selectedSize.badge}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={platformIconUrl}
            alt={platformLabel || "Platform"}
            className="h-full w-full object-contain"
          />
        </div>
      )}
    </div>
  )
}
