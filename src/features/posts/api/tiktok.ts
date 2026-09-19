import { api } from "@/lib/api"

export interface TikTokCreatorInfo {
  creator_avatar_url: string
  creator_nickname: string
  creator_username: string
  privacy_level_options: string[]
  comment_disabled: boolean
  duet_disabled: boolean
  stitch_disabled: boolean
  max_video_post_duration_sec?: number
}

interface TikTokCreatorInfoResponse {
  success: boolean
  data: TikTokCreatorInfo
}

let cachedCreatorInfo: TikTokCreatorInfo | null = null
let inFlightPromise: Promise<TikTokCreatorInfo | null> | null = null

export const invalidateTikTokCreatorInfo = () => {
  cachedCreatorInfo = null
  inFlightPromise = null
}

export const fetchTikTokCreatorInfo = async (
  forceRefresh = false
): Promise<TikTokCreatorInfo | null> => {
  if (!forceRefresh && cachedCreatorInfo) {
    return cachedCreatorInfo
  }
  if (!forceRefresh && inFlightPromise) {
    return inFlightPromise
  }

  inFlightPromise = (async () => {
    try {
      const response = await api.get<TikTokCreatorInfoResponse>(
        "/social_accounts/tiktok/creator-info/"
      )

      if (response.data?.success && response.data?.data) {
        cachedCreatorInfo = response.data.data
        return response.data.data
      }
      return null
    } catch (error) {
      console.warn("Failed to fetch TikTok creator info:", error)
      return null
    } finally {
      inFlightPromise = null
    }
  })()

  return inFlightPromise
}
