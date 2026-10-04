import { PLATFORM_OPTIONS } from "@/features/onboarding/components/steps/shared"

export const getPlatformMeta = (platformKey: string) => {
  const lowerKey = (platformKey || "").toLowerCase()
  const isTwitter = lowerKey === "twitter" || lowerKey === "x"

  const opt = PLATFORM_OPTIONS.find((p) => {
    const pId = p.id.toLowerCase()
    if (isTwitter) {
      return pId === "twitter" || pId === "x"
    }
    return pId === lowerKey
  })

  if (isTwitter) {
    return {
      label: "X",
      icon: opt?.icon || "/social-icons/twitter-circle.png",
    }
  }

  return {
    label: opt?.label || platformKey,
    icon: opt?.icon || "/placeholder-avatar.svg",
  }
}

