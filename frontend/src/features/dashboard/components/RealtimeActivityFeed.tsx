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
        <Text className="ui-label" c="rgba(255,255,255,.82)" fw={700}>
          Realtime hotel activity
        </Text>
        {items.map((item) => (
          <Stack key={`${item.title}-${item.timestamp}`} gap={2} className="activity-row">
            <Badge variant="light" color="gray" tt="none" w="fit-content">
              {item.type}
            </Badge>
            <Text fw={600}>{item.title}</Text>
            <Text size="sm" c="rgba(255,255,255,.76)" fw={500}>
              {item.detail}
            </Text>
            <Text size="xs" c="rgba(255,255,255,.72)" fw={500}>
              {formatDateTime(item.timestamp)} | {formatCurrency(item.amount)}
            </Text>
          </Stack>
        ))}
      </Stack>
    </PremiumCard>
  )
}
