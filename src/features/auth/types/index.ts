export type AuthTokenPair = {
  accessToken: string
  refreshToken: string
}

export type AuthProfile = {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  handle: string | null
  role: string
  has_completed_onboarding: boolean
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
