import { Badge, Stack, Text } from '@mantine/core'
import { PremiumCard } from '../../../components/ui/PremiumCard'
import { formatCurrency, formatDateTime } from '../../../lib/formatters'

export function RealtimeActivityFeed({
  items,
}: {
  items: Array<{ title: string; detail: string; amount: number; timestamp: string; type: string }>
}) {
  return (
    <PremiumCard p="md">
      <Stack gap="sm">
        <Text size="xs" tt="uppercase" fw={700} c="dimmed">
          Realtime hotel activity
        </Text>
        {items.map((item) => (
          <Stack key={`${item.title}-${item.timestamp}`} gap={2} className="activity-row">
            <Badge variant="light" color="gray" tt="none" w="fit-content">
              {item.type}
            </Badge>
            <Text fw={600}>{item.title}</Text>
            <Text size="sm" c="dimmed">
              {item.detail}
            </Text>
            <Text size="xs" c="dimmed">
              {formatDateTime(item.timestamp)} | {formatCurrency(item.amount)}
            </Text>
          </Stack>
        ))}
      </Stack>
    </PremiumCard>
  )
}
