"use client"

import * as React from "react"
import Link from "next/link"
import { Info } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { PLATFORM_OPTIONS } from "@/features/onboarding/components/steps/shared"

const POST_TYPES = [
  {
    id: "text",
    title: "Text Post",
    icon: (
      <svg
        viewBox="0 0 64 64"
        className="w-16 h-16 text-slate-400 dark:text-slate-500 group-hover:text-accent-dark dark:group-hover:text-accent-brand transition-colors duration-300"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 44 L22 20 L32 44 M16 37 L28 37" />
        <path d="M42 22 h12 M42 32 h12 M42 42 h12" />
      </svg>
    ),
    platforms: ["facebook", "x", "linkedin"],
  },
  {
    id: "image",
    title: "Image Post",
    icon: (
      <svg
        viewBox="0 0 64 64"
        className="w-16 h-16 text-slate-400 dark:text-slate-500 group-hover:text-accent-dark dark:group-hover:text-accent-brand transition-colors duration-300"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="10" y="10" width="44" height="44" rx="8" />
        <circle cx="23" cy="23" r="4" />
        <path d="M10 42 l14 -14 l14 14" />
        <path d="M30 36 l8 -8 l16 16" />
      </svg>
    ),
    platforms: ["facebook", "x", "linkedin", "instagram", "tiktok"],
  },
  {
    id: "video",
    title: "Video Post",
    icon: (
      <svg
        viewBox="0 0 64 64"
        className="w-16 h-16 text-slate-400 dark:text-slate-500 group-hover:text-accent-dark dark:group-hover:text-accent-brand transition-colors duration-300"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="8" y="16" width="32" height="32" rx="6" />
        <path d="M40 26 l14 -9 v30 l-14 -9 z" />
      </svg>
    ),
    platforms: ["facebook", "x", "linkedin", "instagram", "tiktok", "youtube"],
  },
]

export function CreatePost() {
  const router = useRouter()

  const handleSelectType = (id: string, title: string) => {
    if (id === "video") {
      router.push("/dashboard/posts/video")
    } else {
      toast.info(`${title} editor coming soon!`, {
        description: "We are currently setting up the sub-pages for post drafting.",
        duration: 4000,
      })
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8 min-w-0 overflow-x-hidden space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-1 mt-6 sm:mt-10">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
          Create a new post
        </h1>
      </div>

      {/* Post Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        {POST_TYPES.map((card) => {
          // Get platforms supported by this card
          const supportedPlatforms = PLATFORM_OPTIONS.filter((p) =>
            card.platforms.includes(p.id)
          )

          return (
            <button
              key={card.id}
              onClick={() => handleSelectType(card.id, card.title)}
              className="group relative flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-10 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-solid hover:border-accent-brand/60 dark:hover:border-accent-brand/40 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-accent-brand focus:ring-offset-2 focus:ring-offset-background"
            >
              {/* Icon Container with subtle animation */}
              <div className="transform-gpu transition-transform duration-300 group-hover:scale-110">
                {card.icon}
              </div>

              {/* Title */}
              <h3 className="mt-6 text-lg font-semibold text-slate-800 dark:text-slate-200">
                {card.title}
              </h3>

              {/* Social Platform Icons */}
              <div className="mt-8 flex items-center justify-center gap-2">
                {supportedPlatforms.map((platform) => (
                  <span
                    key={platform.id}
                    className="relative flex h-5 w-5 shrink-0 items-center justify-center opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                    title={platform.label}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={platform.icon}
                      alt={platform.label}
                      className="h-4.5 w-4.5 object-contain"
                    />
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>

      {/* Info Alert Link */}
      <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-500 pt-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
          <Info className="size-3.5 text-emerald-500" />
        </div>
        <span>
          You can connect more accounts{" "}
          <Link
            href="/dashboard/connections"
            className="underline decoration-emerald-500/40 hover:decoration-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-medium"
          >
            here
          </Link>
        </span>
      </div>
    </main>
  )
}

