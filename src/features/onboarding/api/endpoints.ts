import type { OnboardingPlatform } from "@/features/onboarding/types"

export const ONBOARDING_ENDPOINTS = {
  profile: "/social_accounts/onboarding/",
} as const

export const SOCIAL_ENDPOINTS = {
  youtubeAuthUrl: "/social_accounts/youtube/auth-url/",
  youtubeConnect: "/social_accounts/youtube/connect/",
} as const

export const platformToEndpoint = (platform: OnboardingPlatform): string => {
  const map: Record<OnboardingPlatform, string> = {
    instagram: "/social_accounts/instagram/connect/",
    facebook: "/social_accounts/facebook/connect/",
    x: "/social_accounts/x/connect/",
    tiktok: "/social_accounts/tiktok/connect/",
    linkedin: "/social_accounts/linkedin/connect/",
    youtube: "/social/youtube/connect/",
  }

  return map[platform]
}
