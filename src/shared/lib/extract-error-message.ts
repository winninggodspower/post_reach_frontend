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
 * Recursively extracts a readable message string from various nested backend response formats:
 * - DRF serializer errors: { errors: { field: ["error"] } } or { field: ["error"] }
 * - { detail: "..." } (e.g. DRF detail)
 * - { error: { message: "..." } } (e.g. Graph API error)
 * - { message: "..." } (fallback summary)
 * - stringified JSON: '{"message": {"message": "..."}}'
 */
function extractMessageFromPayload(data: unknown): string | null {
  if (!data) return null

  if (typeof data === "string") {
    const trimmed = data.trim()
    if (!trimmed || isHtml(trimmed)) return null
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        const parsed = JSON.parse(trimmed)
        const extracted = extractMessageFromPayload(parsed)
        if (extracted) return extracted
      } catch {
        // Not valid JSON, continue with trimmed string
      }
    }
    return trimmed
  }

  if (Array.isArray(data)) {
    for (const item of data) {
      const extracted = extractMessageFromPayload(item)
      if (extracted) return extracted
    }
    return null
  }

  if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>

    // 1. Detailed field errors (e.g. { errors: { redirect_uris: [...] } })
    // Prioritized before generic `record.message` summaries!
    if (record.errors !== undefined && record.errors !== null) {
      const drfError = formatDrfErrors(record.errors)
      if (drfError) return drfError
      const extracted = extractMessageFromPayload(record.errors)
      if (extracted) return extracted
    }

    // 2. Direct detail (DRF detail string or object)
    if (record.detail !== undefined && record.detail !== null) {
      const extracted = extractMessageFromPayload(record.detail)
      if (extracted) return extracted
    }

    // 3. Direct error (string or nested object like { error: { message: "..." } })
    if (record.error !== undefined && record.error !== null) {
      const extracted = extractMessageFromPayload(record.error)
      if (extracted) return extracted
    }

    // 4. Direct message summary
    if (record.message !== undefined && record.message !== null) {
      const extracted = extractMessageFromPayload(record.message)
      if (extracted) return extracted
    }

    // 5. DRF validation error formatting directly on root object
    const drfError = formatDrfErrors(record)
    if (drfError) return drfError
  }

  return null
}

/**
 * Extracts a user-friendly error message from Axios errors, standard Errors, or response objects.
 * Handles nested `{ message: { message: "..." } }`, DRF field/nested errors, status codes, and ignores raw HTML.
 */
export function extractErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred. Please try again."
): string {
  if (!error) return fallback

  // 1. Axios Error
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    const extractedFromData = extractMessageFromPayload(data)
    if (extractedFromData) {
      return extractedFromData
    }

    const status = error.response?.status
    if (status === 404) {
      return "The requested resource was not found (404)."
    }
    if (status && status >= 500) {
      return "Internal server error. Please try again later."
    }

    // Ignore Axios generic message "Request failed with status code ..."
    if (error.message && !/^Request failed with status code \d+/i.test(error.message)) {
      const extractedMsg = extractMessageFromPayload(error.message)
      if (extractedMsg) return extractedMsg
    }

    return fallback
  }

  // 2. Standard Error instance
  if (error instanceof Error) {
    if (/^Request failed with status code \d+/i.test(error.message)) {
      return fallback
    }
    const extracted = extractMessageFromPayload(error.message)
    if (extracted) return extracted
    return fallback
  }

  // 3. Object (e.g. backend response payload passed directly: { success: false, message: ... })
  if (typeof error === "object") {
    const extracted = extractMessageFromPayload(error)
    if (extracted) return extracted
  }

  // 4. Raw string
  if (typeof error === "string") {
    const extracted = extractMessageFromPayload(error)
    if (extracted) return extracted
  }

  return fallback
}

/**
 * Maps server-side field validation errors directly into a React Hook Form instance.
 * Returns true if one or more field errors were mapped, allowing the caller to suppress generic popups.
 */
export function applyFormServerErrors<T extends Record<string, any>>(
  error: unknown,
  setError: (name: any, error: { type: string; message: string }) => void,
): boolean {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (data?.errors && typeof data.errors === "object" && data.errors !== null) {
      let hasFieldErrors = false
      for (const [key, val] of Object.entries(data.errors)) {
        let message = ""
        if (Array.isArray(val)) {
          message = val.filter(Boolean).map(String).join("\n")
        } else if (typeof val === "string") {
          message = val
        } else if (typeof val === "object" && val !== null) {
          message = JSON.stringify(val)
        }

        if (message) {
          setError(key, {
            type: "server",
            message,
          })
          hasFieldErrors = true
        }
      }
      return hasFieldErrors
    }
  }
  return false
}
