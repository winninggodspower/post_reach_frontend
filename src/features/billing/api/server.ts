import axios from "axios"
import { api } from "@/lib/api"
import { BILLING_ENDPOINTS } from "./endpoints"
import type {
  CheckoutSessionRequest,
  CheckoutSessionResponse,
  CustomerPortalResponse,
  SubscriptionPlan,
  UserSubscription,
} from "../types"

interface ApiResponse<T> {
  success?: boolean
  message?: string
  data?: T
}

export const extractBillingError = (error: unknown, fallbackMessage: string): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (typeof data === "string") return data
    if (data?.message) return data.message
    if (data?.detail) return data.detail
    if (data?.errors?.detail) return data.errors.detail
    if (data?.errors && typeof data.errors === "object") {
      const firstKey = Object.keys(data.errors)[0]
      const firstVal = data.errors[firstKey]
      if (Array.isArray(firstVal) && firstVal.length > 0) return `${firstKey}: ${firstVal[0]}`
      if (typeof firstVal === "string") return `${firstKey}: ${firstVal}`
    }
  } else if (error instanceof Error) {
    return error.message
  }
  return fallbackMessage
}

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const response = await api.get<ApiResponse<SubscriptionPlan[]>>(BILLING_ENDPOINTS.plans)
    return response.data?.data ?? []
  } catch (error) {
    throw new Error(extractBillingError(error, "Failed to load subscription plans."))
  }
}

export async function fetchUserSubscription(): Promise<UserSubscription | null> {
  try {
    const response = await api.get<ApiResponse<UserSubscription>>(BILLING_ENDPOINTS.me)
    return response.data?.data ?? null
  } catch (error) {
    throw new Error(extractBillingError(error, "Failed to load subscription details."))
  }
}

export async function createCheckoutSession(
  payload: CheckoutSessionRequest,
): Promise<CheckoutSessionResponse> {
  try {
    const response = await api.post<ApiResponse<CheckoutSessionResponse>>(
      BILLING_ENDPOINTS.checkout,
      payload,
    )
    if (!response.data?.data) {
      throw new Error("Invalid response from checkout service.")
    }
    return response.data.data
  } catch (error) {
    throw new Error(extractBillingError(error, "Failed to create checkout session."))
  }
}

export async function fetchCustomerPortalUrl(): Promise<string> {
  try {
    const response = await api.post<ApiResponse<CustomerPortalResponse>>(BILLING_ENDPOINTS.portal)
    if (!response.data?.data?.portal_url) {
      throw new Error("Unable to retrieve customer portal URL.")
    }
    return response.data.data.portal_url
  } catch (error) {
    throw new Error(extractBillingError(error, "Failed to open customer portal."))
  }
}

export async function cancelUserSubscription(
  cancelAtPeriodEnd: boolean = true,
): Promise<UserSubscription> {
  try {
    const response = await api.post<ApiResponse<UserSubscription>>(BILLING_ENDPOINTS.cancel, {
      cancel_at_period_end: cancelAtPeriodEnd,
    })
    if (!response.data?.data) {
      throw new Error("Unable to cancel subscription.")
    }
    return response.data.data
  } catch (error) {
    throw new Error(extractBillingError(error, "Failed to cancel subscription."))
  }
}
