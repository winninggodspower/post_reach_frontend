"use client"

import { useState } from "react"
import { Check, Loader2, Shield, UserCheck, Eye, Mail } from "lucide-react"
import { ModalShell } from "@/components/ui/modal-shell"
import { Button } from "@/components/ui/button"
import type { BrandInvitationRole, SendInvitationData } from "../types/members"

type InviteMemberModalProps = {
  isOpen: boolean
  onClose: () => void
  onInvite: (data: SendInvitationData) => Promise<boolean>
  isInviting: boolean
  brandName?: string
}

const ROLE_OPTIONS: {
  role: BrandInvitationRole
  title: string
  description: string
  icon: typeof Shield
  badgeColor: string
}[] = [
  {
    role: "editor",
    title: "Editor",
    description: "Can create, schedule, edit, and publish posts for this brand.",
    icon: UserCheck,
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    role: "admin",
    title: "Admin",
    description: "Can manage brand settings, invite members, and connect accounts.",
    icon: Shield,
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    role: "viewer",
    title: "Viewer",
    description: "Read-only access to view scheduled posts, calendar, and analytics.",
    icon: Eye,
    badgeColor: "bg-slate-50 text-slate-700 border-slate-200",
  },
]

export function InviteMemberModal({
  isOpen,
  onClose,
  onInvite,
  isInviting,
  brandName,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<BrandInvitationRole>("editor")
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setEmail("")
    setRole("editor")
    setError(null)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError("Please enter an email address.")
      return
    }

    // Basic email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.")
      return
    }

    const success = await onInvite({
      email: trimmedEmail,
      role,
    })

    if (success) {
      handleClose()
    }
  }

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Invite Team Member"
      maxWidthClass="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <p className="text-xs text-slate-500 mb-3">
            Invite a collaborator to {brandName ? <strong className="text-slate-800">{brandName}</strong> : "your brand"}. They will receive an invitation link via email.
          </p>

          <label htmlFor="invite-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError(null)
              }}
              placeholder="collaborator@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 text-sm outline-none transition focus:border-slate-950 focus:ring-1 focus:ring-slate-950 bg-white"
              autoFocus
              disabled={isInviting}
            />
          </div>
          {error && <p className="text-xs text-rose-600 mt-1.5 font-medium">{error}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Select Role
          </label>
          <div className="space-y-2">
            {ROLE_OPTIONS.map((item) => {
              const Icon = item.icon
              const isSelected = role === item.role

              return (
                <button
                  type="button"
                  key={item.role}
                  onClick={() => setRole(item.role)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition cursor-pointer ${
                    isSelected
                      ? "border-slate-950 bg-slate-50/70 shadow-xs"
                      : "border-black/8 hover:border-black/20 bg-white"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 border ${item.badgeColor}`}>
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">{item.title}</span>
                      {isSelected && <Check className="size-4 text-slate-950 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isInviting}
            className="rounded-xl cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isInviting || !email.trim()}
            className="rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-semibold cursor-pointer shadow-sm"
          >
            {isInviting && <Loader2 className="mr-1.5 size-4 animate-spin" />}
            Send Invitation
          </Button>
        </div>
      </form>
    </ModalShell>
  )
}
