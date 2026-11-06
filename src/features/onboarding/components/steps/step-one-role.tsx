"use client"

import type { OnboardingRole } from "@/features/onboarding/types"

import { ROLE_OPTIONS, RoleCard } from "./shared"

type OnboardingStepOneRoleProps = {
  selectedRole: OnboardingRole
  onSelectRole: (role: OnboardingRole) => void
  error?: string
}

export function OnboardingStepOneRole({
  selectedRole,
  onSelectRole,
  error,
}: OnboardingStepOneRoleProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-950">
          What sounds most like you?
        </h1>
        <p className="mt-1 sm:mt-2 max-w-2xl text-xs sm:text-base leading-relaxed text-slate-600">
          We’ll tailor the workspace around how you actually work.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {ROLE_OPTIONS.map((option) => (
          <RoleCard
            key={option.id}
            option={option}
            selected={selectedRole === option.id}
            onSelect={onSelectRole}
          />
        ))}
      </div>

      {error ? (
        <p className="text-sm font-medium text-destructive animate-in fade-in">
          {error}
        </p>
      ) : null}
    </div>
  )
}
