"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function CtaFooter() {
  return (
    <footer className="relative bg-slate-950 text-white overflow-hidden border-t border-white/5">
      {/* Glow blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-0">
        
        {/* Final CTA Card */}
        <div className="bg-linear-to-r from-orange-600 via-orange-700 to-amber-700 rounded-[2.5rem] p-8 md:p-16 text-center shadow-2xl border border-orange-500/20 mb-20 transition-transform duration-350 hover:scale-[1.002]">
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
              Ready to simplify your publishing?
            </h3>
            <p className="text-orange-100 text-sm md:text-lg max-w-xl mx-auto leading-relaxed">
              Create your account in under a minute and schedule your first posts. Connect up to three channels completely free.
            </p>
            <div className="pt-2">
              <Link
                href="/signup"
                className="bg-white text-orange-950 hover:bg-orange-50 font-bold px-8 py-4 rounded-full shadow-lg inline-flex items-center gap-2 group transition focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-orange-300"
              >
                <span>Start For Free</span>
                <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <p className="text-[11px] text-orange-200/80 mt-3">
                No credit card required • Instant account creation
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links & Brand area */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 pb-8 border-t border-white/5 text-slate-400 text-sm">
          
          {/* Brand Info (Navbar Logo, text label removed) */}
          <div className="flex items-center">
            <Image
              src="/postglee-logo.png"
              alt="PostGlee logo"
              width={112}
              height={112}
              className="w-28 object-contain"
            />
          </div>

          {/* Links Row */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <Link href="/privacy-policy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="mailto:support@postglee.com" className="hover:text-white transition">
              Support
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-xs text-slate-500 text-center md:text-right">
            <p>© {new Date().getFullYear()} PostGlee. All rights reserved.</p>
          </div>

        </div>

        {/* Giant Watermark Text at the bottom with downward fade */}
        <div className="relative w-full h-16 md:h-24 overflow-hidden select-none pointer-events-none mt-6">
          <div className="absolute inset-x-0 top-0 text-center font-black tracking-[0.08em] text-[15.5vw] lg:text-[150px] uppercase leading-none font-sans text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.08)] select-none">
            PostGlee
          </div>
          {/* Fading bottom overlay */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>

      </div>
    </footer>
  )
}
