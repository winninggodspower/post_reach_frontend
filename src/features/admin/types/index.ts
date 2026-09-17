export interface AdminUserGrowth {
  joined_today: number
  joined_this_week: number
  joined_this_month: number
}

export interface AdminUserRolesBreakdown {
  creator?: number
  business_owner?: number
  agency_owner?: number
  social_media_manager?: number
  unassigned?: number
  [key: string]: number | undefined
}

export interface AdminUsersMetrics {
  total_users: number
  active_users: number
  completed_onboarding: number
  pending_onboarding: number
  onboarding_completion_rate_percentage: number
  roles_breakdown: AdminUserRolesBreakdown
  growth: AdminUserGrowth
}

export interface AdminBrandsMetrics {
  total_brands: number
  brands_with_connected_accounts: number
  industries_breakdown: Record<string, number>
  team_sizes_breakdown: Record<string, number>
}

export interface AdminSocialAccountsMetrics {
  total_connected_accounts: number
  platforms_breakdown: {
    instagram?: number
    youtube?: number
    tiktok?: number
    facebook?: number
    linkedin?: number
    twitter?: number
    x?: number
    [key: string]: number | undefined
  }
}

export interface AdminPostsStatusBreakdown {
  posted: number
  scheduled: number
  pending: number
  uploading: number
  processing: number
  failed: number
  [key: string]: number
}

export interface AdminPostsContentTypesBreakdown {
  video: number
  photo: number
  text: number
  [key: string]: number
}

export interface AdminPostsActivity {
  posts_created_today: number
  posts_created_this_week: number
  posts_created_this_month: number
}

export interface AdminPostsMetrics {
  total_posts: number
  live_posts_count: number
  platform_posts_published: number
  status_breakdown: AdminPostsStatusBreakdown
  content_types_breakdown: AdminPostsContentTypesBreakdown
  published_by_platform: Record<string, number>
  activity: AdminPostsActivity
}

export interface AdminPendingUploads {
  total: number
  claimed: number
  unclaimed: number
}

export interface AdminStorageMetrics {
  total_media_items: number
  pending_uploads: AdminPendingUploads
}

export interface AdminAnalyticsSummary {
  total_users: number
  completed_onboarding: number
  onboarding_completion_rate_percentage: number
  total_connected_accounts: number
  live_posts_count: number
  total_posts: number
  failed_posts_count: number
}

export interface AdminAnalyticsData {
  summary?: AdminAnalyticsSummary
  users: AdminUsersMetrics
  brands: AdminBrandsMetrics
  social_accounts: AdminSocialAccountsMetrics
  posts: AdminPostsMetrics
  storage: AdminStorageMetrics
}

export interface AdminAnalyticsResponse {
  success: boolean
  message: string
  data: AdminAnalyticsData
}

export interface AdminAnalyticsSummaryResponse {
  success: boolean
  message: string
  data: AdminAnalyticsSummary
}
