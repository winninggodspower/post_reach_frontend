"use client"

import { useState } from "react"
import { Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModalShell } from "@/components/ui/modal-shell"
import { useAuth } from "@/features/auth/store/auth-store"
import { InviteMemberModal } from "./invite-member-modal"
import { BrandMemberRow } from "./brand-member-row"
import { BrandInvitationRow } from "./brand-invitation-row"
import { useBrandMembers } from "../hooks/use-brand-members"
import type {
  BrandInvitation,
  BrandMember,
} from "../types/members"

type BrandMembersTabProps = {
  brandId?: string
  brandName?: string
  brandLogoUrl?: string | null
}

export function BrandMembersTab({
  brandId,
  brandName = "Active Brand",
}: BrandMembersTabProps) {
  const currentUser = useAuth((state) => state.user)

  const {
    members,
    invitations,
    isLoading,
    isInviting,
    actionInProgressId,
    canManageMembers,
    inviteMember,
    changeMemberRole,
    removeMember,
    revokeInvite,
    resendInvite,
  } = useBrandMembers(brandId)

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<BrandMember | null>(null)
  const [invitationToRevoke, setInvitationToRevoke] =
    useState<BrandInvitation | null>(null)

  const handleConfirmRemoveMember = async () => {
    if (!memberToRemove) return
    const success = await removeMember(memberToRemove.id)
    if (success) {
      setMemberToRemove(null)
    }
  }

  const handleConfirmRevokeInvite = async () => {
    if (!invitationToRevoke) return
    const success = await revokeInvite(invitationToRevoke.id)
    if (success) {
      setInvitationToRevoke(null)
    }
  }

  if (!brandId) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center">
        <Users className="mx-auto size-10 text-slate-300 mb-3" />
        <h3 className="text-base font-semibold text-slate-800">No brand selected</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Please select or create an active brand to manage collaborators and team members.
        </p>
      </div>
    )
  }

  const totalCollaborators = members.length + invitations.length

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Title and Invite Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-950">
            Team Members
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage collaborators and permission roles for{" "}
            {brandName ? <strong className="text-slate-800">{brandName}</strong> : "this brand"}.
          </p>
        </div>

        {canManageMembers && (
          <Button
            onClick={() => setIsInviteModalOpen(true)}
            className="rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-semibold cursor-pointer shadow-xs gap-1.5 h-9.5 px-4 shrink-0"
          >
            <Plus className="size-4" />
            Invite Member
          </Button>
        )}
      </div>

      {/* Collaborators Section (Active Members + Pending Invitations) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Collaborators
          </h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600">
            {totalCollaborators}
          </span>
          {invitations.length > 0 && (
            <span className="text-[11px] text-slate-400">
              ({members.length} active, {invitations.length} pending)
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 w-full bg-slate-100/80 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : totalCollaborators === 0 ? (
          <div className="rounded-2xl border border-black/5 bg-white p-8 text-center text-slate-400">
            <Users className="mx-auto size-8 text-slate-300 mb-2" />
            <p className="text-sm">No members found.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-black/8 bg-white overflow-hidden shadow-2xs divide-y divide-black/5">
            {/* Active Members */}
            {members.map((member) => (
              <BrandMemberRow
                key={member.id}
                member={member}
                currentUserId={currentUser?.id}
                currentUserEmail={currentUser?.email}
                canManageMembers={canManageMembers}
                isOperating={
                  actionInProgressId === `role-${member.id}` ||
                  actionInProgressId === `remove-${member.id}`
                }
                onChangeRole={(role) => void changeMemberRole(member.id, role)}
                onRemove={() => setMemberToRemove(member)}
              />
            ))}

            {/* Pending Invitations */}
            {invitations.map((invite) => (
              <BrandInvitationRow
                key={invite.id}
                invite={invite}
                canManageMembers={canManageMembers}
                isResending={actionInProgressId === `resend-${invite.id}`}
                isRevoking={actionInProgressId === `revoke-${invite.id}`}
                onResend={() => void resendInvite(invite.id)}
                onRevoke={() => setInvitationToRevoke(invite)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={inviteMember}
        isInviting={isInviting}
        brandName={brandName}
      />

      {/* Remove Member Confirmation Modal */}
      {memberToRemove && (
        <ModalShell
          isOpen={true}
          onClose={() => setMemberToRemove(null)}
          title={
            memberToRemove.user.id === currentUser?.id ||
            memberToRemove.user.email === currentUser?.email
              ? "Leave Brand"
              : "Remove Team Member"
          }
          maxWidthClass="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Are you sure you want to remove{" "}
              <strong className="text-slate-900">
                {memberToRemove.user.first_name || memberToRemove.user.email}
              </strong>{" "}
              from <strong className="text-slate-900">{brandName}</strong>? They will
              immediately lose access to this brand&apos;s posts, calendar, and connected accounts.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                onClick={() => setMemberToRemove(null)}
                className="rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => void handleConfirmRemoveMember()}
                className="rounded-xl font-semibold cursor-pointer bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm & Remove
              </Button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Revoke Invitation Confirmation Modal */}
      {invitationToRevoke && (
        <ModalShell
          isOpen={true}
          onClose={() => setInvitationToRevoke(null)}
          title="Revoke Invitation"
          maxWidthClass="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Are you sure you want to revoke the pending invitation for{" "}
              <strong className="text-slate-900">{invitationToRevoke.email}</strong>? The
              link sent to them will be invalidated immediately.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                onClick={() => setInvitationToRevoke(null)}
                className="rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => void handleConfirmRevokeInvite()}
                className="rounded-xl font-semibold cursor-pointer bg-rose-600 hover:bg-rose-700 text-white"
              >
                Revoke Invitation
              </Button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  )
}
