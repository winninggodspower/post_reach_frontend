import { API_BASE_URL } from "@/lib/api"

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"])

const isSameOrLoopbackOrigin = (urlA: URL, urlB: URL): boolean => {
  if (urlA.origin === urlB.origin) {
    return true
  }

  return (
    urlA.protocol === urlB.protocol &&
    urlA.port === urlB.port &&
    LOOPBACK_HOSTS.has(urlA.hostname) &&
    LOOPBACK_HOSTS.has(urlB.hostname)
  )
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

    if (isSameOrLoopbackOrigin(parsedNext, backendBase)) {
      return true
    }

    if (typeof window !== "undefined") {
      const currentOrigin = new URL(window.location.origin)
      if (isSameOrLoopbackOrigin(parsedNext, currentOrigin)) {
        return true
      }
    }

    return false
  } catch {
    return false
  }
}

