import { api, authApi } from "@/lib/api"
import { AUTH_ENDPOINTS } from "@/lib/auth/endpoints"
import type { AuthData, AuthProfile, AuthResponse, AuthTokenPair } from "@/lib/auth/types"

type CredentialPayload = {
  email: string
  password: string
  fullName?: string
  country?: string
}

const toProfile = (
  payload: AuthData,
  fallbackEmail: string,
): AuthProfile => ({
  id: String(payload.user?.id ?? ""),
  email: payload.user?.email ?? fallbackEmail,
  first_name: payload.user?.first_name ?? "",
  last_name: payload.user?.last_name ?? "",
  handle: payload.user?.handle ?? "",
})

const submitAuthRequest = async (
  endpoint: string,
  body: Record<string, string | undefined>,
  fallbackEmail: string,
  errorMessage?: string,
) => {
  try {
    const { data } = await authApi.post<AuthResponse>(endpoint, body)
    console.log(data)

    if (!data.success) {
      // Throw structured error so callers can parse field errors
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
  } catch (err: any) {
    // If axios returned a 4xx with a JSON body, surface that body as structured fields
    const respData = err?.response?.data
    if (respData && typeof respData === "object") {
      const message = respData.message || errorMessage || "Authentication failed."
      throw new Error(
        JSON.stringify({
          message,
          fields: respData.errors ?? respData.fields ?? null,
        }),
      )
    }

    // Fallback: rethrow with a helpful message
    const fallback = errorMessage || "Authentication failed."
    throw new Error(JSON.stringify({ message: fallback, fields: null }))
  }
}

export const fetchCurrentUser = async () => {
  const { data } = await api.get<{ data?: { user?: AuthProfile }; user?: AuthProfile }>(
    AUTH_ENDPOINTS.me,
  )

  const user = data.data?.user ?? data.user

  return {
    id: String(user?.id ?? ""),
    email: user?.email ?? "",
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    handle: user?.handle ?? "",
  } satisfies AuthProfile
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

export const refreshAccessToken = async (refreshToken: string) => {
  const { data } = await authApi.post<{ access?: string; accessToken?: string }>(
    AUTH_ENDPOINTS.refresh,
    {
      refresh: refreshToken,
    },
  )

  return data.accessToken ?? data.access ?? null
}
