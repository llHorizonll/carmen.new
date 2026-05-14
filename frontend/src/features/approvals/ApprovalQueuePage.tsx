import { Badge, Button, Grid, Group, Stack, Text } from '@mantine/core'
import { useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { PremiumCard } from '../../components/ui/PremiumCard'
import { approvals } from '../../lib/mockData'
import { formatCompactAmount } from '../../lib/formatters'

export function ApprovalQueuePage() {
  const [selected, setSelected] = useState((approvals[0] ?? null))

  return (
    <Stack gap="md">
      <PageHeader badge={<Badge variant="light" color="yellow">Approvals</Badge>} title="Approval Queue" subtitle="Grouped queue for AP invoices, journal entries, payments, and adjustments." />
      <Grid>
        <Grid.Col span={{ base: 12, xl: 8 }}>
          <Stack gap="sm">
            {approvals.map((item) => (
              <PremiumCard key={item.id} p="md" className="approval-item">
                <Group justify="space-between" align="flex-start">
                  <Stack gap={4}>
                    <Group gap="xs">
                      <Badge variant="light">{item.group}</Badge>
                      <Badge variant="light" color={item.priority === 'High' ? 'red' : item.priority === 'Medium' ? 'yellow' : 'gray'}>
                        {item.priority}
                      </Badge>
                    </Group>
                    <Text fw={700}>{item.requester}</Text>
                    <Text size="sm" c="gray.4" fw={500}>{item.preview}</Text>
                    <Text size="xs" c="gray.4" fw={500}>SLA {item.sla}</Text>
                  </Stack>
                  <Stack align="flex-end">
                    <Text fw={700}>{formatCompactAmount(item.amount)}</Text>
                    <Badge variant="light">{item.status}</Badge>
                    <Group gap="xs">
                      <Button size="xs" onClick={() => setSelected(item)}>Preview</Button>
                      <Button size="xs" variant="light">Approve</Button>
                      <Button size="xs" variant="light">Reject</Button>
                    </Group>
                  </Stack>
                </Group>
              </PremiumCard>
            ))}
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xl: 4 }}>
          <PremiumCard p="md">
            <Stack gap="sm">
              <Text fw={700}>Side preview</Text>
              <Text size="sm" c="gray.4" fw={500}>{selected?.preview}</Text>
              <Text size="sm" c="gray.4" fw={500}>Requester {selected?.requester}</Text>
              <Text size="sm" c="gray.4" fw={500}>Group {selected?.group}</Text>
              <Text size="sm" c="gray.4" fw={500}>SLA {selected?.sla}</Text>
            </Stack>
          </PremiumCard>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
