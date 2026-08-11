"use client"

import React from "react"
import Image from "next/image"
import { Check } from "lucide-react"

export function PublishingCard() {
  return (
    <div className="sticky top-[100px] rounded-[2.5rem] bg-slate-950 text-white p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-8 items-center border border-white/8 min-h-[380px] md:min-h-[420px] transition-transform duration-350 hover:scale-[1.005]">
      <div className="flex-1 space-y-4 text-left">
        <span className="text-[10px] tracking-[0.2em] font-semibold text-orange-400 uppercase">
          01 / Publishing
        </span>
        <h3 className="text-2xl md:text-4xl font-semibold tracking-tight leading-tight">
          Publish your content to all platforms
        </h3>
        <p className="text-slate-355 text-sm md:text-base leading-relaxed">
          Draft your post once and publish it instantly to Instagram, X, Facebook, LinkedIn, TikTok, and YouTube. Stop copy-pasting your content across separate tabs.
        </p>
        <div className="pt-2 flex flex-wrap gap-2 text-xs text-slate-405">
          <span className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-1">
            <Check className="size-3 text-orange-400" /> Preview drafts
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-1">
            <Check className="size-3 text-orange-400" /> Multi-image posts
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-1">
            <Check className="size-3 text-orange-400" /> Secure connection
          </span>
        </div>
      </div>

      {/* Visual Graphic */}
      <div className="flex-1 w-full flex items-center justify-center min-h-[220px] relative">
        <div className="absolute w-44 h-44 bg-orange-500/10 rounded-full blur-2xl" />
        {/* Radial Connection Node Grid */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Center logo node */}
          <div className="w-16 h-16 rounded-3xl overflow-hidden flex items-center justify-center z-10 animate-float-1">
            <Image src="/postglee-favicon.png" alt="PostGlee" width={64} height={64} className="object-contain" />
          </div>

          {/* Floating Social Nodes */}
          <div className="absolute -top-2 left-6 w-9 h-9 rounded-full bg-white border border-black/8 flex items-center justify-center shadow-md animate-float-2">
            <Image src="/social-icons/instagram-circle.png" alt="" width={22} height={22} className="rounded-full" />
          </div>
          <div className="absolute top-12 -right-2 w-9 h-9 rounded-full bg-white border border-black/8 flex items-center justify-center shadow-md animate-float-3">
            <Image src="/social-icons/twitter-circle.png" alt="" width={22} height={22} className="rounded-full" />
          </div>
          <div className="absolute -bottom-2 right-12 w-9 h-9 rounded-full bg-white border border-black/8 flex items-center justify-center shadow-md animate-float-4">
            <Image src="/social-icons/linkedin-circle.png" alt="" width={22} height={22} className="rounded-full" />
          </div>
          <div className="absolute bottom-12 -left-2 w-9 h-9 rounded-full bg-white border border-black/8 flex items-center justify-center shadow-md animate-float-5">
            <Image src="/social-icons/facebook-circle.png" alt="" width={22} height={22} className="rounded-full" />
          </div>
          <div className="absolute top-20 left-32 w-8 h-8 rounded-full bg-white border border-black/8 flex items-center justify-center shadow-md animate-float-6">
            <Image src="/social-icons/youtube-circle.png" alt="" width={18} height={18} className="rounded-full" />
          </div>

          {/* Connection Line Dotted SVGs with flow animation */}
          <svg className="absolute inset-0 size-full pointer-events-none opacity-40 text-orange-450" viewBox="0 0 100 100">
            <style>{`
              .connection-pulse {
                stroke-dasharray: 4, 4;
                animation: flow-pulse 1.2s linear infinite;
              }
              @keyframes flow-pulse {
                to {
                  stroke-dashoffset: -16;
                }
              }
            `}</style>
            <line x1="50" y1="50" x2="30" y2="15" stroke="currentColor" strokeWidth="1.2" className="connection-pulse" />
            <line x1="50" y1="50" x2="80" y2="35" stroke="currentColor" strokeWidth="1.2" className="connection-pulse" />
            <line x1="50" y1="50" x2="65" y2="85" stroke="currentColor" strokeWidth="1.2" className="connection-pulse" />
            <line x1="50" y1="50" x2="20" y2="65" stroke="currentColor" strokeWidth="1.2" className="connection-pulse" />
          </svg>
        </div>
      </div>
    </div>
  )
}
