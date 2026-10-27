import { api } from "@/lib/api"
import {
  ONBOARDING_ENDPOINTS,
  AUTH_URL_ENDPOINTS,
  CONNECT_ENDPOINTS,
  FACEBOOK_PAGES_ENDPOINT,
} from "@/features/onboarding/api/endpoints"
import type { OnboardingPlatform, OnboardingSubmission } from "@/features/onboarding/types"
import { extractErrorMessage } from "@/shared/lib/extract-error-message"

type OnboardingProfileResponse = {
  success: boolean
  message?: unknown
}

type OAuthInitResponse = {
  success: boolean
  redirect_url: string
  message?: unknown
}

type AuthUrlResponse = {
  success: boolean
  data?: {
    auth_url: string
  }
  message?: unknown
}

type ConnectResponse = {
  success: boolean
  data?: {
    message: string
    platform: string
    is_connected: boolean
  }
  message?: unknown
}

export type FacebookPage = {
  id: string
  name: string
  picture_url: string
}

type FacebookPagesResponse = {
  success: boolean
  data?: {
    pages: FacebookPage[]
  }
  message?: unknown
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
      throw new Error(extractErrorMessage(data, "Failed to save onboarding profile."))
    }

    return data
  } catch (err: unknown) {
    throw new Error(extractErrorMessage(err, "Unable to save onboarding profile."))
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
      throw new Error(extractErrorMessage(data, `Failed to get ${platform} auth URL.`))
    }

    return data
  } catch (err: unknown) {
    throw new Error(extractErrorMessage(err, `Unable to initiate ${platform} connection.`))
  }
}

/**
 * Exchange the authorization code for platform tokens.
 * Step 3 of the OAuth flow — called from the callback page.
 */
export const exchangeOAuthCode = async (payload: {
  platform: OnboardingPlatform
  code?: string
  state?: string
  redirect_uri?: string
  page_id?: string
  oauth_token?: string
  oauth_verifier?: string
}): Promise<ConnectResponse> => {
  try {
    const endpoint = CONNECT_ENDPOINTS[payload.platform]

    const requestBody: Record<string, unknown> = {}
    if (payload.platform === "twitter" && payload.oauth_token && payload.oauth_verifier) {
      requestBody.oauth_token = payload.oauth_token
      requestBody.oauth_verifier = payload.oauth_verifier
    } else {
      if (payload.code) requestBody.code = payload.code
      if (payload.state) requestBody.state = payload.state
      if (payload.redirect_uri) requestBody.redirect_uri = payload.redirect_uri
      if (payload.page_id) requestBody.page_id = payload.page_id
    }

    const { data } = await api.post<ConnectResponse>(endpoint, requestBody)

    if (!data.success) {
      throw new Error(
        extractErrorMessage(data, `Failed to connect ${payload.platform} account.`),
      )
    }

    return data
  } catch (err: unknown) {
    throw new Error(
      extractErrorMessage(err, `Unable to connect ${payload.platform} account.`),
    )
  }
}

export const getFacebookPages = async (
  code: string,
  redirectUri: string
): Promise<FacebookPagesResponse> => {
  try {
    const { data } = await api.post<FacebookPagesResponse>(FACEBOOK_PAGES_ENDPOINT, {
      code,
      redirect_uri: redirectUri,
    })

    if (!data.success) {
      throw new Error(extractErrorMessage(data, "Unable to fetch Facebook pages."))
    }

    return data
  } catch (err: unknown) {
    throw new Error(extractErrorMessage(err, "Unable to fetch Facebook pages."))
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
        extractErrorMessage(data, `Failed to initiate ${platform} connection.`),
      )
    }

    return data
  } catch (err: unknown) {
    throw new Error(
      extractErrorMessage(err, `Unable to connect ${platform}.`),
    )
  }
}
