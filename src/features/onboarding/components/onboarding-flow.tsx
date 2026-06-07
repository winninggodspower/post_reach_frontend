"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useForm } from "react-hook-form"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { GridPattern } from "@/components/ui/grid-pattern"
import { useAuth } from "@/features/auth/store/auth-store"
import { submitOnboardingProfile } from "@/features/onboarding/api/server"
import type { OnboardingPlatform, OnboardingSubmission } from "@/features/onboarding/types"

import { ROLE_OPTIONS, STEP_TITLES } from "./steps/shared"
import { OnboardingStepOneRole } from "./steps/step-one-role"
import { OnboardingStepTwoBusiness } from "./steps/step-two-business"
import { OnboardingStepThreeContent } from "./steps/step-three-content"
import { OnboardingStepFourSocial } from "./steps/step-four-social"

type StepId = 0 | 1 | 2 | 3

const emptySubmission = (): OnboardingSubmission => ({
  role: "creator",
  industry: "technology",
  team_size: "just_me",
  primary_platform: "instagram",
  posting_frequency: "weekly",
  connected_platforms: [],
})

const getStepTitle = (step: StepId) => STEP_TITLES[step]

export function OnboardingFlow() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const user = useAuth((state) => state.user)
  const setUser = useAuth((state) => state.setUser)
  const isHydrated = useAuth((state) => state.isHydrated)
  const isLoadingUser = useAuth((state) => state.isLoadingUser)

  const [step, setStep] = useState<StepId>(0)
  const {
    register,
    setValue,
    watch,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingSubmission>({
    defaultValues: emptySubmission(),
    mode: "onBlur",
  })

  const form = watch()

  const nextUrl = searchParams?.get("next") ?? "/dashboard"

  const alreadyCompleted = user?.has_completed_onboarding ?? false
  const connectedCount = form.connected_platforms.length
  const progress = Math.round(((step + 1) / 4) * 100)

  useEffect(() => {
    if (!isHydrated || isLoadingUser) {
      return
    }

    if (alreadyCompleted) {
      router.replace(nextUrl)
    }
  }, [alreadyCompleted, isHydrated, isLoadingUser, nextUrl, router])

  useEffect(() => {
    if (form.role === "creator") {
      setValue("team_size", "just_me", { shouldDirty: true, shouldValidate: true })
    }
  }, [form.role, setValue])

  const canProceedStepOne = Boolean(form.role)
  const canProceedStepTwo = Boolean(form.industry) && Boolean(form.team_size)
  const canProceedStepThree = Boolean(form.primary_platform) && Boolean(form.posting_frequency)

  const handleNextStep = async () => {
    const fieldsToValidate =
      step === 0
        ? ["role"]
        : step === 1
          ? ["industry", "team_size"]
          : step === 2
            ? ["primary_platform", "posting_frequency"]
            : []

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate as Array<keyof OnboardingSubmission>)

      if (!isValid) {
        return
      }
    }

    setStep((current) => ((current + 1) as StepId))
  }

  const togglePlatform = (platform: OnboardingPlatform) => {
    const currentPlatforms = watch("connected_platforms")

    setValue(
      "connected_platforms",
      currentPlatforms.includes(platform)
        ? currentPlatforms.filter((item) => item !== platform)
        : [...currentPlatforms, platform],
      { shouldDirty: true },
    )
  }

  const [isSaving, setIsSaving] = useState(false)

  const finishOnboarding = handleSubmit(async (values) => {
    setIsSaving(true)

    try {
      await submitOnboardingProfile(values)

      // Update the auth store so has_completed_onboarding is reflected immediately
      if (user) {
        setUser({ ...user, has_completed_onboarding: true })
      }

      router.replace(nextUrl)
      router.refresh()
    } catch (err) {
      const message =
        err instanceof Error
          ? (() => {
              try {
                const parsed = JSON.parse(err.message)
                return parsed.message || "Something went wrong."
              } catch {
                return err.message || "Something went wrong."
              }
            })()
          : "Something went wrong."

      toast.error(message, {
        description: "Your onboarding data wasn't saved. Please try again.",
        duration: 5000,
      })
    } finally {
      setIsSaving(false)
    }
  })

  if (!isHydrated || isLoadingUser || alreadyCompleted) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-24">
        <p className="text-sm text-slate-500">Loading onboarding...</p>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fffaf4_0%,#fff4eb_46%,#ffffff_100%)]">
      <GridPattern
        className="stroke-black/5 mask-[linear-gradient(to_bottom,white,transparent_90%)]"
        squares={[
          [2, 2],
          [9, 3],
          [14, 7],
          [19, 2],
        ]}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-6 w-full max-w-3xl rounded-full border border-white/70 bg-white/70 px-4 py-3 text-center shadow-sm backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent-dark">
            Onboarding
          </p>
        </div>

        <div className="mb-6 h-2 w-full max-w-3xl overflow-hidden rounded-full bg-black/6">
          <div
            className="h-full rounded-full bg-linear-to-r from-accent-dark to-accent-brand transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex w-full flex-1 justify-center">
          <section className="w-full max-w-3xl rounded-[32px] border border-black/8 bg-white/92 p-4 shadow-[0_30px_90px_-55px_rgba(15,23,42,0.5)] backdrop-blur sm:p-6 lg:p-7">
            <div className="mb-6 flex flex-wrap gap-2">
              {STEP_TITLES.map((label, index) => {
                const isActive = index === step
                const isComplete = index < step

                return (
                  <div
                    key={label}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                      isActive
                        ? "bg-slate-950 text-white"
                        : isComplete
                          ? "bg-emerald-500/10 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isComplete ? <span className="text-[10px]">✓</span> : <span className="text-[10px]">0{index + 1}</span>}
                    {label}
                  </div>
                )
              })}
            </div>

            <div>
              {step === 0 ? (
                <OnboardingStepOneRole
                  selectedRole={form.role}
                  onSelectRole={(role) =>
                    setValue("role", role, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    })
                  }
                />
              ) : null}

              {step === 1 ? (
                <OnboardingStepTwoBusiness
                  register={register}
                  errors={errors}
                  role={form.role}
                  setValue={setValue}
                />
              ) : null}

              {step === 2 ? (
                <OnboardingStepThreeContent register={register} errors={errors} />
              ) : null}

              {step === 3 ? (
                <OnboardingStepFourSocial
                  form={form}
                  togglePlatform={togglePlatform}
                />
              ) : null}
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-black/6 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-500">
                {step === 3 ? (
                  <span>
                    {connectedCount > 0
                      ? `${connectedCount} platform${connectedCount === 1 ? "" : "s"} connected`
                      : "No accounts connected yet"}
                  </span>
                ) : (
                  <span>Everything stays editable after onboarding.</span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {step > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep((current) => ((current - 1) as StepId))}
                    className="gap-2"
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </Button>
                ) : null}

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => void handleNextStep()}
                    disabled={
                      (step === 0 && !canProceedStepOne) ||
                      (step === 1 && !canProceedStepTwo) ||
                      (step === 2 && !canProceedStepThree)
                    }
                    className="gap-2"
                  >
                    Next
                    <ArrowRight className="size-4" />
                  </Button>
                ) : (
                  <button
                    type="button"
                    onClick={() => void finishOnboarding()}
                    className="text-sm font-medium text-slate-500 underline underline-offset-4 transition hover:text-slate-800 cursor-pointer"
                  >
                    Skip for now
                  </button>
                )}
              </div>
            </div>
          </section>
          
        </div>
      </div>
    </main>
  )
}
