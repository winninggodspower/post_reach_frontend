import { useState, useEffect } from "react"
import { getPostStatus } from "../api/server"
import type { PlatformPostStatus } from "../api/server"
import { useIsMounted } from "@/shared/hooks/use-is-mounted"

type UsePostStatusProps = {
  postId: string | null
  enabled: boolean
  intervalMs?: number
}

export function usePostStatus({ postId, enabled, intervalMs = 7000 }: UsePostStatusProps) {
  const [platformStatuses, setPlatformStatuses] = useState<PlatformPostStatus[]>([])
  const [contentType, setContentType] = useState<"video" | "photo" | "text" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const isMounted = useIsMounted()

  const isFinished = platformStatuses.length > 0 && platformStatuses.every((p) => p.status === "posted" || p.status === "failed")

  useEffect(() => {
    if (!postId || !enabled || isFinished) return

    setIsLoading(true)

    const pollInterval = setInterval(async () => {
      try {
        const response = await getPostStatus(postId)
        if (isMounted() && response.success && response.data) {
          setPlatformStatuses(response.data.platforms || [])
          if (response.data.content_type) {
            setContentType(response.data.content_type as any)
          }
          setError(null)
        }
      } catch (err: any) {
        console.error("Error polling post status:", err)
        if (isMounted()) {
          setError(err?.message || "Failed to fetch post status")
        }
      } finally {
        if (isMounted()) {
          setIsLoading(false)
        }
      }
    }, intervalMs)

    return () => {
      clearInterval(pollInterval)
    }
  }, [postId, enabled, isFinished, intervalMs, isMounted])

  return {
    platformStatuses,
    contentType,
    error,
    isLoading,
    isFinished,
  }
}
