import type { AccountChannel } from "../components/target-accounts-selector"
import type { ComposerFormValues } from "../types/composer"

export interface CaptionLimitError {
  platform: string
  channelId?: string
  channelName?: string
  currentLength: number
  maxLength: number
  isPremium?: boolean
  message: string
}

export interface CaptionValidationResult {
  isValid: boolean
  errors: CaptionLimitError[]
  firstErrorMessage?: string
}

/**
 * Returns the maximum caption character limit for a given social platform.
 * - Threads: 500 characters
 * - Twitter / X: 280 characters for standard accounts, 25,000 for X Premium / Pro
 * - Instagram: 2,200 characters
 * - TikTok: 2,200 characters
 * - LinkedIn: 3,000 characters
 * - YouTube: 5,000 characters
 */
export function getPlatformCaptionLimit(platform: string, isPremium: boolean = false): number {
  const p = platform.toLowerCase()
  if (p === "threads") {
    return 500
  }
  if (p === "twitter" || p === "x") {
    return isPremium ? 25000 : 280
  }
  if (p === "instagram" || p === "tiktok") {
    return 2200
  }
  if (p === "linkedin") {
    return 3000
  }
  if (p === "youtube") {
    return 5000
  }
  return 3000
}

/**
 * Resolves the effective caption for a specific platform.
 * Checks whether an explicit override is provided in the form values;
 * if empty or whitespace-only, it falls back to the main caption.
 */
export function getEffectivePlatformCaption(
  platform: string,
  values: Partial<ComposerFormValues>
): string {
  const p = platform.toLowerCase()
  const mainCaption = values.caption || ""

  let override = ""
  if (p === "threads") {
    override = values.threadsCaption || ""
  } else if (p === "twitter" || p === "x") {
    override = values.xCaption || ""
  } else if (p === "instagram") {
    override = values.instagramCaption || ""
  } else if (p === "facebook") {
    override = values.facebookCaption || ""
  } else if (p === "linkedin") {
    override = values.linkedinCaption || ""
  } else if (p === "tiktok") {
    override = values.tiktokCaption || ""
  } else if (p === "youtube") {
    override = values.youtubeCaption || ""
  }

  return override.trim() ? override.trim() : mainCaption
}

/**
 * Validates captions across all provided/selected channels before submitting to the backend.
 * Checks platform-specific limits and flags any captions that exceed them.
 */
export function validatePlatformCaptions({
  channels,
  values,
}: {
  channels: AccountChannel[]
  values: Partial<ComposerFormValues>
}): CaptionValidationResult {
  const errors: CaptionLimitError[] = []

  const activeChannels = channels.filter((c) => c.selected !== false)

  for (const channel of activeChannels) {
    const platform = channel.platform.toLowerCase()
    const isPremium = !!channel.is_premium
    const maxLength = getPlatformCaptionLimit(platform, isPremium)
    const effectiveCaption = getEffectivePlatformCaption(platform, values)
    const currentLength = effectiveCaption.length

    if (currentLength > maxLength) {
      let message = ""
      if (platform === "threads") {
        message = `Threads caption is limited to 500 characters. Current length: ${currentLength}.`
      } else if (platform === "twitter" || platform === "x") {
        const accountType = isPremium ? "Premium" : "standard"
        message = `Twitter / X post exceeds the ${maxLength.toLocaleString()} character limit for ${accountType} accounts. Current length: ${currentLength}.`
      } else if (platform === "instagram") {
        message = `Instagram caption is limited to 2,200 characters. Current length: ${currentLength}.`
      } else if (platform === "tiktok") {
        message = `TikTok caption is limited to 2,200 characters. Current length: ${currentLength}.`
      } else if (platform === "linkedin") {
        message = `LinkedIn post is limited to 3,000 characters. Current length: ${currentLength}.`
      } else {
        message = `${channel.name || platform} caption exceeds the ${maxLength.toLocaleString()} character limit. Current length: ${currentLength}.`
      }

      errors.push({
        platform,
        channelId: channel.id,
        channelName: channel.name,
        currentLength,
        maxLength,
        isPremium,
        message,
      })
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    firstErrorMessage: errors.length > 0 ? errors[0].message : undefined,
  }
}
