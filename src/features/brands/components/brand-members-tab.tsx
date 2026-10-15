"use client"

import { useState } from "react"
import {
  Clock,
  Crown,
  Eye,
  Loader2,
  Mail,
  MoreVertical,
  Plus,
  RefreshCw,
  Shield,
  Trash2,
  UserCheck,
  UserMinus,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModalShell } from "@/components/ui/modal-shell"
import { useAuth } from "@/features/auth/store/auth-store"
import { InviteMemberModal } from "./invite-member-modal"
import { useBrandMembers } from "../hooks/use-brand-members"
import type {
  BrandInvitation,
  BrandInvitationRole,
  BrandMember,
  BrandRole,
} from "../types/members"

type BrandMembersTabProps = {
  brandId?: string
  brandName?: string
  brandLogoUrl?: string | null
}

const ROLE_BADGE_CONFIG: Record<
  BrandRole,
  { label: string; bg: string; text: string; border: string; icon: typeof Crown }
> = {
  owner: {
    label: "Owner",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    icon: Crown,
  },
  admin: {
    label: "Admin",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: Shield,
  },
  editor: {
    label: "Editor",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: UserCheck,
  },
  viewer: {
    label: "Viewer",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    icon: Eye,
  },
}

export function BrandMembersTab({
  brandId,
  brandName = "Active Brand",
  brandLogoUrl,
}: BrandMembersTabProps) {
  const currentUser = useAuth((state) => state.user)

  const {
    members,
    invitations,
    isLoading,
    isInviting,
    actionInProgressId,
    currentUserRole,
    canManageMembers,
    inviteMember,
    resendInvite,
    revokeInvite,
    changeMemberRole,
    removeMember,
  } = useBrandMembers(brandId)

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<BrandMember | null>(null)
  const [invitationToRevoke, setInvitationToRevoke] = useState<BrandInvitation | null>(null)

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return dateString
    }
  }

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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Title and Invite Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-950">
            Team Members
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage collaborators and permission roles for {brandName ? <strong className="text-slate-800">{brandName}</strong> : "this brand"}.
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

      {/* Members Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Active Members
          </h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600">
            {members.length}
          </span>
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
        ) : members.length === 0 ? (
          <div className="rounded-2xl border border-black/5 bg-white p-8 text-center text-slate-400">
            <Users className="mx-auto size-8 text-slate-300 mb-2" />
            <p className="text-sm">No members found.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-black/8 bg-white overflow-hidden shadow-2xs divide-y divide-black/5">
            {members.map((member) => {
              const roleConfig = ROLE_BADGE_CONFIG[member.role] || ROLE_BADGE_CONFIG.viewer
              const RoleIcon = roleConfig.icon
              const isSelf = member.user.id === currentUser?.id || member.user.email === currentUser?.email
              const isOwner = member.role === "owner"
              const isOperating =
                actionInProgressId === `role-${member.id}` ||
                actionInProgressId === `remove-${member.id}`

              const validFirstName =
                member.user.first_name && member.user.first_name !== "string"
                  ? member.user.first_name
                  : ""
              const validLastName =
                member.user.last_name && member.user.last_name !== "string"
                  ? member.user.last_name
                  : ""
              const fullName =
                [validFirstName, validLastName].filter(Boolean).join(" ") ||
                member.user.email.split("@")[0]

              const initials = fullName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()

              return (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-slate-50/60 transition"
                >
                  {/* User info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    {member.user.profile_picture_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.user.profile_picture_url}
                        alt={fullName}
                        className="size-9 rounded-full object-cover border border-black/10 shrink-0"
                      />
                    ) : (
                      <div className="size-9 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 border border-black/10 shadow-xs">
                        {initials}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {fullName}
                        </span>
                        {isSelf && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            You
                          </span>
                        )}
                        {member.user.handle && member.user.handle !== "string" && (
                          <span className="text-xs text-slate-400 truncate">
                            @{member.user.handle}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {member.user.email}
                      </p>
                    </div>
                  </div>

                  {/* Role badge & actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-13 sm:pl-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${roleConfig.bg} ${roleConfig.text} ${roleConfig.border}`}
                      >
                        <RoleIcon className="size-3.5" />
                        {roleConfig.label}
                      </span>

                      <span className="text-[11px] text-slate-400 hidden md:inline">
                        Joined {formatDate(member.created_at)}
                      </span>
                    </div>

                    {/* Actions dropdown */}
                    {canManageMembers && !isOwner && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isOperating}
                            className="size-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                          >
                            {isOperating ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <MoreVertical className="size-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1.5">
                          <DropdownMenuLabel className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Change Role
                          </DropdownMenuLabel>
                          {(["admin", "editor", "viewer"] as BrandInvitationRole[]).map(
                            (r) => (
                              <DropdownMenuItem
                                key={r}
                                disabled={member.role === r}
                                onClick={() => void changeMemberRole(member.id, r)}
                                className={`text-xs capitalize font-medium cursor-pointer ${
                                  member.role === r ? "font-bold text-slate-900 bg-slate-50" : ""
                                }`}
                              >
                                {r}
                              </DropdownMenuItem>
                            ),
                          )}
                          <DropdownMenuSeparator className="my-1" />
                          <DropdownMenuItem
                            onClick={() => setMemberToRemove(member)}
                            className="text-xs font-semibold text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="size-3.5 mr-1.5" />
                            {isSelf ? "Leave Brand" : "Remove Member"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    {/* Non-admin leave button if self */}
                    {!canManageMembers && isSelf && !isOwner && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMemberToRemove(member)}
                        className="rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 cursor-pointer"
                      >
                        <UserMinus className="size-3.5 mr-1" />
                        Leave Brand
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pending Invitations Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Pending Invitations
          </h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600">
            {invitations.length}
          </span>
        </div>

        {invitations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/8 bg-slate-50/50 py-3.5 px-4 text-center flex items-center justify-center gap-2 text-slate-400">
            <Mail className="size-3.5 text-slate-400 shrink-0" />
            <p className="text-xs text-slate-500">
              No pending invitations. Invited collaborators will appear here.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-black/8 bg-white overflow-hidden shadow-2xs divide-y divide-black/5">
            {invitations.map((invite) => {
              const roleConfig = ROLE_BADGE_CONFIG[invite.role] || ROLE_BADGE_CONFIG.viewer
              const RoleIcon = roleConfig.icon
              const isResending = actionInProgressId === `resend-${invite.id}`
              const isRevoking = actionInProgressId === `revoke-${invite.id}`
              const isActioning = isResending || isRevoking
              const isExpired =
                invite.status === "expired" ||
                (invite.expires_at && new Date(invite.expires_at).getTime() < Date.now())

              return (
                <div
                  key={invite.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-slate-50/60 transition"
                >
                  {/* Recipient & Invited info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="size-9 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0 border border-black/5">
                      <Mail className="size-3.5 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {invite.email}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${roleConfig.bg} ${roleConfig.text} ${roleConfig.border}`}
                        >
                          <RoleIcon className="size-3" />
                          {roleConfig.label}
                        </span>
                        {isExpired && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200">
                            Expired
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        Invited by {invite.invited_by_name || invite.invited_by_email} • Expires {formatDate(invite.expires_at)}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Resend & Revoke */}
                  {canManageMembers && (
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isActioning}
                        onClick={() => void resendInvite(invite.id)}
                        className="rounded-xl text-xs font-semibold hover:bg-slate-100 cursor-pointer h-8 px-2.5 gap-1.5"
                      >
                        {isResending ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="size-3.5 text-slate-500" />
                        )}
                        <span>Resend</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isActioning}
                        onClick={() => setInvitationToRevoke(invite)}
                        className="rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 cursor-pointer h-8 px-2.5 gap-1.5"
                      >
                        {isRevoking ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                        <span>Revoke</span>
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Role Permissions Reference Helper */}
      <div className="rounded-2xl border border-black/6 bg-slate-50/60 p-4.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
          Role Permissions Overview
        </h4>
        <div className="grid gap-3 sm:grid-cols-3 text-xs text-slate-600">
          <div className="p-3 rounded-xl bg-white border border-black/5">
            <div className="flex items-center gap-1.5 font-bold text-blue-700 mb-1">
              <Shield className="size-3.5" />
              <span>Admin</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Full brand management, invite/remove members, update roles, and manage integrations.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-black/5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-700 mb-1">
              <UserCheck className="size-3.5" />
              <span>Editor</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Create, edit, schedule, and publish posts to all connected brand platforms.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-black/5">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
              <Eye className="size-3.5" />
              <span>Viewer</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Read-only visibility for scheduled calendar, published posts, and performance metrics.
            </p>
          </div>
        </div>
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
