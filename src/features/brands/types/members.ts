export type BrandRole = "owner" | "admin" | "editor" | "viewer"

export type BrandInvitationRole = "admin" | "editor" | "viewer"

export type BrandInvitationStatus = "pending" | "accepted" | "revoked" | "expired"

export type BrandMemberUser = {
  id: string
  email: string
  first_name: string
  last_name: string
  handle: string | null
  profile_picture_url: string | null
}

export type BrandMember = {
  id: string
  brand_id: string
  user: BrandMemberUser
  role: BrandRole
  created_at: string
  updated_at: string
}

export type BrandInvitation = {
  id: string
  brand_id: string
  email: string
  role: BrandRole
  status: BrandInvitationStatus
  invited_by_email: string
  invited_by_name: string
  expires_at: string
  created_at: string
}

export type SendInvitationData = {
  email: string
  role?: BrandInvitationRole
}

export type UpdateMemberRoleData = {
  role: BrandInvitationRole
}
