import { api } from "@/lib/api"
import { ONBOARDING_ENDPOINTS, platformToEndpoint, SOCIAL_ENDPOINTS } from "@/features/onboarding/api/endpoints"
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

type YouTubeAuthUrlResponse = {
  success: boolean
  data: {
    auth_url: string
  }
  message?: string
}

type YouTubeConnectResponse = {
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
 * Get the YouTube OAuth authorization URL from the server.
 * Step 1 of the YouTube OAuth flow.
 */
export const getYouTubeAuthUrl = async (
  redirectUri: string,
): Promise<YouTubeAuthUrlResponse> => {
  try {
    const { data } = await api.get<YouTubeAuthUrlResponse>(
      SOCIAL_ENDPOINTS.youtubeAuthUrl,
      { params: { redirect_uri: redirectUri } },
    )

    if (!data.success) {
      throw new Error(
        JSON.stringify({
          message: data.message || "Failed to get YouTube auth URL.",
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
      axiosError.response?.data?.message || "Unable to initiate YouTube connection."

    throw new Error(JSON.stringify({ message }))
  }
}

/**
 * Exchange the authorization code for YouTube tokens.
 * Step 3 of the YouTube OAuth flow.
 */
export const exchangeYouTubeCode = async (payload: {
  code: string
  redirect_uri: string
  state: string
  brand?: string
}): Promise<YouTubeConnectResponse> => {
  try {
    const { data } = await api.post<YouTubeConnectResponse>(
      SOCIAL_ENDPOINTS.youtubeConnect,
      payload,
    )

    if (!data.success) {
      throw new Error(
        JSON.stringify({
          message: data.message || "Failed to connect YouTube account.",
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
      axiosError.response?.data?.message || "Unable to connect YouTube account."

    throw new Error(JSON.stringify({ message }))
  }
}

export const initiatePlatformOAuth = async (
  platform: OnboardingPlatform,
): Promise<OAuthInitResponse> => {
  try {
    const { data } = await api.post<OAuthInitResponse>(platformToEndpoint(platform))

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
