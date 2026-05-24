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
            Sign in
          </CardTitle>
          <CardDescription className="text-sm leading-6 text-slate-500">
            Access your content calendar, social accounts, and publishing
            workspace.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-6 py-6">
          <SignInForm />
        </CardContent>
      </Card>
    </AuthShell>
  )
}
