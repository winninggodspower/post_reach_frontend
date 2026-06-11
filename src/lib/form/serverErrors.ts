import type { UseFormSetError, FieldValues } from "react-hook-form"

type ServerErrorPayload = {
  message?: string
  fields?: Record<string, any>
  errors?: Record<string, any>
}

export function handleServerFormErrors<T extends FieldValues = FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  setSubmitError?: (msg: string | null) => void,
): boolean {
  if (!error) {
    if (setSubmitError) setSubmitError(null)
    return false
  }

  // Extract the payload from an Error object if needed
  const raw = error instanceof Error ? error.message : error

  let parsed: ServerErrorPayload | null = null
  try {
    if (typeof raw === "string") parsed = JSON.parse(raw)
    else if (typeof raw === "object" && raw !== null) parsed = raw as ServerErrorPayload
  } catch {
    if (setSubmitError) setSubmitError(String(raw))
    return false
  }

  // Support multiple backend shapes: `fields` (old), or `errors` (Django-style)
  const fields = parsed?.fields ?? parsed?.errors
  const message = parsed?.message ?? null

  // If the backend provided a top-level detail (e.g. `fields.detail` or `errors.detail`), surface it
  const detail = parsed?.errors?.detail ?? parsed?.fields?.detail ?? parsed?.errors?.non_field_errors ?? null

  const snakeToCamel = (s: string) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase())

  let hadField = false
  if (fields && typeof fields === "object") {
    for (const [k, v] of Object.entries(fields)) {
      // skip `detail`/`non_field_errors` which are non-field messages
      if (k === "detail" || k === "non_field_errors") continue
      const key = snakeToCamel(k) as unknown as string
      const msg = Array.isArray(v) ? v.join(" ") : String(v)
      try {
        // cast to any to satisfy UseFormSetError Path typing
        setError(key as any, { type: "server", message: msg })
        hadField = true
      } catch {
        // ignore fields that don't map to form keys
      }
    }
  }
  if (!hadField) {
    if (detail && setSubmitError) setSubmitError(Array.isArray(detail) ? detail.join(" ") : String(detail))
    else if (message && setSubmitError) setSubmitError(message)
    else if (setSubmitError) setSubmitError(String(raw))
  }
  return hadField
}

export default handleServerFormErrors
