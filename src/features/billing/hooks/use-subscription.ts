"use client"

import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@/features/auth/store/auth-store"
import { useAuthStatus } from "@/features/auth/hooks/use-auth-status"
import { fetchUserSubscription } from "../api/server"
import type { PlanTier, UserSubscription } from "../types"

export function useSubscription() {
  const { isAuthenticated, isHydrated } = useAuthStatus()
  const user = useAuth((state) => state.user)

  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const loadSubscription = useCallback(async () => {
    if (!isAuthenticated) {
      setSubscription(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchUserSubscription()
      setSubscription(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subscription")
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isHydrated) {
      loadSubscription()
    }
  }, [isHydrated, loadSubscription])

  const currentTier: PlanTier = subscription?.plan?.tier ?? "free"
  const isPaid = currentTier !== "free"
  const isActive = subscription?.is_valid_active ?? true

  return {
    subscription,
    isLoading,
    error,
    currentTier,
    isPaid,
    isActive,
    refetch: loadSubscription,
  }
}
