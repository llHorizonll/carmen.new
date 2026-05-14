import { ActionIcon, Badge, Button, Drawer, Group, ScrollArea, Stack, Text } from '@mantine/core'
import { IconCheck, IconCircle } from '@tabler/icons-react'
import { useMemo } from 'react'
import { useAppStore } from '../../stores/app.store'
import { useNotificationStore } from '../../stores/notification.store'
import { formatDateTime } from '../../lib/formatters'
import { PremiumCard } from '../ui/PremiumCard'

export function NotificationCenter() {
  const open = useAppStore((state) => state.notificationDrawerOpen)
  const setOpen = useAppStore((state) => state.setNotificationDrawerOpen)
  const items = useNotificationStore((state) => state.items)
  const markRead = useNotificationStore((state) => state.markRead)
  const markAllRead = useNotificationStore((state) => state.markAllRead)
  const connectionStatus = useNotificationStore((state) => state.connectionStatus)

  const grouped = useMemo(() => {
    const today = items.filter((item) => item.timestamp.startsWith(new Date().toISOString().slice(0, 10)))
    return {
      Today: today.length ? today : items.slice(0, 4),
      Earlier: items.slice(4),
    }
  }, [items])

  return (
    <Drawer opened={open} onClose={() => setOpen(false)} position="right" size="md" title="Realtime notifications" overlayProps={{ backgroundOpacity: 0.25, blur: 2 }}>
      <Stack gap="md" className="notification-center">
        <Group justify="space-between">
          <Badge variant="light" color={connectionStatus === 'live' ? 'teal' : connectionStatus === 'reconnecting' ? 'yellow' : 'red'}>
            {connectionStatus}
          </Badge>
          <Button variant="subtle" size="xs" leftSection={<IconCheck size={14} />} onClick={markAllRead}>
            Mark all read
          </Button>
        </Group>
        <ScrollArea h="calc(100vh - 180px)">
          <Stack gap="md">
            {Object.entries(grouped).map(([bucket, bucketItems]) => (
              <Stack key={bucket} gap="xs">
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  {bucket}
                </Text>
                {bucketItems.map((item) => (
                  <PremiumCard key={item.id} p="sm" className={item.read ? 'notification-read' : 'notification-unread'}>
                    <Group justify="space-between" align="flex-start">
                      <Stack gap={4} style={{ flex: 1 }}>
                        <Group gap={6}>
                          <IconCircle size={10} />
                          <Text fw={700}>{item.title}</Text>
                        </Group>
                        <Text size="sm" c="dimmed">
                          {item.message}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {formatDateTime(item.timestamp)}
                        </Text>
                      </Stack>
                      <ActionIcon variant="subtle" onClick={() => markRead(item.id)}>
                        <IconCheck size={14} />
                      </ActionIcon>
                    </Group>
                  </PremiumCard>
                ))}
              </Stack>
            ))}
          </Stack>
        </ScrollArea>
      </Stack>
    </Drawer>
  )
}
