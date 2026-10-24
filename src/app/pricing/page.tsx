import React, { Suspense } from "react"
import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import { CtaFooter } from "@/features/landing/components/cta-footer"
import { PricingTable } from "@/features/billing/components/pricing-table"
import { Loader2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing Plans & Subscriptions | PostGlee",
  description:
    "Simple, predictable plans for creators, agencies, and social teams. Scale your presence across Instagram, TikTok, X, YouTube, and Facebook.",
}

const PRICING_FAQS = [
  {
    q: "How does billing work?",
    a: "We offer both monthly and annual subscriptions. Annual plans include 2 months free (~17% discount). Payments are securely handled through Bachs via credit or debit card.",
  },
  {
    q: "Can I change or cancel my plan anytime?",
    a: "Yes! You can upgrade, downgrade, or cancel your subscription at any time from your account settings. When you cancel, you will continue to enjoy your paid features until the end of your current billing period.",
  },
  {
    q: "What payment methods are supported?",
    a: "We accept all major credit and debit cards (Visa, Mastercard, American Express). If you are paying from Nigeria, direct bank money transfer is also supported via our Bachs checkout.",
  },
  {
    q: "Is there any setup fee or hidden cost?",
    a: "No setup fees or hidden surprises. The price you see is the price you pay.",
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-orange-500 selection:text-white">
      {/* Global Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* Simple Header */}
        <section className="pt-12 pb-2 px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Simple, predictable pricing
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Choose the plan that fits your growth. Upgrade or cancel anytime.
          </p>
        </section>

        {/* Pricing Table with Suspense for SearchParams */}
        <section className="relative pb-16">
          <Suspense
            fallback={
              <div className="w-full flex items-center justify-center py-24 text-slate-400">
                <Loader2 className="size-8 animate-spin text-orange-500" />
              </div>
            }
          >
            <PricingTable />
          </Suspense>
        </section>

        {/* Pricing FAQ Section */}
        <section className="relative px-6 py-20 bg-slate-50/60 border-t border-slate-100">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Have questions about billing or plans? We&apos;ve got answers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PRICING_FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs"
                >
                  <h3 className="font-semibold text-slate-900 text-base mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Global CTA Footer */}
      <CtaFooter />
    </div>
  )
}
