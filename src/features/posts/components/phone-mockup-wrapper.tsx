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
        <div className="w-[300px] relative select-none bg-transparent dark">
          <Iphone
            src={bgMediaSrc}
            videoSrc={bgVideoSrc}
            className="w-full bg-transparent iphone-bezel-container"
          />

          {/* Main Screen Content Overlays */}
          <div
            onClick={onClickInner}
            className={`absolute z-20 flex flex-col select-none overflow-hidden ${innerClassName}`}
            style={{
              left: "4.9076%",
              top: "2.1825%",
              width: "89.9538%",
              height: "95.6349%",
              borderRadius: "14.3132% / 6.6094%",
              backgroundColor: bgVideoSrc || bgMediaSrc ? "transparent" : "#ffffff",
            }}
          >
            {/* Feed Mock Layout */}
            <div className="flex flex-col h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-150 pt-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }
)

PhoneMockupWrapper.displayName = "PhoneMockupWrapper"
