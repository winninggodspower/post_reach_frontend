import { API_BASE_URL } from "@/lib/api"

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"])

const getRootDomain = (hostname: string): string => {
  const parts = hostname.toLowerCase().split(".")
  if (parts.length <= 2) {
    return hostname.toLowerCase()
  }
  return parts.slice(-2).join(".")
}

const isTrustedBackendOrigin = (targetUrl: URL, referenceUrl: URL): boolean => {
  if (targetUrl.origin === referenceUrl.origin) {
    return true
  }

  if (
    targetUrl.protocol === referenceUrl.protocol &&
    targetUrl.port === referenceUrl.port &&
    LOOPBACK_HOSTS.has(targetUrl.hostname) &&
    LOOPBACK_HOSTS.has(referenceUrl.hostname)
  ) {
    return true
  }

  // Allow subdomains of the same root domain (e.g. postglee.com <-> api.postglee.com)
  const targetRoot = getRootDomain(targetUrl.hostname)
  const referenceRoot = getRootDomain(referenceUrl.hostname)
  if (
    targetRoot &&
    targetRoot.includes(".") &&
    targetRoot === referenceRoot &&
    !LOOPBACK_HOSTS.has(targetUrl.hostname)
  ) {
    return true
  }

  return false
}

const hasOAuthAuthorizePath = (pathname: string): boolean => {
  return /\/oauth\/authorize\/?$/i.test(pathname)
}

/**
 * Checks whether a `next` query string value points to the backend's
 * `/oauth/authorize/` endpoint.
 */
export const isBackendOAuthAuthorizeUrl = (
  nextUrl: string | null | undefined,
): nextUrl is string => {
  if (!nextUrl) {
    return false
  }

  const trimmed = nextUrl.trim()
  if (!trimmed) {
    return false
  }

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    try {
      const parsedRelative = new URL(trimmed, "http://localhost")
      return hasOAuthAuthorizePath(parsedRelative.pathname)
    } catch {
      return false
    }
  }

  try {
    const parsedNext = new URL(trimmed)
    if (parsedNext.protocol !== "http:" && parsedNext.protocol !== "https:") {
      return false
    }

    if (!hasOAuthAuthorizePath(parsedNext.pathname)) {
      return false
    }

    const fallbackOrigin =
      typeof window !== "undefined" ? window.location.origin : "http://127.0.0.1:8000"
    const backendBase = new URL(API_BASE_URL, fallbackOrigin)

    if (isTrustedBackendOrigin(parsedNext, backendBase)) {
      return true
    }

    if (typeof window !== "undefined") {
      const currentOrigin = new URL(window.location.origin)
      if (isTrustedBackendOrigin(parsedNext, currentOrigin)) {
        return true
      }
    }

    return false
  } catch {
    return false
  }
}
