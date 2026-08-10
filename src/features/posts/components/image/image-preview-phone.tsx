"use client"

import * as React from "react"
import { Eye, Image as LucideImage } from "lucide-react"

import type { AccountChannel } from "../target-accounts-selector"
import { PhoneMockupWrapper } from "../phone-mockup-wrapper"

// Import platform specific preview components
import { InstagramPostPreview } from "../previews/instagram-post-preview"
import { XPostPreview } from "../previews/x-post-preview"
import { FacebookPostPreview } from "../previews/facebook-post-preview"
import { LinkedInPostPreview } from "../previews/linkedin-post-preview"
import { TikTokPostPreview } from "../previews/tiktok-post-preview"

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

  // Reusable component to render post media inside layout templates
  const renderMedia = (aspectRatioClass: string = "aspect-square") => {
    return (
      <div className={`relative ${aspectRatioClass} w-full bg-slate-50 dark:bg-slate-900 border-t border-b border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0`}>
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
                    className="absolute left-2 top-1/2 -translate-y-1/2 size-5 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-[10px] font-bold cursor-pointer z-10"
                  >
                    ‹
                  </button>
                )}
                {activeImageIndex < imageSrcs.length - 1 && (
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 size-5 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-[10px] font-bold cursor-pointer z-10"
                  >
                    ›
                  </button>
                )}
              </>
            )}

            {/* Dots Indicator */}
            {imageSrcs.length > 1 && (
              <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1 z-10">
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
          <div className="text-slate-400 dark:text-slate-650 flex flex-col items-center gap-1.5 p-6">
            <LucideImage className="size-8 text-slate-350" />
            <span className="text-[10px]">No images selected</span>
          </div>
        )}
      </div>
    )
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
      <PhoneMockupWrapper>
        {previewPlatform === "instagram" && (
          <InstagramPostPreview
            avatar={activeChannel?.avatar}
            handle={activeChannel?.handle || "@channel"}
            caption={caption}
            media={renderMedia("aspect-square")}
          />
        )}

        {previewPlatform === "x" && (
          <XPostPreview
            avatar={activeChannel?.avatar}
            name={activeChannel?.name || "Channel"}
            handle={activeChannel?.handle || "@channel"}
            caption={caption}
            media={renderMedia("aspect-[16/10]")}
          />
        )}

        {previewPlatform === "facebook" && (
          <FacebookPostPreview
            avatar={activeChannel?.avatar}
            name={activeChannel?.name || "Channel"}
            caption={caption}
            media={renderMedia("aspect-[1.91/1]")}
          />
        )}

        {previewPlatform === "linkedin" && (
          <LinkedInPostPreview
            avatar={activeChannel?.avatar}
            name={activeChannel?.name || "Channel"}
            caption={caption}
            media={renderMedia("aspect-[1.91/1]")}
          />
        )}

        {previewPlatform === "tiktok" && (
          <TikTokPostPreview
            avatar={activeChannel?.avatar}
            handle={activeChannel?.handle || "@channel"}
            caption={caption}
            imageSrcs={imageSrcs}
            activeImageIndex={activeImageIndex}
            onNextImage={nextImage}
            onPrevImage={prevImage}
          />
        )}
      </PhoneMockupWrapper>

      <p className="text-[10px] text-center text-slate-500 mt-4 leading-normal">
        Previews mock the final layout feed view on mobile screens.
      </p>
    </div>
  )
}
