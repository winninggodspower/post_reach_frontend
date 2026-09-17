"use client"

import React from "react"
import {
  Building2,
  Users2,
  Globe2,
  PieChart,
  Briefcase,
  Share2,
  CheckCircle2,
} from "lucide-react"
import {
  AdminBrandsMetrics,
  AdminSocialAccountsMetrics,
} from "../types"

interface SocialEcosystemSectionProps {
  brands: AdminBrandsMetrics
  socialAccounts: AdminSocialAccountsMetrics
}

const PLATFORM_COLORS: Record<
  string,
  { name: string; bg: string; text: string; bar: string }
> = {
  instagram: {
    name: "Instagram",
    bg: "bg-pink-500/10",
    text: "text-pink-600 dark:text-pink-400",
    bar: "bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500",
  },
  youtube: {
    name: "YouTube",
    bg: "bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    bar: "bg-red-500",
  },
  tiktok: {
    name: "TikTok",
    bg: "bg-slate-500/10",
    text: "text-slate-900 dark:text-slate-100",
    bar: "bg-slate-900 dark:bg-slate-200",
  },
  facebook: {
    name: "Facebook",
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    bar: "bg-blue-600",
  },
  linkedin: {
    name: "LinkedIn",
    bg: "bg-sky-500/10",
    text: "text-sky-600 dark:text-sky-400",
    bar: "bg-sky-600",
  },
  x: {
    name: "X (Twitter)",
    bg: "bg-neutral-500/10",
    text: "text-neutral-900 dark:text-neutral-100",
    bar: "bg-neutral-900 dark:bg-neutral-100",
  },
  twitter: {
    name: "Twitter / X",
    bg: "bg-neutral-500/10",
    text: "text-neutral-900 dark:text-neutral-100",
    bar: "bg-neutral-900 dark:bg-neutral-100",
  },
}

export const SocialEcosystemSection: React.FC<SocialEcosystemSectionProps> = ({
  brands,
  socialAccounts,
}) => {
  const totalBrands = Math.max(brands.total_brands || 0, 1)
  const connectedBrandsRate = (
    ((brands.brands_with_connected_accounts || 0) / totalBrands) *
    100
  ).toFixed(1)

  const totalConnected = Math.max(
    socialAccounts.total_connected_accounts || 0,
    1
  )

  const platforms = Object.entries(
    socialAccounts.platforms_breakdown || {}
  ).filter(([, count]) => typeof count === "number")

  const industries = Object.entries(brands.industries_breakdown || {}).sort(
    ([, a], [, b]) => b - a
  )
  const totalIndustriesCount = Math.max(
    industries.reduce((acc, [, v]) => acc + v, 0),
    1
  )

  const teamSizes = Object.entries(brands.team_sizes_breakdown || {}).sort(
    ([, a], [, b]) => b - a
  )
  const totalTeamSizesCount = Math.max(
    teamSizes.reduce((acc, [, v]) => acc + v, 0),
    1
  )

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Workspaces
            </span>
            <div className="size-8 rounded-xl bg-orange-50 text-accent-brand border border-orange-100 flex items-center justify-center">
              <Building2 className="size-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
            {brands.total_brands.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-2">Organized brand workspaces</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Connected Brands
            </span>
            <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
              {brands.brands_with_connected_accounts.toLocaleString()}
            </p>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
              ({connectedBrandsRate}%)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Brands with 1+ live social account</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Connected Accounts
            </span>
            <div className="size-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
              <Share2 className="size-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
            {socialAccounts.total_connected_accounts.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Avg {(socialAccounts.total_connected_accounts / totalBrands).toFixed(1)} per brand
          </p>
        </div>
      </div>

      {/* Social Platforms Breakdown */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Connected Channels Breakdown</h3>
            <p className="text-xs text-slate-500">
              Distribution of authenticated social accounts across network providers
            </p>
          </div>
          <div className="text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
            {socialAccounts.total_connected_accounts} accounts total
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {platforms.map(([platformKey, count]) => {
            const numCount = count || 0
            const pct = ((numCount / totalConnected) * 100).toFixed(1)
            const meta = PLATFORM_COLORS[platformKey.toLowerCase()] || {
              name: platformKey,
              bg: "bg-slate-50",
              text: "text-slate-800",
              bar: "bg-slate-900",
            }

            return (
              <div
                key={platformKey}
                className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50 hover:border-slate-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold capitalize text-slate-900">
                    {meta.name}
                  </span>
                  <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${meta.bg} ${meta.text}`}>
                    {numCount}
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Share of ecosystem</span>
                    <span className="font-semibold text-slate-700">{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200/70 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${meta.bar} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Brand Demographics: Industries & Team Sizes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industries */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="size-8 rounded-xl bg-orange-50 text-accent-brand border border-orange-100 flex items-center justify-center">
              <Briefcase className="size-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Brand Industries</h3>
              <p className="text-xs text-slate-500">Self-reported business category</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {industries.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No industry classifications recorded yet.
              </p>
            ) : (
              industries.map(([industry, count]) => {
                const pct = ((count / totalIndustriesCount) * 100).toFixed(1)
                const formattedName = industry
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())

                return (
                  <div key={industry} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800">{formattedName}</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-slate-900">{count}</span>
                        <span className="text-[11px] text-slate-500">({pct}%)</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-accent-brand to-accent-dark transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Team Sizes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="size-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Users2 className="size-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Team Size Profile</h3>
              <p className="text-xs text-slate-500">Workspace organization tier</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {teamSizes.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No team size distribution recorded yet.
              </p>
            ) : (
              teamSizes.map(([sizeRange, count]) => {
                const pct = ((count / totalTeamSizesCount) * 100).toFixed(1)
                const formattedRange = sizeRange.replace(/_/g, " ")

                return (
                  <div key={sizeRange} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800">{formattedRange}</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-slate-900">{count}</span>
                        <span className="text-[11px] text-slate-500">({pct}%)</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
