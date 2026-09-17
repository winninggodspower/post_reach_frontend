"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { fetchAdminAnalytics } from "../api/server"
import type { AdminAnalyticsData } from "../types"
import { extractErrorMessage } from "@/shared/lib/extract-error-message"

export function useAdminAnalytics() {
  const [data, setData] = useState<AdminAnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isForbidden, setIsForbidden] = useState(false)
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null)

  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setError(null)
    setIsForbidden(false)

    try {
      const response = await fetchAdminAnalytics()
      if (response.success && response.data) {
        setData(response.data)
        setLastRefreshedAt(new Date())
      } else {
        setError(response.message || "Failed to load admin analytics.")
      }
    } catch (err: unknown) {
      console.error("Admin analytics error:", err)
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setIsForbidden(true)
        setError("Permission denied. Superadmin access is required to view platform telemetry.")
      } else {
        setError(extractErrorMessage(err, "Failed to load admin analytics."))
      }
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void loadData(false)
  }, [loadData])

  const refetch = useCallback(() => {
    return loadData(true)
  }, [loadData])

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    isForbidden,
    lastRefreshedAt,
    refetch,
  }
}
