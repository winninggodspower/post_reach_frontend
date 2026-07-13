import { api } from "@/lib/api"
import { POSTS_ENDPOINTS } from "./endpoints"
import type { AxiosProgressEvent } from "axios"

export type PublishVideoPayload = {
  video: File
  caption: string
  platforms: string[]
  platformSettings?: Record<string, any>
}

export type PlatformPostStatus = {
  id: number
  platform: string
  status: "pending" | "uploading" | "posted" | "failed"
  platform_post_id: string | null
  error_message: string | null
  title: string
  caption: string
  created_at: string
  updated_at: string
}

export type PostStatusResponse = {
  success: boolean
  data: {
    id: string
    caption: string
    content_type: "video" | "photo"
    platforms: PlatformPostStatus[]
    created_at: string
    updated_at: string
  }
}

export type PublishImagePayload = {
  images: File[]
  caption: string
  platforms: string[]
  platformSettings?: Record<string, any>
}

export const publishVideoPost = async (
  payload: PublishVideoPayload,
  onProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
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
    onUploadProgress: onProgress,
  })

  return data
}

export const publishImagePost = async (
  payload: PublishImagePayload,
  onProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  const formData = new FormData()
  payload.images.forEach((img) => {
    formData.append("photos", img)
  })
  formData.append("caption", payload.caption)

  payload.platforms.forEach((platform) => {
    formData.append("platforms", platform)
  })

  if (payload.platformSettings) {
    formData.append("platform_settings", JSON.stringify(payload.platformSettings))
  }

  const { data } = await api.post(POSTS_ENDPOINTS.createImage, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: onProgress,
  })

  return data
}

export type PublishTextPayload = {
  caption: string
  platforms: string[]
  platformSettings?: Record<string, any>
}

export const publishTextPost = async (
  payload: PublishTextPayload,
  onProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  const formData = new FormData()
  formData.append("caption", payload.caption)

  payload.platforms.forEach((platform) => {
    formData.append("platforms", platform)
  })

  if (payload.platformSettings) {
    formData.append("platform_settings", JSON.stringify(payload.platformSettings))
  }

  const { data } = await api.post(POSTS_ENDPOINTS.createText, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: onProgress,
  })

  return data
}

export const getPostStatus = async (id: string): Promise<PostStatusResponse> => {
  const { data } = await api.get<PostStatusResponse>(`/content/posts/${id}/`)
  return data
}
