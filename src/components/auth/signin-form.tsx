"use client"

import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react"

import { GoogleIcon } from "@/components/auth/google-icon"
import { FormError } from "@/components/form-error"
import { handleServerFormErrors } from "@/lib/form/serverErrors"
import { FormField } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type SignInFormValues = {
  email: string
  password: string
}

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null)

    try {
      const result = await signIn("login", {
        redirect: false,
        email: values.email,
        password: values.password,
      })

      if (result?.error) {
        console.log(result)
        handleServerFormErrors<SignInFormValues>(result.error, setError, setSubmitError)
        return
      }

      console.log(result)

      // Prefer the URL returned by next-auth, otherwise use callbackUrl search param
      const callbackUrl = searchParams?.get("callbackUrl") ?? "/dashboard"
      router.push(callbackUrl)
      router.refresh()
    } catch {
      setSubmitError("Unable to sign in right now. Please try again.")
    }
  })

  return (
    <form className="space-y-5" noValidate onSubmit={onSubmit}>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-12 w-full justify-center rounded-xl border-black/10 bg-white text-slate-900 shadow-sm hover:bg-slate-50"
      >
        <GoogleIcon />
        Continue with Google
      </Button>

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">
          Or
        </span>
      </div>

      <FormError message={submitError} />

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
        autoComplete="current-password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register("password", {
          required: "Password is required.",
        })}
      />

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}
