"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/features/auth/store/auth-store"
import {
  acceptReceivedInvitation,
  declineReceivedInvitation,
  fetchReceivedInvitations,
  setActiveBrand,
} from "../api/server"
import type { ReceivedBrandInvitation } from "../types/members"

export function useReceivedInvitations(status: string = "pending") {
  const router = useRouter()
  const user = useAuth((state) => state.user)
  const setUser = useAuth((state) => state.setUser)
  const loadUser = useAuth((state) => state.loadUser)

  const [invitations, setInvitations] = useState<ReceivedBrandInvitation[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [actionInProgress, setActionInProgress] = useState<{
    id: string
    action: "accept" | "decline"
  } | null>(null)

  const loadInvitations = useCallback(async () => {
    if (!user) {
      setInvitations([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const data = await fetchReceivedInvitations(status)
      setInvitations(data)
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to load invitations."
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [user, status])

  useEffect(() => {
    void loadInvitations()
  }, [loadInvitations])

  const pendingCount = useMemo(() => {
    return invitations.filter((inv) => inv.status === "pending").length
  }, [invitations])

  const acceptInvite = useCallback(
    async (
      invitation: ReceivedBrandInvitation,
      options?: { switchImmediately?: boolean }
    ) => {
      setActionInProgress({ id: invitation.id, action: "accept" })

      try {
        const response = await acceptReceivedInvitation(invitation.id)

        // Optimistically remove from pending list
        setInvitations((prev) => prev.filter((item) => item.id !== invitation.id))

        toast.success(
          `Joined ${invitation.brand_name} as ${invitation.role}!`
        )

        // If user wants to immediately switch or has no active brand
        if (options?.switchImmediately) {
          try {
            const updatedUser = await setActiveBrand(response.brand_id)
            if (updatedUser) {
              setUser(updatedUser)
            } else {
              await loadUser()
            }
            router.refresh()
          } catch {
            await loadUser()
          }
        } else {
          // Re-fetch user profile to sync brands list
          await loadUser()
        }

        return true
      } catch (error) {
        const msg =
          error instanceof Error
            ? error.message
            : "Failed to accept invitation."
        toast.error(msg)
        return false
      } finally {
        setActionInProgress(null)
      }
    },
    [loadUser, router, setUser]
  )

  const declineInvite = useCallback(
    async (invitation: ReceivedBrandInvitation) => {
      setActionInProgress({ id: invitation.id, action: "decline" })

      try {
        await declineReceivedInvitation(invitation.id)

        // Remove from list
        setInvitations((prev) => prev.filter((item) => item.id !== invitation.id))

        toast.success(`Declined invitation to join ${invitation.brand_name}.`)
        return true
      } catch (error) {
        const msg =
          error instanceof Error
            ? error.message
            : "Failed to decline invitation."
        toast.error(msg)
        return false
      } finally {
        setActionInProgress(null)
      }
    },
    []
  )

  return {
    invitations,
    isLoading,
    pendingCount,
    actionInProgress,
    loadInvitations,
    acceptInvite,
    declineInvite,
  }
}
