"use client"

import { useState } from "react"
import {
  Check,
  Clock,
  Loader2,
  Mail,
  RefreshCw,
  User,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModalShell } from "@/components/ui/modal-shell"
import { BrandAvatar } from "@/features/brands/components/brand-avatar"
import { BrandRoleBadge } from "./brand-role-badge"
import { useReceivedInvitations } from "../hooks/use-received-invitations"
import type { ReceivedBrandInvitation } from "../types/members"

function formatExpiration(dateString: string): string {
  try {
    const target = new Date(dateString)
    const now = new Date()
    const diffMs = target.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays <= 0) {
      return "Expired"
    }
    if (diffDays === 1) {
      return "Expires today"
    }
    if (diffDays < 30) {
      return `Expires in ${diffDays} days`
    }
    return `Expires ${target.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`
  } catch {
    return "Valid invitation"
  }
}

export function ReceivedInvitationsTab() {
  const {
    invitations,
    isLoading,
    actionInProgress,
    loadInvitations,
    acceptInvite,
    declineInvite,
  } = useReceivedInvitations("pending")

  const [invitationToDecline, setInvitationToDecline] =
    useState<ReceivedBrandInvitation | null>(null)

  const handleConfirmDecline = async () => {
    if (!invitationToDecline) return
    const success = await declineInvite(invitationToDecline)
    if (success) {
      setInvitationToDecline(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Brand Invitations
          </h2>
          <p className="text-sm text-slate-500">
            Review and respond to invitations sent to your account by workspace owners.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void loadInvitations()}
          disabled={isLoading}
          className="h-9 w-fit cursor-pointer border-black/8 text-slate-600 hover:text-slate-900"
        >
          <RefreshCw
            className={`mr-1.5 size-3.5 ${isLoading ? "animate-spin" : ""}`}
          />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex animate-pulse items-center justify-between rounded-2xl border border-black/6 bg-white p-5 shadow-xs"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-slate-200" />
                  <div className="h-3 w-48 rounded bg-slate-100" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-20 rounded-xl bg-slate-100" />
                <div className="h-9 w-24 rounded-xl bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : invitations.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 bg-slate-50/50 py-16 px-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-xs border border-black/5 text-slate-400 mb-4">
            <Mail className="size-6 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            No pending brand invitations
          </h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
            When another team or workspace invites you to join, their invitation will show up here for you to accept.
          </p>
        </div>
      ) : (
        /* Invitations List */
        <div className="space-y-3">
          {invitations.map((inv) => {
            const isAccepting =
              actionInProgress?.id === inv.id &&
              actionInProgress.action === "accept"
            const isDeclining =
              actionInProgress?.id === inv.id &&
              actionInProgress.action === "decline"
            const isBusy = !!actionInProgress

            return (
              <div
                key={inv.id}
                className="flex flex-col gap-3 rounded-2xl border border-black/6 bg-white p-3.5 sm:px-4 sm:py-3 shadow-xs sm:flex-row sm:items-center sm:justify-between transition-all hover:border-black/10"
              >
                {/* Brand & Inviter Info */}
                <div className="flex items-center gap-3">
                  <BrandAvatar
                    name={inv.brand_name}
                    logoUrl={inv.brand_logo_url}
                    brandId={inv.brand_id}
                    className="size-9.5 shrink-0 rounded-xl shadow-xs"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {inv.brand_name}
                      </h3>
                      <BrandRoleBadge role={inv.role} size="sm" />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="size-3 text-slate-400" />
                        <span>
                          Invited by{" "}
                          <strong className="font-semibold text-slate-700">
                            {inv.invited_by_name || inv.invited_by_email}
                          </strong>
                        </span>
                      </span>

                      {inv.expires_at && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Clock className="size-3" />
                          <span>{formatExpiration(inv.expires_at)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 sm:self-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isBusy}
                    onClick={() => setInvitationToDecline(inv)}
                    className="h-8 px-2.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    {isDeclining ? (
                      <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                    ) : (
                      <X className="mr-1.5 size-3.5" />
                    )}
                    <span>Decline</span>
                  </Button>

                  <Button
                    size="sm"
                    disabled={isBusy}
                    onClick={() => void acceptInvite(inv, { switchImmediately: true })}
                    className="h-8 px-3.5 text-xs font-semibold bg-slate-950 text-white hover:bg-slate-800 shadow-xs cursor-pointer"
                  >
                    {isAccepting ? (
                      <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                    ) : (
                      <Check className="mr-1.5 size-3.5" />
                    )}
                    <span>Accept Invite</span>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Decline Confirmation Modal */}
      {invitationToDecline && (
        <ModalShell
          isOpen={true}
          onClose={() => setInvitationToDecline(null)}
          title="Decline Invitation"
          maxWidthClass="max-w-md"
          footerContent={
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInvitationToDecline(null)}
                disabled={actionInProgress?.id === invitationToDecline.id}
                className="cursor-pointer border-black/10"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => void handleConfirmDecline()}
                disabled={actionInProgress?.id === invitationToDecline.id}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer"
              >
                {actionInProgress?.id === invitationToDecline.id && (
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                )}
                Decline Invitation
              </Button>
            </div>
          }
        >
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Are you sure you want to decline the invitation to join{" "}
              <strong className="text-slate-900">
                {invitationToDecline.brand_name}
              </strong>
              ?
            </p>
            <p className="text-xs text-slate-500">
              If you decline, the inviter will need to send a new invitation if they want to invite you again.
            </p>
          </div>
        </ModalShell>
      )}
    </div>
  )
}
