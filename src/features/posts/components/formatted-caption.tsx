import * as React from "react"

export interface FormattedCaptionProps {
  text?: string
  fallback?: string
  className?: string
  tagClassName?: string
}

export function FormattedCaption({
  text,
  fallback = "Enter your post text here...",
  className = "",
  tagClassName = "text-sky-500 font-medium hover:underline cursor-pointer",
}: FormattedCaptionProps) {
  if (!text) {
    return <span className="text-slate-400 italic text-xs">{fallback}</span>
  }

  const words = text.split(" ")
  return (
    <span className={className}>
      {words.map((word, i) => {
        if (word.startsWith("#") || word.startsWith("@")) {
          return (
            <span key={i} className={tagClassName}>
              {word}{" "}
            </span>
          )
        }
        return word + " "
      })}
    </span>
  )
}
