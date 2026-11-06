"use client"

import { PanelTopOpen } from "lucide-react"
import type { FieldErrors, UseFormRegister } from "react-hook-form"

import { Label } from "@/components/ui/label"
import type { OnboardingSubmission } from "@/features/onboarding/types"

import { PLATFORM_OPTIONS } from "./shared"

const POSTING_FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "few_times_a_week", label: "Few times a week" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "rarely", label: "Rarely" },
] as const

type OnboardingStepThreeContentProps = {
  register: UseFormRegister<OnboardingSubmission>
  errors: FieldErrors<OnboardingSubmission>
}

export function OnboardingStepThreeContent({
  register,
  errors,
}: OnboardingStepThreeContentProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-950">
          Tell us about your content
        </h1>
        <p className="mt-1 sm:mt-2 max-w-2xl text-xs sm:text-base leading-relaxed text-slate-600">
          Choose your primary platform and posting rhythm.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="primary_platform">Primary platform</Label>
          <div className="relative">
            <select
              id="primary_platform"
              aria-invalid={errors.primary_platform ? true : undefined}
              {...register("primary_platform", { required: "Primary platform is required." })}
              className="h-12 w-full appearance-none rounded-xl border border-black/10 bg-white px-3 pr-10 text-base text-slate-900 shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            >
              <option value="" disabled>Select primary platform...</option>
              {PLATFORM_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <PanelTopOpen className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </div>
          {errors.primary_platform ? (
            <p className="text-sm text-destructive">{errors.primary_platform.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="posting_frequency">Posting frequency</Label>
          <div className="relative">
            <select
              id="posting_frequency"
              aria-invalid={errors.posting_frequency ? true : undefined}
              {...register("posting_frequency", { required: "Posting frequency is required." })}
              className="h-12 w-full appearance-none rounded-xl border border-black/10 bg-white px-3 pr-10 text-base text-slate-900 shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            >
              <option value="" disabled>Select frequency...</option>
              {POSTING_FREQUENCY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <PanelTopOpen className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </div>
          {errors.posting_frequency ? (
            <p className="text-sm text-destructive">{errors.posting_frequency.message}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
