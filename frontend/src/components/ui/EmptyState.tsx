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
    <PremiumCard p="md">
      <Stack align="center" gap={6} ta="center">
        <IconFileOff size={24} opacity={0.7} />
        <Title order={4}>{title}</Title>
        <Text c="dimmed" maw={420} size="sm">
          {description}
        </Text>
        {actionLabel ? (
          <Button variant="light" size="xs" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </Stack>
    </PremiumCard>
  )
}
