import axios from "axios"
import { api } from "@/lib/api"
import type { AuthProfile } from "@/features/auth/types"
import { BRANDS_ENDPOINTS } from "./endpoints"
import type {
  BrandInvitation,
  BrandInvitationRole,
  BrandMember,
  SendInvitationData,
  ReceivedBrandInvitation,
  AcceptInvitationResponse,
} from "../types/members"

export type CreateBrandData = {
  name: string
  industry: string
  team_size: string
  primary_platform: string
  posting_frequency: string
  logo_url?: string
}

export type BrandSummary = {
  id: string
  name: string
  logo_url?: string | null
  is_default?: boolean
  is_active?: boolean
  role?: string | null
}

type ApiResponse<T> = {
  success?: boolean
  message?: string
  data?: T
}

type BrandsListResponse = {
  success: boolean
  data: BrandSummary[]
}

const extractApiError = (error: unknown, fallbackMessage: string): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (typeof data === "string") return data
    if (data?.message) return data.message
    if (data?.detail) return data.detail
    if (data?.errors?.detail) return data.errors.detail
    if (data?.errors && typeof data.errors === "object") {
      const firstKey = Object.keys(data.errors)[0]
      const firstVal = data.errors[firstKey]
      if (Array.isArray(firstVal) && firstVal.length > 0) return `${firstKey}: ${firstVal[0]}`
      if (typeof firstVal === "string") return `${firstKey}: ${firstVal}`
    }
    if (data?.email && Array.isArray(data.email)) return data.email[0]
  } else if (error instanceof Error) {
    return error.message
  }
  return fallbackMessage
}

export const fetchBrands = async (): Promise<BrandSummary[]> => {
  const { data } = await api.get<BrandsListResponse>(BRANDS_ENDPOINTS.list)

  if (!data.success || !Array.isArray(data.data)) {
    throw new Error("Failed to load brands.")
  }

  return data.data
}

export const createBrand = async (data: CreateBrandData) => {
  const response = await api.post(BRANDS_ENDPOINTS.create, data)
  return response.data
}

type SetActiveBrandResponse = {
  success: boolean
  message?: string
  data: AuthProfile
}

export const setActiveBrand = async (brandId: string): Promise<AuthProfile> => {
  const { data } = await api.post<SetActiveBrandResponse>(BRANDS_ENDPOINTS.setActive, {
    brand_id: brandId,
  })

  if (!data.success || !data.data) {
    throw new Error(data.message || "Failed to set active brand.")
  }

  return data.data
}

/* =========================================================================
   Brand Members & Invitations API
   ========================================================================= */

export const fetchBrandMembers = async (brandId: string): Promise<BrandMember[]> => {
  try {
    const response = await api.get<ApiResponse<BrandMember[]> | BrandMember[]>(
      BRANDS_ENDPOINTS.members(brandId),
    )

    if (Array.isArray(response.data)) {
      return response.data
    }

    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data
    }

    return []
  } catch (error) {
    throw new Error(extractApiError(error, "Failed to load brand members."))
  }
}

export const fetchBrandInvitations = async (brandId: string): Promise<BrandInvitation[]> => {
  try {
    const response = await api.get<ApiResponse<BrandInvitation[]> | BrandInvitation[]>(
      BRANDS_ENDPOINTS.invitations(brandId),
    )

    if (Array.isArray(response.data)) {
      return response.data
    }

    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data
    }

    return []
  } catch (error) {
    throw new Error(extractApiError(error, "Failed to load brand invitations."))
  }
}

export const sendBrandInvitation = async (
  brandId: string,
  payload: SendInvitationData,
): Promise<BrandInvitation> => {
  try {
    const response = await api.post<ApiResponse<BrandInvitation> | BrandInvitation>(
      BRANDS_ENDPOINTS.invitations(brandId),
      payload,
    )

    if ("data" in response.data && response.data.data && typeof response.data.data === "object") {
      return response.data.data as BrandInvitation
    }

    return response.data as BrandInvitation
  } catch (error) {
    throw new Error(extractApiError(error, "Failed to send invitation."))
  }
}

export const revokeBrandInvitation = async (
  brandId: string,
  invitationId: string,
): Promise<void> => {
  try {
    await api.delete(BRANDS_ENDPOINTS.invitationDetail(brandId, invitationId))
  } catch (error) {
    throw new Error(extractApiError(error, "Failed to revoke invitation."))
  }
}

export const resendBrandInvitation = async (
  brandId: string,
  invitationId: string,
): Promise<BrandInvitation> => {
  try {
    const response = await api.post<ApiResponse<BrandInvitation> | BrandInvitation>(
      BRANDS_ENDPOINTS.resendInvitation(brandId, invitationId),
    )

    if ("data" in response.data && response.data.data && typeof response.data.data === "object") {
      return response.data.data as BrandInvitation
    }

    return response.data as BrandInvitation
  } catch (error) {
    throw new Error(extractApiError(error, "Failed to resend invitation."))
  }
}

export const updateBrandMemberRole = async (
  brandId: string,
  memberId: string,
  role: BrandInvitationRole,
): Promise<BrandMember> => {
  try {
    const response = await api.patch<ApiResponse<BrandMember> | BrandMember>(
      BRANDS_ENDPOINTS.memberDetail(brandId, memberId),
      { role },
    )

    if ("data" in response.data && response.data.data && typeof response.data.data === "object") {
      return response.data.data as BrandMember
    }

    return response.data as BrandMember
  } catch (error) {
    throw new Error(extractApiError(error, "Failed to update member role."))
  }
}

export const removeBrandMember = async (
  brandId: string,
  memberId: string,
): Promise<void> => {
  try {
    await api.delete(BRANDS_ENDPOINTS.memberDetail(brandId, memberId))
  } catch (error) {
    throw new Error(extractApiError(error, "Failed to remove member."))
  }
}

/* =========================================================================
   Received Invitations (for Current User)
   ========================================================================= */

export const fetchReceivedInvitations = async (
  status: string = "pending",
): Promise<ReceivedBrandInvitation[]> => {
  try {
    const response = await api.get<
      ApiResponse<ReceivedBrandInvitation[]> | ReceivedBrandInvitation[]
    >(BRANDS_ENDPOINTS.receivedInvitations, {
      params: { status },
    })

    if (Array.isArray(response.data)) {
      return response.data
    }

    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data
    }

    return []
  } catch (error) {
    throw new Error(extractApiError(error, "Failed to load received invitations."))
  }
}

export const acceptReceivedInvitation = async (
  invitationId: string,
): Promise<AcceptInvitationResponse> => {
  try {
    const response = await api.post<
      ApiResponse<AcceptInvitationResponse> | AcceptInvitationResponse
    >(BRANDS_ENDPOINTS.acceptInvitation(invitationId))

    if (
      "data" in response.data &&
      response.data.data &&
      typeof response.data.data === "object"
    ) {
      return response.data.data as AcceptInvitationResponse
    }

    return response.data as AcceptInvitationResponse
  } catch (error) {
    throw new Error(extractApiError(error, "Failed to accept invitation."))
  }
}

export const declineReceivedInvitation = async (
  invitationId: string,
): Promise<void> => {
  try {
    await api.post(BRANDS_ENDPOINTS.declineInvitation(invitationId))
  } catch (error) {
    throw new Error(extractApiError(error, "Failed to decline invitation."))
  }
}
