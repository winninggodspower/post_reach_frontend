"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { useAuth } from "@/features/auth/store/auth-store"
import {
  fetchBrandInvitations,
  fetchBrandMembers,
  removeBrandMember,
  resendBrandInvitation,
  revokeBrandInvitation,
  sendBrandInvitation,
  updateBrandMemberRole,
} from "../api/server"
import type {
  BrandInvitation,
  BrandInvitationRole,
  BrandMember,
  BrandRole,
  SendInvitationData,
} from "../types/members"

export function useBrandMembers(brandId?: string) {
  const user = useAuth((state) => state.user)

  const [members, setMembers] = useState<BrandMember[]>([])
  const [invitations, setInvitations] = useState<BrandInvitation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInviting, setIsInviting] = useState(false)
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    if (!brandId) return

    setIsLoading(true)
    try {
      const [membersData, invitationsData] = await Promise.all([
        fetchBrandMembers(brandId),
        fetchBrandInvitations(brandId).catch(() => []),
      ])
      setMembers(membersData)
      setInvitations(invitationsData)
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to load team members"
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [brandId])

  useEffect(() => {
    if (brandId) {
      void loadData()
    } else {
      setMembers([])
      setInvitations([])
    }
  }, [brandId, loadData])

  // Determine current user's role within this brand
  const currentUserRole: BrandRole | null = useMemo(() => {
    if (!user) return null

    // Check members list first
    const memberRecord = members.find((m) => m.user.id === user.id || m.user.email === user.email)
    if (memberRecord) return memberRecord.role

    // Check brands array in user profile
    const brandInList = user.brands?.find((b) => b.id === brandId)
    if (brandInList?.role) return brandInList.role as BrandRole

    // Fallback: If user has this brand as active and is superuser/creator
    return "admin"
  }, [user, members, brandId])

  const canManageMembers = useMemo(() => {
    return currentUserRole === "owner" || currentUserRole === "admin"
  }, [currentUserRole])

  const inviteMember = useCallback(
    async (payload: SendInvitationData): Promise<boolean> => {
      if (!brandId) return false
      setIsInviting(true)
      try {
        const newInvitation = await sendBrandInvitation(brandId, payload)
        toast.success(`Invitation sent to ${payload.email}`)
        setInvitations((prev) => [newInvitation, ...prev.filter((inv) => inv.id !== newInvitation.id)])
        return true
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Failed to send invitation"
        toast.error(msg)
        return false
      } finally {
        setIsInviting(false)
      }
    },
    [brandId],
  )

  const resendInvite = useCallback(
    async (invitationId: string): Promise<boolean> => {
      if (!brandId) return false
      setActionInProgressId(`resend-${invitationId}`)
      try {
        const updated = await resendBrandInvitation(brandId, invitationId)
        toast.success("Invitation resent successfully")
        setInvitations((prev) =>
          prev.map((inv) => (inv.id === invitationId ? updated : inv)),
        )
        return true
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Failed to resend invitation"
        toast.error(msg)
        return false
      } finally {
        setActionInProgressId(null)
      }
    },
    [brandId],
  )

  const revokeInvite = useCallback(
    async (invitationId: string): Promise<boolean> => {
      if (!brandId) return false
      setActionInProgressId(`revoke-${invitationId}`)
      try {
        await revokeBrandInvitation(brandId, invitationId)
        toast.success("Invitation revoked")
        setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId))
        return true
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Failed to revoke invitation"
        toast.error(msg)
        return false
      } finally {
        setActionInProgressId(null)
      }
    },
    [brandId],
  )

  const changeMemberRole = useCallback(
    async (memberId: string, role: BrandInvitationRole): Promise<boolean> => {
      if (!brandId) return false
      setActionInProgressId(`role-${memberId}`)
      try {
        const updated = await updateBrandMemberRole(brandId, memberId, role)
        toast.success("Member role updated")
        setMembers((prev) =>
          prev.map((m) => (m.id === memberId ? updated : m)),
        )
        return true
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Failed to update role"
        toast.error(msg)
        return false
      } finally {
        setActionInProgressId(null)
      }
    },
    [brandId],
  )

  const removeMember = useCallback(
    async (memberId: string): Promise<boolean> => {
      if (!brandId) return false
      setActionInProgressId(`remove-${memberId}`)
      try {
        await removeBrandMember(brandId, memberId)
        toast.success("Member removed from brand")
        setMembers((prev) => prev.filter((m) => m.id !== memberId))
        return true
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Failed to remove member"
        toast.error(msg)
        return false
      } finally {
        setActionInProgressId(null)
      }
    },
    [brandId],
  )

  return {
    members,
    invitations,
    isLoading,
    isInviting,
    actionInProgressId,
    currentUserRole,
    canManageMembers,
    loadData,
    inviteMember,
    resendInvite,
    revokeInvite,
    changeMemberRole,
    removeMember,
  }
}
