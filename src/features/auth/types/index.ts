export type AuthTokenPair = {
  accessToken: string
  refreshToken: string
}

export type ConnectedAccount = {
  platform: string
  external_id: string
  account_name: string
  profile_picture_url: string | null
  connected_at: string
}

export type UserBrand = {
  id: string
  name: string
  industry: string | null
  posting_frequency: string | null
  primary_platform: string | null
  team_size: string | null
  connected_accounts: ConnectedAccount[]
}

export type AuthProfile = {
  id: string
  email: string
  first_name: string
  last_name: string
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
  firstName: string
  lastName: string
  email: string
  password: string
  country: string
}
