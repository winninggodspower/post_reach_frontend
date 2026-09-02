import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"

import { useAuth } from "@/features/auth/store/auth-store"
import {
  fetchBrands,
  setActiveBrand,
  type BrandSummary,
} from "@/features/brands/api/server"
import { buildBrandGradientMap } from "@/features/brands/lib/brand-gradient"

export function useBrands() {
  const user = useAuth((state) => state.user)
  const loadUser = useAuth((state) => state.loadUser)

  const [brands, setBrands] = useState<BrandSummary[]>([])
  const [isLoadingBrands, setIsLoadingBrands] = useState(false)
  const [isSwitchingBrand, setIsSwitchingBrand] = useState(false)

  const activeBrandId = user?.brand?.id
  const activeBrandName = user?.brand?.name || "PostReach Brand"

  const displayBrands = useMemo(() => {
    if (brands.length > 0) {
      return brands
    }

    if (user?.brand) {
      return [
        {
          id: user.brand.id,
          name: user.brand.name,
          logo_url: user.brand.logo_url,
        },
      ]
    }

    return []
  }, [brands, user?.brand])

  const brandGradientMap = useMemo(
    () => buildBrandGradientMap(displayBrands.map((brand) => brand.id)),
    [displayBrands],
  )

  const loadBrands = useCallback(async () => {
    setIsLoadingBrands(true)

    try {
      const nextBrands = await fetchBrands()
      setBrands(nextBrands)
    } catch {
      toast.error("Failed to load brands.")
    } finally {
      setIsLoadingBrands(false)
    }
  }, [])

  const switchBrand = useCallback(
    async (brandId: string) => {
      if (brandId === activeBrandId || isSwitchingBrand) {
        return
      }

      setIsSwitchingBrand(true)

      try {
        await setActiveBrand(brandId)
        await loadUser()
      } catch {
        toast.error("Failed to switch brand.")
      } finally {
        setIsSwitchingBrand(false)
      }
    },
    [activeBrandId, isSwitchingBrand, loadUser],
  )

  const handleDropdownOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        void loadBrands()
      }
    },
    [loadBrands],
  )

  return {
    activeBrandId,
    activeBrandName,
    displayBrands,
    brandGradientMap,
    isLoadingBrands,
    isSwitchingBrand,
    loadBrands,
    switchBrand,
    handleDropdownOpenChange,
  }
}
