"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Sparkles, X } from "lucide-react"

interface BetaCommunityBannerProps {
  whatsappUrl?: string
}

function WhatsAppIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.301-.15-1.782-.879-2.057-.979-.276-.1-.476-.15-.676.15s-.777.979-.953 1.18c-.175.2-.351.226-.652.075s-1.272-.469-2.423-1.496c-.896-.799-1.501-1.787-1.677-2.088-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.15-.175.2-.301.301-.501.1-.2.05-.376-.025-.526s-.676-1.63-1.026-2.232c-.24-.412-.485-.355-.667-.364l-.57-.008c-.197 0-.517.074-.787.369s-1.034 1.011-1.034 2.465 1.059 2.857 1.209 3.057c.15.2 2.085 3.184 5.051 4.466.706.305 1.258.487 1.688.624.71.226 1.356.194 1.867.118.57-.085 1.782-.728 2.033-1.431.251-.703.251-1.305.176-1.431-.075-.126-.275-.201-.576-.351zm-5.467 7.618a9.92 9.92 0 0 1-5.06-1.385l-.363-.216-3.763.987 1.004-3.668-.236-.376a9.92 9.92 0 0 1-1.521-5.267c0-5.485 4.462-9.947 9.947-9.947 2.656 0 5.153 1.034 7.028 2.91 1.876 1.876 2.91 4.373 2.91 7.037 0 5.485-4.462 9.947-9.946 9.947z" />
    </svg>
  )
}

const STORAGE_KEY = "post_reach_beta_banner_dismissed"

export function BetaCommunityBanner({
  whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL || "https://chat.whatsapp.com/LN9UsbXfRRm2cfHLKjPznZ?s=cl&p=i&mlu=4&ilr=4e",
}: BetaCommunityBannerProps) {
  const [isVisible, setIsVisible] = React.useState(true)
  const bannerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const isDismissed = sessionStorage.getItem(STORAGE_KEY)
    if (isDismissed === "true") {
      setIsVisible(false)
    }
  }, [])

  React.useLayoutEffect(() => {
    if (!isVisible) {
      document.documentElement.style.setProperty("--beta-banner-height", "0px")
      return
    }

    const updateHeight = () => {
      if (bannerRef.current) {
        document.documentElement.style.setProperty(
          "--beta-banner-height",
          `${bannerRef.current.offsetHeight}px`
        )
      }
    }

    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => {
      window.removeEventListener("resize", updateHeight)
      document.documentElement.style.removeProperty("--beta-banner-height")
    }
  }, [isVisible])

  const handleDismiss = () => {
    setIsVisible(false)
    sessionStorage.setItem(STORAGE_KEY, "true")
    document.documentElement.style.setProperty("--beta-banner-height", "0px")
  }

  if (!isVisible) return null

  return (
    <div
      ref={bannerRef}
      className="sticky top-0 z-40 w-full bg-linear-to-r from-slate-950 via-slate-900 to-zinc-950 text-white border-b border-white/10 px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium transition-all shadow-xs"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 pr-8 sm:pr-6 text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400 border border-amber-500/30 shrink-0">
          <Sparkles className="size-3" />
          Beta Notice
        </span>

        {/* Message */}
        <span className="text-slate-200 text-xs sm:text-sm">
          You need to be in the beta community to use{" "}
          <strong className="font-semibold text-white">Instagram</strong> and{" "}
          <strong className="font-semibold text-white">Facebook</strong>.
        </span>

        {/* WhatsApp Join Button */}
        <Link
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs px-3 py-1 shadow-sm transition hover:scale-105 active:scale-95 shrink-0"
        >
          <WhatsAppIcon className="size-3.5 fill-white" />
          <span>Join Community</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
        aria-label="Dismiss banner"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}
