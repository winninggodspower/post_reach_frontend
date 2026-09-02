import axios, { type AxiosProgressEvent } from "axios"
import { api } from "@/lib/api"
import { POSTS_ENDPOINTS } from "./endpoints"

type PresignedUploadFileDescriptor = {
  content_type: "video" | "photo"
  extension: string
}

type PresignedUploadResponseItem = {
  key: string
  url: string
}

type PresignedUploadResponse = {
  success: boolean
  data: PresignedUploadResponseItem[]
}

const getFileExtension = (file: File) => {
  const fileNameParts = file.name.split(".")
  const fileNameExtension = fileNameParts.length > 1 ? fileNameParts.pop() : ""
  const mimeExtension = file.type.includes("/") ? file.type.split("/").pop() : ""

  return (fileNameExtension || mimeExtension || "bin").toLowerCase()
}

const requestPresignedUrls = async (
  files: PresignedUploadFileDescriptor[]
): Promise<PresignedUploadResponseItem[]> => {
  const { data } = await api.post<PresignedUploadResponse>(POSTS_ENDPOINTS.presignedUrl, { files })

  if (!data.success || !Array.isArray(data.data) || data.data.length !== files.length) {
    throw new Error("The server returned an incomplete presigned upload response.")
  }

  return data.data
}

const uploadFilesToR2 = async (
  files: Array<{ file: File; contentType: "video" | "photo" }>,
  onProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  if (files.length === 0) {
    return [] as string[]
  }

  const presignedUrls = await requestPresignedUrls(
    files.map(({ file, contentType }) => ({
      content_type: contentType,
      extension: getFileExtension(file),
    }))
  )

  const totalBytes = files.reduce((sum, { file }) => sum + file.size, 0)
  let uploadedBytes = 0

  console.log(presignedUrls)
  for (let index = 0; index < files.length; index += 1) {
    const { file } = files[index]
    const presignedUpload = presignedUrls[index]

    if (!presignedUpload?.url || !presignedUpload.key) {
      throw new Error(`The server did not return a valid upload URL for file ${index + 1}.`)
    }

    const { url } = presignedUpload

    await axios.put(url, file, {
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      onUploadProgress: onProgress
        ? (event) => {
            const loadedForFile = event.loaded ?? 0
            const totalForFile = event.total ?? file.size ?? 1
            const cumulativeLoaded = Math.min(uploadedBytes + loadedForFile, totalBytes)
            const cumulativeTotal = totalBytes || totalForFile

            onProgress({
              ...event,
              loaded: cumulativeLoaded,
              total: cumulativeTotal,
            } as AxiosProgressEvent)
          }
        : undefined,
    })

    uploadedBytes += file.size

    if (onProgress) {
      onProgress({
        loaded: uploadedBytes,
        total: totalBytes,
      } as AxiosProgressEvent)
    }
  }

  return presignedUrls.map(({ key }) => key)
}

export type PublishVideoPayload = {
  video: File
  caption: string
  platforms: string[]
  platformSettings?: Record<string, unknown>
  scheduledAt?: string
  thumbnail?: File
  video_thumbnail_offset?: number
}

export type PlatformPostStatus = {
  id: number
  platform: string
  status: "pending" | "scheduled" | "uploading" | "processing" | "posted" | "failed"
  platform_post_id: string | null
  error_message: string | null
  post_url: string | null
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
  platformSettings?: Record<string, unknown>
  scheduledAt?: string
}

export const publishVideoPost = async (
  payload: PublishVideoPayload,
  onProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  const uploadKeys = await uploadFilesToR2(
    [
      { file: payload.video, contentType: "video" },
      ...(payload.thumbnail ? [{ file: payload.thumbnail, contentType: "photo" as const }] : []),
    ],
    onProgress
  )

  const body: Record<string, unknown> = {
    video_key: uploadKeys[0],
    caption: payload.caption,
    platforms: payload.platforms,
    platform_settings: payload.platformSettings ?? {},
  }

  if (uploadKeys[1]) {
    body.thumbnail_key = uploadKeys[1]
  }

  if (payload.scheduledAt) {
    body.scheduled_at = payload.scheduledAt
  }

  if (payload.video_thumbnail_offset !== undefined && payload.video_thumbnail_offset !== null) {
    body.video_thumbnail_offset = payload.video_thumbnail_offset
  }

  const { data } = await api.post(POSTS_ENDPOINTS.createVideo, body)

  return data
}

