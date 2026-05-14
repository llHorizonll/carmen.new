import { Button, Stack, Text, Title } from '@mantine/core'
import { IconFileOff } from '@tabler/icons-react'
import { PremiumCard } from './PremiumCard'

type EmptyStateProps = {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <PremiumCard p="xl">
      <Stack align="center" gap="sm" ta="center">
        <IconFileOff size={28} opacity={0.7} />
        <Title order={3}>{title}</Title>
        <Text c="dimmed" maw={420}>
          {description}
        </Text>
        {actionLabel ? (
          <Button variant="light" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </Stack>
    </PremiumCard>
  )
}
