"use client"

import { Clock, Loader2, Mail, RefreshCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandRoleBadge } from "./brand-role-badge"
import type { BrandInvitation } from "../types/members"

type BrandInvitationRowProps = {
  invite: BrandInvitation
  canManageMembers: boolean
  isResending: boolean
  isRevoking: boolean
  onResend: () => void
  onRevoke: () => void
}

function formatDate(dateString: string): string {
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

export function BrandInvitationRow({
  invite,
  canManageMembers,
  isResending,
  isRevoking,
  onResend,
  onRevoke,
}: BrandInvitationRowProps) {
  const isActioning = isResending || isRevoking
  const isExpired =
    invite.status === "expired" ||
    (invite.expires_at && new Date(invite.expires_at).getTime() < Date.now())

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-slate-50/60 transition">
      {/* Recipient & Invited Info */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="size-9 rounded-full bg-slate-100 text-slate-500 text-xs font-medium flex items-center justify-center shrink-0 border border-black/5">
          <Mail className="size-3.5 text-slate-400" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-slate-900 truncate">
              {invite.email}
            </span>
            <BrandRoleBadge role={invite.role} size="sm" />
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-black/5">
              <Clock className="size-2.5 text-slate-400" />
              Pending
            </span>
            {isExpired && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60">
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
            onClick={onResend}
            className="rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-black/8 cursor-pointer h-8 px-2.5 gap-1.5"
          >
            {isResending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RefreshCw className="size-3.5 text-slate-400" />
            )}
            <span>Resend</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={isActioning}
            onClick={onRevoke}
            className="rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50/60 hover:border-rose-200 border-black/8 cursor-pointer h-8 px-2.5 gap-1.5 transition-colors"
          >
            {isRevoking ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5 text-slate-400 group-hover:text-rose-500" />
            )}
            <span>Revoke</span>
          </Button>
        </div>
      )}
    </div>
  )
}
