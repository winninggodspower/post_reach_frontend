"use client"

import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form"

import { FormSelect } from "@/components/form-select"
import type {
  OnboardingSubmission,
  OnboardingTeamSize,
} from "@/features/onboarding/types"

import { INDUSTRY_OPTIONS } from "./shared"

const TEAM_SIZE_OPTIONS: Array<{ value: OnboardingTeamSize; label: string }> = [
  { value: "1", label: "Just me" },
  { value: "2-5", label: "2-5" },
  { value: "6-20", label: "6-20" },
  { value: "21-50", label: "21-50" },
  { value: "51+", label: "51+" },
]

type OnboardingStepTwoBusinessProps = {
  register: UseFormRegister<OnboardingSubmission>
  errors: FieldErrors<OnboardingSubmission>
  role: OnboardingSubmission["role"]
  setValue: UseFormSetValue<OnboardingSubmission>
}

export function OnboardingStepTwoBusiness({
  register,
  errors,
}: OnboardingStepTwoBusinessProps) {

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-950">
          Tell us about your business
        </h1>
        <p className="mt-1 sm:mt-2 max-w-2xl text-xs sm:text-base leading-relaxed text-slate-600">
          We’ll keep this quick and use it to tune the workspace.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-5">
        <FormSelect
          id="industry"
          label="Industry"
          error={errors.industry?.message}
          {...register("industry", { required: "Industry is required." })}
        >
          <option value="" disabled>Select an industry</option>
          {INDUSTRY_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </FormSelect>

        <FormSelect
          id="team_size"
          label="Team size"
          error={errors.team_size?.message}
          {...register("team_size", { required: "Team size is required." })}
        >
          <option value="" disabled>Select team size</option>
          {TEAM_SIZE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FormSelect>
      </div>

    </div>
  )
}
