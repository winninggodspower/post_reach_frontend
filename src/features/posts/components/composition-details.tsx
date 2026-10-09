"use client"

import * as React from "react"
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react"
import { PLATFORM_OPTIONS } from "@/features/onboarding/components/steps/shared"
import type { ComposerFormValues } from "../types/composer"
import type { AccountChannel } from "./target-accounts-selector"
import { TiktokAdvancedSettings } from "./tiktok-advanced-settings"
import { getPlatformCaptionLimit } from "../lib/caption-validation"

type CompositionDetailsProps = {
  register: UseFormRegister<ComposerFormValues>
  setValue: UseFormSetValue<ComposerFormValues>
  watch: UseFormWatch<ComposerFormValues>
  channels: AccountChannel[]
  postType?: "video" | "photo" | "text"
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
    case "twitter":
    case "x": return "xCaption"
    case "threads": return "threadsCaption"
    default: return "caption"
  }
}

export function CompositionDetails({
  register,
  setValue,
  watch,
  channels,
  postType = "video",
}: CompositionDetailsProps) {
  const caption = watch("caption") || ""
  const globalTitle = (watch("title") as string) || ""

  // Find which selected platforms are checked
  const selectedChannels = channels.filter(c => c.selected)
  const isYoutubeSelected = selectedChannels.some(c => c.platform === "youtube")

  // Track prev global title so we can detect manual override edits
  const prevGlobalTitleRef = React.useRef(globalTitle)

  // Live-sync globalTitle → youtubeTitle override,
  // but stop syncing once the user has manually changed the override.
  React.useEffect(() => {
    if (isYoutubeSelected) {
      const currentOverride = (watch("youtubeTitle") as string) || ""
      // Sync only if the override is still tracking the previous global title
      if (!currentOverride.trim() || currentOverride === prevGlobalTitleRef.current) {
        setValue("youtubeTitle", globalTitle)
      }
    }
    prevGlobalTitleRef.current = globalTitle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalTitle, isYoutubeSelected])

  // Track prev caption so we can detect manual override edits per platform
  const prevCaptionRef = React.useRef(caption)

  // Live-sync caption → platform caption overrides,
  // but stop syncing once the user has manually changed that specific platform's override.
  React.useEffect(() => {
    selectedChannels.forEach((channel) => {
      const formKey = getPlatformFormKey(channel.platform)
      if (formKey === "caption") return
      const currentOverride = (watch(formKey) as string) || ""
      // Sync only if the override is empty or is still tracking the previous caption
      if (!currentOverride.trim() || currentOverride === prevCaptionRef.current) {
        setValue(formKey, caption)
      }
    })
    prevCaptionRef.current = caption
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caption, selectedChannels])

  // State for which channel panel is expanded
  const [openChannelId, setOpenChannelId] = React.useState<string | null>(null)

  // Identify selected channels where main caption will apply and exceeds limits
  const channelsInheritingMainCaption = selectedChannels.filter((c) => {
    const formKey = getPlatformFormKey(c.platform)
    if (formKey === "caption") return false
    const overrideText = (watch(formKey) as string) || ""
    return !overrideText.trim() || overrideText === caption
  })

  const exceededInheritedChannels = channelsInheritingMainCaption.filter((c) => {
    const limit = getPlatformCaptionLimit(c.platform, c.is_premium)
    return caption.length > limit
  })

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

        {exceededInheritedChannels.length > 0 && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs mt-2 animate-fade-in">
            <AlertCircle className="size-4 shrink-0 mt-0.5 text-amber-500" />
            <div className="space-y-1 flex-1">
              <p className="font-semibold text-amber-800 dark:text-amber-200">
                Caption exceeds limit for {exceededInheritedChannels.map((c) => {
                  const platName = c.platform === "threads" ? "Threads" : (c.platform === "twitter" || c.platform === "x") ? "Twitter / X" : c.name || c.platform
                  const limit = getPlatformCaptionLimit(c.platform, c.is_premium)
                  return `${platName} (${limit.toLocaleString()} max)`
                }).join(", ")}
              </p>
              <p className="text-[11px] text-amber-700/90 dark:text-amber-300/90 leading-relaxed">
                Shorten your main caption or customize platform-specific captions in the section below before posting.
              </p>
            </div>
          </div>
        )}
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

      {/* Platform-Specific Collapsible Panels */}
      {selectedChannels.length > 0 && (
        <div className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
              Platform Customizations
            </h4>
            <span className="text-[10px] text-slate-400">
              Optional overrides per channel
            </span>
          </div>

          <div className="space-y-3">
            {selectedChannels.map((channel) => {
              const isExpanded = openChannelId === channel.id
              const formKey = getPlatformFormKey(channel.platform)
              const overrideVal = (watch(formKey) as string) || ""
              const hasOverride = overrideVal.trim().length > 0 && overrideVal !== caption

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
                          {hasOverride ? (
                            <span className="text-accent-brand font-semibold">Custom caption applied</span>
                          ) : (
                            "Inheriting main caption"
                          )}
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
                    className={`grid transition-all duration-300 ${isExpanded
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
                        {(() => {
                          const isTwitter = channel.platform === "twitter" || channel.platform === "x"
                          const isThreads = channel.platform === "threads"
                          const maxChar = getPlatformCaptionLimit(channel.platform, channel.is_premium)
                          const isOverLimit = overrideVal.length > maxChar
                          const isNearLimit = overrideVal.length > maxChar - (maxChar <= 500 ? 50 : 100)
                          return (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                                    {channel.platform === "youtube" ? "Override Description" : "Platform-Specific Caption"}
                                  </label>
                                  {isTwitter && channel.is_premium && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                      X Premium · 25K
                                    </span>
                                  )}
                                  {isTwitter && !channel.is_premium && (
                                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                      Standard · 280
                                    </span>
                                  )}
                                  {isThreads && (
                                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                      500 max
                                    </span>
                                  )}
                                </div>
                                <span
                                  className={`text-[10px] font-semibold ${
                                    isOverLimit
                                      ? "text-red-500 font-bold"
                                      : isNearLimit
                                      ? "text-amber-500"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {overrideVal.length.toLocaleString()} / {maxChar.toLocaleString()}
                                </span>
                              </div>
                              <textarea
                                placeholder={
                                  channel.platform === "youtube"
                                    ? "Override the YouTube description for this post..."
                                    : isThreads
                                    ? "Thread caption (max 500 chars, inheriting main caption)..."
                                    : isTwitter
                                    ? channel.is_premium
                                      ? "X Premium caption (max 25,000 chars, inheriting main caption)..."
                                      : "X caption (max 280 chars, inheriting main caption)..."
                                    : `Platform caption (max ${maxChar.toLocaleString()} chars, inheriting main caption)...`
                                }
                                rows={3}
                                className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 dark:bg-slate-950 text-sm focus:outline-hidden focus:ring-1 resize-y scrollbar-thin text-slate-800 dark:text-slate-100 transition-colors ${
                                  isOverLimit
                                    ? "border-red-400 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
                                    : "border-slate-200 dark:border-slate-800 focus:ring-accent-brand focus:border-accent-brand"
                                }`}
                                {...register(formKey, {
                                  maxLength: maxChar,
                                })}
                              />
                              {isOverLimit && (
                                <p className="text-[11px] font-medium text-red-500">
                                  Caption exceeds {channel.name || channel.platform} limit by {overrideVal.length - maxChar} characters.
                                </p>
                              )}
                            </div>
                          )
                        })()}

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
                          {hasOverride ? (
                            <button
                              type="button"
                              onClick={() => setValue(formKey, caption)}
                              className="px-2.5 py-1.5 text-[10px] font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 cursor-pointer transition"
                            >
                              Reset to Main Caption
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 italic py-1.5">
                              Edit above to customize for {channel.name}
                            </span>
                          )}
                        </div>

                        {/* TikTok Specific Settings */}
                        {channel.platform === "tiktok" && (
                          <TiktokAdvancedSettings
                            register={register}
                            watch={watch}
                            setValue={setValue}
                            postType={postType}
                          />
                        )}
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
