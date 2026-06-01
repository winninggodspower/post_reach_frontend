import { Check, CircleCheckBig, Loader2 } from "lucide-react"

import type {
  OnboardingIndustry,
  OnboardingPlatform,
  OnboardingRole,
} from "@/features/onboarding/types"

export type StepId = 0 | 1 | 2 | 3

export type RoleOption = {
  id: OnboardingRole
  title: string
  description: string
}

export type IndustryOption = {
  id: OnboardingIndustry
  label: string
}

export type PlatformOption = {
  id: OnboardingPlatform
  label: string
  accent: string
  initials: string
}

export const ROLE_OPTIONS: RoleOption[] = [
  {
    id: "creator",
    title: "Creator",
    description: "Build your personal brand and grow your audience.",
  },
  {
    id: "business_owner",
    title: "Business Owner",
    description: "Manage content and marketing for your business.",
  },
  {
    id: "agency_owner",
    title: "Agency Owner",
    description: "Manage multiple clients and teams.",
  },
  {
    id: "social_media_manager",
    title: "Social Media Manager",
    description: "Plan and publish content professionally.",
  },
]

export const INDUSTRY_OPTIONS: IndustryOption[] = [
  { id: "technology", label: "Technology" },
  { id: "marketing", label: "Marketing" },
  { id: "ecommerce", label: "Ecommerce" },
  { id: "real_estate", label: "Real Estate" },
  { id: "healthcare", label: "Healthcare" },
  { id: "education", label: "Education" },
  { id: "finance", label: "Finance" },
  { id: "other", label: "Other" },
]

export const PLATFORM_OPTIONS: PlatformOption[] = [
  { id: "instagram", label: "Instagram", accent: "from-fuchsia-500 to-orange-400", initials: "IG" },
  { id: "linkedin", label: "LinkedIn", accent: "from-sky-600 to-sky-400", initials: "IN" },
  { id: "tiktok", label: "TikTok", accent: "from-zinc-900 to-fuchsia-600", initials: "TT" },
  { id: "facebook", label: "Facebook", accent: "from-blue-700 to-blue-500", initials: "FB" },
  { id: "x", label: "X", accent: "from-slate-950 to-slate-700", initials: "X" },
  { id: "youtube", label: "YouTube", accent: "from-red-600 to-rose-500", initials: "YT" },
]

export const STEP_TITLES = ["Role", "Business", "Content", "Accounts"]

export const platformLabelMap = Object.fromEntries(
  PLATFORM_OPTIONS.map((platform) => [platform.id, platform.label]),
) as Record<OnboardingPlatform, string>

