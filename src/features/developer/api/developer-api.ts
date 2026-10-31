import { api, API_BASE_URL } from "@/lib/api"
import type {
  ApiResponse,
  CreateApplicationPayload,
  DeveloperApplication,
  OAuthScope,
  RegenerateSecretResponse,
  UpdateApplicationPayload,
} from "../types"

export const getApiBaseDomain = (): string => {
  return API_BASE_URL.replace(/\/api\/?$/, "")
}

export const fetchDeveloperApplications = async (): Promise<
  DeveloperApplication[]
> => {
  const { data } = await api.get<ApiResponse<DeveloperApplication[]>>(
    "/developers/applications/",
  )
  return data.data ?? []
}

export const createDeveloperApplication = async (
  payload: CreateApplicationPayload,
): Promise<DeveloperApplication> => {
  const { data } = await api.post<ApiResponse<DeveloperApplication>>(
    "/developers/applications/",
    payload,
  )
  return data.data
}

export const fetchDeveloperApplication = async (
  clientId: string,
): Promise<DeveloperApplication> => {
  const { data } = await api.get<ApiResponse<DeveloperApplication>>(
    `/developers/applications/${clientId}/`,
  )
  return data.data
}

export const updateDeveloperApplication = async (
  clientId: string,
  payload: UpdateApplicationPayload,
): Promise<DeveloperApplication> => {
  const { data } = await api.patch<ApiResponse<DeveloperApplication>>(
    `/developers/applications/${clientId}/`,
    payload,
  )
  return data.data
}

export const deleteDeveloperApplication = async (
  clientId: string,
): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/developers/applications/${clientId}/`)
}

export const regenerateApplicationSecret = async (
  clientId: string,
): Promise<RegenerateSecretResponse> => {
  const { data } = await api.post<ApiResponse<RegenerateSecretResponse>>(
    `/developers/applications/${clientId}/regenerate-secret/`,
  )
  return data.data
}

export const fetchSupportedScopes = async (): Promise<OAuthScope[]> => {
  const { data } = await api.get<ApiResponse<OAuthScope[]>>(
    "/developers/scopes/",
  )
  return data.data ?? []
}
