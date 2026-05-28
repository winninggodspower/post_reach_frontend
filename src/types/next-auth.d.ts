import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
    user: DefaultSession["user"] & {
      first_name?: string
      last_name?: string
      handle?: string
    }
  }

  interface User {
    first_name?: string
    last_name?: string
    handle?: string
    accessToken?: string
    refreshToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    user?: {
      id?: string
      email?: string | null
      name?: string | null
      first_name?: string
      last_name?: string
      handle?: string
    }
  }
}
