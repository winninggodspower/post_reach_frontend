import Link from "next/link"
import { Suspense } from "react"

import { AuthShell } from "@/features/auth/components/auth-shell"
import { SignUpForm } from "@/features/auth/components/signup-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata = {
  title: "Create Account | PostReach",
  description:
    "Create your PostReach account and manage publishing, workspaces, and social content from one dashboard.",
}

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Create account"
      title="Build a calmer workflow."
      description="Set up your workspace and start creating, scheduling, and optimizing content across every social channel you manage."
      footer={
        <p>
          Already have an account?{" "}
          <Link className="font-semibold text-accent-dark" href="/signin">
            Sign in
          </Link>
        </p>
      }
    >
      <Card className="gap-0 rounded-[28px] border border-black/8 bg-white/90 py-0 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.4)] backdrop-blur">
        <CardHeader className="border-b border-black/6 px-6 py-6">
          <CardTitle className="text-xl font-semibold text-slate-950">
            Create your account
          </CardTitle>
          <CardDescription className="text-sm leading-6 text-slate-500">
            Start one dashboard for publishing, brand management, and social
            scheduling.
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
            <SignUpForm />
          </Suspense>
        </CardContent>
      </Card>
    </AuthShell>
  )
}
