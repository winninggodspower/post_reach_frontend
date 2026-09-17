import axios from "axios"
import { api } from "@/lib/api"
import { ADMIN_ENDPOINTS } from "./endpoints"
import type {
  AdminAnalyticsResponse,
  AdminAnalyticsSummaryResponse,
} from "../types"

export const fetchAdminAnalytics = async (): Promise<AdminAnalyticsResponse> => {
  try {
    const { data } = await api.get<AdminAnalyticsResponse>(ADMIN_ENDPOINTS.analytics)
    return data
  } catch (error) {
    // If root 404s, try overview alias fallback
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      const { data } = await api.get<AdminAnalyticsResponse>(ADMIN_ENDPOINTS.overview)
      return data
    }
    throw error
  }
}

export const fetchAdminAnalyticsSummary = async (): Promise<AdminAnalyticsSummaryResponse> => {
  const { data } = await api.get<AdminAnalyticsSummaryResponse>(ADMIN_ENDPOINTS.summary)
  return data
}
