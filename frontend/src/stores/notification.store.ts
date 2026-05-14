import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ConnectionStatus, NotificationItem } from '../lib/mockData'

type NotificationStore = {
  items: NotificationItem[]
  connectionStatus: ConnectionStatus
  lastSyncAt: string | null
  pushNotification: (item: NotificationItem) => void
  seedNotifications: (items: NotificationItem[]) => void
  markRead: (id: string) => void
  markAllRead: () => void
  clear: () => void
  setConnectionStatus: (status: ConnectionStatus) => void
  setLastSyncAt: (timestamp: string) => void
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      items: [],
      connectionStatus: 'live',
      lastSyncAt: null,
      pushNotification: (item) =>
        set((state) => ({
          items: [item, ...state.items].slice(0, 50),
          lastSyncAt: item.timestamp,
        })),
      seedNotifications: (items) => set({ items }),
      markRead: (id) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, read: true } : item)),
        })),
      markAllRead: () =>
        set((state) => ({
          items: state.items.map((item) => ({ ...item, read: true })),
        })),
      clear: () => set({ items: [] }),
      setConnectionStatus: (status) => set({ connectionStatus: status }),
      setLastSyncAt: (timestamp) => set({ lastSyncAt: timestamp }),
    }),
    {
      name: 'carmen-notifications',
      partialize: (state) => ({
        items: state.items,
        lastSyncAt: state.lastSyncAt,
      }),
    },
  ),
)
