"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { GoogleSignInButton } from "@/features/auth/components/google-signin-button"
import { FormError } from "@/components/form-error"
import { FormField } from "@/components/form-field"
import { handleServerFormErrors } from "@/lib/form/serverErrors"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/features/auth/store/auth-store"

type SignUpFormValues = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  country: string
}

export function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register: registerAccountWithAuth } = useAuth()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "",
    },
    mode: "onBlur",
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null)

    try {
      await registerAccountWithAuth({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        country: values.country,
      })

      const callbackUrl = searchParams?.get("callbackUrl")
      const nextUrl = callbackUrl
        ? `/onboarding?next=${encodeURIComponent(callbackUrl)}`
        : "/onboarding"

      router.replace(nextUrl)
    } catch (error) {
      handleServerFormErrors<SignUpFormValues>(error, setError, setSubmitError)
    }
  })

  return (
    <form className="space-y-5" noValidate onSubmit={onSubmit}>
      <GoogleSignInButton
        mode="signup"
        onError={(message) => setSubmitError(message)}
      />

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">
          Or
        </span>
      </div>

      <FormError message={submitError} />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="First name"
          autoComplete="given-name"
          placeholder="Ada"
          error={errors.firstName?.message}
          {...register("firstName", {
            required: "First name is required.",
            minLength: {
              value: 2,
              message: "Enter at least 2 characters.",
            },
          })}
        />

        <FormField
          label="Last name"
          autoComplete="family-name"
          placeholder="Lovelace"
          error={errors.lastName?.message}
          {...register("lastName", {
            required: "Last name is required.",
            minLength: {
              value: 2,
              message: "Enter at least 2 characters.",
            },
          })}
        />
      </div>

      <FormField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required.",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Enter a valid email address.",
          },
        })}
      />

      <FormField
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="Create a password"
        hint="Use at least 8 characters for a stronger login."
        error={errors.password?.message}
        {...register("password", {
          required: "Password is required.",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters.",
          },
        })}
      />

      <FormField
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        placeholder="Confirm your password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword", {
          required: "Please confirm your password.",
          validate: (value) =>
            value === getValues("password") || "Passwords do not match.",
        })}
      />

      <FormField
        label="Country"
        autoComplete="country-name"
        placeholder="Optional"
        error={errors.country?.message}
        {...register("country")}
      />

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}
