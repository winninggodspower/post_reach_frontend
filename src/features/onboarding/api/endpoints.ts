import type { OnboardingPlatform } from "@/features/onboarding/types"

export const ONBOARDING_ENDPOINTS = {
  profile: "/auth/onboarding/",
} as const

export const AUTH_URL_ENDPOINTS: Record<OnboardingPlatform, string> = {
  youtube: "/social_accounts/youtube/auth-url/",
  facebook: "/social_accounts/facebook/auth-url/",
  instagram: "/social_accounts/instagram/auth-url/",
  x: "/social_accounts/x/auth-url/",
  tiktok: "/social_accounts/tiktok/auth-url/",
  linkedin: "/social_accounts/linkedin/auth-url/",
}

export const CONNECT_ENDPOINTS: Record<OnboardingPlatform, string> = {
  youtube: "/social_accounts/youtube/connect/",
  facebook: "/social_accounts/facebook/connect/",
  instagram: "/social_accounts/instagram/connect/",
  x: "/social_accounts/x/connect/",
  tiktok: "/social_accounts/tiktok/connect/",
  linkedin: "/social_accounts/linkedin/connect/",
}
