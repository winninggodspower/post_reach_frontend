"use client"

import React from "react"
import { Check, TrendingUp, Play } from "lucide-react"

export function AnalyticsCard() {
  return (
    <div className="sticky top-[196px] rounded-[2.5rem] bg-linear-to-br from-orange-600 via-orange-700 to-amber-700 text-white p-8 md:p-12 shadow-2xl flex flex-col gap-6 items-stretch border border-orange-500/20 min-h-[380px] md:min-h-[420px] transition-transform duration-350 hover:scale-[1.005]">
      {/* Text on top */}
      <div className="space-y-3 text-left">
        <span className="text-[10px] tracking-[0.2em] font-semibold text-orange-255 uppercase block">
          04 / Analytics
        </span>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-2xl md:text-3xl font-semibold tracking-tight leading-tight max-w-xl">
            See your video analytics in one dashboard
          </h3>
          <div className="flex flex-wrap gap-2 text-xs text-orange-200">
            <span className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-1">
              <Check className="size-3 text-orange-200" /> Combined reach
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-1">
              <Check className="size-3 text-orange-200" /> Top posts
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-1">
              <Check className="size-3 text-orange-200" /> Simple charts
            </span>
          </div>
        </div>
        <p className="text-orange-100 text-sm md:text-base leading-relaxed max-w-3xl">
          Get a simple summary of your reach, views, and follower growth across all platforms. No complicated data dashboards to figure out.
        </p>
      </div>
      
      {/* Visual Graphic on Bottom (Side-by-side Video + Analytics) */}
      <div className="w-full flex-1 flex items-center justify-center min-h-[220px]">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch justify-center w-full max-w-[520px] animate-float-1">
          
          {/* Video Thumbnail Card */}
          <div className="w-full sm:w-[170px] h-[130px] sm:h-auto rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 border border-white/10 relative overflow-hidden flex flex-col justify-between p-3.5 shadow-lg shrink-0 text-left">
            <div className="absolute inset-0 bg-black/20 z-0" />
            
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-lg border border-orange-400/30 hover:scale-105 transition">
                <Play className="size-4 fill-white text-white ml-0.5" />
              </div>
            </div>

            {/* Video Meta top */}
            <div className="relative z-10 flex justify-between items-center text-[8px] text-white/60">
              <span className="font-semibold uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded">Reel</span>
              <span>0:45</span>
            </div>

            {/* Video Meta bottom */}
            <div className="relative z-10 text-[9px] font-bold text-white/90">
              <p className="truncate">3 Hacks to Grow.mp4</p>
              <p className="text-[8px] text-white/60 font-normal mt-0.5">Scheduled for Tue</p>
            </div>
          </div>

          {/* Analytics curve card */}
          <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl p-4 flex-1 text-left space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div>
                <p className="text-[9px] text-white/55 tracking-wider uppercase">Video Performance</p>
                <p className="text-base font-bold">+185.4%</p>
              </div>
              <TrendingUp className="size-5 text-orange-350 animate-pulse" />
            </div>
            
            {/* SVG Curve chart */}
            <div className="h-12 w-full relative">
              <svg className="w-full h-full text-orange-300" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M 0 28 Q 15 22 30 18 T 60 8 T 90 2 T 100 0" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M 0 28 Q 15 22 30 18 T 60 8 T 90 2 T 100 0 L 100 30 L 0 30 Z" fill="currentColor" fillOpacity="0.08" stroke="none" />
                <circle cx="30" cy="18" r="1.5" fill="white" />
                <circle cx="60" cy="8" r="1.5" fill="white" />
                <circle cx="90" cy="2" r="1.5" fill="white" />
              </svg>
            </div>
            
            <div className="flex justify-between text-[8px] text-white/55">
              <span>Views</span>
              <span>Likes</span>
              <span>Shares</span>
              <span>Clicks</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
