import Link from "next/link"
import { Suspense } from "react"

import { AuthShell } from "@/features/auth/components/auth-shell"
import { SignUpForm } from "@/features/auth/components/signup-form"
import { Card } from "@/components/ui/card"

export const metadata = {
  title: "Create Account | PostGlee",
  description:
    "Create your PostGlee account and manage publishing, workspaces, and social content from one dashboard.",
}

export default function SignUpPage() {
  return (
    <AuthShell
      title="Ready to post smarter?"
      description="One workspace, every channel, zero tab-switching chaos."
      footer={
        <p>
          Already have an account?{" "}
          <Link className="font-semibold text-accent-dark" href="/signin">
            Sign in
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
          <SignUpForm />
        </Suspense>
      </Card>
    </AuthShell>
  )
}
