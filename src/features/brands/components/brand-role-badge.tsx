import React from "react"
import { Crown, Eye, Shield, UserCheck } from "lucide-react"
import type { BrandRole } from "../types/members"

export const ROLE_BADGE_CONFIG: Record<
  BrandRole,
  { label: string; bg: string; text: string; border: string; icon: typeof Crown }
> = {
  owner: {
    label: "Owner",
    bg: "bg-purple-50/70",
    text: "text-purple-700",
    border: "border-purple-200/50",
    icon: Crown,
  },
  admin: {
    label: "Admin",
    bg: "bg-blue-50/70",
    text: "text-blue-700",
    border: "border-blue-200/50",
    icon: Shield,
  },
  editor: {
    label: "Editor",
    bg: "bg-emerald-50/70",
    text: "text-emerald-700",
    border: "border-emerald-200/50",
    icon: UserCheck,
  },
  viewer: {
    label: "Viewer",
    bg: "bg-slate-100/80",
    text: "text-slate-600",
    border: "border-slate-200/60",
    icon: Eye,
  },
}

type BrandRoleBadgeProps = {
  role: BrandRole
  size?: "sm" | "md"
  className?: string
}

export function BrandRoleBadge({
  role,
  size = "md",
  className = "",
}: BrandRoleBadgeProps) {
  const config = ROLE_BADGE_CONFIG[role] || ROLE_BADGE_CONFIG.viewer
  const Icon = config.icon

  const sizeStyles =
    size === "sm"
      ? "px-2 py-0.5 text-[10px] gap-1"
      : "px-2.5 py-1 text-xs gap-1.5"

  const iconSizes = size === "sm" ? "size-3" : "size-3.5"

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border ${config.bg} ${config.text} ${config.border} ${sizeStyles} ${className}`}
    >
      <Icon className={iconSizes} />
      <span>{config.label}</span>
    </span>
  )
}
