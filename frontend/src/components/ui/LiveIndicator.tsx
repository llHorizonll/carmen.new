import { Group, Text } from '@mantine/core'
import { IconWifi, IconWifiOff, IconLoader2 } from '@tabler/icons-react'
import type { ConnectionStatus } from '../../lib/mockData'

type LiveIndicatorProps = {
  status: ConnectionStatus
  label?: string
}

export function LiveIndicator({ status, label }: LiveIndicatorProps) {
  const tone = status === 'live' ? 'teal' : status === 'reconnecting' ? 'yellow' : 'red'
  const icon = status === 'live' ? <IconWifi size={14} /> : status === 'reconnecting' ? <IconLoader2 size={14} /> : <IconWifiOff size={14} />

  return (
    <Group gap={6} wrap="nowrap">
      <Text c={tone} fw={700} size="xs" tt="uppercase" className="live-indicator">
        {icon}
      </Text>
      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
        {label ?? status}
      </Text>
    </Group>
  )
}
