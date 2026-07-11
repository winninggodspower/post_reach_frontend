import { api } from "@/lib/api"
import { POSTS_ENDPOINTS } from "./endpoints"

export type PublishVideoPayload = {
  video: File
  caption: string
  platforms: string[]
  platformSettings?: Record<string, any>
}

export const publishVideoPost = async (payload: PublishVideoPayload) => {
  const formData = new FormData()
  formData.append("video", payload.video)
  formData.append("caption", payload.caption)
  
  payload.platforms.forEach((platform) => {
    formData.append("platforms", platform)
  })

  if (payload.platformSettings) {
    formData.append("platform_settings", JSON.stringify(payload.platformSettings))
  }

  const { data } = await api.post(POSTS_ENDPOINTS.createVideo, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return data
}
