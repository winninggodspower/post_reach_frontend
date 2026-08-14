import Link from "next/link"
import { Suspense } from "react"

import { AuthShell } from "@/features/auth/components/auth-shell"
import { SignUpForm } from "@/features/auth/components/signup-form"

export const metadata = {
  title: "Create Account | PostGlee",
  description:
    "Create your PostGlee account and manage publishing, workspaces, and social content from one dashboard.",
}

export default function SignUpPage() {
  return (
    <AuthShell
      title="Ready to post smarter?"
      description="Create a free PostGlee account to seamlessly manage your social content across platforms."
      footer={
        <p>
          Already have an account?{" "}
          <Link className="font-semibold text-accent-dark" href="/signin">
            Sign in
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
        <SignUpForm />
      </Suspense>
    </AuthShell>
  )
}

