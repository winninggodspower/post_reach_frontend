import Link from "next/link"

import { AuthShell } from "@/components/auth/auth-shell"
import { SignUpForm } from "@/components/auth/signup-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata = {
  title: "Create Account | PostReach",
  description: "Create your PostReach account and start planning your social media workflow.",
}

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Create account"
      title="Start building a calmer publishing workflow."
      description="Open your workspace in minutes, invite teammates later, and keep every social campaign moving from draft to scheduled."
      footer={
        <p>
          Already have an account?{" "}
          <Link className="font-semibold text-accent-dark" href="/signin">
            Sign in
          </Link>
        </p>
      }
    >
      <Card className="rounded-[28px] border border-black/[0.08] bg-white/90 py-0 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.4)] backdrop-blur gap-0">
        <CardHeader className="border-b border-black/6 px-6 py-6">
          <CardTitle className="text-xl font-semibold text-slate-950">
            Create your account
          </CardTitle>
          <CardDescription className="text-sm leading-6 text-slate-500">
            Start with Google first, or set up your account with the fields
            below.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-6 py-6">
          <SignUpForm />
        </CardContent>
      </Card>
    </AuthShell>
  )
}
