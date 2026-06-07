import axios from "axios"

import { api, authApi } from "@/lib/api"
import { AUTH_ENDPOINTS } from "@/features/auth/api/endpoints"
import type {
  AuthData,
  AuthProfile,
  AuthResponse,
  AuthTokenPair,
} from "@/features/auth/types"

type CredentialPayload = {
  email: string
  password: string
  fullName?: string
  country?: string
}

type MeResponse = {
  success: boolean
  message: string
  data: AuthProfile
}

const toProfile = (
  payload: AuthData,
  fallbackEmail: string,
): AuthProfile => ({
  id: String(payload.user?.id ?? ""),
  email: payload.user?.email ?? fallbackEmail,
  first_name: payload.user?.first_name ?? "",
  last_name: payload.user?.last_name ?? "",
  full_name: payload.user?.full_name ?? "",
  handle: payload.user?.handle ?? null,
  role: payload.user?.role ?? null,
  has_completed_onboarding: Boolean(payload.user?.has_completed_onboarding ?? false),
  brand: payload.user?.brand ?? null,
})

const getAxiosResponseData = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data
  }

  return null
}

const submitAuthRequest = async (
  endpoint: string,
  body: Record<string, string | undefined>,
  fallbackEmail: string,
  errorMessage?: string,
) => {
  try {
    const { data } = await authApi.post<AuthResponse>(endpoint, body)

    if (!data.success) {
      throw new Error(
        JSON.stringify({
          message: data.message || errorMessage || "Authentication failed.",
          fields: data.data ?? null,
        }),
      )
    }

    return {
      profile: toProfile(data.data, fallbackEmail),
      tokens: {
        accessToken: data.data.tokens.access,
        refreshToken: data.data.tokens.refresh,
      } satisfies AuthTokenPair,
    }
  } catch (error: unknown) {
    const respData = getAxiosResponseData(error)
    if (respData && typeof respData === "object") {
      const message = respData.message || errorMessage || "Authentication failed."
      throw new Error(
        JSON.stringify({
          message,
          fields: respData.errors ?? respData.fields ?? null,
        }),
      )
    }

    const fallback = errorMessage || "Authentication failed."
    throw new Error(JSON.stringify({ message: fallback, fields: null }))
  }
}

export const fetchCurrentUser = async () => {
  const { data } = await api.get<MeResponse>(AUTH_ENDPOINTS.me)

  return data.data
}

export const authenticateLogin = async ({
  email,
  password,
}: CredentialPayload) => {
  return submitAuthRequest(
    AUTH_ENDPOINTS.login,
    { username: email, password },
    email,
    "Unable to sign in.",
  )
}

export const registerAccount = async ({
  email,
  password,
  fullName,
  country,
}: CredentialPayload) => {
  return submitAuthRequest(
    AUTH_ENDPOINTS.register,
    {
      full_name: fullName,
      email,
      password,
      country,
    },
    email,
    "Unable to create account.",
  )
}

type GoogleSignInPayload = {
  authCode: string
  redirectUri: string
}

export const googleSignIn = async ({ authCode, redirectUri }: GoogleSignInPayload) => {
  try {
    const { data } = await authApi.post<AuthResponse>(AUTH_ENDPOINTS.googleSignIn, {
      auth_code: authCode,
      redirect_uri: redirectUri,
    })

    if (!data.success) {
      throw new Error(
        JSON.stringify({
          message: data.message || "Google authentication failed.",
          fields: data.data ?? null,
        }),
      )
    }

    return {
      profile: toProfile(data.data, data.data.user?.email ?? ""),
      tokens: {
        accessToken: data.data.tokens.access,
        refreshToken: data.data.tokens.refresh,
      } satisfies AuthTokenPair,
    }
  } catch (error: unknown) {
    const respData = getAxiosResponseData(error)
    if (respData && typeof respData === "object") {
      const message = respData.message || "Google authentication failed."
      throw new Error(
        JSON.stringify({
          message,
          fields: respData.errors ?? respData.fields ?? null,
        }),
      )
    }

    throw new Error(JSON.stringify({ message: "Google authentication failed.", fields: null }))
  }
}

export const refreshAccessToken = async (refreshToken: string) => {
  const { data } = await authApi.post<{ access?: string; accessToken?: string }>(
    AUTH_ENDPOINTS.refresh,
    {
      refresh: refreshToken,
    },
  )

  return data.accessToken ?? data.access ?? null
}
