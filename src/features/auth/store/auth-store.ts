import axios from "axios"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import {
  authenticateLogin,
  fetchCurrentUser,
  googleSignIn,
  refreshAccessToken,
  registerAccount,
} from "@/features/auth/api/server"
import type { OnboardingPlatform } from "@/features/onboarding/types"
import type {
  AuthProfile,
  AuthTokenPair,
  LoginFormValues,
  RegisterFormValues,
} from "@/features/auth/types"

const BRAND_PLATFORM_KEY: Record<OnboardingPlatform, string> = {
  youtube: "is_youtube_connected",
  instagram: "is_instagram_connected",
  tiktok: "is_tiktok_connected",
  facebook: "is_facebook_connected",
  linkedin: "is_linkedin_connected",
  x: "is_x_connected",
}

type AuthState = {
  user: AuthProfile | null
  accessToken: string | null
  refreshToken: string | null
  isHydrated: boolean
  isLoadingUser: boolean
  setHydrated: (hydrated: boolean) => void
  setLoadingUser: (isLoadingUser: boolean) => void
  setUser: (user: AuthProfile | null) => void
  setTokens: (tokens: AuthTokenPair) => void
  setAuth: (auth: { user: AuthProfile; tokens: AuthTokenPair }) => void
  updateAccessToken: (accessToken: string) => void
  clearAuth: () => void
  setBrandConnection: (platform: OnboardingPlatform) => void
  login: (values: LoginFormValues) => Promise<AuthProfile>
  register: (values: RegisterFormValues) => Promise<AuthProfile>
  googleLogin: (payload: { authCode: string; redirectUri: string }) => Promise<AuthProfile>
  loadUser: () => Promise<AuthProfile | null>
  bootstrap: () => Promise<void>
  refreshSession: () => Promise<string | null>
  logout: () => void
}

const storage = createJSONStorage(() => localStorage)

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isHydrated: false,
      isLoadingUser: false,
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
      setLoadingUser: (isLoadingUser) => set({ isLoadingUser }),
      setUser: (user) => set({ user }),
      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),
      setAuth: ({ user, tokens }) =>
        set({
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        }),
      updateAccessToken: (accessToken) => set({ accessToken }),
      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        }),

      setBrandConnection: (platform) => {
        const currentUser = get().user
        if (!currentUser?.brand) return

        const key = BRAND_PLATFORM_KEY[platform]
        set({
          user: {
            ...currentUser,
            brand: {
              ...currentUser.brand,
              [key]: true,
            },
          },
        })
      },

      login: async (values) => {
        const result = await authenticateLogin(values)
        set({
          user: result.profile,
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
        })
        return result.profile
      },

      register: async (values) => {
        const result = await registerAccount(values)
        set({
          user: result.profile,
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
        })
        return result.profile
      },

      googleLogin: async ({ authCode, redirectUri }) => {
        const result = await googleSignIn({ authCode, redirectUri })
        set({
          user: result.profile,
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
        })
        return result.profile
      },

      loadUser: async () => {
        if (!get().accessToken) {
          return null
        }

        set({ isLoadingUser: true })

        try {
          const user = await fetchCurrentUser()
          console.log(user)
          set({ user })
          return user
        } catch (error) {
          if (axios.isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0)) {
            set({ user: null, accessToken: null, refreshToken: null })
          }

          return null
        } finally {
          set({ isLoadingUser: false })
        }
      },

      bootstrap: async () => {
        const state = get()

        if (!state.isHydrated || state.isLoadingUser || !state.accessToken) {
          return
        }

        await get().loadUser()
      },

      refreshSession: async () => {
        const state = get()

        if (!state.refreshToken) {
          set({ user: null, accessToken: null, refreshToken: null })
          return null
        }

        const newAccessToken = await refreshAccessToken(state.refreshToken)

        if (!newAccessToken) {
          set({ user: null, accessToken: null, refreshToken: null })
          return null
        }

        set({ accessToken: newAccessToken })
        return newAccessToken
      },

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null })
      },
    }),
    {
      name: "postreach-auth",
      storage,
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    },
  ),
)
