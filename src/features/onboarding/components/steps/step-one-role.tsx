"use client"

import type { OnboardingRole } from "@/features/onboarding/types"

import { ROLE_OPTIONS, RoleCard } from "./shared"

type OnboardingStepOneRoleProps = {
  selectedRole: OnboardingRole
  onSelectRole: (role: OnboardingRole) => void
}

export function OnboardingStepOneRole({
  selectedRole,
  onSelectRole,
}: OnboardingStepOneRoleProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-dark">
          Step 1
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
          Select your role
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          We’ll tailor the workspace around how you actually work.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ROLE_OPTIONS.map((option) => (
          <RoleCard
            key={option.id}
            option={option}
            selected={selectedRole === option.id}
            onSelect={onSelectRole}
          />
        ))}
      </div>
    </div>
  )
}
