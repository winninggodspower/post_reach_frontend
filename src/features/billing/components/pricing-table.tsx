"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowRight, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useAuthStatus } from "@/features/auth/hooks/use-auth-status"
import { VISIBLE_PLANS } from "../data/plans"
import { useSubscription } from "../hooks/use-subscription"
import { useCheckout } from "../hooks/use-checkout"
import type { BillingInterval, PlanTier } from "../types"

export function PricingTable() {
  const searchParams = useSearchParams()
  const checkoutStatus = searchParams.get("checkout")
  const upgradedTier = searchParams.get("tier")

  const [interval, setInterval] = useState<BillingInterval>("month")
  const { isAuthenticated, isHydrated } = useAuthStatus()
  const { currentTier, subscription, refetch } = useSubscription()
  const { initiateCheckout, loadingTier } = useCheckout()

  // Handle post-checkout feedback
  useEffect(() => {
    if (checkoutStatus === "success") {
      toast.success(
        upgradedTier
          ? `Welcome to Postglee ${upgradedTier.toUpperCase()}! Your subscription is active.`
          : "Your payment was successful! Your subscription is now active."
      )
      refetch()
      const t1 = setTimeout(() => refetch(), 1500)
      const t2 = setTimeout(() => refetch(), 3500)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    } else if (checkoutStatus === "cancelled") {
      toast.info("Checkout was cancelled. No charges were made.")
    }
  }, [checkoutStatus, upgradedTier, refetch])

  const handleActionClick = (tier: PlanTier) => {
    if (tier === "free") return
    initiateCheckout(tier as "starter" | "creator" | "agency", interval)
  }

  // If returning from a successful checkout, prioritize the upgraded tier while webhook completes
  const activePlanTier =
    checkoutStatus === "success" && upgradedTier ? (upgradedTier as PlanTier) : currentTier

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Interval Switch Toggle */}
      <div className="flex items-center justify-center gap-3.5 mb-12 sm:mb-16 select-none">
        <button
          type="button"
          onClick={() => setInterval("month")}
          className={`text-sm cursor-pointer transition-colors ${
            interval === "month"
              ? "font-bold text-slate-900"
              : "font-medium text-slate-400 hover:text-slate-600"
          }`}
        >
          Monthly
        </button>

        <button
          type="button"
          role="switch"
          aria-checked={interval === "year"}
          aria-label="Toggle annual billing"
          onClick={() => setInterval(interval === "month" ? "year" : "month")}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 ${
            interval === "year" ? "bg-slate-900" : "bg-slate-300"
          }`}
        >
          <span
            className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              interval === "year" ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInterval("year")}
            className={`text-sm cursor-pointer transition-colors ${
              interval === "year"
                ? "font-bold text-slate-900"
                : "font-medium text-slate-400 hover:text-slate-600"
            }`}
          >
            Annual
          </button>
          <span className="text-[11px] font-bold tracking-wide px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Save 2 months
          </span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {VISIBLE_PLANS.map((plan) => {
          const isCurrentPlan = isHydrated && isAuthenticated && activePlanTier === plan.tier
          const isPopular = Boolean(plan.popular)
          const isLoadingThis = loadingTier === plan.tier

          const price = interval === "month" ? plan.monthlyPrice : plan.yearlyPrice
          const billingSuffix =
            plan.tier === "free"
              ? "free forever"
              : interval === "month"
              ? "/ month"
              : "/ year"

          return (
            <div
              key={plan.tier}
              className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02] ${
                isPopular
                  ? "bg-white border-2 border-orange-500 shadow-lg hover:shadow-xl"
                  : "bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-lg"
              }`}
            >
              {/* Badge for Popular or other special tiers */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className={`inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full text-white shadow-xs ${
                      isPopular
                        ? "bg-linear-to-r from-orange-600 to-amber-600"
                        : "bg-slate-900"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                  {isCurrentPlan && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Current Plan
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-500 min-h-10 leading-relaxed">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="my-6 pb-6 border-b border-slate-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                      ${price}
                    </span>
                    <span className="text-sm font-medium text-slate-500">
                      {billingSuffix}
                    </span>
                  </div>
                  {interval === "year" && plan.tier !== "free" && (
                    <p className="text-xs text-orange-600 font-medium mt-1.5">
                      Billed annually (${(price / 12).toFixed(2)}/mo equivalent)
                    </p>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3.5 mb-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    What&apos;s included:
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <div
                          className={`mt-0.5 rounded-full p-0.5 shrink-0 ${
                            isPopular
                              ? "bg-orange-100 text-orange-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          <Check className="size-3.5 stroke-[2.5]" />
                        </div>
                        <span
                          className={
                            feature.highlight
                              ? "font-semibold text-slate-900"
                              : "text-slate-600"
                          }
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA Action Button */}
              <div className="pt-4 border-t border-slate-100">
                {isCurrentPlan ? (
                  <Button
                    variant="outline"
                    disabled
                    className="w-full h-11 rounded-xl font-semibold border-slate-200 text-slate-500 bg-slate-50"
                  >
                    Current Plan
                  </Button>
                ) : plan.tier === "free" ? (
                  <Link href={isAuthenticated ? "/dashboard" : "/signup"} className="w-full block">
                    <Button
                      variant="outline"
                      className="w-full h-11 rounded-xl font-semibold border-slate-300 text-slate-800 hover:bg-slate-50 hover:text-slate-900"
                    >
                      {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={() => handleActionClick(plan.tier)}
                    disabled={isLoadingThis}
                    className={`w-full h-11 rounded-xl font-semibold text-white shadow-sm transition-all duration-200 group/btn ${
                      isPopular
                        ? "bg-linear-to-r from-orange-600 via-orange-600 to-amber-600 hover:brightness-105 shadow-orange-500/20"
                        : "bg-slate-900 hover:bg-slate-800"
                    }`}
                  >
                    {isLoadingThis ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-2" />
                        <span>Redirecting to checkout...</span>
                      </>
                    ) : (
                      <>
                        <span>Upgrade to {plan.name}</span>
                        <ArrowRight className="size-4 ml-1.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                      </>
                    )}
                  </Button>
                )}
                <p className="text-center text-[11px] text-slate-400 mt-2.5">
                  {plan.tier === "free"
                    ? "No credit card required"
                    : "Secure checkout powered by Bachs"}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
