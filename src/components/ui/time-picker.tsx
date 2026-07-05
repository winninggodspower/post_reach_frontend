import * as React from "react"
import { Clock } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"

const parseTime = (timeStr: string) => {
  if (!timeStr) return { hour24: 12, hour12: 12, minute: 0, ampm: "AM" as const }
  const [h, m] = timeStr.split(":").map(Number)
  const hour24 = h || 0
  const minute = m || 0
  const ampm = hour24 >= 12 ? ("PM" as const) : ("AM" as const)
  let hour12 = hour24 % 12
  if (hour12 === 0) hour12 = 12
  return { hour24, hour12, minute, ampm }
}

const formatTime = (hour12: number, minute: number, ampm: "AM" | "PM") => {
  let hour24 = hour12 % 12
  if (ampm === "PM") {
    hour24 += 12
  }
  const hStr = String(hour24).padStart(2, "0")
  const mStr = String(minute).padStart(2, "0")
  return `${hStr}:${mStr}`
}

export interface TimePickerProps {
  value: string
  onChange: (val: string) => void
  className?: string
}

export function TimePicker({
  value,
  onChange,
  className,
}: TimePickerProps) {
  const { hour12, minute, ampm } = parseTime(value)

  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5)

  const handleSelectHour = (h: number) => {
    onChange(formatTime(h, minute, ampm))
  }
  const handleSelectMinute = (m: number) => {
    onChange(formatTime(hour12, m, ampm))
  }
  const handleSelectAmPm = (ap: "AM" | "PM") => {
    onChange(formatTime(hour12, minute, ap))
  }

  const displayTimeText = `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${ampm}`

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={`w-full justify-start text-left font-semibold text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:outline-hidden focus:ring-1 focus:ring-accent-brand h-9 text-slate-800 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 cursor-pointer ${className}`}
        >
          <Clock className="mr-2 size-3.5 text-slate-400" />
          {displayTimeText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <div className="flex gap-2 justify-between h-48 select-none">
          {/* Hours Column */}
          <div className="flex-1 overflow-y-auto scrollbar-thin border-r border-slate-100 dark:border-slate-800/80 pr-1 space-y-0.5">
            <div className="text-[9px] text-center font-bold text-slate-400 uppercase tracking-wider mb-1 sticky top-0 bg-popover py-1">Hour</div>
            {hours.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => handleSelectHour(h)}
                className={`w-full py-1 text-center text-xs font-semibold rounded-md transition cursor-pointer ${
                  hour12 === h
                    ? "bg-accent-brand text-white"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                {String(h).padStart(2, "0")}
              </button>
            ))}
          </div>

          {/* Minutes Column */}
          <div className="flex-1 overflow-y-auto scrollbar-thin border-r border-slate-100 dark:border-slate-800/80 pr-1 space-y-0.5">
            <div className="text-[9px] text-center font-bold text-slate-400 uppercase tracking-wider mb-1 sticky top-0 bg-popover py-1">Min</div>
            {minutes.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleSelectMinute(m)}
                className={`w-full py-1 text-center text-xs font-semibold rounded-md transition cursor-pointer ${
                  minute === m
                    ? "bg-accent-brand text-white"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                {String(m).padStart(2, "0")}
              </button>
            ))}
          </div>

          {/* AM/PM Column */}
          <div className="flex-1 flex flex-col justify-center space-y-2">
            <div className="text-[9px] text-center font-bold text-slate-400 uppercase tracking-wider mb-1">AM/PM</div>
            {(["AM", "PM"] as const).map((ap) => (
              <button
                key={ap}
                type="button"
                onClick={() => handleSelectAmPm(ap)}
                className={`w-full py-2.5 text-center text-xs font-bold rounded-md transition cursor-pointer ${
                  ampm === ap
                    ? "bg-accent-brand text-white"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                {ap}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
