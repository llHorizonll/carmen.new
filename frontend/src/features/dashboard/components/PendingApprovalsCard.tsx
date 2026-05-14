import { Group, Stack, Text } from '@mantine/core'
import { PremiumCard } from '../../../components/ui/PremiumCard'

export function PendingApprovalsCard({ count, details }: { count: number; details: string }) {
  return (
    <PremiumCard p="md">
      <Stack gap={8}>
        <Text size="xs" tt="uppercase" fw={700} c="dimmed">
          Pending approvals
        </Text>
        <Group justify="space-between" align="flex-end">
          <Text fw={700} size="xl">
            {count}
          </Text>
          <Text size="sm" c="dimmed">
            {details}
          </Text>
        </Group>
      </Stack>
    </PremiumCard>
  )
}
