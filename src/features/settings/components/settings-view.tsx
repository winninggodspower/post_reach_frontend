"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/store/auth-store"
import { submitOnboardingProfile } from "@/features/onboarding/api/server"
import {
  ROLE_OPTIONS,
  INDUSTRY_OPTIONS,
  PLATFORM_OPTIONS,
  getConnectedPlatformsFromBrand,
} from "@/features/onboarding/components/steps/shared"
import type {
  OnboardingRole,
  OnboardingIndustry,
  OnboardingTeamSize,
  OnboardingPlatform,
  OnboardingPostingFrequency,
} from "@/features/onboarding/types"

type ProfileFormValues = {
  firstName: string
  lastName: string
  role: OnboardingRole
}

type BrandFormValues = {
  brandName: string
  industry: OnboardingIndustry
  teamSize: OnboardingTeamSize
  primaryPlatform: OnboardingPlatform
  postingFrequency: OnboardingPostingFrequency
}

export function SettingsView() {
  const user = useAuth((state) => state.user)
  const setUser = useAuth((state) => state.setUser)
  const isHydrated = useAuth((state) => state.isHydrated)

  const [activeTab, setActiveTab] = useState<"profile" | "brand">("profile")

  // React Hook Form for Profile settings
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { isSubmitting: isSavingProfile },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      role: "creator",
    },
  })

  // React Hook Form for Brand settings
  const {
    register: registerBrand,
    handleSubmit: handleSubmitBrand,
    reset: resetBrand,
    formState: { isSubmitting: isSavingBrand },
  } = useForm<BrandFormValues>({
    defaultValues: {
      brandName: "",
      industry: "technology",
      teamSize: "just_me",
      primaryPlatform: "instagram",
      postingFrequency: "daily",
    },
  })

  // Initialize and update form states once user state is hydrated
  useEffect(() => {
    if (user) {
      resetProfile({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        role: (user.role as OnboardingRole) || "creator",
      })

      if (user.brand) {
        resetBrand({
          brandName: user.brand.name || "",
          industry: (user.brand.industry as OnboardingIndustry) || "technology",
          teamSize: (user.brand.team_size as OnboardingTeamSize) || "just_me",
          primaryPlatform: (user.brand.primary_platform as OnboardingPlatform) || "instagram",
          postingFrequency: (user.brand.posting_frequency as OnboardingPostingFrequency) || "daily",
        })
      }
    }
  }, [user, isHydrated, resetProfile, resetBrand])

  if (!isHydrated) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200 rounded" />
          <div className="h-4 w-72 bg-slate-200 rounded" />
          <div className="h-40 bg-slate-100 rounded-xl" />
        </div>
      </main>
    )
  }

  const onSaveProfile = async (values: ProfileFormValues) => {
    if (!user) return

    try {
      // Update local state first
      const updatedUser = {
        ...user,
        first_name: values.firstName,
        last_name: values.lastName,
        role: values.role,
      }
      setUser(updatedUser)

      // Also persist to onboarding API
      const connectedPlatforms = user.brand
        ? getConnectedPlatformsFromBrand(user.brand)
        : []

      const currentBrand = user.brand

      await submitOnboardingProfile({
        role: values.role,
        industry: (currentBrand?.industry as OnboardingIndustry) || "technology",
        team_size: (currentBrand?.team_size as OnboardingTeamSize) || "just_me",
        primary_platform: (currentBrand?.primary_platform as OnboardingPlatform) || "instagram",
        posting_frequency: (currentBrand?.posting_frequency as OnboardingPostingFrequency) || "daily",
        connected_platforms: connectedPlatforms,
      })

      toast.success("Profile settings updated successfully.")
    } catch (err) {
      toast.error("Failed to update profile settings.")
    }
  }

  const onSaveBrand = async (values: BrandFormValues) => {
    if (!user) return

    try {
      const updatedUser = {
        ...user,
        brand: {
          ...user.brand,
          id: user.brand?.id || "",
          name: values.brandName,
          industry: values.industry,
          team_size: values.teamSize,
          primary_platform: values.primaryPlatform,
          posting_frequency: values.postingFrequency,
          connected_accounts: user.brand?.connected_accounts ?? [],
        },
      }
      setUser(updatedUser)

      const connectedPlatforms = user.brand
        ? getConnectedPlatformsFromBrand(user.brand)
        : []

      // Submit brand details to onboarding profile api
      await submitOnboardingProfile({
        role: (user.role as OnboardingRole) || "creator",
        industry: values.industry,
        team_size: values.teamSize,
        primary_platform: values.primaryPlatform,
        posting_frequency: values.postingFrequency,
        connected_platforms: connectedPlatforms,
      })

      toast.success("Brand details updated successfully.")
    } catch (err) {
      toast.error("Failed to update brand details.")
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-8 min-w-0 overflow-x-hidden space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1.5">
          Manage your personal profile and brand configuration.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-black/8 gap-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 text-sm font-semibold border-b-2 transition duration-200 cursor-pointer ${
            activeTab === "profile"
              ? "border-slate-950 text-slate-950"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Profile settings
        </button>
        <button
          onClick={() => setActiveTab("brand")}
          className={`pb-3 text-sm font-semibold border-b-2 transition duration-200 cursor-pointer ${
            activeTab === "brand"
              ? "border-slate-950 text-slate-950"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Brand configuration
        </button>
      </div>

      {activeTab === "profile" && (
        <form onSubmit={handleSubmitProfile(onSaveProfile)} className="space-y-6 max-w-xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                {...registerProfile("firstName", { required: true })}
                className="w-full rounded-xl border border-black/8 px-4 py-2.5 text-sm outline-none transition focus:border-slate-950 bg-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                {...registerProfile("lastName", { required: true })}
                className="w-full rounded-xl border border-black/8 px-4 py-2.5 text-sm outline-none transition focus:border-slate-950 bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ""}
              className="w-full rounded-xl border border-black/8 px-4 py-2.5 text-sm bg-slate-50 text-slate-400 cursor-not-allowed outline-none"
              disabled
            />
            <p className="text-[11px] text-slate-400">Email address cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Your Primary Role
            </label>
            <select
              id="role"
              {...registerProfile("role")}
              className="w-full rounded-xl border border-black/8 px-4 py-2.5 text-sm outline-none transition focus:border-slate-950 bg-white"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.title}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" disabled={isSavingProfile} className="bg-slate-950 hover:bg-slate-800 text-white font-semibold cursor-pointer">
            {isSavingProfile && <Loader2 className="mr-1.5 size-4 animate-spin" />}
            Save Profile
          </Button>
        </form>
      )}

      {activeTab === "brand" && (
        <form onSubmit={handleSubmitBrand(onSaveBrand)} className="space-y-6 max-w-xl">
          <div className="space-y-2">
            <label htmlFor="brandName" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Brand Name
            </label>
            <input
              id="brandName"
              type="text"
              {...registerBrand("brandName", { required: true })}
              className="w-full rounded-xl border border-black/8 px-4 py-2.5 text-sm outline-none transition focus:border-slate-950 bg-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="industry" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Industry
              </label>
              <select
                id="industry"
                {...registerBrand("industry")}
                className="w-full rounded-xl border border-black/8 px-4 py-2.5 text-sm outline-none transition focus:border-slate-950 bg-white"
              >
                {INDUSTRY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="teamSize" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Team Size
              </label>
              <select
                id="teamSize"
                {...registerBrand("teamSize")}
                className="w-full rounded-xl border border-black/8 px-4 py-2.5 text-sm outline-none transition focus:border-slate-950 bg-white"
              >
                <option value="just_me">Just me</option>
                <option value="2_5">2 - 5 people</option>
                <option value="6_20">6 - 20 people</option>
                <option value="20_plus">More than 20 people</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="primaryPlatform" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Primary Platform
              </label>
              <select
                id="primaryPlatform"
                {...registerBrand("primaryPlatform")}
                className="w-full rounded-xl border border-black/8 px-4 py-2.5 text-sm outline-none transition focus:border-slate-950 bg-white"
              >
                {PLATFORM_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="postingFrequency" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Posting Frequency
              </label>
              <select
                id="postingFrequency"
                {...registerBrand("postingFrequency")}
                className="w-full rounded-xl border border-black/8 px-4 py-2.5 text-sm outline-none transition focus:border-slate-950 bg-white"
              >
                <option value="daily">Daily</option>
                <option value="few_times_a_week">A few times a week</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="rarely">Rarely</option>
              </select>
            </div>
          </div>

          <Button type="submit" disabled={isSavingBrand} className="bg-slate-950 hover:bg-slate-800 text-white font-semibold cursor-pointer">
            {isSavingBrand && <Loader2 className="mr-1.5 size-4 animate-spin" />}
            Save Brand Details
          </Button>
        </form>
      )}
    </main>
  )
}
