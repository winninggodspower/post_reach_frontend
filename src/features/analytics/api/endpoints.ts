export const ANALYTICS_ENDPOINTS = {
  postAnalytics: (postId: string) => `/content/posts/${postId}/analytics/`,
  brandAnalytics: (brandId: string) => `/content/brands/${brandId}/analytics/`,
} as const
