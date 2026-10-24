"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuthStatus } from "@/features/auth/hooks/use-auth-status"
import { createCheckoutSession } from "../api/server"
import type { BillingInterval, PlanTier } from "../types"

interface UseCheckoutOptions {
  onSuccess?: () => void
}

export function useCheckout(options?: UseCheckoutOptions) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStatus()
  const [loadingTier, setLoadingTier] = useState<PlanTier | null>(null)

  const initiateCheckout = async (
    tier: "starter" | "creator" | "agency",
    interval: BillingInterval = "month",
  ) => {
    if (!isAuthenticated) {
      toast.info("Please sign in or create an account to subscribe.")
      router.push(`/signin?redirect=${encodeURIComponent("/pricing")}`)
      return
    }

    setLoadingTier(tier)
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : ""
      const session = await createCheckoutSession({
        plan_tier: tier,
        billing_interval: interval,
        currency: "USD",
        payment_method: "auto",
        success_url: `${origin}/pricing/success?tier=${tier}`,
        cancel_url: `${origin}/pricing?checkout=cancelled`,
      })

      if (session.checkout_url) {
        options?.onSuccess?.()
        window.location.href = session.checkout_url
      } else {
        throw new Error("No checkout URL returned from payment server.")
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to start checkout. Please try again."
      toast.error(msg)
      setLoadingTier(null)
    }
  }

  return {
    initiateCheckout,
    loadingTier,
    isLoading: loadingTier !== null,
  }
}