function RoleIllustration({ role }: { role: OnboardingRole }) {
  switch (role) {
    case "creator":
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full scale-110 transform-gpu origin-center" aria-hidden="true">
          <rect x="16" y="16" width="88" height="88" rx="28" fill="#fff7ed" />
          <circle cx="60" cy="46" r="14" fill="#fdba74" />
          <path d="M42 86c4-12 12-18 18-18s14 6 18 18" fill="#fb923c" fillOpacity="0.22" />
          <path d="M46 60c4-6 9-9 14-9s10 3 14 9v14c0 4-3 7-7 7H53c-4 0-7-3-7-7V60Z" fill="#fb923c" fillOpacity="0.72" />
          <path d="M50 38c0-5 4-9 10-9s10 4 10 9" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
          <path d="M39 53l-8-4M81 53l8-4M60 28v-8" stroke="#fb923c" strokeWidth="4" strokeLinecap="round" />
          <circle cx="86" cy="34" r="4" fill="#f97316" />
          <circle cx="31" cy="72" r="3.5" fill="#fdba74" />
        </svg>
      )
    case "business_owner":
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full scale-110 transform-gpu origin-center" aria-hidden="true">
          <rect x="16" y="16" width="88" height="88" rx="28" fill="#eff6ff" />
          <circle cx="60" cy="42" r="13" fill="#bfdbfe" />
          <path d="M42 86c3-13 10-21 18-21s15 8 18 21" fill="#60a5fa" fillOpacity="0.22" />
          <path d="M47 56c0-4 3-7 7-7h12c4 0 7 3 7 7v16c0 4-3 7-7 7H54c-4 0-7-3-7-7V56Z" fill="#2563eb" fillOpacity="0.72" />
          <path d="M49 38c3-5 7-8 11-8s8 3 11 8" stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round" />
          <rect x="71" y="60" width="12" height="10" rx="3" fill="#1d4ed8" fillOpacity="0.25" />
          <path d="M69 70h18" stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round" />
          <path d="M40 76h13M67 76h13" stroke="#93c5fd" strokeWidth="4" strokeLinecap="round" />
        </svg>
      )
    case "agency_owner":
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full scale-110 transform-gpu origin-center" aria-hidden="true">
          <rect x="16" y="16" width="88" height="88" rx="28" fill="#f8fafc" />
          <circle cx="60" cy="42" r="13" fill="#cbd5e1" />
          <path d="M42 86c3-13 10-21 18-21s15 8 18 21" fill="#0f172a" fillOpacity="0.14" />
          <path d="M47 56c0-4 3-7 7-7h12c4 0 7 3 7 7v16c0 4-3 7-7 7H54c-4 0-7-3-7-7V56Z" fill="#0f172a" fillOpacity="0.7" />
          <path d="M50 38c3-4 6-6 10-6s7 2 10 6" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
          <circle cx="34" cy="60" r="9" fill="#94a3b8" fillOpacity="0.55" />
          <circle cx="86" cy="60" r="9" fill="#94a3b8" fillOpacity="0.55" />
          <path d="M34 70c0-5 4-9 9-9s9 4 9 9v6H34v-6Z" fill="#94a3b8" fillOpacity="0.4" />
          <path d="M77 70c0-5 4-9 9-9s9 4 9 9v6H77v-6Z" fill="#94a3b8" fillOpacity="0.4" />
          <path d="M60 58v10M47 66h26" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
        </svg>
      )
    case "social_media_manager":
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full scale-110 transform-gpu origin-center" aria-hidden="true">
          <rect x="16" y="16" width="88" height="88" rx="28" fill="#f0fdf4" />
          <circle cx="60" cy="42" r="13" fill="#bbf7d0" />
          <path d="M42 86c3-13 10-21 18-21s15 8 18 21" fill="#16a34a" fillOpacity="0.2" />
          <path d="M47 56c0-4 3-7 7-7h12c4 0 7 3 7 7v16c0 4-3 7-7 7H54c-4 0-7-3-7-7V56Z" fill="#16a34a" fillOpacity="0.72" />
          <path d="M50 38c3-5 7-8 10-8s7 3 10 8" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
          <rect x="71" y="34" width="16" height="12" rx="4" fill="#22c55e" fillOpacity="0.28" />
          <path d="M71 40h18M71 48h12" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M38 70h10M72 70h10" stroke="#86efac" strokeWidth="4" strokeLinecap="round" />
          <circle cx="34" cy="58" r="5" fill="#22c55e" fillOpacity="0.35" />
          <circle cx="86" cy="58" r="5" fill="#22c55e" fillOpacity="0.35" />
        </svg>
      )
    default:
      return null
  }
}

export function RoleCard({
  option,
  selected,
  onSelect,
}: {
  option: RoleOption
  selected: boolean
  onSelect: (role: OnboardingRole) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      aria-pressed={selected}
      className={`group relative flex h-full flex-col rounded-[28px] border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-32px_rgba(15,23,42,0.4)] sm:p-5 ${
        selected
          ? "border-slate-950/15 bg-slate-950/3 ring-1 ring-slate-950/10"
          : "border-black/8 bg-white hover:border-slate-950/12"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="relative mb-5 overflow-hidden rounded-[22px] border border-black/6 bg-linear-to-br from-slate-50 to-white p-3 shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.12),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_42%)]" />
            <div className="relative h-24 w-full">
              <RoleIllustration role={option.id} />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-950">{option.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{option.description}</p>
        </div>

        <span
          className={`mt-1 flex h-7 w-7 items-center justify-center rounded-full border transition ${
            selected
              ? "border-slate-950 bg-slate-950 text-white"
              : "border-black/10 bg-white text-transparent group-hover:border-slate-950/25"
          }`}
        >
          <Check className="size-4" />
        </span>
      </div>
    </button>
  )
}

export function SocialPlatformIcon({ option }: { option: PlatformOption }) {
  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${option.accent} text-[11px] font-semibold tracking-[0.16em] text-white shadow-[0_12px_30px_-18px_rgba(15,23,42,0.8)]`}
      aria-hidden="true"
    >
      {option.initials}
    </span>
  )
}

export function StatusPill({ connected }: { connected: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
        connected
          ? "bg-emerald-500/10 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {connected ? <CircleCheckBig className="size-3.5" /> : <Loader2 className="size-3.5" />}
      {connected ? "Connected" : "Not connected"}
    </span>
  )
}
