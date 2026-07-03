import Link from "next/link"
import { Suspense } from "react"

import { AuthShell } from "@/features/auth/components/auth-shell"
import { SignInForm } from "@/features/auth/components/signin-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata = {
  title: "Sign In | PostReach",
  description:
    "Sign in to PostReach and continue managing content, publishing, and social accounts from one dashboard.",
}

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Pick up where you left off."
      description="Return to your dashboard to schedule posts, manage connected accounts, and keep every brand workspace moving."
      footer={
        <p>
          New here?{" "}
          <Link className="font-semibold text-accent-dark" href="/signup">
            Create an account
          </Link>
        </p>
      }
    >
      <Card className="rounded-[28px] border border-black/8 bg-white/90 py-0 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.4)] backdrop-blur">
        <CardHeader className="border-b border-black/6 px-6 py-6">
          <CardTitle className="text-xl font-semibold text-slate-950">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-sm leading-6 text-slate-500">
            Access your content calendar, social accounts, and brand dashboards.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-6 py-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-950" />
              </div>
            }
          >
            <SignInForm />
          </Suspense>
        </CardContent>
      </Card>
    </AuthShell>
  )
}
