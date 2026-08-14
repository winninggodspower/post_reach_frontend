import Link from "next/link"
import { Suspense } from "react"

import { AuthShell } from "@/features/auth/components/auth-shell"
import { SignInForm } from "@/features/auth/components/signin-form"

export const metadata = {
  title: "Sign In | PostGlee",
  description:
    "Sign in to PostGlee and continue managing content, publishing, and social accounts from one dashboard.",
}

export default function SignInPage() {
  return (
    <AuthShell
      title="Back at it? Let's go."
      description="We missed your social presence. Sign in to make more content and keep growing."
      footer={
        <p>
          New here?{" "}
          <Link className="font-semibold text-accent-dark" href="/signup">
            Create an account
          </Link>
        </p>
      }
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-950" />
          </div>
        }
      >
        <SignInForm />
      </Suspense>
    </AuthShell>
  )
}

