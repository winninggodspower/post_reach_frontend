import type { CSSProperties } from "react"

const GOLDEN_ANGLE = 137.508

const BRAND_GRADIENTS: CSSProperties[] = [
  { background: "linear-gradient(135deg, #f97316, #fbbf24)" },
  { background: "linear-gradient(135deg, #8b5cf6, #c084fc)" },
  { background: "linear-gradient(135deg, #0ea5e9, #22d3ee)" },
  { background: "linear-gradient(135deg, #10b981, #2dd4bf)" },
  { background: "linear-gradient(135deg, #f43f5e, #f472b6)" },
  { background: "linear-gradient(135deg, #6366f1, #60a5fa)" },
  { background: "linear-gradient(135deg, #d946ef, #a78bfa)" },
  { background: "linear-gradient(135deg, #f59e0b, #f97316)" },
]

export const getBrandGradientStyle = (index: number): CSSProperties => {
  if (index < BRAND_GRADIENTS.length) {
    return BRAND_GRADIENTS[index]
  }

  const overflowIndex = index - BRAND_GRADIENTS.length
  const hue = (overflowIndex * GOLDEN_ANGLE) % 360
  const secondaryHue = (hue + 42) % 360

  return {
    background: `linear-gradient(135deg, hsl(${hue} 72% 58%), hsl(${secondaryHue} 68% 45%))`,
  }
}

export const getBrandGradientIndexFromSeed = (seed: string) => {
  let hash = 0

  for (let index = 0; index < seed.length; index += 1) {
    hash = seed.charCodeAt(index) + ((hash << 5) - hash)
  }

  return Math.abs(hash) % BRAND_GRADIENTS.length
}

export const buildBrandGradientMap = (brandIds: string[]) => {
  const gradientMap = new Map<string, number>()
  const sortedIds = [...new Set(brandIds)].sort()

  sortedIds.forEach((id, index) => {
    gradientMap.set(id, index)
  })

  return gradientMap
}
