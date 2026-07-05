"use client"

import * as React from "react"
import { Eye, Heart, MessageCircle, Bookmark, Share2, Music, Plus } from "lucide-react"
import type { AccountChannel } from "./target-accounts-selector"

type LivePreviewPhoneProps = {
  videoSrc: string
  isPlaying: boolean
  previewPlatform: "tiktok" | "youtube" | "instagram"
  onChangePreviewPlatform: (platform: "tiktok" | "youtube" | "instagram") => void
  previewVideoRef: React.RefObject<HTMLVideoElement | null>
  activeChannel: AccountChannel | undefined
  onTogglePlay: () => void
  title: string
  caption: string
  liked: boolean
  onToggleLike: () => void
  bookmarked: boolean
  onToggleBookmark: () => void
}

export function LivePreviewPhone({
  videoSrc,
  isPlaying,
  previewPlatform,
  onChangePreviewPlatform,
  previewVideoRef,
  activeChannel,
  onTogglePlay,
  title,
  caption,
  liked,
  onToggleLike,
  bookmarked,
  onToggleBookmark,
}: LivePreviewPhoneProps) {
  
  const renderFormattedPreviewCaption = (text: string) => {
    if (!text) return "Enter your main caption here..."
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

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-[1.75rem] p-6 shadow-xs relative text-slate-800 dark:text-slate-200 animate-fade-in">
      {/* Top tabs */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-sans flex items-center gap-1.5">
          <Eye className="size-4 text-accent-brand" />
          Live Preview
        </h3>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-850">
          {[
            { id: "tiktok", label: "TikTok" },
            { id: "youtube", label: "Shorts" },
            { id: "instagram", label: "Reels" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChangePreviewPlatform(tab.id as any)}
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
      </div>

      {/* Smart Phone Wrapper */}
      <div className="flex justify-center py-2">
        <div className="w-[280px] h-[520px] rounded-[3rem] border-12 border-slate-950 bg-black shadow-2xl relative overflow-hidden flex flex-col justify-between">
          {/* Speaker notch */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-950 rounded-full z-30 flex items-center justify-center">
            <div className="size-1 rounded-full bg-slate-800 absolute right-4" />
          </div>

          {/* Main Screen Content */}
          <div className="absolute inset-0 bg-slate-950 flex flex-col justify-between z-10 select-none">
            {/* Backdrop Video Player */}
            {/* eslint-disable-next-line @next/next/no-html-video-element */}
            <video
              ref={previewVideoRef}
              src={videoSrc}
              loop
              muted
              onClick={onTogglePlay}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-black/25 via-transparent to-black/60 pointer-events-none" />

            {/* Header overlays */}
            <div className="w-full pt-8 px-4 flex items-center justify-between text-[11px] font-bold text-white z-20">
              {previewPlatform === "tiktok" && (
                <div className="w-full flex justify-center gap-4 text-white/60">
                  <span className="hover:text-white cursor-pointer">Following</span>
                  <span className="text-white border-b-2 border-white pb-0.5">For You</span>
                </div>
              )}
              {previewPlatform === "youtube" && (
                <div className="w-full flex justify-between items-center text-white/80">
                  <span className="font-extrabold uppercase tracking-wide">Shorts</span>
                  <div className="flex gap-3">
                    <span>🔍</span>
                    <span>⋮</span>
                  </div>
                </div>
              )}
              {previewPlatform === "instagram" && (
                <div className="w-full flex justify-between items-center text-white font-extrabold text-sm">
                  <span>Reels</span>
                  <span>📷</span>
                </div>
              )}
            </div>

            {/* Content Overlay Info Box */}
            <div className="mt-auto p-3 flex justify-between items-end gap-3 z-20 w-full">
              <div className="flex-1 space-y-1.5 max-w-[190px] drop-shadow-md text-white text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold truncate">
                    {activeChannel?.handle || "@jack_ingy"}
                  </span>
                  {previewPlatform === "youtube" && (
                    <span className="bg-red-600 text-[8px] px-1 rounded-sm uppercase tracking-wide font-extrabold">
                      Subscribe
                    </span>
                  )}
                </div>

                {previewPlatform === "youtube" && title && (
                  <p className="text-[11px] font-bold leading-snug line-clamp-1">
                    {title}
                  </p>
                )}

                <p className="text-[10px] leading-snug text-white/90 font-normal break-words line-clamp-3">
                  {renderFormattedPreviewCaption(caption)}
                </p>

                <div className="flex items-center gap-1 text-[9px] text-white/80">
                  <Music className="size-2.5 animate-pulse" />
                  <span className="truncate font-semibold max-w-[130px]">
                    {title ? `sound - ${title}` : `original sound - ${activeChannel?.name || "jack"}`}
                  </span>
                </div>
              </div>

              {/* Social Action List */}
              <div className="flex flex-col items-center gap-3 drop-shadow-md text-white z-20">
                {previewPlatform !== "youtube" && (
                  <div className="relative mb-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        activeChannel?.avatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                      }
                      alt="Avatar preview"
                      className="size-8.5 rounded-full border border-white object-cover"
                    />
                    {previewPlatform === "tiktok" && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 rounded-full size-3 flex items-center justify-center text-white border border-slate-950">
                        <Plus className="size-2" />
                      </span>
                    )}
                  </div>
                )}

                <button
                  onClick={onToggleLike}
                  className="flex flex-col items-center cursor-pointer focus:outline-hidden select-none"
                >
                  <Heart
                    className={`size-6 transition-all duration-300 active:scale-130 ${
                      liked ? "fill-red-500 stroke-red-500" : "fill-white/10 text-white"
                    }`}
                  />
                  <span className="text-[9px] font-bold mt-0.5">{liked ? "4.1k" : "4.0k"}</span>
                </button>

                <div className="flex flex-col items-center">
                  <MessageCircle className="size-6 text-white fill-white/10" />
                  <span className="text-[9px] font-bold mt-0.5">188</span>
                </div>

                {previewPlatform === "tiktok" && (
                  <button
                    onClick={onToggleBookmark}
                    className="flex flex-col items-center cursor-pointer focus:outline-hidden"
                  >
                    <Bookmark
                      className={`size-6 transition-all duration-300 active:scale-130 ${
                        bookmarked ? "fill-yellow-400 stroke-yellow-400" : "fill-white/10 text-white"
                      }`}
                    />
                    <span className="text-[9px] font-bold mt-0.5">{bookmarked ? "25" : "24"}</span>
                  </button>
                )}

                <div className="flex flex-col items-center">
                  <Share2 className="size-6 text-white fill-white/10" />
                  <span className="text-[9px] font-bold mt-0.5">62</span>
                </div>

                {previewPlatform !== "youtube" && (
                  <div
                    className={`size-7.5 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center p-1 mt-1 ${
                      isPlaying ? "animate-spin" : ""
                    }`}
                    style={{ animationDuration: "5s" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        activeChannel?.avatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                      }
                      alt="Record sound"
                      className="size-full rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-center text-slate-500 mt-4 leading-normal">
        Previews mock the final layout view template on mobile screens. Interactive items support click
        highlights.
      </p>
    </div>
  )
}