export const publishImagePost = async (
  payload: PublishImagePayload,
  onProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  const photoKeys = await uploadFilesToR2(
    payload.images.map((file) => ({ file, contentType: "photo" as const })),
    onProgress
  )

  const body: Record<string, unknown> = {
    photo_keys: photoKeys,
    caption: payload.caption,
    platforms: payload.platforms,
    platform_settings: payload.platformSettings ?? {},
  }

  if (payload.scheduledAt) {
    body.scheduled_at = payload.scheduledAt
  }

  const { data } = await api.post(POSTS_ENDPOINTS.createImage, body)

  return data
}

export type PublishTextPayload = {
  caption: string
  platforms: string[]
  platformSettings?: Record<string, unknown>
  scheduledAt?: string
}

export const publishTextPost = async (
  payload: PublishTextPayload,
  onProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  const body: Record<string, unknown> = {
    caption: payload.caption,
    platforms: payload.platforms,
    platform_settings: payload.platformSettings ?? {},
  }

  if (payload.scheduledAt) {
    body.scheduled_at = payload.scheduledAt
  }

  const { data } = await api.post(POSTS_ENDPOINTS.createText, body, {
    onUploadProgress: onProgress,
  })

  return data
}

export const getPostStatus = async (id: string): Promise<PostStatusResponse> => {
  const { data } = await api.get<PostStatusResponse>(`/content/posts/${id}/`)
  return data
}

export type CalendarItemPlatform = {
  id: number
  platform: string
  status: "scheduled" | "posted" | "failed" | "pending" | "uploading" | "processing"
  platform_post_id: string | null
  error_message: string | null
  post_url: string | null
  title: string
  caption: string
  created_at: string
  updated_at: string
}

export type CalendarItem = {
  id: string
  caption: string
  content_type: "video" | "photo" | "text"
  scheduled_at: string | null
  platforms: CalendarItemPlatform[]
  thumbnail_url?: string | null
  video_thumbnail_offset?: number | null
  media_urls?: string[] | null
  created_at: string
  updated_at: string
}

export type CalendarResponse = {
  success: boolean
  data: CalendarItem[]
}

export const getCalendarItems = async (
  startDate?: string,
  endDate?: string
): Promise<CalendarResponse> => {
  const params: Record<string, string> = {}
  if (startDate) params.start_date = startDate
  if (endDate) params.end_date = endDate

  const { data } = await api.get<CalendarResponse>(POSTS_ENDPOINTS.calendar, { params })
  return data
}

export const fetchPostById = async (id: string): Promise<{ success: boolean; data: CalendarItem }> => {
  const { data } = await api.get<{ success: boolean; data: CalendarItem }>(`/content/posts/${id}/`)
  return data
}

export const updateScheduledPost = async (
  id: string,
  payload: { caption: string; platforms: string[]; platformSettings?: Record<string, unknown>; scheduledAt?: string }
): Promise<{ success: boolean; data: unknown }> => {
  const body: Record<string, unknown> = {
    caption: payload.caption,
    platforms: payload.platforms,
    platform_settings: payload.platformSettings ?? {},
  }

  if (payload.scheduledAt) {
    body.scheduled_at = payload.scheduledAt
  }

  const { data } = await api.patch(`/content/posts/${id}/`, body)

  return data
}

export const deleteScheduledPost = async (id: string): Promise<{ success: boolean; data: unknown }> => {
  const { data } = await api.delete(`/content/posts/${id}/`)
  return data
}
