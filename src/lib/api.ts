import axios from "axios"

import { AUTH_ENDPOINTS } from "@/lib/auth/endpoints"
import { useAuthStore } from "@/store/auth-store"

const normalizeUrl = (value: string) => value.replace(/\/$/, "")

const API_BASE_URL = normalizeUrl(
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

let refreshPromise: Promise<string | null> | null = null

export const refreshAccessToken = async (refreshToken: string) => {
  const { data } = await authApi.post<{ access?: string; accessToken?: string }>(
    AUTH_ENDPOINTS.refresh,
    {
      refresh: refreshToken,
    },
  )

  return data.accessToken ?? data.access ?? null
}

const shouldSkipRefresh = (url?: string) => {
  if (!url) {
    return false
  }

  return [AUTH_ENDPOINTS.login, AUTH_ENDPOINTS.refresh, AUTH_ENDPOINTS.register].some(
    (endpoint) => url.includes(endpoint),
  )
}

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken

  if (accessToken) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
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

    const refreshToken = useAuthStore.getState().refreshToken

    if (!refreshToken) {
      useAuthStore.getState().clearTokens()
      return Promise.reject(error)
    }

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken(refreshToken)
          .then((accessToken) => {
            if (accessToken) {
              useAuthStore.getState().updateAccessToken(accessToken)
            }

            return accessToken
          })
          .catch(() => {
            useAuthStore.getState().clearTokens()
            return null
          })
          .finally(() => {
            refreshPromise = null
          })
      }

      const newAccessToken = await refreshPromise

      if (!newAccessToken) {
        return Promise.reject(error)
      }

      originalRequest.headers = originalRequest.headers ?? {}
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

      return api(originalRequest)
    } catch {
      useAuthStore.getState().clearTokens()
      return Promise.reject(error)
    }
  },
)
