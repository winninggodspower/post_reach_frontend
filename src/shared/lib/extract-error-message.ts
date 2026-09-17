import axios from "axios"

/**
 * Recursively formats Django Rest Framework serializer errors
 * e.g. { title: ["This field is required."] } or nested { settings: { youtube: ["Invalid"] } }
 */
function formatDrfErrors(errors: unknown): string | null {
  if (typeof errors === "string") return errors.trim()
  if (Array.isArray(errors)) {
    const list = errors.map(formatDrfErrors).filter(Boolean)
    return list.length ? list.join(", ") : null
  }
  if (typeof errors === "object" && errors !== null) {
    const entries = Object.entries(errors)
      .filter(([k]) => k !== "success" && k !== "status")
      .map(([field, val]) => {
        const msg = formatDrfErrors(val)
        if (!msg) return null
        return field === "non_field_errors" || field === "detail" ? msg : `${field}: ${msg}`
      })
      .filter(Boolean)

    return entries.length ? entries.join(" • ") : null
  }
  return null
}

/**
 * Extracts a user-friendly error message from Axios errors or standard Errors.
 * Prioritizes `message`, then gracefully flattens DRF field/nested errors.
 */
export function extractErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred. Please try again."
): string {
  if (!error) return fallback

  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (typeof data === "string" && data.trim()) return data

    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>

      // 1. Custom backend error: { success: false, message: "..." }
      if (typeof record.message === "string" && record.message.trim()) {
        return record.message.trim()
      }

      if (typeof record.error === "string" && record.error.trim()) {
        return record.error.trim()
      }

      // 2. DRF serializer field errors (flat or nested)
      const drfError = formatDrfErrors(record.errors ?? record)
      if (drfError) return drfError
    }
  }

  if (error instanceof Error) {
    if (/^Request failed with status code \d+/i.test(error.message)) {
      return fallback
    }
    return error.message
  }

  return typeof error === "string" ? error : fallback
}
