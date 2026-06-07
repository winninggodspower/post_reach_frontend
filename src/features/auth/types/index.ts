export type AuthTokenPair = {
  accessToken: string
  refreshToken: string
}

export type UserBrand = {
  id: string
  name: string
  industry: string | null
  posting_frequency: string | null
  primary_platform: string | null
  team_size: string | null
  is_youtube_connected: boolean
  is_instagram_connected: boolean
  is_tiktok_connected: boolean
  is_facebook_connected: boolean
  is_linkedin_connected: boolean
  is_x_connected: boolean
}

export type AuthProfile = {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  handle: string | null
  role: string | null
  has_completed_onboarding: boolean
  brand: UserBrand | null
}

export type AuthToken = {
  refresh: string
  access: string
}

export type AuthData = {
  user: AuthProfile
  tokens: AuthToken
}

export type AuthResponse = {
  success: boolean
  title: string
  message: string
  data: AuthData
}

export type LoginFormValues = {
  email: string
  password: string
}

export type RegisterFormValues = {
  fullName: string
  email: string
  password: string
  country: string
}
