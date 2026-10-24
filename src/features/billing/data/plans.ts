import type { PlanTier } from "../types"

export interface PlanFeature {
  text: string
  highlight?: boolean
}

export interface PlanCardConfig {
  tier: PlanTier
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  priceNgnMonthly: number
  priceNgnYearly: number
  popular?: boolean
  badge?: string
  hidden?: boolean
  features: PlanFeature[]
}

export const PLAN_CONFIGS: PlanCardConfig[] = [
  {
    tier: "free",
    name: "Free",
    description: "Essential tools to kickstart your social media presence.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    priceNgnMonthly: 0,
    priceNgnYearly: 0,
    features: [
      { text: "1 Brand workspace" },
      { text: "3 Connected social accounts" },
      { text: "30 Monthly platform posts" },
      { text: "1 Team member" },
      { text: "Visual content calendar" },
      { text: "Standard analytics" },
      { text: "Limited AI features" },
    ],
  },
  {
    tier: "starter",
    name: "Starter",
    description: "Solo creators and small accounts getting serious with publishing.",
    monthlyPrice: 6,
    yearlyPrice: 60,
    priceNgnMonthly: 5000,
    priceNgnYearly: 50000,
    features: [
      { text: "2 Brand workspaces", highlight: true },
      { text: "14 Connected social accounts", highlight: true },
      { text: "Unlimited monthly posts", highlight: true },
      { text: "1 Team member" },
      { text: "Visual content calendar" },
      { text: "Standard analytics" },
      { text: "Limited AI features" },
    ],
  },
  {
    tier: "creator",
    name: "Creator",
    description: "Power creators, influencers, and brands with multi-accounts & analytics.",
    monthlyPrice: 12,
    yearlyPrice: 120,
    priceNgnMonthly: 14000,
    priceNgnYearly: 140000,
    popular: true,
    badge: "Most Popular",
    features: [
      { text: "4 Brand workspaces", highlight: true },
      { text: "28 Connected social accounts", highlight: true },
      { text: "Unlimited monthly posts", highlight: true },
      { text: "Up to 5 team members", highlight: true },
      { text: "Visual content calendar" },
      { text: "Advanced analytics & insights", highlight: true },
      { text: "Full AI caption & idea generation", highlight: true },
    ],
  },
  {
    tier: "agency",
    name: "Agency",
    description: "Agencies and multi-client businesses requiring maximum power.",
    monthlyPrice: 35,
    yearlyPrice: 350,
    priceNgnMonthly: 45000,
    priceNgnYearly: 450000,
    badge: "Agencies & Teams",
    hidden: true, // Configured and ready; hidden for launch as per requirement
    features: [
      { text: "10 Brand workspaces", highlight: true },
      { text: "Unlimited social accounts", highlight: true },
      { text: "Unlimited monthly posts", highlight: true },
      { text: "Up to 15 team members", highlight: true },
      { text: "Visual content calendar" },
      { text: "Advanced analytics & insights" },
      { text: "Full AI caption & idea generation" },
      { text: "Priority support & features", highlight: true },
    ],
  },
]

/**
 * Plans displayed on the website for launch (Free, Starter, Creator).
 * Agency remains fully configured in PLAN_CONFIGS and can be made visible anytime.
 */
export const VISIBLE_PLANS = PLAN_CONFIGS.filter((p) => !p.hidden)
