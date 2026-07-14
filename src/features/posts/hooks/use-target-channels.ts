import { useState } from "react"
import { toast } from "sonner"
import type { AccountChannel } from "../components/target-accounts-selector"
import { PLAIN_AVATAR } from "@/features/onboarding/components/steps/shared"

type ConnectedAccount = {
  external_id: string
  platform: string
  account_name: string
  profile_picture_url?: string | null
  is_expired?: boolean
}

export function useTargetChannels(connectedAccounts: ConnectedAccount[] | undefined, allowedPlatforms: string[]) {
  const [channels, setChannels] = useState<AccountChannel[]>(() => {
    if (connectedAccounts && connectedAccounts.length > 0) {
      let firstActiveSelected = false
      return connectedAccounts
        .filter((conn) => allowedPlatforms.includes(conn.platform.toLowerCase()))
        .map((conn) => {
          const isExpired = !!conn.is_expired
          let shouldSelect = false
          if (!isExpired && !firstActiveSelected) {
            shouldSelect = true
            firstActiveSelected = true
          }
          return {
            id: conn.external_id,
            platform: conn.platform.toLowerCase(),
            name: conn.account_name,
            handle: `@${conn.account_name.toLowerCase().replace(/\s+/g, "")}`,
            avatar: conn.profile_picture_url || PLAIN_AVATAR,
            selected: shouldSelect,
            expired: isExpired,
          }
        })
    }
    return []
  })

  const toggleChannel = (id: string) => {
    const channel = channels.find((c) => c.id === id)
    if (channel?.expired) {
      toast.error("Account connection expired", {
        description: `Please reconnect your ${channel.name} account in Connections settings.`,
      })
      return
    }

    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    )
  }

  const selectedChannels = channels.filter((c) => c.selected)

  return {
    channels,
    toggleChannel,
    selectedChannels,
  }
}
