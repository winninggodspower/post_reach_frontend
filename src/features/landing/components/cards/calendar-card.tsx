"use client"

import Image from "next/image"
import { Check } from "lucide-react"

export function CalendarCard() {
  return (
    <div className="sticky top-[132px] rounded-[2.5rem] bg-linear-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-8 md:p-12 shadow-2xl flex flex-col md:flex-row-reverse gap-8 items-center border border-indigo-500/20 min-h-[380px] md:min-h-[420px] transition-transform duration-350 hover:scale-[1.005]">
      {/* Text on the Right */}
      <div className="flex-1 space-y-4 text-left">
        <span className="text-[10px] tracking-[0.2em] font-semibold text-indigo-355 uppercase">
          02 / Planning
        </span>
        <h3 className="text-2xl md:text-4xl font-semibold tracking-tight leading-tight">
          Schedule weeks of posts in minutes
        </h3>
        <p className="text-indigo-200 text-sm md:text-base leading-relaxed">
          See all your scheduled posts and videos in a clean calendar grid. Easily drag items to different days to organize your publishing schedule.
        </p>
        <div className="pt-2 flex flex-wrap gap-2 text-xs text-indigo-300">
          <span className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-1">
            <Check className="size-3 text-indigo-300" /> Drag-and-drop
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-1">
            <Check className="size-3 text-indigo-300" /> Visual calendar
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-1">
            <Check className="size-3 text-indigo-300" /> Automatic times
          </span>
        </div>
      </div>

      {/* Visual Graphic on the Left */}
      <div className="flex-1 w-full flex items-center justify-center min-h-[220px]">
        {/* Simulated mini-calendar card deck */}
        <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl p-4 w-full max-w-[280px] shadow-xl space-y-3 animate-float-2">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[10px] text-white/50 tracking-wider">
            <span className="font-bold">August 2026</span>
            <div className="flex gap-1.5 font-bold">
              <span>‹</span><span>August 10</span><span>›</span>
            </div>
          </div>

          {/* Calendar Grid row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="border border-white/5 bg-white/5 rounded-xl p-2 min-h-[90px] flex flex-col justify-between text-left">
              <span className="text-[9px] text-white/30 font-bold">Mon 10</span>
              <div className="bg-orange-500/20 border border-orange-500/30 text-orange-350 p-1 rounded-md text-[8px] flex items-center gap-1 font-semibold">
                <Image src="/social-icons/instagram-circle.png" alt="" width={10} height={10} />
                <span>10:00 AM</span>
              </div>
            </div>

            <div className="border border-white/5 bg-white/5 rounded-xl p-2 min-h-[90px] flex flex-col justify-between text-left ring-2 ring-indigo-500/50 shadow-lg scale-102 bg-white/5">
              <span className="text-[9px] text-indigo-455 font-bold">Tue 11</span>
              <div className="bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 p-1 rounded-md text-[8px] space-y-1">
                <div className="flex items-center gap-1 font-semibold">
                  <Image src="/social-icons/twitter-circle.png" alt="" width={10} height={10} />
                  <span>2:15 PM</span>
                </div>
                <div className="h-1 w-[80%] bg-white/20 rounded-full" />
              </div>
            </div>

            <div className="border border-white/5 bg-white/5 rounded-xl p-2 min-h-[90px] flex flex-col justify-between text-left">
              <span className="text-[9px] text-white/30 font-bold">Wed 12</span>
              <div className="bg-sky-500/20 border border-sky-500/30 text-sky-350 p-1 rounded-md text-[8px] flex items-center gap-1 font-semibold">
                <Image src="/social-icons/linkedin-circle.png" alt="" width={10} height={10} />
                <span>4:30 PM</span>
              </div>
            </div>
          </div>

          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-[45%] bg-indigo-500 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
