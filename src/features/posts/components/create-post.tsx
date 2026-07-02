"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  Loader2,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { PLATFORM_OPTIONS } from "@/features/onboarding/components/steps/shared"
import type { OnboardingPlatform } from "@/features/onboarding/types"


export function CreatePost() {
  const router = useRouter()

  const [selectedPlatforms, setSelectedPlatforms] = React.useState<OnboardingPlatform[]>([])
  const [caption, setCaption] = React.useState("")
  const [isEnhancing, setIsEnhancing] = React.useState(false)
  const [selectedMedia, setSelectedMedia] = React.useState<{ name: string; url: string } | null>(null)
  
  const [scheduleDate, setScheduleDate] = React.useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const yyyy = tomorrow.getFullYear()
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0")
    const dd = String(tomorrow.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
  })
  const [scheduleTime, setScheduleTime] = React.useState("12:00")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Toggle platform selection
  const handlePlatformToggle = (platform: OnboardingPlatform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    )
  }

  // AI Enhance Caption
  const handleEnhanceCaption = () => {
    if (!caption.trim()) {
      toast.warning("Please type a caption draft first", {
        description: "AI needs some text to work its magic!",
        duration: 3000
      })
      return
    }

    setIsEnhancing(true)
    setTimeout(() => {
      const enhancedText = `💡 ${caption.trim()} 🚀\n\nWith Post Reach, you can plan, schedule, and automate your posts in one clean dashboard. Say goodbye to publishing stress! 📈✨\n\n#socialmedia #productivity #growth #marketingtips`
      setCaption(enhancedText)
      setIsEnhancing(false)
      toast.success("Caption polished by AI!", {
        description: "Optimized readability and added relevant tags.",
        duration: 3000
      })
    }, 1200)
  }

  // Submit flow
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedPlatforms.length === 0) {
      toast.error("No platforms selected", {
        description: "Choose at least one social media channel to post to.",
        duration: 3000
      })
      return
    }

    if (!caption.trim()) {
      toast.error("Caption is empty", {
        description: "Your post needs some content to publish.",
        duration: 3000
      })
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      try {
        const postsKey = "postreach-scheduled-posts"
        const existingPostsStr = localStorage.getItem(postsKey)
        const existingPosts = existingPostsStr ? JSON.parse(existingPostsStr) : []

        const newPost = {
          id: crypto.randomUUID(),
          content: caption,
          platforms: selectedPlatforms,
          scheduledAt: `${scheduleDate}T${scheduleTime}:00`,
          mediaUrl: selectedMedia?.url,
          mediaName: selectedMedia?.name || "Original Upload",
          type: "compose",
          createdAt: new Date().toISOString()
        }

        localStorage.setItem(postsKey, JSON.stringify([newPost, ...existingPosts]))

        toast.success("Post scheduled successfully!", {
          description: `Scheduled to publish at ${scheduleDate} ${scheduleTime}.`,
          duration: 4000
        })

        // Redirect back to dashboard
        router.push("/dashboard")
      } catch {
        toast.error("Failed to schedule post")
      } finally {
        setIsSubmitting(false)
      }
    }, 1200)
  }

  // Character lengths
  const isXPlatform = selectedPlatforms.includes("x")
  const isOverXLimit = isXPlatform && caption.length > 280

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Navigation & Header */}
      <div className="space-y-2 border-b border-black/5 pb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="size-3.5" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Create Post
        </h1>
        <p className="text-sm text-slate-500">
          Compose and schedule content across all your social channels.
        </p>
      </div>

      {/* Composer Form */}
      <form onSubmit={handlePublish} className="mt-8 space-y-6 rounded-3xl border border-black/8 bg-white/70 p-6 shadow-sm backdrop-blur-md sm:p-8">
        
        {/* 1. Target Channels */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-accent-dark">
            1. Select Channels
          </label>
          <div className="flex flex-wrap gap-2">
            {PLATFORM_OPTIONS.map((option) => {
              const isSelected = selectedPlatforms.includes(option.id)
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handlePlatformToggle(option.id)}
                  className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? `border-slate-950 bg-slate-950 text-white shadow-sm scale-105`
                      : "border-black/8 bg-white hover:border-black/20 text-slate-700"
                  }`}
                >
                  <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={option.icon} alt="" className="h-4 w-4" />
                  </span>
                  <span>{option.label}</span>
                  {isSelected && <Check className="ml-0.5 size-3 text-white" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* 2. Caption */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-accent-dark">
              2. Caption Content
            </label>
            <span className={`text-xs font-semibold ${isOverXLimit ? "text-rose-500 font-bold" : "text-slate-500"}`}>
              {caption.length} {isXPlatform && "/ 280"} chars
            </span>
          </div>
          <div className="relative rounded-2xl border border-black/8 bg-white focus-within:border-black/20 focus-within:ring-1 focus-within:ring-black/10 transition">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What would you like to share? Connect, inspire, and grow..."
              rows={6}
              className="w-full resize-none bg-transparent p-4 text-sm text-slate-800 focus:outline-none"
            />
            <div className="flex justify-end p-2 border-t border-black/5 bg-slate-50/50 rounded-b-2xl">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleEnhanceCaption}
                disabled={isEnhancing || !caption.trim()}
                className="h-8 gap-1.5 px-3 text-xs font-bold text-accent-dark hover:bg-orange-50 cursor-pointer disabled:opacity-50"
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    Polishing...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3 text-accent-brand animate-pulse" />
                    AI Enhance ✨
                  </>
                )}
              </Button>
            </div>
          </div>
          {isOverXLimit && (
            <p className="text-xs text-rose-500 font-medium">
              ⚠️ Caption length exceeds the character limit for X (Twitter).
            </p>
          )}
        </div>

        {/* 3. Media Assets */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-accent-dark">
            3. Media Assets (Optional)
          </label>
          {selectedMedia ? (
            <div className="relative group overflow-hidden rounded-2xl border border-black/10 bg-slate-900 aspect-video flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedMedia.url}
                alt="Post media"
                className="absolute inset-0 h-full w-full object-cover opacity-85 transition group-hover:scale-105 duration-300"
              />
              <button
                type="button"
                onClick={() => setSelectedMedia(null)}
                className="absolute top-3 right-3 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-all cursor-pointer"
              >
                <X className="size-4" />
              </button>
              <div className="absolute bottom-3 left-3 bg-black/65 px-2.5 py-1 rounded-full text-white text-[10px] font-semibold backdrop-blur-xs">
                {selectedMedia.name}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/8 bg-slate-50/50 p-6 text-center hover:bg-slate-50 hover:border-black/15 transition-all">
              <UploadCloud className="size-8 text-slate-400" />
              <p className="mt-2 text-sm font-semibold text-slate-700">Drag and drop media files</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Supports PNG, JPG, MP4 files up to 50MB</p>
            </div>
          )}
        </div>

        {/* 4. Release Schedule */}
        {selectedPlatforms.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-black/5">
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-[0.18em] text-accent-dark">
                4. Release Schedule
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full rounded-xl border border-black/8 bg-white px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-black/20"
                  required
                />
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full rounded-xl border border-black/8 bg-white px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-black/20"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || isOverXLimit}
                className="w-full bg-linear-to-r from-accent-dark to-accent-brand text-white shadow-md hover:brightness-95 transition-all duration-300 font-semibold py-6 rounded-xl cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Scheduling Post...
                  </>
                ) : (
                  "Schedule Post"
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </main>
  )
}
