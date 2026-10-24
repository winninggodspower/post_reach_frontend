"use client"

import React, { Suspense, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react"
import confetti from "canvas-confetti"

import Navbar from "@/components/navbar"
import { CtaFooter } from "@/features/landing/components/cta-footer"
import { Button } from "@/components/ui/button"
import { PLAN_CONFIGS } from "@/features/billing/data/plans"
import { useSubscription } from "@/features/billing/hooks/use-subscription"
import type { PlanTier } from "@/features/billing/types"

function SuccessContent() {
  const searchParams = useSearchParams()
  const rawTier = searchParams.get("tier")?.toLowerCase()
  const checkoutId = searchParams.get("checkout_id")

  const tier: PlanTier =
    rawTier === "creator" ? "creator" : rawTier === "agency" ? "agency" : "starter"
  const plan = PLAN_CONFIGS.find((p) => p.tier === tier) ?? PLAN_CONFIGS[1]

  const { refetch } = useSubscription()

  const fireCelebration = () => {
    const brandColors = ["#ea580c", "#fb923c", "#10b981", "#f59e0b", "#3b82f6"]
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: brandColors,
    })
  }

  useEffect(() => {
    const brandColors = ["#ea580c", "#fb923c", "#10b981", "#f59e0b", "#3b82f6"]

    // 1. Initial center burst
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.55 },
      colors: brandColors,
    })

    // 2. Left side cannon
    const leftTimer = setTimeout(() => {
      confetti({
        particleCount: 55,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.65 },
        colors: brandColors,
      })
    }, 250)

    // 3. Right side cannon
    const rightTimer = setTimeout(() => {
      confetti({
        particleCount: 55,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.65 },
        colors: brandColors,
      })
    }, 450)

    // Trigger subscription state refresh on mount and shortly after to sync with webhook
    refetch()
    const t1 = setTimeout(() => refetch(), 1500)
    const t2 = setTimeout(() => refetch(), 3500)

    return () => {
      clearTimeout(leftTimer)
      clearTimeout(rightTimer)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [refetch])

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center">
      {/* Clean Success Icon */}
      <button
        type="button"
        onClick={fireCelebration}
        title="Click to celebrate!"
        className="mx-auto size-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-5 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-transform focus:outline-none"
      >
        <CheckCircle2 className="size-9 stroke-[2.2]" />
      </button>

      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
        Welcome to {plan.name}!
      </h1>

      <p className="mt-3 text-base text-slate-600 max-w-md mx-auto leading-relaxed">
        Your payment was successful and your subscription is now active.
      </p>

      {/* Plan Details Card */}
      <div className="mt-10 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 text-left shadow-sm">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{plan.name} Plan</h2>
            <p className="text-xs text-slate-500 mt-0.5">Active & Ready to use</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
            Active
          </span>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            What you&apos;ve unlocked:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {plan.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{feat.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {checkoutId && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Reference ID</span>
            <code className="font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded">
              {checkoutId}
            </code>
          </div>
        )}
      </div>

      {/* Action CTA Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/dashboard" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto h-12 px-8 rounded-full font-bold bg-linear-to-r from-orange-600 via-orange-600 to-amber-600 text-white shadow-md hover:brightness-105 transition-all text-sm gap-2">
            <span>Go to Dashboard</span>
            <ArrowRight className="size-4" />
          </Button>
        </Link>
        <Link href="/dashboard/connections" className="w-full sm:w-auto">
          <Button
            variant="outline"
            className="w-full sm:w-auto h-12 px-8 rounded-full font-semibold border-slate-300 text-slate-700 hover:bg-slate-50 transition-all text-sm"
          >
            Connect Social Channels
          </Button>
        </Link>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="size-4 text-emerald-600" />
        <span>
          {tier === "creator"
            ? "A receipt and your exclusive Creator community invite have been sent to your email."
            : "A receipt and payment confirmation has been sent to your email."}
        </span>
      </div>
    </div>
  )
}

export default function PricingSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-900">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="py-24 text-center text-slate-400 text-sm">
              Loading confirmation...
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </main>
      <CtaFooter />
    </div>
  )
}
