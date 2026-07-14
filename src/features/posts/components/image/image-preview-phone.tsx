"use client"

import * as React from "react"
import { Eye, Heart, MessageCircle, Share2, Plus, Image as LucideImage } from "lucide-react"
import type { AccountChannel } from "../target-accounts-selector"
import { PhoneMockupWrapper } from "../phone-mockup-wrapper"

type ImagePreviewPhoneProps = {
  imageSrcs: string[]
  previewPlatform: "instagram" | "facebook" | "linkedin" | "x" | "tiktok"
  onChangePreviewPlatform: (platform: "instagram" | "facebook" | "linkedin" | "x" | "tiktok") => void
  activeChannel: AccountChannel | undefined
  caption: string
  channels: AccountChannel[]
}

export function ImagePreviewPhone({
  imageSrcs = [],
  previewPlatform,
  onChangePreviewPlatform,
  activeChannel,
  caption,
  channels,
}: ImagePreviewPhoneProps) {
  const [activeImageIndex, setActiveImageIndex] = React.useState(0)

  // Reset slide index when source changes
  React.useEffect(() => {
    setActiveImageIndex(0)
  }, [imageSrcs])

  const selectedPlatforms = channels.filter(c => c.selected).map(c => c.platform === "twitter" ? "x" : c.platform)

  const previewTabs = [
    { id: "instagram", label: "Instagram" },
    { id: "facebook", label: "Facebook" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "x", label: "X" },
    { id: "tiktok", label: "TikTok" }
  ].filter(tab => selectedPlatforms.includes(tab.id))

  const tabsToRender = previewTabs.length > 0 ? previewTabs : []


  React.useEffect(() => {
    if (tabsToRender.length > 0 && !tabsToRender.some(t => t.id === previewPlatform)) {
      onChangePreviewPlatform(tabsToRender[0].id as any)
    }
  }, [tabsToRender, previewPlatform, onChangePreviewPlatform])

  const renderFormattedPreviewCaption = (text: string) => {
    if (!text) return "Enter your caption here..."
    const words = text.split(" ")
    return words.map((word, i) => {
      if (word.startsWith("#") || word.startsWith("@")) {
        return (
          <span key={i} className="text-sky-400 font-medium hover:underline cursor-pointer">
            {word}{" "}
          </span>
        )
      }
      return word + " "
    })
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (activeImageIndex < imageSrcs.length - 1) {
      setActiveImageIndex(prev => prev + 1)
    }
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (activeImageIndex > 0) {
      setActiveImageIndex(prev => prev - 1)
    }
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
                onClick={() => onChangePreviewPlatform(tab.id as any)}
                className={`px-2 py-1 text-[10px] font-bold rounded-md transition select-none cursor-pointer ${previewPlatform === tab.id
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
      <PhoneMockupWrapper bgMediaSrc={imageSrcs[0] || undefined}>
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-805">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeChannel?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"}
                    alt="Avatar"
                    className="size-7 rounded-full object-cover border border-slate-100 dark:border-slate-800"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-bold leading-none">
                      {activeChannel?.handle || "@channel"}
                    </span>
                    <span className="text-[8px] text-slate-400 mt-0.5 leading-none">Sponsored</span>
                  </div>
                </div>
                <span className="text-slate-400 text-xs font-bold px-1">•••</span>
              </div>

              {/* Media Display */}
              <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden">
                {imageSrcs.length > 0 ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageSrcs[activeImageIndex]}
                      alt={`Slide ${activeImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Carousel Navigation Arrows */}
                    {imageSrcs.length > 1 && (
                      <>
                        {activeImageIndex > 0 && (
                          <button
                            type="button"
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 size-5 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-[10px] font-bold cursor-pointer"
                          >
                            ‹
                          </button>
                        )}
                        {activeImageIndex < imageSrcs.length - 1 && (
                          <button
                            type="button"
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 size-5 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-[10px] font-bold cursor-pointer"
                          >
                            ›
                          </button>
                        )}
                      </>
                    )}

                    {/* Dots Indicator */}
                    {imageSrcs.length > 1 && (
                      <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1">
                        {imageSrcs.map((_, i) => (
                          <span
                            key={i}
                            className={`size-1.5 rounded-full transition-all duration-200 ${i === activeImageIndex ? "bg-accent-brand scale-110 w-2" : "bg-white/60"
                              }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-slate-400 dark:text-slate-650 flex flex-col items-center gap-1.5">
                    <LucideImage className="size-8" />
                    <span className="text-[10px]">No images selected</span>
                  </div>
                )}
              </div>

              {/* Feed Controls */}
              <div className="px-3 py-2 flex items-center justify-between text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-3">
                  <span className="text-xs">❤️</span>
                  <span className="text-xs">💬</span>
                  <span className="text-xs">✈️</span>
                </div>
                {imageSrcs.length > 1 && (
                  <div className="flex gap-0.5">
                    {imageSrcs.map((_, i) => (
                      <span
                        key={i}
                        className={`size-1 rounded-full ${i === activeImageIndex ? "bg-sky-500" : "bg-slate-300 dark:bg-slate-700"}`}
                      />
                    ))}
                  </div>
                )}
                <span className="text-xs">🔖</span>
              </div>

              {/* Feed Details */}
              <div className="px-3 pb-3 space-y-1 text-left flex-1 overflow-y-auto">
                <p className="text-[10px] font-bold leading-none">9,425 likes</p>
                <p className="text-[10px] leading-snug break-words">
                  <span className="font-bold mr-1.5">{activeChannel?.handle || "@channel"}</span>
                  {renderFormattedPreviewCaption(caption)}
                </p>
              </div>
      </PhoneMockupWrapper>

      <p className="text-[10px] text-center text-slate-500 mt-4 leading-normal">
        Previews mock the final layout feed view on mobile screens.
      </p>
    </div>
  )
}
