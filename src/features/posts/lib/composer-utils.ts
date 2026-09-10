import type { ComposerFormValues } from "../types/composer"

interface BuildPlatformSettingsOptions {
  platforms: string[]
  values: Partial<ComposerFormValues>
  extraSettings?: {
    youtube?: { title?: string; description?: string }
    tiktok?: Record<string, unknown>
    [key: string]: unknown
  }
}

/**
 * Builds the platformSettings payload object sent to the server.
 * Maps per-platform custom captions and any platform-specific extras (e.g. TikTok, YouTube).
 */
export function buildPlatformSettings({
  platforms,
  values,
  extraSettings = {},
}: BuildPlatformSettingsOptions): Record<string, unknown> | undefined {
  const platformSettings: Record<string, any> = {}

  if (extraSettings.youtube) {
    platformSettings.youtube = extraSettings.youtube
  }

  const hasPlatform = (id: string) =>
    platforms.some((p) => {
      const lower = p.toLowerCase()
      if (id === "twitter" || id === "x") {
        return lower === "twitter" || lower === "x"
      }
      return lower === id.toLowerCase()
    })

  if (hasPlatform("facebook") && values.facebookCaption?.trim()) {
    platformSettings.facebook = { ...(platformSettings.facebook || {}), caption: values.facebookCaption.trim() }
  }
  if (hasPlatform("instagram") && values.instagramCaption?.trim()) {
    platformSettings.instagram = { ...(platformSettings.instagram || {}), caption: values.instagramCaption.trim() }
  }
  if (hasPlatform("tiktok") && values.tiktokCaption?.trim()) {
    platformSettings.tiktok = { ...(platformSettings.tiktok || {}), caption: values.tiktokCaption.trim() }
  }
  if (hasPlatform("linkedin") && values.linkedinCaption?.trim()) {
    platformSettings.linkedin = { ...(platformSettings.linkedin || {}), caption: values.linkedinCaption.trim() }
  }
  if (hasPlatform("twitter") && values.xCaption?.trim()) {
    platformSettings.twitter = { ...(platformSettings.twitter || {}), caption: values.xCaption.trim() }
  }

  if (extraSettings.tiktok) {
    platformSettings.tiktok = {
      ...(platformSettings.tiktok || {}),
      ...extraSettings.tiktok,
    }
  }

  return Object.keys(platformSettings).length > 0 ? platformSettings : undefined
}
