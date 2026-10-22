"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { fetchPostAnalytics } from "../api/post-analytics"
import type { PostAnalyticsData } from "../types/post-analytics"

interface UsePostAnalyticsOptions {
  enabled?: boolean
}

export function usePostAnalytics(
  postId: string | null | undefined,
  options: UsePostAnalyticsOptions = { enabled: true }
) {
  const { enabled = true } = options
  const [data, setData] = useState<PostAnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const loadAnalytics = useCallback(
    async (forceRefresh = false) => {
      if (!postId) {
        setData(null)
        setError(null)
        return
      }

      if (forceRefresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }
      setError(null)

      try {
        const analyticsData = await fetchPostAnalytics(postId, { refresh: forceRefresh })
        setData(analyticsData)
        if (forceRefresh) {
          toast.success("Analytics refreshed successfully from platforms.")
        }
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to fetch post analytics."
        setError(errorMessage)
        if (forceRefresh) {
          toast.error(errorMessage)
        }
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [postId]
  )

  useEffect(() => {
    if (enabled && postId) {
      void loadAnalytics(false)
    } else {
      setData(null)
      setError(null)
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [postId, enabled, loadAnalytics])

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    refresh: () => loadAnalytics(true),
    reload: () => loadAnalytics(false),
  }
}
