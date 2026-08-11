"use client"

import React from "react"
import { Check, Globe } from "lucide-react"

export function WorkspacesCard() {
  return (
    <div className="sticky top-[164px] rounded-[2.5rem] bg-linear-to-br from-emerald-950 via-slate-950 to-black text-white p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-8 items-center border border-emerald-500/20 min-h-[380px] md:min-h-[420px] transition-transform duration-350 hover:scale-[1.005]">
      <div className="flex-1 space-y-4 text-left">
        <span className="text-[10px] tracking-[0.2em] font-semibold text-emerald-455 uppercase">
          03 / Organization
        </span>
        <h3 className="text-2xl md:text-4xl font-semibold tracking-tight leading-tight">
          Keep client accounts and brands separate
        </h3>
        <p className="text-emerald-250 text-sm md:text-base leading-relaxed">
          Organize your social accounts into distinct workspaces. This keeps client handles, asset libraries, and scheduled posts completely isolated from one another.
        </p>
        <div className="pt-2 flex flex-wrap gap-2 text-xs text-emerald-305">
          <span className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-1">
            <Check className="size-3 text-emerald-300" /> Separate brands
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-1">
            <Check className="size-3 text-emerald-300" /> Isolated media
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-1">
            <Check className="size-3 text-emerald-300" /> Separate schedules
          </span>
        </div>
      </div>
      
      {/* Visual Graphic */}
      <div className="flex-1 w-full flex items-center justify-center min-h-[220px]">
        {/* Switchable workspace stack UI */}
        <div className="w-full max-w-[260px] space-y-2 select-none animate-float-3">
          
          {/* Active workspace */}
          <div className="border border-emerald-500/30 bg-emerald-900/20 backdrop-blur-md rounded-xl p-3 flex items-center justify-between text-left shadow-lg scale-102">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center text-xs font-bold text-slate-900">A</div>
              <div>
                <p className="text-[11px] font-bold">Acme Workspace</p>
                <p className="text-[9px] text-emerald-400">3 channels connected</p>
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-bold">Active</span>
          </div>
          
          {/* Secondary workspace */}
          <div className="border border-white/5 bg-white/5 rounded-xl p-3 flex items-center justify-between text-left opacity-60 hover:opacity-80 transition duration-150">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-purple-500 flex items-center justify-center text-xs font-bold">C</div>
              <div>
                <p className="text-[11px] font-bold">Creative Studio</p>
                <p className="text-[9px] text-slate-400">5 channels connected</p>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Switch</span>
          </div>

          {/* Third workspace */}
          <div className="border border-white/5 bg-white/5 rounded-xl p-3 flex items-center justify-between text-left opacity-40 hover:opacity-60 transition duration-150">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-xs font-bold">P</div>
              <div>
                <p className="text-[11px] font-bold">Personal Brand</p>
                <p className="text-[9px] text-slate-400">1 channel connected</p>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Switch</span>
          </div>

        </div>
      </div>
    </div>
  )
}
