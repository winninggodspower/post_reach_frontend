export interface ApiResponse<T> {
  status: "success" | "error"
  message: string
  data: T
  errors?: Record<string, any>
}

export interface OAuthScope {
  scope: string
  name: string
  description: string
}

export type ClientType = "confidential" | "public"

export interface DeveloperApplication {
  id: number
  name: string
  client_id: string
  client_secret?: string | null
  client_type: ClientType
  authorization_grant_type: string
  redirect_uris: string
  redirect_uris_list: string[]
  allowed_origins: string
  allowed_origins_list: string[]
  post_logout_redirect_uris?: string
  post_logout_redirect_uris_list?: string[]
  algorithm?: string
  created: string
  updated: string
  active_users_count: number
}

export interface CreateApplicationPayload {
  name: string
  client_type: ClientType
  redirect_uris: string | string[]
  allowed_origins?: string | string[]
}

export interface UpdateApplicationPayload {
  name?: string
  redirect_uris?: string | string[]
  allowed_origins?: string | string[]
}

export interface RegenerateSecretResponse {
  client_id: string
  client_secret: string
  message: string
}

