export type OnboardingRole =
  | "creator"
  | "business_owner"
  | "agency_owner"
  | "social_media_manager"

export type OnboardingIndustry =
  | "technology"
  | "marketing"
  | "ecommerce"
  | "real_estate"
  | "healthcare"
  | "education"
  | "finance"
  | "other"

export type OnboardingTeamSize = "just_me" | "2_5" | "6_20" | "20_plus"

export type OnboardingPostingFrequency =
  | "daily"
  | "few_times_a_week"
  | "weekly"
  | "monthly"
  | "rarely"

export type OnboardingPlatform =
  | "instagram"
  | "linkedin"
  | "tiktok"
  | "facebook"
  | "x"
  | "youtube"

export type OnboardingSubmission = {
  role: OnboardingRole
  industry: OnboardingIndustry
  team_size: OnboardingTeamSize
  primary_platform: OnboardingPlatform
  posting_frequency: OnboardingPostingFrequency
  connected_platforms: OnboardingPlatform[]
}
