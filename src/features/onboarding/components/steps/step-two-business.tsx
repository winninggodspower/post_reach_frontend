"use client"

import { useEffect } from "react"
import { PanelTopOpen } from "lucide-react"
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form"

import { Label } from "@/components/ui/label"
import type {
  OnboardingSubmission,
  OnboardingTeamSize,
} from "@/features/onboarding/types"

import { INDUSTRY_OPTIONS } from "./shared"

const TEAM_SIZE_OPTIONS: Array<{ value: OnboardingTeamSize; label: string }> = [
  { value: "just_me", label: "Just me" },
  { value: "2_5", label: "2-5" },
  { value: "6_20", label: "6-20" },
  { value: "20_plus", label: "20+" },
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
  role,
  setValue,
}: OnboardingStepTwoBusinessProps) {
  const hideTeamSize = role === "creator"

  useEffect(() => {
    if (hideTeamSize) {
      setValue("team_size", "just_me", { shouldDirty: true, shouldValidate: true })
    }
  }, [hideTeamSize, setValue])

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-dark">
          Step 2
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
          Tell us about your business
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          We’ll keep this quick and use it to tune the workspace.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <div className="relative">
            <select
              id="industry"
              aria-invalid={errors.industry ? true : undefined}
              {...register("industry", { required: "Industry is required." })}
              className="h-12 w-full appearance-none rounded-xl border border-black/10 bg-white px-3 pr-10 text-base text-slate-900 shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            >
              <option value="" disabled>Select your industry...</option>
              {INDUSTRY_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <PanelTopOpen className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </div>
          {errors.industry ? (
            <p className="text-sm text-destructive">{errors.industry.message}</p>
          ) : null}
        </div>

        {hideTeamSize ? null : (
          <div className="space-y-2">
            <Label htmlFor="team_size">Team size</Label>
            <div className="relative">
              <select
                id="team_size"
                aria-invalid={errors.team_size ? true : undefined}
                {...register("team_size", { required: "Team size is required." })}
                className="h-12 w-full appearance-none rounded-xl border border-black/10 bg-white px-3 pr-10 text-base text-slate-900 shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
              >
                <option value="" disabled>Select team size...</option>
                {TEAM_SIZE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <PanelTopOpen className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
            {errors.team_size ? (
              <p className="text-sm text-destructive">{errors.team_size.message}</p>
            ) : null}
          </div>
        )}
      </div>

    </div>
  )
}
