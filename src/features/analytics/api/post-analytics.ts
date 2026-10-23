import { api } from "@/lib/api"
import { ANALYTICS_ENDPOINTS } from "./endpoints"
import type { PostAnalyticsApiResponse, PostAnalyticsData } from "../types/post-analytics"

export interface FetchPostAnalyticsOptions {
  refresh?: boolean
  force?: boolean
}

export const fetchPostAnalytics = async (
  postId: string,
  options?: FetchPostAnalyticsOptions
): Promise<PostAnalyticsData> => {
  const params: Record<string, boolean> = {}
  if (options?.refresh || options?.force) {
    params.refresh = true
    params.force = true
  }

  const response = await api.get<PostAnalyticsApiResponse>(
    ANALYTICS_ENDPOINTS.postAnalytics(postId),
    { params }
  )

  if (response.data && response.data.data) {
    return response.data.data
  }

  // Fallback in case backend returns data unwrapped
  return response.data as unknown as PostAnalyticsData
}
