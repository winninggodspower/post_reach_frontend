"use client"

import { GoogleOAuthProvider } from "@react-oauth/google"
import type { ReactNode } from "react"

type GoogleAuthProviderProps = {
  children: ReactNode
}

export function GoogleAuthProvider({ children }: GoogleAuthProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  )
}
