import { forwardRef, type ComponentProps } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type FormFieldProps = {
  label: string
  error?: string
  hint?: string
  inputClassName?: string
} & ComponentProps<typeof Input>

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    { id, name, label, error, hint, className, inputClassName, ...props },
    ref
  ) => {
    const resolvedId = id ?? (typeof name === "string" ? name : undefined)

    return (
      <div className={cn("space-y-2", className)}>
        <Label htmlFor={resolvedId}>{label}</Label>
        <Input
          ref={ref}
          id={resolvedId}
          name={name}
          aria-invalid={error ? true : undefined}
          className={cn(
            "h-12 rounded-xl border-black/10 bg-white",
            inputClassName
          )}
          {...props}
        />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {!error && hint ? (
          <p className="text-sm text-slate-500">{hint}</p>
        ) : null}
      </div>
    )
  }
)

FormField.displayName = "FormField"

export { FormField }
