"use client"

import React, { useState } from "react"
import {
  RefreshCw,
  ShieldCheck,
  Activity,
  Users,
  Send,
  HardDrive,
  LayoutDashboard,
  AlertCircle,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react"
import { useAdminAnalytics } from "../hooks/use-admin-analytics"
import { AccessDeniedView } from "./access-denied-view"
import { KpiSummaryCards } from "./kpi-summary-cards"
import { UserGrowthSection } from "./user-growth-section"
import { ContentPipelineSection } from "./content-pipeline-section"
import { SocialEcosystemSection } from "./social-ecosystem-section"
import { StorageTelemetrySection } from "./storage-telemetry-section"

type TabType = "overview" | "users" | "publishing" | "system"

export const AdminAnalyticsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const {
    data,
    isLoading,
    isRefreshing,
    error,
    isForbidden,
    refetch,
    lastRefreshedAt,
  } = useAdminAnalytics()

  // 403 Forbidden check (Non-superuser)
  if (isForbidden) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <AccessDeniedView onRetry={refetch} />
      </div>
    )
  }

  const formattedTime = lastRefreshedAt
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      }).format(lastRefreshedAt)
    : null

  const tabs: {
    id: TabType
    label: string
    icon: React.ComponentType<{ className?: string }>
  }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users & Funnel", icon: Users },
    { id: "publishing", label: "Publishing Health", icon: Send },
    { id: "system", label: "System & Storage", icon: HardDrive },
  ]

  const isBusy = isLoading || isRefreshing

  return (
    <div className="min-h-screen pb-16 space-y-8 animate-in fade-in duration-300">
      {/* PostReach Signature Dark Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-8 shadow-xl text-white">
        {/* Subtle dot grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        {/* PostReach Radial Glow Orbs */}
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-accent-brand/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-blue-500/20 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur">
                <ShieldCheck className="size-3.5 text-accent-brand" />
                Admin Console
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
                </span>
                Live Status
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Platform{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-accent-brand to-orange-300">
                Analytics
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time user growth, content publishing pipeline, connected channels, and workspace activity.
            </p>
          </div>

          {/* Sync CTA and Timestamp */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {formattedTime && (
              <span className="text-xs text-slate-400 font-medium">
                Updated {formattedTime}
              </span>
            )}

            <button
              onClick={() => refetch()}
              disabled={isBusy}
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-accent-brand to-accent-dark text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 shadow-lg shadow-accent-brand/25 hover:shadow-xl hover:shadow-accent-brand/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`size-3.5 ${isBusy ? "animate-spin" : ""}`}
              />
              <span>{isRefreshing ? "Syncing..." : "Sync Metrics"}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation inside Hero */}
        <div className="relative z-10 flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-slate-800/80 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-white text-slate-900 shadow-md scale-[1.02]"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className={`size-4 ${isActive ? "text-accent-brand" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Error State Banner */}
      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 flex items-center justify-between gap-4 text-sm text-destructive">
          <div className="flex items-center gap-3">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => refetch()}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-destructive text-destructive-foreground hover:brightness-95 transition-colors cursor-pointer"
          >
            Retry Sync
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && !data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl border border-slate-200 bg-slate-100/70 animate-pulse"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 rounded-2xl border border-slate-200 bg-slate-100/70 animate-pulse" />
            <div className="h-80 rounded-2xl border border-slate-200 bg-slate-100/70 animate-pulse" />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {data && (
        <div className="space-y-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Top 5 Headline Summary Cards */}
              <KpiSummaryCards data={data} />

              {/* Overview Summary: Two Clean, Focused Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. New Sign-Ups & Roles */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                          New Sign-Ups
                        </h3>
                        <p className="text-xs text-slate-500">
                          Recent user registrations
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab("users")}
                        className="text-xs font-bold text-accent-brand hover:text-accent-dark flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>View All Users</span>
                        <ArrowUpRight className="size-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-5">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Today
                        </span>
                        <p className="text-xl font-extrabold text-slate-900 mt-1">
                          +{data.users.growth?.joined_today ?? 0}
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          This Week
                        </span>
                        <p className="text-xl font-extrabold text-slate-900 mt-1">
                          +{data.users.growth?.joined_this_week ?? 0}
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          This Month
                        </span>
                        <p className="text-xl font-extrabold text-slate-900 mt-1">
                          +{data.users.growth?.joined_this_month ?? 0}
                        </p>
                      </div>
                    </div>

                    {/* Simple Top Roles list */}
                    <div className="mt-6 space-y-2.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Top Roles
                      </p>
                      {Object.entries(data.users.roles_breakdown || {})
                        .filter(([key]) => key !== "unassigned")
                        .slice(0, 3)
                        .map(([role, count]) => (
                          <div
                            key={role}
                            className="flex items-center justify-between text-xs py-1"
                          >
                            <span className="capitalize font-medium text-slate-700">
                              {role.replace(/_/g, " ")}
                            </span>
                            <span className="font-bold text-slate-900">
                              {count ?? 0} users
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{data.users.total_users} registered users</span>
                    <span className="font-semibold text-emerald-600">
                      {data.users.completed_onboarding} completed setup
                    </span>
                  </div>
                </div>

                {/* 2. Publishing Status */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                          Publishing Status
                        </h3>
                        <p className="text-xs text-slate-500">
                          Current state of all created posts
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab("publishing")}
                        className="text-xs font-bold text-accent-brand hover:text-accent-dark flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>View Publishing</span>
                        <ArrowUpRight className="size-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-5">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Live Posted
                        </span>
                        <p className="text-xl font-extrabold text-slate-900 mt-1">
                          {data.posts.live_posts_count.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Scheduled
                        </span>
                        <p className="text-xl font-extrabold text-slate-900 mt-1">
                          {data.posts.status_breakdown?.scheduled ?? 0}
                        </p>
                      </div>
                      <div
                        className={`p-3.5 rounded-xl border ${
                          (data.posts.status_breakdown?.failed ?? 0) === 0
                            ? "bg-slate-50 border-slate-100"
                            : "bg-rose-50 border-rose-100"
                        }`}
                      >
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider ${
                            (data.posts.status_breakdown?.failed ?? 0) === 0
                              ? "text-slate-500"
                              : "text-rose-700"
                          }`}
                        >
                          Failed
                        </span>
                        <p
                          className={`text-xl font-extrabold mt-1 ${
                            (data.posts.status_breakdown?.failed ?? 0) === 0
                              ? "text-slate-900"
                              : "text-rose-600"
                          }`}
                        >
                          {data.posts.status_breakdown?.failed ?? 0}
                        </p>
                      </div>
                    </div>

                    {/* Top Connected Platforms */}
                    <div className="mt-6 space-y-2.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Top Connected Channels
                      </p>
                      {Object.entries(data.social_accounts?.platforms_breakdown || {})
                        .filter(([, count]) => typeof count === "number" && count > 0)
                        .slice(0, 3)
                        .map(([platform, count]) => (
                          <div
                            key={platform}
                            className="flex items-center justify-between text-xs py-1"
                          >
                            <span className="capitalize font-medium text-slate-700">
                              {platform}
                            </span>
                            <span className="font-bold text-slate-900">
                              {count} accounts
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {data.posts.platform_posts_published.toLocaleString()} total platform broadcasts
                    </span>
                    <span className="font-semibold text-slate-700">
                      {data.posts.total_posts} total posts
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USERS & FUNNEL */}
          {activeTab === "users" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <UserGrowthSection users={data.users} />
            </div>
          )}

          {/* TAB 3: PUBLISHING HEALTH */}
          {activeTab === "publishing" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <ContentPipelineSection metrics={data.posts} />
            </div>
          )}

          {/* TAB 4: SYSTEM & STORAGE */}
          {activeTab === "system" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <StorageTelemetrySection storage={data.storage} />
              <SocialEcosystemSection
                brands={data.brands}
                socialAccounts={data.social_accounts}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
