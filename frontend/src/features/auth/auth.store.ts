import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockLogin } from '../../lib/pocketbase'
import { useTenantStore } from '../../stores/tenant.store'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: string
}

export type AuthSession = {
  token: string
  user: AuthUser
}

type AuthState = {
  isAuthenticated: boolean
  session: AuthSession | null
  activeTenantId: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setActiveTenant: (tenantId: string | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      session: null,
      activeTenantId: null,
      login: async (email, password) => {
        const result = await mockLogin(email, password)
        set({
          isAuthenticated: true,
          session: {
            token: result.token,
            user: result.user,
          },
        })

        const recent = useTenantStore.getState().selectedTenantId ?? result.tenants[0]?.id ?? null
        if (recent) {
          useTenantStore.getState().pushRecentTenant(recent)
        }
      },
      logout: () =>
        set({
          isAuthenticated: false,
          session: null,
          activeTenantId: null,
        }),
      setActiveTenant: (tenantId) => {
        set({ activeTenantId: tenantId })
        if (tenantId) {
          useTenantStore.getState().setTenant(tenantId)
        }
      },
    }),
    {
      name: 'carmen-auth-session',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        session: state.session,
        activeTenantId: state.activeTenantId,
      }),
    },
  ),
)
