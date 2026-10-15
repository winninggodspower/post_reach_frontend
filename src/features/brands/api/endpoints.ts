export const BRANDS_ENDPOINTS = {
  list: "/auth/brands/",
  create: "/auth/brands/",
  setActive: "/auth/me/active-brand/",
  invitations: (brandId: string) => `/auth/brands/${brandId}/invitations/`,
  invitationDetail: (brandId: string, invitationId: string) =>
    `/auth/brands/${brandId}/invitations/${invitationId}/`,
  resendInvitation: (brandId: string, invitationId: string) =>
    `/auth/brands/${brandId}/invitations/${invitationId}/resend/`,
  members: (brandId: string) => `/auth/brands/${brandId}/members/`,
  memberDetail: (brandId: string, memberId: string) =>
    `/auth/brands/${brandId}/members/${memberId}/`,
} as const
