"use client"

import * as React from "react"
import { Eye, Heart, MessageCircle, Share2 } from "lucide-react"
import type { AccountChannel } from "../target-accounts-selector"
import { Iphone } from "@/components/ui/iphone"
import { PLAIN_AVATAR } from "@/features/onboarding/components/steps/shared"

type TextPreviewPhoneProps = {
  caption: string
  customizePerPlatform: boolean
  facebookCaption?: string
  linkedinCaption?: string
  xCaption?: string
  channels: AccountChannel[]
}

export function TextPreviewPhone({
  caption = "",
  customizePerPlatform = false,
  facebookCaption = "",
  linkedinCaption = "",
  xCaption = "",
  channels,
}: TextPreviewPhoneProps) {
  const [previewPlatform, setPreviewPlatform] = React.useState<"facebook" | "linkedin" | "x">("facebook")

  const selectedPlatforms = channels
    .filter((c) => c.selected)
    .map((c) => (c.platform === "twitter" ? "x" : c.platform))

  const previewTabs = [
    { id: "facebook", label: "Facebook" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "x", label: "X" },
  ].filter((tab) => selectedPlatforms.includes(tab.id))

  const tabsToRender = previewTabs.length > 0 ? previewTabs : []

  React.useEffect(() => {
    if (tabsToRender.length > 0 && !tabsToRender.some((t) => t.id === previewPlatform)) {
      setPreviewPlatform(tabsToRender[0].id as "facebook" | "linkedin" | "x")
    }
  }, [tabsToRender, previewPlatform])

  const activeChannel =
    channels.find((c) => c.selected && c.platform === previewPlatform) ||
    channels.find((c) => c.selected) ||
    channels[0]

  const activeCaption = customizePerPlatform
    ? (previewPlatform === "facebook"
        ? facebookCaption
        : previewPlatform === "linkedin"
        ? linkedinCaption
        : xCaption) || caption
    : caption

  const renderFormattedPreviewCaption = (text: string) => {
    if (!text) return "Enter your post text here..."
    const words = text.split(" ")
    return words.map((word, i) => {
      if (word.startsWith("#") || word.startsWith("@")) {
        return (
          <span key={i} className="text-sky-500 font-medium hover:underline cursor-pointer">
            {word}{" "}
          </span>
        )
      }
      return word + " "
    })
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-[1.75rem] p-6 shadow-xs relative text-slate-800 dark:text-slate-200 animate-fade-in">
      {/* Top tabs */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-3 gap-2">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-sans flex items-center gap-1.5 shrink-0 whitespace-nowrap">
          <Eye className="size-4 text-accent-brand" />
          Live Preview
        </h3>

        {tabsToRender.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-850 shrink-0">
            {tabsToRender.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPreviewPlatform(tab.id as "facebook" | "linkedin" | "x")}
                className={`px-2 py-1 text-[10px] font-bold rounded-md transition select-none cursor-pointer ${
                  previewPlatform === tab.id
                    ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-600 dark:text-slate-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Smart Phone Wrapper */}
      <div className="flex justify-center py-2">
        <div className="w-[300px] relative select-none bg-transparent dark">
          <Iphone className="w-full bg-transparent iphone-bezel-container" />

          {/* Main Screen Content Overlays */}
          <div
            className="absolute z-20 flex flex-col select-none overflow-hidden"
            style={{
              left: "4.9076%",
              top: "2.1825%",
              width: "89.9538%",
              height: "95.6349%",
              borderRadius: "14.3132% / 6.6094%",
              backgroundColor: "#ffffff",
            }}
          >
            {/* Feed Mock Layout */}
            <div className="flex flex-col h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-150 pt-8">
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-805">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeChannel?.avatar || PLAIN_AVATAR}
                    alt="Avatar"
                    className="size-7 rounded-full object-cover border border-slate-100 dark:border-slate-800"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-bold leading-none">
                      {activeChannel?.name || "Channel Name"}
                    </span>
                    <span className="text-[8px] text-slate-400 mt-0.5 leading-none">
                      {activeChannel?.handle || "@channel"}
                    </span>
                  </div>
                </div>
                <span className="text-slate-400 text-xs font-bold px-1">•••</span>
              </div>

              {/* Text Only Content Area (Mocking social post body) */}
              <div className="flex-1 px-3 py-4 text-left overflow-y-auto max-h-[300px] scrollbar-none">
                <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans leading-normal">
                  {renderFormattedPreviewCaption(activeCaption)}
                </p>
              </div>

              {/* Mock Engagement Bar */}
              <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-805 flex items-center justify-between text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Heart className="size-3.5" />
                  <span className="text-[9px] font-medium">Like</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="size-3.5" />
                  <span className="text-[9px] font-medium">Comment</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Share2 className="size-3.5" />
                  <span className="text-[9px] font-medium">Share</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
