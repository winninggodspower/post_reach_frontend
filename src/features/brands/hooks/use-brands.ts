import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { useAuth } from "@/features/auth/store/auth-store"
import {
  fetchBrands,
  setActiveBrand,
  type BrandSummary,
} from "@/features/brands/api/server"
import { buildBrandGradientMap } from "@/features/brands/lib/brand-gradient"

export function useBrands() {
  const router = useRouter()
  const user = useAuth((state) => state.user)
  const setUser = useAuth((state) => state.setUser)
  const loadUser = useAuth((state) => state.loadUser)

  const [brands, setBrands] = useState<BrandSummary[]>([])
  const [isLoadingBrands, setIsLoadingBrands] = useState(false)
  const [isSwitchingBrand, setIsSwitchingBrand] = useState(false)

  // Determine active brand: check active item in user.brands, or user.brand
  const activeBrand = useMemo(() => {
    if (user?.brands && user.brands.length > 0) {
      const activeFromList = user.brands.find((b) => b.is_active)
      if (activeFromList) return activeFromList
    }
    return user?.brand || null
  }, [user?.brands, user?.brand])

  const activeBrandId = activeBrand?.id || user?.brand?.id
  const activeBrandName = activeBrand?.name || user?.brand?.name || "PostReach Brand"
  const activeBrandLogoUrl = activeBrand?.logo_url || user?.brand?.logo_url

  // Get brands directly from user response if available, avoiding refetching
  const displayBrands = useMemo<BrandSummary[]>(() => {
    if (user?.brands && user.brands.length > 0) {
      return user.brands.map((b) => ({
        id: b.id,
        name: b.name,
        logo_url: b.logo_url,
        is_default: b.is_default,
        is_active: b.is_active,
        role: b.role,
      }))
    }

    if (brands.length > 0) {
      return brands
    }

    if (user?.brand) {
      return [
        {
          id: user.brand.id,
          name: user.brand.name,
          logo_url: user.brand.logo_url,
          is_active: true,
        },
      ]
    }

    return []
  }, [user?.brands, brands, user?.brand])

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
        const updatedUser = await setActiveBrand(brandId)
        if (updatedUser) {
          setUser(updatedUser)
        } else {
          await loadUser()
        }
        router.refresh()
      } catch {
        toast.error("Failed to switch brand.")
      } finally {
        setIsSwitchingBrand(false)
      }
    },
    [activeBrandId, isSwitchingBrand, loadUser, router, setUser],
  )

  const handleDropdownOpenChange = useCallback(
    (open: boolean) => {
      // Only fetch brands from API if they are not already returned in the user response
      if (open && (!user?.brands || user.brands.length === 0)) {
        void loadBrands()
      }
    },
    [user?.brands, loadBrands],
  )

  return {
    activeBrandId,
    activeBrandName,
    activeBrandLogoUrl,
    displayBrands,
    brandGradientMap,
    isLoadingBrands,
    isSwitchingBrand,
    loadBrands,
    switchBrand,
    handleDropdownOpenChange,
  }
}
