import { api } from "@/lib/api"
import type { OnboardingPlatform } from "@/features/onboarding/types"

type OAuthInitResponse = {
  success: boolean
  redirect_url: string
  message?: string
}

const platformToEndpoint = (platform: OnboardingPlatform): string => {
  const map: Record<OnboardingPlatform, string> = {
    instagram: "/auth/instagram/connect/",
    facebook: "/auth/facebook/connect/",
    x: "/auth/x/connect/",
    tiktok: "/auth/tiktok/connect/",
    linkedin: "/auth/linkedin/connect/",
    youtube: "/auth/youtube/connect/",
  }

  return map[platform]
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
