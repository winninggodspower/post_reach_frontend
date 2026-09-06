"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { CreateBrandFlow } from "@/features/brands/components/create-brand-flow"
import { setActiveBrand } from "@/features/brands/api/server"
import { useAuth } from "@/features/auth/store/auth-store"

export default function CreateBrandPage() {
  const router = useRouter()
  const loadUser = useAuth((state) => state.loadUser)

  const handleSuccess = async (brandId: string) => {
    await setActiveBrand(brandId)
    await loadUser()
    router.replace("/dashboard")
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-6 py-8 sm:px-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex w-fit items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        <div className="mt-10 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Create a brand
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Set up a workspace to manage social accounts, posts, and analytics in one place.
          </p>
        </div>

        <CreateBrandFlow onSuccess={handleSuccess} />
      </div>
    </main>
  )
}
