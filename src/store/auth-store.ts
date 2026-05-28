import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { AuthTokenPair } from "@/lib/auth/types"

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  setTokens: (tokens: AuthTokenPair) => void
  updateAccessToken: (accessToken: string) => void
  clearTokens: () => void
}

const storage = createJSONStorage(() => localStorage)

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),
      updateAccessToken: (accessToken) => set({ accessToken }),
      clearTokens: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: "postreach-auth",
      storage,
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
)
