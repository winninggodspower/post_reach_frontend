export interface ComposerFormValues {
  title: string
  caption: string
  isScheduled: boolean
  scheduleDate: string
  scheduleTime: string
  customizePerPlatform: boolean
  youtubeTitle?: string
  youtubeCaption?: string
  tiktokCaption?: string
  instagramCaption?: string
  facebookCaption?: string
  linkedinCaption?: string
  xCaption?: string
  tiktokPrivacyLevel?: "PUBLIC_TO_EVERYONE" | "MUTUAL_FRIENDS" | "SELF_ONLY"
  tiktokAllowComments?: boolean
  tiktokAllowDuet?: boolean
  tiktokAllowStitch?: boolean
  tiktokBrandContentToggle?: boolean
  tiktokBrandOrganicToggle?: boolean
  coverImageTimestamp?: number
}

export type VideoPostFormValues = ComposerFormValues
export type ImagePostFormValues = ComposerFormValues
export type TextPostFormValues = ComposerFormValues
