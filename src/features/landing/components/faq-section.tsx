"use client"

import React, { useState } from "react"

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Does PostGlee require my social media passwords?",
    answer: "No. PostGlee connects securely using official platform OAuth approvals. We never see, request, or store your passwords, keeping your account completely secure."
  },
  {
    question: "Can I automatically publish Reels, Shorts, and TikToks?",
    answer: "Yes. Videos upload and publish directly to all major platforms automatically without requiring push notifications, reminders, or mobile app intervention."
  },
  {
    question: "Which social media networks are supported?",
    answer: "We support Instagram, X (Twitter), Facebook, LinkedIn, TikTok, and YouTube. You can schedule and publish to all of them from your single dashboard."
  },
  {
    question: "Is there a free trial or free tier?",
    answer: "Yes, you can start using PostGlee for free. You can link up to 3 social media profiles and schedule your first posts immediately—no credit card required."
  }
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="relative px-6 py-20 md:py-28 bg-slate-50/30 border-t border-black/5">
      {/* Soft background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[832px]">
        
        {/* Section Header (Centered) */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-semibold font-[family-name:var(--font-inter)] tracking-tight text-black leading-tight">
            Frequently asked questions
          </h2>
        </div>

        {/* Accordion List (Single Column Stack) */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx
            return (
              <div 
                key={idx}
                className={`border border-slate-100 rounded-xl overflow-hidden transition-all duration-200 ${
                  isOpen ? "bg-slate-50/80 shadow-xs" : "bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-medium text-slate-900 hover:bg-slate-50/40 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm md:text-base font-semibold tracking-tight text-slate-900">
                    {item.question}
                  </span>
                  <span className="text-lg md:text-xl font-mono text-slate-400 select-none ml-4 shrink-0">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                
                {/* Expandable answer container */}
                <div 
                  className={`grid transition-all duration-200 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 border-t border-slate-100/50" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="p-5 text-xs md:text-sm leading-relaxed text-slate-550">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
