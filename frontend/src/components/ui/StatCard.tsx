import { Box, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react'
import { PremiumCard } from './PremiumCard'
import { AmountText } from './AmountText'

type StatCardProps = {
  label: string
  value: string
  delta: string
  trend?: 'up' | 'down' | 'flat'
  hint?: string
}

export function StatCard({ label, value, delta, trend = 'flat', hint }: StatCardProps) {
  return (
    <PremiumCard className="stat-card" p="md">
      <Stack gap={8}>
        <Group justify="space-between" align="flex-start">
          <Box>
            <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
              {label}
            </Text>
            {hint ? (
              <Text size="xs" c="dimmed" mt={2}>
                {hint}
              </Text>
            ) : null}
          </Box>
          <ThemeIcon
            size="sm"
            variant="light"
            color={trend === 'up' ? 'teal' : trend === 'down' ? 'red' : 'gray'}
          >
            {trend === 'down' ? <IconArrowDownRight size={14} /> : <IconArrowUpRight size={14} />}
          </ThemeIcon>
        </Group>
        <Title order={2} className="stat-value">
          {value.includes('฿') || value.includes('$') ? <AmountText value={value} /> : value}
        </Title>
        <Text size="sm" c="dimmed">
          {delta}
        </Text>
      </Stack>
    </PremiumCard>
  )
}
