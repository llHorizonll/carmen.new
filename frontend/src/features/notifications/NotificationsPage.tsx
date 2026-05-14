import { Badge, Group, Stack, Text } from '@mantine/core'
import { PageHeader } from '../../components/ui/PageHeader'
import { PremiumCard } from '../../components/ui/PremiumCard'
import { useNotificationStore } from '../../stores/notification.store'
import { formatDateTime } from '../../lib/formatters'

export function NotificationsPage() {
  const items = useNotificationStore((state) => state.items)
  const markRead = useNotificationStore((state) => state.markRead)

  return (
    <Stack gap="md">
      <PageHeader badge={<Badge variant="light" color="teal">Notifications</Badge>} title="Realtime Notifications" subtitle="Grouped notification center with read/unread state and live status." />
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
              <Badge variant="light" onClick={() => markRead(item.id)}>{item.read ? 'Read' : 'Unread'}</Badge>
            </Group>
          </PremiumCard>
        ))}
      </Stack>
    </Stack>
  )
}
