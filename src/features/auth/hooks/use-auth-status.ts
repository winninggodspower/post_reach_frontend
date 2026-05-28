import { useAuth } from "@/features/auth/store/auth-store"

type AuthStatus = {
  isHydrated: boolean
  isLoadingUser: boolean
  isAuthenticated: boolean
}

export const useAuthStatus = (): AuthStatus => {
  const isHydrated = useAuth((state) => state.isHydrated)
  const isLoadingUser = useAuth((state) => state.isLoadingUser)
  const isAuthenticated = useAuth((state) => Boolean(state.accessToken))

  return {
    isHydrated,
    isLoadingUser,
    isAuthenticated,
  }
}
