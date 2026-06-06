import type { OnboardingPlatform } from "@/features/onboarding/types"

export const ONBOARDING_ENDPOINTS = {
  profile: "/auth/onboarding/",
} as const

export const SOCIAL_ENDPOINTS = {
  youtubeAuthUrl: "/social/youtube/auth-url/",
  youtubeConnect: "/social/youtube/connect/",
} as const

export const platformToEndpoint = (platform: OnboardingPlatform): string => {
  const map: Record<OnboardingPlatform, string> = {
    instagram: "/auth/instagram/connect/",
    facebook: "/auth/facebook/connect/",
    x: "/auth/x/connect/",
    tiktok: "/auth/tiktok/connect/",
    linkedin: "/auth/linkedin/connect/",
    youtube: "/social/youtube/connect/",
  }

  return map[platform]
}
