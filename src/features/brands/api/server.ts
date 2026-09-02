import { api } from "@/lib/api"
import type { AuthProfile } from "@/features/auth/types"
import { BRANDS_ENDPOINTS } from "./endpoints"

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
}

type BrandsListResponse = {
  success: boolean
  data: BrandSummary[]
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
