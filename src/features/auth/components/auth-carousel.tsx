"use client"

import { useState, useEffect } from "react"
import { LayoutDashboard, Calendar, BarChart3, CheckCircle2, TrendingUp, ChevronDown } from "lucide-react"

function WorkspaceVisual() {
  return (
    <div className="w-full max-w-[280px] rounded-xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20">
            <LayoutDashboard className="h-4 w-4 text-indigo-400" />
          </div>
          <span className="text-sm font-medium text-white">Acme Corp</span>
        </div>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 p-2 border border-white/10">
          <div className="h-8 w-8 rounded-full bg-rose-500/20" />
          <div className="flex-1 space-y-1">
            <div className="h-2 w-20 rounded bg-white/20" />
            <div className="h-2 w-12 rounded bg-white/10" />
          </div>
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="flex items-center gap-3 rounded-lg p-2 border border-transparent">
          <div className="h-8 w-8 rounded-full bg-blue-500/20" />
          <div className="flex-1 space-y-1">
            <div className="h-2 w-24 rounded bg-white/20" />
            <div className="h-2 w-16 rounded bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  )
}

function CalendarVisual() {
  return (
    <div className="w-full max-w-[280px] rounded-xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20">
            <Calendar className="h-4 w-4 text-rose-400" />
          </div>
          <span className="text-sm font-medium text-white">This Week</span>
        </div>
        <div className="flex gap-1">
          <div className="h-4 w-4 rounded bg-white/10" />
          <div className="h-4 w-4 rounded bg-white/10" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-2 rounded-lg border border-white/5 bg-white/5 p-2">
          <div className="text-center text-[10px] text-slate-400">Mon</div>
          <div className="h-10 rounded bg-rose-500/20 border border-rose-500/20" />
        </div>
        <div className="flex flex-col gap-2 rounded-lg border border-white/5 bg-white/5 p-2">
          <div className="text-center text-[10px] text-slate-400">Tue</div>
          <div className="h-10 rounded bg-blue-500/20 border border-blue-500/20" />
          <div className="h-8 rounded bg-emerald-500/20 border border-emerald-500/20" />
        </div>
        <div className="flex flex-col gap-2 rounded-lg border border-white/5 bg-white/5 p-2">
          <div className="text-center text-[10px] text-slate-400">Wed</div>
          <div className="h-16 rounded bg-purple-500/20 border border-purple-500/20" />
        </div>
      </div>
    </div>
  )
}

function AnalyticsVisual() {
  return (
    <div className="w-full max-w-[280px] rounded-xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
            <BarChart3 className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-sm font-medium text-white">Total Reach</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
          <TrendingUp className="h-3 w-3" />
          <span>+24%</span>
        </div>
      </div>
      <div className="flex h-20 items-end justify-between gap-2 border-b border-white/10 pb-2">
        {[30, 45, 25, 60, 40, 80, 50].map((height, i) => (
          <div
            key={i}
            className="w-full rounded-t bg-gradient-to-t from-emerald-500/20 to-teal-400/50"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="mt-3 flex justify-between">
        <div className="space-y-1">
          <div className="text-[10px] text-slate-400">Followers</div>
          <div className="text-sm font-medium text-white">12.4K</div>
        </div>
        <div className="space-y-1 text-right">
          <div className="text-[10px] text-slate-400">Engagement</div>
          <div className="text-sm font-medium text-white">4.2%</div>
        </div>
      </div>
    </div>
  )
}

const slides = [
  {
    title: "Schedule a month of content in 5 minutes.",
    description: "Use our bulk publisher and visual calendar to plan your social media strategy effortlessly.",
    visual: <CalendarVisual />,
  },
  {
    title: "Manage all your brands in one place.",
    description: "Easily switch between brands, clients, and team members without losing context.",
    visual: <WorkspaceVisual />,
  },
  {
    title: "Analytics for every platform.",
    description: "Track growth, engagement, and reach across all your connected social accounts.",
    visual: <AnalyticsVisual />,
  },
]

export function AuthCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-950 flex flex-col items-center justify-center">
      {/* Animated gradient backgrounds */}
      <div className="absolute -top-[20%] -left-[10%] h-[70%] w-[70%] animate-[spin_20s_linear_infinite] rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-[100px]" />
      <div className="absolute -bottom-[20%] -right-[10%] h-[70%] w-[70%] animate-[spin_25s_linear_infinite_reverse] rounded-full bg-gradient-to-tl from-rose-500/20 via-orange-500/10 to-transparent blur-[100px]" />
      
      {/* Mesh grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />

      {/* Carousel Content */}
      <div className="relative z-10 w-full max-w-lg px-8 flex flex-col h-full justify-center">
        <div className="relative h-[400px]">
          {slides.map((slide, index) => {
            const isActive = index === currentSlide
            
            return (
              <div
                key={index}
                className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-[1500ms] ease-out ${
                  isActive ? "opacity-100 scale-100 blur-0 pointer-events-auto" : "opacity-0 scale-95 blur-sm pointer-events-none"
                }`}
              >
                <div className="mb-10 w-full flex justify-center">
                  {slide.visual}
                </div>
                <h2 className="text-3xl font-medium tracking-tight text-white mb-4">
                  {slide.title}
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
                  {slide.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Navigation Dots */}
        <div className="mt-8 flex justify-center gap-3">
          <style>{`
            @keyframes progress-fill {
              0% { width: 0%; }
              100% { width: 100%; }
            }
          `}</style>
          {slides.map((_, index) => {
            const isActive = index === currentSlide
            return (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-300 ${
                  isActive ? "w-12 bg-white/20" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                {isActive && (
                  <div 
                    className="absolute top-0 left-0 h-full bg-white"
                    style={{ animation: 'progress-fill 5s linear forwards' }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}
