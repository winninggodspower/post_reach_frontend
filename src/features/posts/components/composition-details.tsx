"use client"

import * as React from "react"
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { ChevronDown, ChevronUp } from "lucide-react"
import { PLATFORM_OPTIONS } from "@/features/onboarding/components/steps/shared"
import type { VideoPostFormValues } from "./video/video-composer"
import type { AccountChannel } from "./target-accounts-selector"

type CompositionDetailsProps = {
  register: UseFormRegister<VideoPostFormValues>
  setValue: UseFormSetValue<VideoPostFormValues>
  watch: UseFormWatch<VideoPostFormValues>
  channels: AccountChannel[]
}

const getPlatformIcon = (platformId: string) => {
  const opt = PLATFORM_OPTIONS.find(p => p.id === platformId)
  return opt ? opt.icon : `/social-icons/${platformId}-circle.png`
}

const getPlatformFormKey = (platform: string): any => {
  switch (platform) {
    case "youtube": return "youtubeCaption"
    case "tiktok": return "tiktokCaption"
    case "instagram": return "instagramCaption"
    case "facebook": return "facebookCaption"
    case "linkedin": return "linkedinCaption"
    case "x": return "xCaption"
    default: return "caption"
  }
}

export function CompositionDetails({
  register,
  setValue,
  watch,
  channels,
}: CompositionDetailsProps) {
  const customizePerPlatform = watch("customizePerPlatform")
  const caption = watch("caption") || ""
  const globalTitle = (watch("title") as string) || ""

  // Track prev global title so we can detect manual override edits
  const prevGlobalTitleRef = React.useRef(globalTitle)

  // Live-sync globalTitle → youtubeTitle override when customization is on,
  // but stop syncing once the user has manually changed the override.
  React.useEffect(() => {
    if (customizePerPlatform && isYoutubeSelected) {
      const currentOverride = (watch("youtubeTitle") as string) || ""
      // Sync only if the override is still tracking the previous global title
      if (!currentOverride.trim() || currentOverride === prevGlobalTitleRef.current) {
        setValue("youtubeTitle", globalTitle)
      }
    }
    prevGlobalTitleRef.current = globalTitle
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalTitle, customizePerPlatform])
  
  // Find which selected platforms are checked
  const selectedChannels = channels.filter(c => c.selected)
  const isYoutubeSelected = selectedChannels.some(c => c.platform === "youtube")
  
  // State for which channel panel is expanded
  const [openChannelId, setOpenChannelId] = React.useState<string | null>(null)

  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 font-sans">
          Post Details
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Draft the primary content and customize settings per platform
        </p>
      </div>

      {/* YouTube Title (Only visible if YouTube is selected) */}
      {isYoutubeSelected && (
        <div className="space-y-1.5 transition-all duration-300">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            YouTube Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="YouTube Shorts title..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-sm focus:outline-hidden focus:ring-1 focus:ring-accent-brand focus:border-accent-brand text-slate-800 dark:text-slate-100"
            {...register("title")}
          />
        </div>
      )}

      {/* Video Main Caption */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Main Caption
          </label>
          <span className={`text-[10px] font-semibold ${caption.length > 2900 ? "text-red-500" : "text-slate-400"}`}>
            {caption.length} / 3000
          </span>
        </div>
        <div className="relative">
          <textarea
            placeholder="Tell your audience about your video. Use #hashtags or @mentions..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-sm focus:outline-hidden focus:ring-1 focus:ring-accent-brand focus:border-accent-brand resize-y scrollbar-thin text-slate-800 dark:text-slate-100"
            {...register("caption", {
              maxLength: 3000
            })}
          />
        </div>
      </div>

      {/* Quick buttons bar */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => setValue("caption", caption + " #foryou #fyp #trending")}
          className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-slate-50 dark:bg-slate-855 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer transition"
        >
          # Add Tags
        </button>
        <button
          type="button"
          onClick={() => setValue("caption", caption + " @postreach")}
          className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-slate-50 dark:bg-slate-855 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer transition"
        >
          @ Mention Brand
        </button>
      </div>

      {/* Customize per Platform Switch */}
      {selectedChannels.length > 0 && (
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 transition-all duration-300">
          <div className="space-y-0.5 pr-4 text-left">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Customize caption per platform
            </h4>
            <p className="text-[10px] text-slate-400 leading-normal">
              Customize the caption specifically for each channel.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const nextVal = !customizePerPlatform
              setValue("customizePerPlatform", nextVal)
              if (nextVal) {
                // Sync captions
                selectedChannels.forEach((channel) => {
                  const key = getPlatformFormKey(channel.platform)
                  const currentOverride = (watch(key) as string) || ""
                  if (!currentOverride.trim()) {
                    setValue(key, caption)
                  }
                })
                // Sync YouTube title override from the global title
                const currentYtTitle = (watch("youtubeTitle") as string) || ""
                if (!currentYtTitle.trim()) {
                  setValue("youtubeTitle", watch("title") as string)
                }
              }
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-accent-brand focus:ring-offset-2 dark:focus:ring-offset-slate-950 ${
              customizePerPlatform ? "bg-accent-brand" : "bg-slate-200 dark:bg-slate-800"
            }`}
            role="switch"
            aria-checked={customizePerPlatform}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                customizePerPlatform ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      )}

      {/* Platform-Specific Collapsible Panels */}
      {customizePerPlatform && selectedChannels.length > 0 && (
        <div className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
            Platform Customizations
          </h4>
          
          <div className="space-y-3">
            {selectedChannels.map((channel) => {
              const isExpanded = openChannelId === channel.id
              const formKey = getPlatformFormKey(channel.platform)
              const overrideVal = (watch(formKey) as string) || ""
              const hasOverride = overrideVal.trim().length > 0
              
              return (
                <div 
                  key={channel.id} 
                  className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white/40 dark:bg-slate-900/40 shadow-xs transition-all duration-300"
                >
                  {/* Collapsible Header */}
                  <button
                    type="button"
                    onClick={() => setOpenChannelId(isExpanded ? null : channel.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50/50 dark:hover:bg-slate-855/30 text-left transition select-none cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={channel.avatar} 
                          alt={channel.name} 
                          className="size-9 rounded-full object-cover border border-slate-200 dark:border-slate-800" 
                        />
                        <span className="absolute -bottom-1 -right-1 size-4 bg-white dark:bg-slate-950 rounded-full flex items-center justify-center p-0.5 shadow-xs border border-slate-200 dark:border-slate-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={getPlatformIcon(channel.platform)} 
                            alt={channel.platform} 
                            className="size-full object-contain" 
                          />
                        </span>
                      </div>
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{channel.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{channel.handle}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                          {hasOverride 
                            ? "Custom caption applied" 
                            : "Inheriting main caption"}
                        </p>
                      </div>
                    </div>

                    <span className="text-slate-400 pr-1 shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="size-4" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                    </span>
                  </button>

                  {/* Collapsible Content */}
                  <div 
                    className={`grid transition-all duration-300 ${
                      isExpanded 
                        ? "grid-rows-[1fr] border-t border-slate-100 dark:border-slate-800" 
                        : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-4 space-y-4">
                        {/* YouTube-specific title + description overrides */}
                        {channel.platform === "youtube" && (
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                              Override Title
                            </label>
                            <input
                              type="text"
                              placeholder="Override the global YouTube title for this post..."
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-sm focus:outline-hidden focus:ring-1 focus:ring-accent-brand focus:border-accent-brand text-slate-800 dark:text-slate-100"
                              {...register("youtubeTitle")}
                            />
                          </div>
                        )}

                        {/* Caption / Description override */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                              {channel.platform === "youtube" ? "Override Description" : "Platform-Specific Caption"}
                            </label>
                            <span className={`text-[10px] font-semibold ${overrideVal.length > 2900 ? "text-red-500" : "text-slate-400"}`}>
                              {overrideVal.length} / 3000
                            </span>
                          </div>
                          <textarea
                            placeholder={channel.platform === "youtube" ? "Override the YouTube description for this post..." : "Leave blank to inherit main caption..."}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-sm focus:outline-hidden focus:ring-1 focus:ring-accent-brand focus:border-accent-brand resize-y scrollbar-thin text-slate-800 dark:text-slate-100"
                            {...register(formKey, {
                              maxLength: 3000
                            })}
                          />
                        </div>

                        {/* Actions Inside Panel */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                          <button
                            type="button"
                            onClick={() => setValue(formKey, overrideVal + " #foryou #fyp #trending")}
                            className="px-2.5 py-1.5 text-[10px] font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 cursor-pointer transition"
                          >
                            # Add Tags
                          </button>
                          <button
                            type="button"
                            onClick={() => setValue(formKey, overrideVal + " @postreach")}
                            className="px-2.5 py-1.5 text-[10px] font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 cursor-pointer transition"
                          >
                            @ Mention Brand
                          </button>
                          {caption && (
                            <button
                              type="button"
                              onClick={() => setValue(formKey, caption)}
                              className="px-2.5 py-1.5 text-[10px] font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400 cursor-pointer transition sm:ml-auto"
                            >
                              Copy Main Caption
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
