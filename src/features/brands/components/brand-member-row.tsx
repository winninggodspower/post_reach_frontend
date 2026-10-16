"use client"

import { Loader2, MoreVertical, Trash2, UserMinus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BrandRoleBadge } from "./brand-role-badge"
import type {
  BrandInvitationRole,
  BrandMember,
} from "../types/members"

type BrandMemberRowProps = {
  member: BrandMember
  currentUserId?: string
  currentUserEmail?: string
  canManageMembers: boolean
  isOperating: boolean
  onChangeRole: (role: BrandInvitationRole) => void
  onRemove: () => void
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

export function BrandMemberRow({
  member,
  currentUserId,
  currentUserEmail,
  canManageMembers,
  isOperating,
  onChangeRole,
  onRemove,
}: BrandMemberRowProps) {
  const isSelf =
    member.user.id === currentUserId ||
    member.user.email === currentUserEmail
  const isOwner = member.role === "owner"

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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-slate-50/60 transition">
      {/* User Info */}
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

      {/* Role Badge & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-13 sm:pl-0">
        <div className="flex items-center gap-2">
          <BrandRoleBadge role={member.role} />

          <span className="text-[11px] text-slate-400 hidden md:inline">
            Joined {formatDate(member.created_at)}
          </span>
        </div>

        {/* Actions Dropdown for Admins/Owners */}
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
                    onClick={() => onChangeRole(r)}
                    className={`text-xs capitalize font-medium cursor-pointer ${
                      member.role === r
                        ? "font-bold text-slate-900 bg-slate-50"
                        : ""
                    }`}
                  >
                    {r}
                  </DropdownMenuItem>
                ),
              )}
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                onClick={onRemove}
                className="text-xs font-semibold text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer"
              >
                <Trash2 className="size-3.5 mr-1.5" />
                {isSelf ? "Leave Brand" : "Remove Member"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Non-admin Leave Button if Self */}
        {!canManageMembers && isSelf && !isOwner && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 cursor-pointer"
          >
            <UserMinus className="size-3.5 mr-1" />
            Leave Brand
          </Button>
        )}
      </div>
    </div>
  )
}
