import axios from "axios"
import { AUTH_ENDPOINTS } from "@/features/auth/api/endpoints"
import type { RefreshedTokens, TokenRefreshResponse } from "@/features/auth/types"

const normalizeUrl = (value: string) => value.replace(/\/$/, "")

export const API_BASE_URL = normalizeUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api",
)

export const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

const getAuthStore = async () => (await import("@/features/auth/store/auth-store")).useAuth

let refreshPromise: Promise<RefreshedTokens | null> | null = null

export const refreshAccessToken = async (
  refreshToken: string,
): Promise<RefreshedTokens | null> => {
  const { data } = await authApi.post<TokenRefreshResponse>(
    AUTH_ENDPOINTS.refresh,
    {
      refresh: refreshToken,
    },
  )

  if (!data?.access || !data?.refresh) {
    return null
  }

  return {
    accessToken: data.access,
    refreshToken: data.refresh,
  }
}

const shouldSkipRefresh = (url?: string) => {
  if (!url) {
    return false
  }

  return [
    AUTH_ENDPOINTS.login,
    AUTH_ENDPOINTS.googleSignIn,
    AUTH_ENDPOINTS.logout,
    AUTH_ENDPOINTS.refresh,
    AUTH_ENDPOINTS.register,
  ].some((endpoint) => url.includes(endpoint))
}

api.interceptors.request.use((config) => {
  return Promise.resolve().then(async () => {
    const authStore = await getAuthStore()
    const accessToken = authStore.getState().accessToken

    if (accessToken) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  })
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const responseStatus = error.response?.status

    if (
      !originalRequest ||
      responseStatus !== 401 ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest.url)
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const authStore = await getAuthStore()
    const refreshToken = authStore.getState().refreshToken

    if (!refreshToken) {
      authStore.getState().clearAuth()
      return Promise.reject(error)
    }

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken(refreshToken)
          .then((tokens) => {
            if (tokens) {
              authStore.getState().updateTokens({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
              })
            }

            return tokens
          })
          .catch(() => {
            authStore.getState().clearAuth()
            return null
          })
          .finally(() => {
            refreshPromise = null
          })
      }

      const refreshed = await refreshPromise

      if (!refreshed?.accessToken) {
        return Promise.reject(error)
      }

      originalRequest.headers = originalRequest.headers ?? {}
      originalRequest.headers.Authorization = `Bearer ${refreshed.accessToken}`

      return api(originalRequest)
    } catch {
      authStore.getState().clearAuth()
      return Promise.reject(error)
    }
  },
)
