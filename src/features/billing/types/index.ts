export type PlanTier = "free" | "starter" | "creator" | "agency"
export type BillingInterval = "month" | "year"
export type Currency = "USD" | "NGN"
export type PaymentMethodOption = "auto" | "card" | "bank_transfer"

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "unpaid"
  | "canceled"
  | "expired"

export interface SubscriptionPlan {
  id: string
  tier: PlanTier
  name: string
  description: string
  price_usd: string
  price_ngn: string
  billing_interval: BillingInterval
  brands_limit: number
  social_accounts_limit: number | null
  monthly_platform_posts_limit: number | null
  team_members_limit: number
  has_content_calendar: boolean
  has_advanced_analytics: boolean
  ai_features: "limited" | "full" | string
}

export interface UserSubscription {
  id: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  is_valid_active: boolean
  billing_interval: BillingInterval
  payment_method_type: string
  currency: Currency
  amount: string
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
}

export interface CheckoutSessionRequest {
  plan_tier: "starter" | "creator" | "agency"
  billing_interval?: BillingInterval
  currency?: Currency
  payment_method?: PaymentMethodOption
  success_url?: string
  cancel_url?: string
}

export interface CheckoutSessionResponse {
  checkout_id: string
  checkout_url: string
  reference: string
  currency: Currency
  amount: string
  plan_tier: PlanTier
  billing_interval: BillingInterval
}

export interface CustomerPortalResponse {
  portal_url: string
}
