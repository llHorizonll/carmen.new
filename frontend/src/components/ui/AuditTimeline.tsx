import { Box, Divider, Stack, Text } from '@mantine/core'
import { formatDateTime } from '../../lib/formatters'

type TimelineItem = {
  timestamp: string
  title: string
  detail: string
}

type AuditTimelineProps = {
  items: TimelineItem[]
}

export function AuditTimeline({ items }: AuditTimelineProps) {
  return (
    <Stack gap="sm">
      {items.map((item, index) => (
        <Box key={`${item.timestamp}-${index}`}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            {formatDateTime(item.timestamp)}
          </Text>
          <Text fw={600}>{item.title}</Text>
          <Text size="sm" c="dimmed">
            {item.detail}
          </Text>
          {index < items.length - 1 ? <Divider my="sm" /> : null}
        </Box>
      ))}
    </Stack>
  )
}
