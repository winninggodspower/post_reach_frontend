import * as React from "react"
import { PLATFORM_OPTIONS } from "@/features/onboarding/components/steps/shared"

type ChannelAvatarProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  platform: string
}

export function ChannelAvatar({ platform, src, ...props }: ChannelAvatarProps) {
  const getPlatformIcon = (platformId: string) => {
    const opt = PLATFORM_OPTIONS.find((p) => p.id === platformId)
    return opt ? opt.icon : "/social-icons/tiktok-circle.png"
  }

  const defaultIcon = getPlatformIcon(platform)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || defaultIcon}
      onError={(e) => {
        e.currentTarget.src = defaultIcon
      }}
      {...props}
    />
  )
}
