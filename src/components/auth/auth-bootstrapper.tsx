"use client"

import { useEffect } from "react"

import { useAuth } from "@/store/auth-store"

export function AuthBootstrapper() {
  const bootstrap = useAuth((state) => state.bootstrap)

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  return null
}
