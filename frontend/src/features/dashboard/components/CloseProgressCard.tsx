import { Progress, Stack, Text } from '@mantine/core'
import { PremiumCard } from '../../../components/ui/PremiumCard'
import { formatPercent } from '../../../lib/formatters'

export function CloseProgressCard({ value }: { value: number }) {
  return (
    <PremiumCard p="md">
      <Stack gap={8}>
        <Text size="xs" tt="uppercase" fw={700} c="dimmed">
          Month-end close progress
        </Text>
        <Text fw={700} size="xl">
          {formatPercent(value)}
        </Text>
        <Progress value={value * 100} size="sm" />
      </Stack>
    </PremiumCard>
  )
}
