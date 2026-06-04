import { api } from "@/lib/api"
import { ONBOARDING_ENDPOINTS } from "@/features/onboarding/api/endpoints"
import type { OnboardingSubmission } from "@/features/onboarding/types"

type OnboardingProfileResponse = {
  success: boolean
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
