import * as React from "react"

type SuccessCheckIconProps = {
  className?: string
}

export function SuccessCheckIcon({ className }: SuccessCheckIconProps) {
  return (
    <div className={`mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/30 ${className || ""}`}>
      <svg
        className="size-6 text-emerald-600 dark:text-emerald-450"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
  )
}
