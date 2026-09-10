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

  if (values.customizePerPlatform) {
    if (hasPlatform("facebook") && values.facebookCaption) {
      platformSettings.facebook = { ...(platformSettings.facebook || {}), caption: values.facebookCaption }
    }
    if (hasPlatform("instagram") && values.instagramCaption) {
      platformSettings.instagram = { ...(platformSettings.instagram || {}), caption: values.instagramCaption }
    }
    if (hasPlatform("tiktok") && values.tiktokCaption) {
      platformSettings.tiktok = { ...(platformSettings.tiktok || {}), caption: values.tiktokCaption }
    }
    if (hasPlatform("linkedin") && values.linkedinCaption) {
      platformSettings.linkedin = { ...(platformSettings.linkedin || {}), caption: values.linkedinCaption }
    }
    if (hasPlatform("twitter") && values.xCaption) {
      platformSettings.twitter = { ...(platformSettings.twitter || {}), caption: values.xCaption }
    }
  }

  if (extraSettings.tiktok) {
    platformSettings.tiktok = {
      ...(platformSettings.tiktok || {}),
      ...extraSettings.tiktok,
    }
  }

  return Object.keys(platformSettings).length > 0 ? platformSettings : undefined
}
