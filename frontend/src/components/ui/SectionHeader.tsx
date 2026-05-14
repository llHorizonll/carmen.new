import { Group, Text } from '@mantine/core'
import type { ReactNode } from 'react'

type SectionHeaderProps = {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <Group justify="space-between" align="flex-start" wrap="wrap">
      <div>
        <Text fw={700}>{title}</Text>
        {subtitle ? (
          <Text size="sm" c="rgba(255,255,255,.76)" fw={500} lh={1.5}>
            {subtitle}
          </Text>
        ) : null}
      </div>
      {action}
    </Group>
  )
}
