"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronDown, LogOut, Settings } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/features/auth/store/auth-store"

export function DashboardNavbar() {
  const router = useRouter()
  const user = useAuth((state) => state.user)
  const logout = useAuth((state) => state.logout)

  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  const initials = [user?.first_name?.[0], user?.last_name?.[0]].filter(Boolean).join("").toUpperCase() || "BA"
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Brand Account"
  const activeBrandName = user?.brand?.name || "PostReach Brand"

  return (
    <header className="relative flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border px-5 transition-[width,height] ease-linear bg-white">
      {/* Left Side: Navigation & Brand Selector */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 size-9 [&_svg]:size-5" />
        <Separator orientation="vertical" className="mr-2 h-5" />

        <div className="relative">
          <button
            onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-semibold text-slate-800 hover:bg-slate-100 transition cursor-pointer select-none"
          >
            <span>{activeBrandName}</span>
            <ChevronDown className="size-3.5 text-slate-500" />
          </button>

          {brandDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setBrandDropdownOpen(false)} />
              <div className="absolute top-9 left-0 z-50 w-56 rounded-xl border border-black/8 bg-white p-1.5 shadow-md animate-in fade-in-0 slide-in-from-top-1">
                <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Brands
                </p>
                <button
                  type="button"
                  className="w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-black/5"
                >
                  <span className="truncate">{activeBrandName}</span>
                  <Check className="size-3 text-accent-dark" />
                </button>
                <div className="mt-1 border-t border-black/5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setBrandDropdownOpen(false)
                      router.push("/onboarding")
                    }}
                    className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer"
                  >
                    + Create Brand
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Side: Profile Menu */}
      <div className="relative">
        <button
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className="flex size-8 items-center justify-center rounded-full border border-blue-500 hover:brightness-95 transition overflow-hidden shadow-xs cursor-pointer bg-slate-50 p-0.5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/placeholder-avatar.svg"
            alt={fullName}
            className="size-full object-cover rounded-full"
          />
        </button>

        {profileDropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
            <div className="absolute top-9 right-0 z-50 w-56 rounded-xl border border-black/8 bg-white p-1.5 shadow-md animate-in fade-in-0 slide-in-from-top-1 space-y-0.5">
              <div className="border-b border-black/5 p-2">
                <p className="text-xs font-bold text-slate-900 leading-none truncate">
                  {fullName}
                </p>
                <p className="text-[10px] text-slate-400 truncate mt-1">
                  {user?.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(false)
                  router.push("/dashboard/settings")
                }}
                className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer flex items-center gap-2"
              >
                <Settings className="size-3.5 text-slate-400" />
                Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(false)
                  logout()
                  window.location.href = "/signin"
                }}
                className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer flex items-center gap-2"
              >
                <LogOut className="size-3.5 text-slate-400" />
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
