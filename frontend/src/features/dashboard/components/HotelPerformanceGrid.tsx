import { Badge, Group, Progress, SimpleGrid, Stack, Text } from '@mantine/core'
import { PremiumCard } from '../../../components/ui/PremiumCard'
import { formatCurrency, formatPercent, formatNumber } from '../../../lib/formatters'

export function HotelPerformanceGrid({
  items,
}: {
  items: Array<{ property: string; revenue: number; margin: number; occupancy: number; exceptions: number; trend: 'up' | 'down' | 'flat' }>
}) {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm">
      {items.map((item) => (
        <PremiumCard key={item.property} p="md">
          <Stack gap={6}>
            <Group justify="space-between">
              <Text fw={700}>{item.property}</Text>
              <Badge variant="light" color={item.trend === 'up' ? 'teal' : item.trend === 'down' ? 'red' : 'gray'}>
                {item.trend}
              </Badge>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Revenue
              </Text>
              <Text fw={600}>{formatCurrency(item.revenue)}</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Occupancy
              </Text>
              <Text fw={600}>{formatPercent(item.occupancy)}</Text>
            </Group>
            <Progress value={item.occupancy * 100} size="sm" />
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Margin
              </Text>
              <Text fw={600}>{formatPercent(item.margin)}</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Exceptions
              </Text>
              <Text fw={600}>{formatNumber(item.exceptions)}</Text>
            </Group>
          </Stack>
        </PremiumCard>
      ))}
    </SimpleGrid>
  )
}
