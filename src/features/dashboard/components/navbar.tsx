"use client"

import { useRouter } from "next/navigation"
import { Check, ChevronDown, LogOut, Settings } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/features/auth/store/auth-store"
import { useBrands } from "@/features/brands/hooks/use-brands"
import { BrandAvatar } from "@/features/brands/components/brand-avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

export function DashboardNavbar() {
  const router = useRouter()
  const user = useAuth((state) => state.user)
  const logout = useAuth((state) => state.logout)

  const {
    activeBrandId,
    activeBrandName,
    displayBrands,
    brandGradientMap,
    isLoadingBrands,
    isSwitchingBrand,
    switchBrand,
    handleDropdownOpenChange,
  } = useBrands()

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Brand Account"
  const activeBrandLogoUrl = user?.brand?.logo_url

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-black/5 px-5 transition-[width,height] ease-linear bg-white/80 backdrop-blur-lg">
      {/* Left Side: Navigation & Brand Selector */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 size-9 [&_svg]:size-5 text-slate-500 hover:text-slate-900" />
        <Separator orientation="vertical" className="mr-2 h-5 bg-black/10" />

        <DropdownMenu onOpenChange={handleDropdownOpenChange}>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer select-none outline-none">
              <BrandAvatar
                name={activeBrandName}
                logoUrl={activeBrandLogoUrl}
                brandId={activeBrandId}
                gradientIndex={activeBrandId ? brandGradientMap.get(activeBrandId) : undefined}
                className="size-5"
              />
              <span>{activeBrandName}</span>
              <ChevronDown className="size-3.5 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 p-1.5">
            <DropdownMenuLabel className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Brands
            </DropdownMenuLabel>
            {displayBrands.map((brand) => {
              const isActive = brand.id === activeBrandId

              return (
                <DropdownMenuItem
                  key={brand.id}
                  disabled={isSwitchingBrand || isLoadingBrands}
                  onClick={() => void switchBrand(brand.id)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold mb-1 cursor-pointer ${
                    isActive
                      ? "text-slate-800 bg-slate-50 border border-black/5 focus:bg-slate-50"
                      : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <BrandAvatar
                    name={brand.name}
                    logoUrl={brand.logo_url}
                    brandId={brand.id}
                    gradientIndex={brandGradientMap.get(brand.id)}
                    className="size-5"
                  />
                  <span className="truncate flex-1">{brand.name}</span>
                  {isActive && <Check className="size-3 shrink-0 text-accent-dark" />}
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={() => router.push("/create-brand")}
              className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer"
            >
              + Create Brand
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right Side: Profile Menu */}
      <div className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex size-8 items-center justify-center rounded-full border border-blur-500 hover:scale-105 transition-all overflow-hidden cursor-pointer bg-slate-50 outline-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/placeholder-avatar.svg"
                alt={fullName}
                className="size-full object-cover"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1.5 space-y-0.5">
            <div className="border-b border-black/5 p-2 mb-1">
              <p className="text-xs font-bold text-slate-900 leading-none truncate">
                {fullName}
              </p>
              <p className="text-[10px] text-slate-400 truncate mt-1">
                {user?.email}
              </p>
            </div>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings")}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer flex items-center gap-2"
            >
              <Settings className="size-3.5 text-slate-400" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                logout()
                window.location.href = "/signin"
              }}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer flex items-center gap-2"
            >
              <LogOut className="size-3.5 text-slate-400" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
