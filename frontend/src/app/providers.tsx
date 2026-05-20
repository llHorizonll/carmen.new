import type { ReactNode } from 'react'
import { MantineProvider } from '@mantine/core'
import { QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { queryClient } from '../lib/queryClient'
import { fetchNotificationsForTenant, hydratePocketBaseSession } from '../lib/pocketbase'
import { theme } from '../styles/theme'
import { useAppStore } from '../stores/app.store'
import { useAuthStore } from '../features/auth/auth.store'
import { useNotificationStore } from '../stores/notification.store'
import { useTenantStore } from '../stores/tenant.store'
import { startMockRealtime } from '../lib/realtime'

function RealtimeBridge() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const activeTenantId = useAuthStore((state) => state.activeTenantId)
  const fiscalPeriod = useTenantStore((state) => state.fiscalPeriod)
  const pushNotification = useNotificationStore((state) => state.pushNotification)
  const seedNotifications = useNotificationStore((state) => state.seedNotifications)
  const setConnectionStatus = useNotificationStore((state) => state.setConnectionStatus)
  const setLastSyncAt = useNotificationStore((state) => state.setLastSyncAt)
  const lastEventKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !activeTenantId) {
      return undefined
    }

    const stop = startMockRealtime({
      onEvent(event) {
        const eventKey = `${event.type}:${event.title}:${event.message}:${event.timestamp}`
        if (lastEventKeyRef.current === eventKey) {
          return
        }

        lastEventKeyRef.current = eventKey
        pushNotification(event)
        setLastSyncAt(event.timestamp)
        void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      },
      onStatus(status) {
        setConnectionStatus(status)
      },
    })

    return () => stop()
  }, [activeTenantId, isAuthenticated, pushNotification, setConnectionStatus, setLastSyncAt])

  useEffect(() => {
    if (!isAuthenticated || !activeTenantId) {
      return undefined
    }

    let active = true
    void fetchNotificationsForTenant({ tenantId: activeTenantId, fiscalPeriod }).then((items) => {
      if (active) {
        seedNotifications(items)
      }
    })

    return () => {
      active = false
    }
  }, [activeTenantId, fiscalPeriod, isAuthenticated, seedNotifications])

  return null
}

function SessionBridge() {
  const session = useAuthStore((state) => state.session)

  useEffect(() => {
    hydratePocketBaseSession(session)
  }, [session])

  return null
}

export function AppProviders({ children }: { children: ReactNode }) {
  const colorScheme = useAppStore((state) => state.colorScheme)

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="dark" forceColorScheme={colorScheme}>
        <SessionBridge />
        <RealtimeBridge />
        {children}
      </MantineProvider>
    </QueryClientProvider>
  )
}
