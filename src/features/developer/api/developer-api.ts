import axios from "axios"
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

export const applyFormServerErrors = <T extends Record<string, any>>(
  error: unknown,
  setError: (name: any, error: { type: string; message: string }) => void,
): boolean => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (data?.errors && typeof data.errors === "object" && data.errors !== null) {
      let hasFieldErrors = false
      for (const [key, val] of Object.entries(data.errors)) {
        let message = ""
        if (Array.isArray(val)) {
          message = val.filter(Boolean).map(String).join("\n")
        } else if (typeof val === "string") {
          message = val
        } else if (typeof val === "object" && val !== null) {
          message = JSON.stringify(val)
        }

        if (message) {
          setError(key, {
            type: "server",
            message,
          })
          hasFieldErrors = true
        }
      }
      return hasFieldErrors
    }
  }
  return false
}

export const extractDeveloperApiError = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (!data) return error.message || fallbackMessage
    if (typeof data === "string") return data

    // 1. Prioritize detailed field errors in `errors`
    if (data?.errors) {
      if (typeof data.errors === "string") return data.errors
      if (typeof data.errors === "object" && data.errors !== null) {
        const messages: string[] = []
        for (const [, val] of Object.entries(data.errors)) {
          if (Array.isArray(val)) {
            const list = val.filter(Boolean).map(String)
            if (list.length > 0) {
              messages.push(...list)
            }
          } else if (typeof val === "string" && val.trim()) {
            messages.push(val)
          } else if (typeof val === "object" && val !== null) {
            messages.push(JSON.stringify(val))
          }
        }
        if (messages.length > 0) {
          return messages.join(" • ")
        }
      }
    }

    // 2. Next check for `detail`
    if (data?.detail) {
      if (typeof data.detail === "string") return data.detail
      if (Array.isArray(data.detail)) return data.detail.join(" • ")
    }

    // 3. Next check for `error`
    if (data?.error && typeof data.error === "string") {
      return data.error
    }

    // 4. Finally check `message`
    if (data?.message && typeof data.message === "string") {
      return data.message
    }
  }
  if (error instanceof Error) return error.message
  return fallbackMessage
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

