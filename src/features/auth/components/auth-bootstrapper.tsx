"use client"

import { useEffect } from "react"

import { useAuth } from "@/features/auth/store/auth-store"

export function AuthBootstrapper() {
  const bootstrap = useAuth((state) => state.bootstrap)

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  return null
}
