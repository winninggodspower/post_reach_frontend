import { forwardRef, type ComponentProps } from "react"
import { ChevronDown } from "lucide-react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export type FormSelectProps = {
  label: string
  error?: string
  hint?: string
  selectClassName?: string
} & ComponentProps<"select">

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    { id, name, label, error, hint, className, selectClassName, children, ...props },
    ref
  ) => {
    const resolvedId = id ?? (typeof name === "string" ? name : undefined)

    return (
      <div className={cn("space-y-2", className)}>
        <Label htmlFor={resolvedId}>{label}</Label>
        <div className="relative">
          <select
            ref={ref}
            id={resolvedId}
            name={name}
            aria-invalid={error ? true : undefined}
            className={cn(
              "h-12 w-full appearance-none rounded-xl border border-black/10 bg-white px-3 pr-10 text-sm text-slate-900 shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30",
              selectClassName
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {!error && hint ? (
          <p className="text-sm text-slate-500">{hint}</p>
        ) : null}
      </div>
    )
  }
)

FormSelect.displayName = "FormSelect"

export { FormSelect }
