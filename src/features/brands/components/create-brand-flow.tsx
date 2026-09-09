"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BrandAvatar } from "@/features/brands/components/brand-avatar"
import {
  INDUSTRY_OPTIONS,
  PLATFORM_OPTIONS,
} from "@/features/onboarding/components/steps/shared"
import { cn } from "@/lib/utils"
import { createBrand } from "../api/server"

type CreateBrandFormValues = {
  name: string
  industry: string
  team_size: string
  primary_platform: string
  posting_frequency: string
}

type Props = {
  onSuccess: (brandId: string) => void
}

const inputClassName =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100"

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required ? <span className="text-orange-500"> *</span> : null}
      </label>
      {children}
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  )
}

export function CreateBrandFlow({ onSuccess }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<CreateBrandFormValues>({
    defaultValues: {
      name: "",
      industry: "technology",
      team_size: "1",
      primary_platform: "instagram",
      posting_frequency: "few_times_a_week",
    },
    mode: "onBlur",
  })

  const brandName = watch("name")

  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview)
      }
    }
  }, [logoPreview])

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (logoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview)
    }

    setLogoPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (values: CreateBrandFormValues) => {
    try {
      const response = await createBrand(values)
      toast.success("Brand created successfully.")
      onSuccess(response.data.id)
    } catch {
      toast.error("Failed to create brand.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <BrandAvatar
              name={brandName || "New brand"}
              logoUrl={logoPreview}
              brandId={brandName || "new-brand"}
              gradientIndex={0}
              className="size-14"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">Brand logo</p>
              <p className="mt-0.5 text-xs leading-5 text-slate-500">
                Upload a high-resolution logo. 400×400px recommended.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 sm:ml-auto"
          >
            Browse files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleLogoChange}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Brand name"
            required
            error={errors.name?.message}
          >
            <input
              id="name"
              type="text"
              autoFocus
              placeholder="e.g. Acme Corp"
              {...register("name", { required: "Brand name is required" })}
              className={cn(inputClassName, errors.name && "border-rose-300 focus:border-rose-300 focus:ring-rose-100")}
            />
          </Field>

          <Field label="Primary industry">
            <select
              id="industry"
              {...register("industry", { required: true })}
              className={inputClassName}
            >
              {INDUSTRY_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Posting frequency">
            <select
              id="posting_frequency"
              {...register("posting_frequency", { required: true })}
              className={inputClassName}
            >
              <option value="daily">Daily</option>
              <option value="few_times_a_week">A few times a week</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="rarely">Rarely</option>
            </select>
          </Field>

          <Field label="Primary platform">
            <select
              id="primary_platform"
              {...register("primary_platform", { required: true })}
              className={inputClassName}
            >
              {PLATFORM_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Team size">
            <select
              id="team_size"
              {...register("team_size", { required: true })}
              className={inputClassName}
            >
              <option value="1">Just me</option>
              <option value="2-5">2-5</option>
              <option value="6-20">6-20</option>
              <option value="21-50">21-50</option>
              <option value="51+">51+</option>
            </select>
          </Field>
        </div>

        <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 rounded-lg bg-linear-to-r from-accent-dark to-accent-brand px-6 text-sm font-semibold text-white shadow-sm hover:brightness-105"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Create brand"
            )}
          </Button>
        </div>
      </section>
    </form>
  )
}
