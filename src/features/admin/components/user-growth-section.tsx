"use client"

import { UserPlus, Briefcase, Sparkles, CheckCircle2, Clock } from "lucide-react"
import type { AdminUsersMetrics } from "../types"

interface UserGrowthSectionProps {
  users: AdminUsersMetrics
}

const ROLE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  creator: { label: "Content Creator", color: "bg-orange-500 text-orange-700", bg: "bg-orange-50" },
  business_owner: { label: "Business Owner", color: "bg-blue-500 text-blue-700", bg: "bg-blue-50" },
  agency_owner: { label: "Agency Owner", color: "bg-purple-500 text-purple-700", bg: "bg-purple-50" },
  social_media_manager: { label: "Social Media Manager", color: "bg-emerald-500 text-emerald-700", bg: "bg-emerald-50" },
  unassigned: { label: "Unassigned / Incomplete", color: "bg-slate-400 text-slate-600", bg: "bg-slate-50" },
}

export function UserGrowthSection({ users }: UserGrowthSectionProps) {
  const roles = Object.entries(users.roles_breakdown)
  const totalInRoles = roles.reduce((sum, [, count]) => sum + (count || 0), 0) || 1

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* 1. Growth Velocity */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <UserPlus className="size-4.5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base">New Sign-Ups</h3>
            <p className="text-xs text-slate-500">Recent user registrations</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-slate-700">Joined Today</span>
            </div>
            <span className="text-xl font-bold text-slate-900">+{users.growth.joined_today}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-blue-500" />
              <span className="text-sm font-medium text-slate-700">Joined This Week</span>
            </div>
            <span className="text-xl font-bold text-slate-900">+{users.growth.joined_this_week}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-purple-500" />
              <span className="text-sm font-medium text-slate-700">Joined This Month</span>
            </div>
            <span className="text-xl font-bold text-slate-900">+{users.growth.joined_this_month}</span>
          </div>
        </div>

        {/* Onboarding Summary Box */}
        <div className="mt-6 rounded-xl border border-emerald-100/80 bg-emerald-50/40 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 mb-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-600" />
              Percentage Onboarded
            </span>
            <span>{Number(users.onboarding_completion_rate_percentage).toFixed(0)}% Finished</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>{users.completed_onboarding}</strong> out of <strong>{users.total_users}</strong> registered users have set up their brand profile.
          </p>
        </div>
      </div>

      {/* 2. User Roles Breakdown (Spans 2 columns) */}
      <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <Briefcase className="size-4.5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-base">User Roles</h3>
                <p className="text-xs text-slate-500">Distribution across user roles</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {users.total_users} Total Registered
            </span>
          </div>

          {/* Stacked Proportional Bar */}
          <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex gap-0.5 mb-6">
            {roles.map(([key, count]) => {
              const num = count || 0
              if (num === 0) return null
              const percent = (num / totalInRoles) * 100
              const meta = ROLE_LABELS[key] || { color: "bg-slate-400" }
              const bgClass = meta.color.split(" ")[0]
              return (
                <div
                  key={key}
                  className={`${bgClass} h-full transition-all duration-300 hover:opacity-90`}
                  style={{ width: `${percent}%` }}
                  title={`${meta.label || key}: ${num} (${percent.toFixed(1)}%)`}
                />
              )
            })}
          </div>

          {/* Detailed Role Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {roles.map(([key, count]) => {
              const num = count || 0
              const percent = Math.round((num / totalInRoles) * 100)
              const meta = ROLE_LABELS[key] || { label: key.replace(/_/g, " "), color: "bg-slate-400 text-slate-700", bg: "bg-slate-50" }
              const bgClass = meta.color.split(" ")[0]

              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`size-3 rounded-full ${bgClass} shrink-0`} />
                    <span className="text-sm font-medium text-slate-800 truncate capitalize">
                      {meta.label}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 shrink-0 ml-2">
                    <span className="text-sm font-bold text-slate-900">{num}</span>
                    <span className="text-xs text-slate-400">({percent}%)</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-slate-400" />
            Active Users: <strong>{users.active_users}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-orange-500" />
            Top Persona: <strong>Content Creator</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
