import { Progress, Stack, Text } from '@mantine/core'
import { PremiumCard } from '../../../components/ui/PremiumCard'
import { formatPercent } from '../../../lib/formatters'

export function CloseProgressCard({ value }: { value: number }) {
  return (
    <PremiumCard p="md">
      <Stack gap={8}>
        <Text className="ui-label" c="rgba(255,255,255,.82)" fw={700}>
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
