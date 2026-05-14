import { Box, Group, Stack, Text, Title } from '@mantine/core'
import type { ReactNode } from 'react'
import { PremiumCard } from './PremiumCard'

type PageHeaderProps = {
  title: string
  subtitle: string
  badge?: ReactNode
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, badge, actions }: PageHeaderProps) {
  return (
    <PremiumCard p="lg" className="page-header">
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <Stack gap={6}>
          {badge ? <Box>{badge}</Box> : null}
          <Title order={1} className="page-title">
            {title}
          </Title>
          <Text c="dimmed" maw={860}>
            {subtitle}
          </Text>
        </Stack>
        {actions ? <Group gap="sm">{actions}</Group> : null}
      </Group>
    </PremiumCard>
  )
}
