"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { toast } from "sonner"
import type { UseFormSetValue } from "react-hook-form"
import { fetchPostById } from "../api/server"
import type { AccountChannel } from "../components/target-accounts-selector"
import type { ComposerFormValues } from "../types/composer"
import { useIsMounted } from "@/shared/hooks/use-is-mounted"

interface UsePostHydrationOptions {
  postId?: string
  setValue: UseFormSetValue<ComposerFormValues | any>
  setChannels: React.Dispatch<React.SetStateAction<AccountChannel[]>>
  onMediaLoaded?: (data: { mediaUrls?: string[] | null; thumbnailUrl?: string | null }) => void
  onError?: (err: unknown) => void
}

export function usePostHydration({
  postId,
  setValue,
  setChannels,
  onMediaLoaded,
  onError,
}: UsePostHydrationOptions) {
  const [isFetching, setIsFetching] = React.useState(!!postId)
  const isMounted = useIsMounted()

  // Keep callback refs stable to prevent re-fetch infinite loops on parent re-renders
  const onMediaLoadedRef = React.useRef(onMediaLoaded)
  onMediaLoadedRef.current = onMediaLoaded

  const onErrorRef = React.useRef(onError)
  onErrorRef.current = onError

  React.useEffect(() => {
    if (!postId) return

    setIsFetching(true)

    fetchPostById(postId)
      .then((res) => {
        if (!isMounted()) return
        if (!res.success || !res.data) throw new Error("Failed to load post")
        const data = res.data

        setValue("caption", data.caption || "")

        const ytTitle = data.platforms.find((p) => p.platform.toLowerCase() === "youtube")?.title
        if (ytTitle) {
          setValue("title", ytTitle)
        }

        if (data.scheduled_at) {
          setValue("isScheduled", true)
          const d = parseISO(data.scheduled_at)
          setValue("scheduleDate", format(d, "yyyy-MM-dd"))
          setValue("scheduleTime", format(d, "HH:mm"))
        }

        // Hydrate connected channels selection
        setChannels((prev) =>
          prev.map((c) => ({
            ...c,
            selected: data.platforms.some(
              (p) =>
                p.platform.toLowerCase() === c.platform.toLowerCase() ||
                (p.platform.toLowerCase() === "twitter" && c.platform.toLowerCase() === "x")
            ),
          }))
        )

        // Hydrate platform specific custom captions
        data.platforms.forEach((p) => {
          if (p.caption && p.caption !== data.caption) {
            const plat = p.platform.toLowerCase()
            if (plat === "youtube") setValue("youtubeCaption", p.caption)
            if (plat === "tiktok") setValue("tiktokCaption", p.caption)
            if (plat === "instagram") setValue("instagramCaption", p.caption)
            if (plat === "facebook") setValue("facebookCaption", p.caption)
            if (plat === "linkedin") setValue("linkedinCaption", p.caption)
            if (plat === "twitter" || plat === "x") setValue("xCaption", p.caption)
          }
        })

        onMediaLoadedRef.current?.({
          mediaUrls: data.media_urls,
          thumbnailUrl: data.thumbnail_url,
        })
      })
      .catch((err) => {
        if (!isMounted()) return
        if (onErrorRef.current) {
          onErrorRef.current(err)
        } else {
          toast.error("Failed to load post data")
        }
      })
      .finally(() => {
        if (isMounted()) {
          setIsFetching(false)
        }
      })
  }, [postId, setValue, setChannels, isMounted])

  return { isFetching }
}
