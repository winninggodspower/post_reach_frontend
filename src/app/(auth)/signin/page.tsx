import Link from "next/link"

import { AuthShell } from "@/components/auth/auth-shell"
import { SignInForm } from "@/components/auth/signin-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata = {
  title: "Sign In | PostReach",
  description: "Sign in to PostReach and continue managing your social media workflow.",
}

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in and pick up exactly where you left off."
      description="Jump back into your content calendar, approvals, and scheduled posts with a quick Google sign in or your email and password."
      footer={
        <p>
          New here?{" "}
          <Link className="font-semibold text-accent-dark" href="/signup">
            Create an account
          </Link>
        </p>
      }
    >
      <Card className="rounded-[28px] border border-black/[0.08] bg-white/90 py-0 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.4)] backdrop-blur">
        <CardHeader className="border-b border-black/[0.06] px-6 py-6">
          <CardTitle className="text-xl font-semibold text-slate-950">
            Sign in
          </CardTitle>
          <CardDescription className="text-sm leading-6 text-slate-500">
            Choose the fastest path in, then use your normal credentials if you
            prefer.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-6 py-6">
          <SignInForm />
        </CardContent>
      </Card>
    </AuthShell>
  )
}
