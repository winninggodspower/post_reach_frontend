"use client"

import * as React from "react"
import { Heart, MessageCircle, Bookmark, Share2, Image as LucideImage } from "lucide-react"

type TikTokPostPreviewProps = {
  avatar?: string
  handle: string
  caption: string
  imageSrcs: string[]
  activeImageIndex: number
  onNextImage: (e: React.MouseEvent) => void
  onPrevImage: (e: React.MouseEvent) => void
}

export function TikTokPostPreview({
  avatar,
  handle,
  caption,
  imageSrcs = [],
  activeImageIndex,
  onNextImage,
  onPrevImage,
}: TikTokPostPreviewProps) {
  return (
    <div className="flex flex-col h-full bg-black text-white text-[11px] leading-normal font-sans relative">
      {/* Full-screen video-style carousel display */}
      <div className="absolute inset-0 z-0 bg-black flex items-center justify-center overflow-hidden">
        {imageSrcs.length > 0 ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrcs[activeImageIndex]}
              alt=""
              className="w-full h-full object-cover opacity-80"
            />
            {imageSrcs.length > 1 && (
              <>
                {activeImageIndex > 0 && (
                  <button
                    type="button"
                    onClick={onPrevImage}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center text-[9px] font-bold z-10"
                  >
                    ‹
                  </button>
                )}
                {activeImageIndex < imageSrcs.length - 1 && (
                  <button
                    type="button"
                    onClick={onNextImage}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center text-[9px] font-bold z-10"
                  >
                    ›
                  </button>
                )}
              </>
            )}
          </>
        ) : (
          <div className="text-zinc-650 flex flex-col items-center gap-1.5 p-6">
            <LucideImage className="size-8 text-zinc-600" />
            <span className="text-[10px]">No media selected</span>
          </div>
        )}
      </div>

      {/* In-device header overlay */}
      <div className="absolute top-2 inset-x-0 z-10 flex items-center justify-center gap-4 text-xs font-semibold drop-shadow-xs">
        <span className="text-white/60">Following</span>
        <span className="text-white border-b-2 border-white pb-0.5">For You</span>
      </div>

      {/* Right side floating interactions overlay */}
      <div className="absolute right-2 bottom-20 z-10 flex flex-col items-center gap-3.5 select-none text-white drop-shadow-md">
        {/* Creator avatar */}
        <div className="relative mb-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar || "/placeholder-avatar.svg"}
            alt=""
            className="size-9 rounded-full object-cover border border-white"
          />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">
            +
          </span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
            <Heart className="size-[18px] fill-white text-white" />
          </div>
          <span className="text-[8.5px] mt-0.5 font-semibold">12.5K</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
            <MessageCircle className="size-[18px] fill-white text-white" />
          </div>
          <span className="text-[8.5px] mt-0.5 font-semibold">284</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
            <Bookmark className="size-[18px] fill-white text-white" />
          </div>
          <span className="text-[8.5px] mt-0.5 font-semibold">94</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
            <Share2 className="size-[18px] fill-white text-white" />
          </div>
          <span className="text-[8.5px] mt-0.5 font-semibold">52</span>
        </div>
      </div>

      {/* Bottom info overlays (caption & music track) */}
      <div className="absolute bottom-3 left-3 right-12 z-10 text-left space-y-1.5 drop-shadow-md">
        <p className="font-bold text-white text-[12px] leading-none">
          {handle}
        </p>
        
        <p className="text-[10px] text-zinc-100 line-clamp-3 leading-relaxed break-words whitespace-pre-wrap">
          {caption ? caption : <span className="text-zinc-400 italic">Enter caption text...</span>}
        </p>

        <div className="flex items-center gap-1.5 text-zinc-300 text-[9px] pt-1">
          <span className="animate-spin text-white">𝅘𝅥𝅮</span>
          <span className="truncate max-w-[120px]">original sound - Post Reach</span>
        </div>
      </div>
    </div>
  )
}
