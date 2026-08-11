"use client"

import React from "react"
import { Layers } from "lucide-react"

// Import modular card components
import { PublishingCard } from "./cards/publishing-card"
import { CalendarCard } from "./cards/calendar-card"
import { WorkspacesCard } from "./cards/workspaces-card"
import { AnalyticsCard } from "./cards/analytics-card"

export default function FeaturesStack() {
  return (
    <section className="relative px-6 pt-16 pb-24 md:pt-20 md:pb-32 overflow-x-clip bg-slate-50/30">
      {/* Background soft glowing gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl">

        {/* Section Header */}
        <div className="text-center max-w-[832px] mx-auto mb-10 md:mb-14">
          <h2 className="text-3xl md:text-5xl font-normal tracking-tight text-black leading-[1.1]">
            How PostGlee simplifies <span className="font-playfair italic font-medium text-accent-brand">Publishing</span>
          </h2>
          <p className="text-slate-600 text-base md:text-lg mt-3 max-w-2xl mx-auto leading-relaxed">
            Everything you need to plan, schedule, and cross-publish your social videos.
          </p>
        </div>

        {/* Sticky Stacking Cards Container */}
        <div className="flex flex-col gap-12 md:gap-16 pb-20">
          <PublishingCard />
          <CalendarCard />
          <WorkspacesCard />
          <AnalyticsCard />
        </div>

      </div>
    </section>
  )
}
