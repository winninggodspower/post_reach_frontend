"use client"

import type { FieldErrors, UseFormRegister } from "react-hook-form"

import { FormSelect } from "@/components/form-select"
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
        <FormSelect
          id="primary_platform"
          label="Primary platform"
          error={errors.primary_platform?.message}
          {...register("primary_platform", { required: "Primary platform is required." })}
        >
          <option value="" disabled>Select primary platform</option>
          {PLATFORM_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </FormSelect>

        <FormSelect
          id="posting_frequency"
          label="Posting frequency"
          error={errors.posting_frequency?.message}
          {...register("posting_frequency", { required: "Posting frequency is required." })}
        >
          <option value="" disabled>Select posting frequency</option>
          {POSTING_FREQUENCY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FormSelect>
      </div>
    </div>
  )
}
