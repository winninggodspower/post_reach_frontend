"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, AlertCircle, Edit2, XCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchPostById, type CalendarItem } from "@/features/posts/api/server"
import { getPlatformMeta } from "@/features/posts/components/upload-status/utils"
import { usePostAnalytics } from "../hooks/use-post-analytics"
import { MetricScoreboard } from "./metric-scoreboard"
import { PlatformBreakdownList } from "./platform-breakdown-list"
import { PostHeroSummary } from "./post-hero-summary"
import { AudienceShareBar } from "./audience-share-bar"

export interface PostAnalyticsViewProps {
  postId: string
}

export function PostAnalyticsView({ postId }: PostAnalyticsViewProps) {
  const router = useRouter()
  const { data, isLoading, isRefreshing, error, refresh, reload } = usePostAnalytics(postId)
  const [postDetails, setPostDetails] = useState<CalendarItem | null>(null)
  const [activeTab, setActiveTab] = useState<string>("all")

  useEffect(() => {
    if (!postId) return
    let isMounted = true

    fetchPostById(postId)
      .then((res) => {
        if (isMounted && res.success && res.data) {
          setPostDetails(res.data)
        }
      })
      .catch(() => {
        // Fallback to analytics response data
      })

    return () => {
      isMounted = false
    }
  }, [postId])

  const caption = data?.caption || postDetails?.caption || ""
  const contentType = data?.content_type || postDetails?.content_type || "post"
  const mediaUrl =
    postDetails?.thumbnail_url ||
    (postDetails?.media_urls && postDetails.media_urls[0]) ||
    null

  const publishedAt = data?.created_at || postDetails?.created_at || null

  // Segregate published vs failed vs pending platforms
  const allPlatforms = data?.platforms || []
  const publishedPlatforms = allPlatforms.filter(
    (p) => (p.status || "").toLowerCase() === "posted"
  )
  const failedPlatforms = allPlatforms.filter(
    (p) => (p.status || "").toLowerCase() === "failed"
  )
  const isAllFailed = allPlatforms.length > 0 && publishedPlatforms.length === 0

  // Fallback to "all" if active tab was a failed platform that got removed
  const selectedPlatform = publishedPlatforms.find((p) => p.platform === activeTab)
  const platformLabel = selectedPlatform
    ? getPlatformMeta(selectedPlatform.platform).label
    : undefined

  // Calculate active metrics solely from PUBLISHED platforms
  const totalViews = publishedPlatforms.reduce((acc, p) => acc + (p.views || 0), 0)
  const totalReach = publishedPlatforms.reduce((acc, p) => acc + (p.reach || 0), 0)
  const totalLikes = publishedPlatforms.reduce((acc, p) => acc + (p.likes || 0), 0)
  const totalComments = publishedPlatforms.reduce((acc, p) => acc + (p.comments || 0), 0)
  const totalShares = publishedPlatforms.reduce((acc, p) => acc + (p.shares || 0), 0)
  const totalSaves = publishedPlatforms.reduce((acc, p) => acc + (p.saves || 0), 0)
  const totalClicks = publishedPlatforms.reduce((acc, p) => acc + (p.clicks || 0), 0)

  const overallEngagementRate =
    totalViews > 0
      ? Number(
          (
            ((totalLikes + totalComments + totalShares + totalSaves) / totalViews) *
            100
          ).toFixed(2)
        )
      : 0

  const activeMetrics = selectedPlatform
    ? {
        views: selectedPlatform.views,
        reach: selectedPlatform.reach,
        engagementRate: selectedPlatform.engagement_rate,
        likes: selectedPlatform.likes,
        comments: selectedPlatform.comments,
        shares: selectedPlatform.shares,
        saves: selectedPlatform.saves,
        clicks: selectedPlatform.clicks,
      }
    : publishedPlatforms.length > 0
      ? {
          views: totalViews,
          reach: totalReach,
          engagementRate: overallEngagementRate,
          likes: totalLikes,
          comments: totalComments,
          shares: totalShares,
          saves: totalSaves,
          clicks: totalClicks,
        }
      : null

  const handleEditPost = () => {
    const routeType = contentType === "photo" ? "image" : contentType
    router.push(`/dashboard/posts/${routeType}/${postId}/edit`)
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-3.5 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-7 animate-in fade-in duration-200">
      {/* Top Navigation & Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-2 sm:mb-3"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to calendar</span>
          </button>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-950">
            Post Analytics
          </h1>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => void refresh()}
          disabled={isRefreshing || isLoading}
          className="size-9 rounded-xl border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50 cursor-pointer shadow-2xs shrink-0"
          title="Force refresh live analytics from social platforms"
          aria-label="Refresh metrics"
        >
          <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin text-slate-900" : "text-slate-500"}`} />
        </Button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && !data && (
        <div className="space-y-6">
          <Skeleton className="h-20 sm:h-24 rounded-2xl w-full" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 sm:h-28 rounded-2xl w-full" />
            ))}
          </div>
          <div className="space-y-3 pt-2">
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-20 rounded-2xl w-full" />
            <Skeleton className="h-20 rounded-2xl w-full" />
          </div>
        </div>
      )}

      {/* Network / Fetch Error State */}
      {error && !isLoading && (
        <div className="rounded-2xl border border-red-200 bg-red-50/40 p-6 sm:p-8 flex flex-col items-center text-center space-y-3">
          <div className="size-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
            <AlertCircle className="size-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Unable to load post analytics</h2>
          <p className="text-sm text-slate-500 max-w-md">{error}</p>
          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="rounded-xl cursor-pointer"
            >
              Go Back
            </Button>
            <Button
              size="sm"
              onClick={() => void reload()}
              className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Case 1: Post Failed on ALL Destinations (No live metrics available) */}
      {data && isAllFailed && (
        <div className="space-y-6">
          <PostHeroSummary
            caption={caption}
            contentType={contentType}
            mediaUrl={mediaUrl}
            publishedAt={publishedAt}
            platforms={allPlatforms}
          />

          <div className="rounded-2xl border border-red-200/90 bg-white p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0 text-red-600">
                <XCircle className="size-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-slate-900">
                  Publishing Failed on All Destinations
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
                  This post could not be published to your target social channels, so engagement
                  analytics are not available. You can review the destinations below, edit the
                  post, and try publishing again.
                </p>
              </div>
            </div>

            {/* Failed destinations list */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 divide-y divide-slate-100 mt-2">
              {failedPlatforms.map((plat) => {
                const meta = getPlatformMeta(plat.platform)
                return (
                  <div
                    key={plat.platform}
                    className="p-3.5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={meta.icon} alt={meta.label} className="size-4 object-contain" />
                      <span className="font-semibold text-slate-800">{meta.label}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 font-semibold text-red-600 bg-red-50 border border-red-200/50 px-2 py-0.5 rounded-md text-[11px]">
                      Failed to publish
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Button
                onClick={handleEditPost}
                className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-semibold text-xs px-4 h-9 cursor-pointer"
              >
                <Edit2 className="size-3.5 mr-1.5" />
                Edit & Reschedule Post
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="rounded-xl text-xs h-9 cursor-pointer"
              >
                Back to Calendar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Case 2: Post is Live on at least 1 destination */}
      {data && publishedPlatforms.length > 0 && activeMetrics && (
        <div className="space-y-6 sm:space-y-7">
          {/* Post Content Anchor Hero */}
          <PostHeroSummary
            caption={caption}
            contentType={contentType}
            mediaUrl={mediaUrl}
            publishedAt={publishedAt}
            platforms={allPlatforms}
          />

          {/* Key Metrics Section with Tabbed Destination Switcher */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-0">
              {/* Destination Filter Tabs: ONLY Published Platforms appear here */}
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x -mb-px">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
                    activeTab === "all"
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  All Live Destinations ({publishedPlatforms.length})
                </button>

                {publishedPlatforms.map((plat) => {
                  const meta = getPlatformMeta(plat.platform)
                  const isSelected = activeTab === plat.platform

                  return (
                    <button
                      key={plat.platform}
                      type="button"
                      onClick={() => setActiveTab(plat.platform)}
                      className={`px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        isSelected
                          ? "border-slate-900 text-slate-900"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={meta.icon} alt={meta.label} className="size-3.5 object-contain" />
                      <span>{meta.label}</span>
                    </button>
                  )
                })}
              </div>

              <span className="text-xs text-slate-400 pb-2 sm:pb-0 hidden sm:inline shrink-0">
                {platformLabel ? `${platformLabel} live metrics` : "Live consolidated metrics"}
              </span>
            </div>

            {/* Unified Connected Metric Scoreboard */}
            <MetricScoreboard metrics={activeMetrics} platformLabel={platformLabel} />
          </section>

          {/* Cross-Platform Audience Distribution */}
          <AudienceShareBar
            platforms={publishedPlatforms}
            activePlatform={activeTab}
            onSelectPlatform={(platform) => setActiveTab(platform)}
          />

          {/* Destination Breakdown Section (Only published destinations in active metrics table) */}
          <section className="space-y-3">
            <div>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
                Live Destination Breakdown
              </h2>
            </div>

            <PlatformBreakdownList
              platforms={publishedPlatforms}
              activePlatform={activeTab}
              onSelectPlatform={(platform) => setActiveTab(platform)}
            />
          </section>
        </div>
      )}
    </main>
  )
}
