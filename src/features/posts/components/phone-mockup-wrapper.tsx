import * as React from "react"
import { Iphone } from "@/components/ui/iphone"

type PhoneMockupWrapperProps = {
  children: React.ReactNode
  bgMediaSrc?: string
  bgVideoSrc?: string
  onClickInner?: () => void
  innerClassName?: string
}

export const PhoneMockupWrapper = React.forwardRef<HTMLDivElement, PhoneMockupWrapperProps>(
  ({ children, bgMediaSrc, bgVideoSrc, onClickInner, innerClassName = "" }, ref) => {
    return (
      <div ref={ref} className="flex justify-center py-2">
        <div className="w-75 relative select-none bg-transparent dark">
          {/* Static Bezel Outline (Media props omitted to bypass SVG masking layer bugs) */}
          <Iphone
            className="w-full bg-transparent iphone-bezel-container"
          />

          {/* Main Screen Content Overlays */}
          <div
            onClick={onClickInner}
            className={`absolute z-20 flex flex-col select-none overflow-hidden ${innerClassName} ${bgVideoSrc || bgMediaSrc ? "bg-transparent" : "bg-white dark:bg-slate-950"}`}
            style={{
              left: "4.9076%",
              top: "2.1825%",
              width: "89.9538%",
              height: "95.6349%",
              borderRadius: "14.3132% / 6.6094%",
            }}
          >
            {/* Background Video Layer */}
            {bgVideoSrc && (
              <div className="absolute inset-0 z-0 bg-black overflow-hidden pointer-events-none">
                <video
                  key={bgVideoSrc}
                  className="block w-full h-full object-contain"
                  src={bgVideoSrc}
                  loop
                  muted
                  playsInline
                  preload="auto"
                />
              </div>
            )}

            {/* Background Image Layer */}
            {!bgVideoSrc && bgMediaSrc && (
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bgMediaSrc}
                  alt=""
                  className="block w-full h-full object-cover object-top"
                />
              </div>
            )}

            {/* Mock Dynamic Island */}
            {(bgVideoSrc || bgMediaSrc) && (
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4.5 bg-black rounded-full z-30 pointer-events-none" />
            )}

            {/* Feed Mock Layout */}
            <div 
              className="flex flex-col h-full text-slate-900 dark:text-slate-150 pt-8 relative z-10 bg-transparent"
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }
)

PhoneMockupWrapper.displayName = "PhoneMockupWrapper"
