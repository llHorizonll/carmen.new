import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ColorScheme = 'dark' | 'light'

type AppState = {
  colorScheme: ColorScheme
  sidebarCollapsed: boolean
  commandMenuOpen: boolean
  notificationDrawerOpen: boolean
  lastSyncAt: string | null
  toggleColorScheme: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setCommandMenuOpen: (open: boolean) => void
  setNotificationDrawerOpen: (open: boolean) => void
  setLastSyncAt: (timestamp: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      colorScheme: 'dark',
      sidebarCollapsed: false,
      commandMenuOpen: false,
      notificationDrawerOpen: false,
      lastSyncAt: null,
      toggleColorScheme: () =>
        set((state) => ({
          colorScheme: state.colorScheme === 'dark' ? 'light' : 'dark',
        })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setCommandMenuOpen: (open) => set({ commandMenuOpen: open }),
      setNotificationDrawerOpen: (open) => set({ notificationDrawerOpen: open }),
      setLastSyncAt: (timestamp) => set({ lastSyncAt: timestamp }),
    }),
    {
      name: 'carmen-app-ui',
      partialize: (state) => ({
        colorScheme: state.colorScheme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
)
