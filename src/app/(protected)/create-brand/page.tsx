"use client"

import { useRouter } from "next/navigation"

import { CreateBrandFlow } from "@/features/brands/components/create-brand-flow"
import { setActiveBrand } from "@/features/brands/api/server"
import { useAuth } from "@/features/auth/store/auth-store"
import { GridPattern } from "@/components/ui/grid-pattern"
import { ArrowLeft, CheckCircle2, Layers, LineChart, Users } from "lucide-react"

export default function CreateBrandPage() {
  const router = useRouter()
  const setUser = useAuth((state) => state.setUser)

  const handleSuccess = async (brandId: string) => {
    const updatedUser = await setActiveBrand(brandId)
    setUser(updatedUser)
    router.replace("/dashboard")
  }

  return (
    <main className="flex min-h-screen w-full bg-white flex-col-reverse lg:flex-row">
      
      {/* Left Column (formerly Right Column): The Form */}
      <div className="relative flex w-full flex-col items-center justify-center bg-white px-4 py-12 lg:w-[55%]">
        
        {/* Back Button for mobile / standard view */}
        <div className="absolute top-8 left-8">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 rounded-full px-4 py-2 hover:bg-slate-50 transition text-slate-500 hover:text-slate-900 cursor-pointer font-medium text-sm border border-transparent hover:border-slate-200"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </button>
        </div>

        <div className="w-full max-w-xl mt-12 lg:mt-0">
          <div className="mb-10 text-center lg:hidden">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 mb-2">Create New Brand</h1>
            <p className="text-sm text-slate-500">Set up your workspace to get started.</p>
          </div>
          <CreateBrandFlow onSuccess={handleSuccess} />
        </div>
      </div>

      {/* Right Column (formerly Left Column): Premium Presentation */}
      <div className="relative hidden w-full flex-col justify-between bg-slate-50 p-12 lg:flex lg:w-[45%] overflow-hidden border-l border-slate-100">
        
        <GridPattern
          className="absolute inset-0 stroke-black/5 mask-[linear-gradient(to_bottom,white,transparent_90%)]"
          squares={[
            [4, 4],
            [9, 8],
            [15, 2],
            [2, 12],
          ]}
        />

        {/* Removed back button from here, moved to the form side */}
        <div /> 

        <div className="relative z-10 my-auto pl-8">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-6 shadow-sm">
            Workspace Configuration
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-4 leading-tight">
            Elevate your brand's presence
          </h1>
          <p className="text-base text-slate-500 mb-12 max-w-md leading-relaxed">
            A Brand is your dedicated workspace. It keeps everything perfectly organized, so you can focus on creating and growing your audience.
          </p>

          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm border border-slate-100">
                <Layers className="size-5" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900 text-base">Organized Accounts</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">Group all your social media platforms under one unified, beautiful dashboard.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm border border-slate-100">
                <Users className="size-5" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900 text-base">Team Collaboration</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">Invite team members to seamlessly manage posts and analytics together.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm border border-slate-100">
                <LineChart className="size-5" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900 text-base">Unified Analytics</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">Track your brand's overall performance metrics across every network in one place.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center gap-2 text-sm text-slate-400 font-medium pl-8">
          <CheckCircle2 className="size-4 text-emerald-500" />
          Setup takes less than a minute
        </div>
      </div>
    </main>
  )
}
