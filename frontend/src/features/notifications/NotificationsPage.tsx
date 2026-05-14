import { Badge, Group, Stack, Text } from '@mantine/core'
import { PageHeader } from '../../components/ui/PageHeader'
import { PremiumCard } from '../../components/ui/PremiumCard'
import { useNotificationStore } from '../../stores/notification.store'
import { formatDateTime } from '../../lib/formatters'
import { LiveIndicator } from '../../components/ui/LiveIndicator'
import { EmptyState } from '../../components/ui/EmptyState'

export function NotificationsPage() {
  const items = useNotificationStore((state) => state.items)
  const markRead = useNotificationStore((state) => state.markRead)
  const connectionStatus = useNotificationStore((state) => state.connectionStatus)
  const lastSyncAt = useNotificationStore((state) => state.lastSyncAt)
  const unreadCount = items.filter((item) => !item.read).length

  return (
    <Stack gap="md">
      <PageHeader
        badge={<Badge variant="light" color="teal">Notifications</Badge>}
        title="Realtime Notifications"
        subtitle="Grouped notification center with read/unread state and live status."
        actions={<LiveIndicator status={connectionStatus} label={lastSyncAt ? `Synced ${formatDateTime(lastSyncAt)}` : 'Waiting for events'} />}
      />
      <Group justify="space-between" align="center">
        <Text size="sm" c="dimmed">
          {unreadCount} unread
        </Text>
        <Text size="sm" c="dimmed">
          {items.length} total
        </Text>
      </Group>
      {items.length ? (
        <Stack gap="sm">
          {items.map((item) => (
            <PremiumCard key={item.id} p="md" className={item.read ? 'notification-read' : 'notification-unread'}>
              <Group justify="space-between" align="flex-start">
                <Stack gap={4}>
                  <Badge variant="light" color={item.read ? 'gray' : 'teal'}>{item.type}</Badge>
                  <Text fw={700}>{item.title}</Text>
                  <Text size="sm" c="dimmed">{item.message}</Text>
                  <Text size="xs" c="dimmed">{formatDateTime(item.timestamp)}</Text>
                </Stack>
                <Badge variant="light" component="button" onClick={() => markRead(item.id)}>
                  {item.read ? 'Read' : 'Unread'}
                </Badge>
              </Group>
            </PremiumCard>
          ))}
        </Stack>
      ) : (
        <EmptyState
          title="No notifications yet"
          description="Realtime events will appear here once the websocket stream starts delivering notifications."
        />
      )}
    </Stack>
  )
}
