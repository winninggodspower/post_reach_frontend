"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ArrowLeft, ArrowRight, Loader2, UploadCloud } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  INDUSTRY_OPTIONS,
  PLATFORM_OPTIONS,
} from "@/features/onboarding/components/steps/shared"
import { createBrand } from "../api/server"

type CreateBrandFormValues = {
  name: string
  logo_url: string
  industry: string
  team_size: string
  primary_platform: string
  posting_frequency: string
}

type Props = {
  onSuccess: (brandId: string) => void
}

const STEP_TITLES = ["Brand Details", "Business Info", "Content Strategy"]

export function CreateBrandFlow({ onSuccess }: Props) {
  const [step, setStep] = useState(0)
  const {
    register,
    handleSubmit,
    trigger,
    formState: { isSubmitting },
  } = useForm<CreateBrandFormValues>({
    defaultValues: {
      name: "",
      logo_url: "",
      industry: "technology",
      team_size: "just_me",
      primary_platform: "instagram",
      posting_frequency: "daily",
    },
    mode: "onBlur"
  })

  const handleNextStep = async () => {
    let fieldsToValidate: Array<keyof CreateBrandFormValues> = []
    
    if (step === 0) fieldsToValidate = ["name"]
    else if (step === 1) fieldsToValidate = ["industry", "team_size"]
    
    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate)
      if (!isValid) return
    }
    
    setStep((s) => s + 1)
  }

  const onSubmit = async (values: CreateBrandFormValues) => {
    // Prevent early submission if user hits Enter on an earlier step
    if (step < 2) {
      await handleNextStep()
      return
    }

    try {
      const response = await createBrand(values)
      toast.success("Brand created successfully.")
      onSuccess(response.data.id)
    } catch (err) {
      toast.error("Failed to create brand.")
    }
  }

  const progress = Math.round(((step + 1) / 3) * 100)

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-8 w-full max-w-3xl overflow-hidden rounded-full bg-black/6 h-2 mx-auto">
        <div
          className="h-full rounded-full bg-linear-to-r from-accent-dark to-accent-brand transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Step Indicators */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {STEP_TITLES.map((label, index) => {
          const isActive = index === step
          const isComplete = index < step

          return (
            <div
              key={label}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
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

      {/* Form Card */}
      <section className="w-full rounded-[32px] border border-black/8 bg-white/92 p-8 shadow-[0_30px_90px_-55px_rgba(15,23,42,0.5)] backdrop-blur sm:p-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* STEP 1 */}
        {step === 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Brand Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name", { required: true })}
                className="w-full rounded-xl border border-black/8 px-4 py-2.5 text-sm outline-none transition focus:border-slate-950 bg-white"
                placeholder="Acme Corp"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="logo_url" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Brand Logo <span className="text-slate-400 normal-case font-normal">(Optional)</span>
              </label>
              <input 
                id="logo_url"
                type="file" 
                accept="image/*"
                className="w-full rounded-xl border border-black/8 px-4 py-2.5 text-sm outline-none transition focus:border-slate-950 bg-white text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100" 
              />
              <p className="text-[11px] text-slate-400">Upload a PNG, JPG, or SVG.</p>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-2">
              <label htmlFor="industry" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Industry
              </label>
              <select
                id="industry"
                {...register("industry", { required: true })}
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
              <label htmlFor="team_size" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Team Size
              </label>
              <select
                id="team_size"
                {...register("team_size", { required: true })}
                className="w-full rounded-xl border border-black/8 px-4 py-2.5 text-sm outline-none transition focus:border-slate-950 bg-white"
              >
                <option value="just_me">Just me</option>
                <option value="2_5">2 - 5 people</option>
                <option value="6_20">6 - 20 people</option>
                <option value="20_plus">More than 20 people</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-2">
              <label htmlFor="primary_platform" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Primary Platform
              </label>
              <select
                id="primary_platform"
                {...register("primary_platform", { required: true })}
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
              <label htmlFor="posting_frequency" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Posting Frequency
              </label>
              <select
                id="posting_frequency"
                {...register("posting_frequency", { required: true })}
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
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-black/6 pt-6">
          {step > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              className="gap-2 cursor-pointer"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
          ) : (
            <div /> // Placeholder to keep Next button on the right
          )}

          {step < 2 ? (
            <Button
              type="button"
              onClick={handleNextStep}
              className="gap-2 bg-slate-950 text-white hover:bg-slate-800 cursor-pointer"
            >
              Next
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-slate-950 text-white hover:bg-slate-800 cursor-pointer min-w-32"
            >
              {isSubmitting && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              Complete Setup
            </Button>
          )}
        </div>
        </form>
      </section>
    </div>
  )
}
