import Link from "next/link"

import { AuthShell } from "@/components/auth/auth-shell"
import { GoogleIcon } from "@/components/auth/google-icon"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

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

          <form className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                name="fullName"
                autoComplete="name"
                placeholder="Ada Lovelace"
                required
                className="h-12 rounded-xl border-black/10 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
                className="h-12 rounded-xl border-black/10 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a password"
                minLength={8}
                required
                className="h-12 rounded-xl border-black/10 bg-white"
              />
              <p className="text-sm text-slate-500">
                Use at least 8 characters for a stronger login.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm your password"
                minLength={8}
                required
                className="h-12 rounded-xl border-black/10 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                autoComplete="country-name"
                placeholder="Optional"
                className="h-12 rounded-xl border-black/10 bg-white"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-12 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800"
            >
              Create account
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthShell>
  )
}
