import { Group, Stack, Text } from '@mantine/core'
import { PremiumCard } from '../../../components/ui/PremiumCard'

export function PendingApprovalsCard({ count, details }: { count: number; details: string }) {
  return (
    <PremiumCard p="md">
      <Stack gap={8}>
        <Text className="ui-label" c="rgba(255,255,255,.82)" fw={700}>
          Pending approvals
        </Text>
        <Group justify="space-between" align="flex-end">
          <Text fw={700} size="xl">
            {count}
          </Text>
          <Text size="sm" c="rgba(255,255,255,.76)" fw={500}>
            {details}
          </Text>
        </Group>
      </Stack>
    </PremiumCard>
  )
}
