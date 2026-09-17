import axios from "axios"

/**
 * Checks if a string contains HTML markup (e.g. default web server error pages)
 */
function isHtml(content: unknown): boolean {
  return typeof content === "string" && /^\s*<(!doctype|html|head|body|div|p)/i.test(content)
}

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
 * Prioritizes `message`, flattens DRF field/nested errors, and ignores raw HTML / 404 response bodies.
 */
export function extractErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred. Please try again."
): string {
  if (!error) return fallback

  if (axios.isAxiosError(error)) {
    const status = error.response?.status

    // 1. Status-code based early returns
    if (status === 404) {
      return "The requested resource was not found (404)."
    }
    if (status && status >= 500) {
      return "Internal server error. Please try again later."
    }

    const data = error.response?.data

    // 2. Ignore missing data or raw HTML error pages
    if (!data || isHtml(data)) {
      return fallback
    }

    // 3. Clean string response
    if (typeof data === "string" && data.trim()) {
      return data.trim()
    }

    // 4. Object response: Custom backend message, DRF detail, or serializer field errors
    if (typeof data === "object") {
      const record = data as Record<string, unknown>

      if (typeof record.message === "string" && record.message.trim()) {
        return record.message.trim()
      }

      if (typeof record.detail === "string" && record.detail.trim()) {
        return record.detail.trim()
      }

      if (typeof record.error === "string" && record.error.trim()) {
        return record.error.trim()
      }

      const drfError = formatDrfErrors(record.errors ?? record)
      if (drfError) return drfError
    }
  }

  if (error instanceof Error) {
    if (/^Request failed with status code \d+/i.test(error.message)) {
      return fallback
    }
    if (isHtml(error.message)) {
      return fallback
    }
    return error.message
  }

  return typeof error === "string" && !isHtml(error) ? error : fallback
}
