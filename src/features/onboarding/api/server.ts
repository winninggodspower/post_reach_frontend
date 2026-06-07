import { api } from "@/lib/api"
import {
  ONBOARDING_ENDPOINTS,
  AUTH_URL_ENDPOINTS,
  CONNECT_ENDPOINTS,
} from "@/features/onboarding/api/endpoints"
import type { OnboardingPlatform, OnboardingSubmission } from "@/features/onboarding/types"

type OnboardingProfileResponse = {
  success: boolean
  message?: string
}

type OAuthInitResponse = {
  success: boolean
  redirect_url: string
  message?: string
}

type AuthUrlResponse = {
  success: boolean
  data: {
    auth_url: string
  }
  message?: string
}

type ConnectResponse = {
  success: boolean
  data: {
    message: string
    platform: string
    is_connected: boolean
  }
  message?: string
}

export const submitOnboardingProfile = async (
  submission: OnboardingSubmission,
): Promise<OnboardingProfileResponse> => {
  try {
    const { data } = await api.post<OnboardingProfileResponse>(
      ONBOARDING_ENDPOINTS.profile,
      submission,
    )

    if (!data.success) {
      throw new Error(
        JSON.stringify({
          message: data.message || "Failed to save onboarding profile.",
        }),
      )
    }

    return data
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err
    }

    const axiosError = err as { response?: { data?: { message?: string } } }
    const message =
      axiosError.response?.data?.message || "Unable to save onboarding profile."

    throw new Error(JSON.stringify({ message }))
  }
}

/**
 * Get the OAuth authorization URL for any platform.
 * Step 1 of the OAuth flow — opens the provider's consent screen.
 */
export const getAuthUrl = async (
  platform: OnboardingPlatform,
  redirectUri: string,
): Promise<AuthUrlResponse> => {
  try {
    const endpoint = AUTH_URL_ENDPOINTS[platform]

    const { data } = await api.get<AuthUrlResponse>(endpoint, {
      params: { redirect_uri: redirectUri },
    })

    if (!data.success) {
      throw new Error(
        JSON.stringify({
          message: data.message || `Failed to get ${platform} auth URL.`,
        }),
      )
    }

    return data
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err
    }

    const axiosError = err as { response?: { data?: { message?: string } } }
    const message =
      axiosError.response?.data?.message || `Unable to initiate ${platform} connection.`

    throw new Error(JSON.stringify({ message }))
  }
}

/**
 * Exchange the authorization code for platform tokens.
 * Step 3 of the OAuth flow — called from the callback page.
 */
export const exchangeOAuthCode = async (payload: {
  platform: OnboardingPlatform
  code: string
  state: string
  redirect_uri: string
}): Promise<ConnectResponse> => {
  try {
    const endpoint = CONNECT_ENDPOINTS[payload.platform]

    const { data } = await api.post<ConnectResponse>(endpoint, {
      code: payload.code,
      state: payload.state,
      redirect_uri: payload.redirect_uri,
    })

    if (!data.success) {
      throw new Error(
        JSON.stringify({
          message: data.message || `Failed to connect ${payload.platform} account.`,
        }),
      )
    }

    return data
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err
    }

    const axiosError = err as { response?: { data?: { message?: string } } }
    const message =
      axiosError.response?.data?.message || `Unable to connect ${payload.platform} account.`

    throw new Error(JSON.stringify({ message }))
  }
}

export const initiatePlatformOAuth = async (
  platform: OnboardingPlatform,
): Promise<OAuthInitResponse> => {
  try {
    const endpoint = AUTH_URL_ENDPOINTS[platform]

    const { data } = await api.post<OAuthInitResponse>(endpoint)

    if (!data.success) {
      throw new Error(
        JSON.stringify({
          message: data.message || `Failed to initiate ${platform} connection.`,
        }),
      )
    }

    return data
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err
    }

    const axiosError = err as { response?: { data?: { message?: string } } }
    const message =
      axiosError.response?.data?.message || `Unable to connect ${platform}.`

    throw new Error(JSON.stringify({ message }))
  }
}
