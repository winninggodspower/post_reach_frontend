import { PLATFORM_OPTIONS } from "@/features/onboarding/components/steps/shared"

export const getPlatformMeta = (platformKey: string) => {
  const matchKey = platformKey === "twitter" ? "x" : platformKey
  const opt = PLATFORM_OPTIONS.find((p) => p.id.toLowerCase() === matchKey.toLowerCase())
  return {
    label: opt?.label || platformKey,
    icon: opt?.icon || "/placeholder-avatar.svg",
  }
}

