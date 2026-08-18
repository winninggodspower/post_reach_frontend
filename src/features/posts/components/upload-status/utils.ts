import { PLATFORM_OPTIONS } from "@/features/onboarding/components/steps/shared"

export const getPlatformMeta = (platformKey: string) => {
  const matchKey = platformKey === "twitter" ? "x" : platformKey
  const opt = PLATFORM_OPTIONS.find((p) => p.id.toLowerCase() === matchKey.toLowerCase())
  return {
    label: opt?.label || platformKey,
    icon: opt?.icon || "/placeholder-avatar.svg",
  }
}

export const getPostUrl = (platform: string, platformPostId: string | null, contentType: string | null): string | null => {
  if (!platformPostId) return null
  switch (platform.toLowerCase()) {
    case "youtube":
      return contentType === "photo" ? null : `https://youtube.com/shorts/${platformPostId}`
    case "instagram":
      return `https://instagram.com/p/${platformPostId}`
    case "tiktok":
      return `https://www.tiktok.com/video/${platformPostId}`
    case "facebook":
      return contentType === "video"
        ? `https://facebook.com/watch/?v=${platformPostId}`
        : `https://facebook.com/${platformPostId}`
    case "linkedin":
      return `https://www.linkedin.com/feed/update/${platformPostId}`
    case "twitter":
    case "x":
      return `https://x.com/i/status/${platformPostId}`
    default:
      return null
  }
}
