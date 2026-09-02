"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import {
  getBrandGradientIndexFromSeed,
  getBrandGradientStyle,
} from "@/features/brands/lib/brand-gradient"

type BrandAvatarProps = {
  name: string
  logoUrl?: string | null
  brandId?: string
  gradientIndex?: number
  className?: string
}

export function BrandAvatar({
  name,
  logoUrl,
  brandId,
  gradientIndex,
  className,
}: BrandAvatarProps) {
  const [hasImageError, setHasImageError] = useState(false)

  useEffect(() => {
    setHasImageError(false)
  }, [logoUrl])

  if (logoUrl && !hasImageError) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 overflow-hidden rounded-full border border-black/5",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="size-full object-cover"
          onError={() => setHasImageError(true)}
        />
      </span>
    )
  }

  const resolvedGradientIndex =
    gradientIndex ?? getBrandGradientIndexFromSeed(brandId || name)

  return (
    <span
      aria-hidden="true"
      style={getBrandGradientStyle(resolvedGradientIndex)}
      className={cn(
        "inline-flex shrink-0 rounded-full border border-white/25 shadow-xs",
        className,
      )}
    />
  )
}
