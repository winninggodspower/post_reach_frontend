import Link from "next/link"
import { Suspense } from "react"

import { AuthShell } from "@/features/auth/components/auth-shell"
import { SignInForm } from "@/features/auth/components/signin-form"
import { Card } from "@/components/ui/card"

export const metadata = {
  title: "Sign In | PostGlee",
  description:
    "Sign in to PostGlee and continue managing content, publishing, and social accounts from one dashboard.",
}

export default function SignInPage() {
  return (
    <AuthShell
      title="Your queue missed you."
      description="Your drafts are piling up and your schedule has gaps — let's fix that."
      footer={
        <p>
          New here?{" "}
          <Link className="font-semibold text-accent-dark" href="/signup">
            Create an account
          </Link>
        </p>
      }
    >
      <Card className="rounded-2xl border border-black/8 bg-white/90 p-6 shadow-lg shadow-black/5 backdrop-blur">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-950" />
            </div>
          }
        >
          <SignInForm />
        </Suspense>
      </Card>
    </AuthShell>
  )
}
