export interface PostPlatformMetric {
  platform: string
  status: "posted" | "pending" | "failed" | string
  platform_post_id: string | null
  post_url: string | null
  views: number
  reach: number
  likes: number
  comments: number
  shares: number
  saves: number
  clicks: number
  engagement_rate: number
  last_synced_at: string | null
}

export interface PostAnalyticsData {
  post_id: string
  brand_id: string
  caption: string
  content_type: "video" | "photo" | "text" | string
  scheduled_at: string | null
  created_at: string
  total_views: number
  total_reach: number
  total_likes: number
  total_comments: number
  total_shares: number
  total_saves: number
  total_clicks: number
  overall_engagement_rate: number
  platforms: PostPlatformMetric[]
}

export interface PostAnalyticsApiResponse {
  status: boolean
  message: string
  data: PostAnalyticsData
}
