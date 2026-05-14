import { Box, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react'
import { PremiumCard } from './PremiumCard'

type StatCardProps = {
  label: string
  value: string
  delta: string
  trend?: 'up' | 'down' | 'flat'
  hint?: string
}

export function StatCard({ label, value, delta, trend = 'flat', hint }: StatCardProps) {
  const isMoney = value.startsWith('฿') || value.startsWith('$') || value.startsWith('-฿') || value.startsWith('-$')

  return (
    <PremiumCard className="stat-card" p="md">
      <Stack gap={8}>
        <Group justify="space-between" align="flex-start">
          <Box>
            <Text className="ui-label" c="rgba(255,255,255,.82)" fw={700}>
              {label}
            </Text>
            {hint ? (
              <Text size="xs" c="rgba(255,255,255,.72)" mt={2} fw={500}>
                {hint}
              </Text>
            ) : null}
          </Box>
          <ThemeIcon size="sm" variant="light" color={trend === 'up' ? 'teal' : trend === 'down' ? 'red' : 'gray'}>
            {trend === 'down' ? <IconArrowDownRight size={14} /> : <IconArrowUpRight size={14} />}
          </ThemeIcon>
        </Group>
        <Text component="div" className="stat-value">
          {isMoney ? <span className="financial-amount">{value}</span> : value}
        </Text>
        <Text size="sm" c="rgba(255,255,255,.72)" fw={500}>
          {delta}
        </Text>
      </Stack>
    </PremiumCard>
  )
}
