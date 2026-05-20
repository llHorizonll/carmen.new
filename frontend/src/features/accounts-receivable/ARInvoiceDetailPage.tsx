import { Badge, Button, Grid, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader'
import { PremiumCard } from '../../components/ui/PremiumCard'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { AuditTimeline } from '../../components/ui/AuditTimeline'
import { LiveIndicator } from '../../components/ui/LiveIndicator'
import { deleteARInvoice, fetchARInvoice, recordARPayment, updateARInvoice } from '../../lib/pocketbase'
import { formatCompactAmount, formatDate } from '../../lib/formatters'
import { queryClient } from '../../lib/queryClient'

export function ARInvoiceDetailPage() {
  const params = useParams()
  const invoiceId = params.id ?? 'ar-1'

  const query = useQuery({
    queryKey: ['ar-invoice', invoiceId],
    queryFn: () => fetchARInvoice(invoiceId),
  })
  const paymentMutation = useMutation({
    mutationFn: () => recordARPayment(invoiceId, Math.max(0, invoice?.balance ?? 0)),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['ar-invoice', invoiceId] }),
        queryClient.invalidateQueries({ queryKey: ['ar-invoices'] }),
      ])
    },
  })
  const statusMutation = useMutation({
    mutationFn: () =>
      updateARInvoice(invoiceId, {
        tenantId: invoice?.tenantId ?? 'tenant-carmen',
        customerId: 'cust-1',
        propertyId: 'prop-bkk',
        invoiceNo: invoice?.invoiceNo ?? invoiceId,
        invoiceDate: invoice?.invoiceDate ?? new Date().toISOString(),
        dueDate: invoice?.dueDate ?? new Date().toISOString(),
        amount: invoice?.amount ?? 0,
        paid: invoice?.paid ?? 0,
        balance: invoice?.balance ?? 0,
        status: 'Overdue',
        aging: invoice?.aging ?? 'Current',
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['ar-invoice', invoiceId] }),
        queryClient.invalidateQueries({ queryKey: ['ar-invoices'] }),
      ])
    },
  })
  const deleteMutation = useMutation({
    mutationFn: () => deleteARInvoice(invoiceId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ar-invoices'] })
    },
  })

  const invoice = query.data

  return (
    <Stack gap="md">
      <PageHeader
        badge={<Badge variant="light" color="cyan">AR Invoice Detail</Badge>}
        title={invoice?.invoiceNo ?? invoiceId}
        subtitle={`${invoice?.customer ?? ''} | ${invoice?.property ?? ''} | Due ${formatDate(invoice?.dueDate ?? new Date().toISOString())}`}
        actions={
          <Group gap="xs">
            <Button onClick={() => paymentMutation.mutate()} loading={paymentMutation.isPending}>Record Payment</Button>
            <Button variant="light" onClick={() => statusMutation.mutate()} loading={statusMutation.isPending}>Mark Overdue</Button>
            <Button color="red" variant="light" onClick={() => deleteMutation.mutate()} loading={deleteMutation.isPending}>Delete</Button>
          </Group>
        }
      />

      <Grid>
        <Grid.Col span={{ base: 12, xl: 8 }}>
          <PremiumCard p="md">
            <Stack gap="sm">
              <Group justify="space-between">
                <div>
                  <Text fw={700}>Invoice Summary</Text>
                  <Text size="sm" c="gray.4" fw={500}>
                    Balance position, collection status, and aging context.
                  </Text>
                </div>
                <LiveIndicator status="live" label="Realtime Collection Updates" />
              </Group>
              <Group justify="space-between">
                <Text c="gray.4" fw={500}>Invoice Amount</Text>
                <Text fw={700} className="mono fin-number">{formatCompactAmount(invoice?.amount ?? 0)}</Text>
              </Group>
              <Group justify="space-between">
                <Text c="gray.4" fw={500}>Paid</Text>
                <Text fw={700} className="mono fin-number">{formatCompactAmount(invoice?.paid ?? 0)}</Text>
              </Group>
              <Group justify="space-between">
                <Text c="gray.4" fw={500}>Balance</Text>
                <Text fw={700} className="mono fin-number">{formatCompactAmount(invoice?.balance ?? 0)}</Text>
              </Group>
              <Group justify="space-between">
                <Text c="gray.4" fw={500}>Aging Bucket</Text>
                <Text fw={700}>{invoice?.aging ?? 'Current'}</Text>
              </Group>
              <Group justify="space-between">
                <Text c="gray.4" fw={500}>Status</Text>
                <StatusBadge value={invoice?.status ?? 'Open'} />
              </Group>
            </Stack>
          </PremiumCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xl: 4 }}>
          <Stack gap="md">
            <PremiumCard p="md">
              <Stack gap={4}>
                <Text size="xs" tt="uppercase" fw={600} c="gray.4" style={{ letterSpacing: '0.08em' }}>Customer</Text>
                <Title order={3}>{invoice?.customer}</Title>
                <Text size="sm" c="gray.4" fw={500}>{invoice?.property}</Text>
                <Text size="sm" c="gray.4" fw={500}>Invoice Date {formatDate(invoice?.invoiceDate ?? new Date().toISOString())}</Text>
                <Text size="sm" c="gray.4" fw={500}>Due Date {formatDate(invoice?.dueDate ?? new Date().toISOString())}</Text>
              </Stack>
            </PremiumCard>
            <PremiumCard p="md">
              <Stack gap={4}>
                <Text fw={700}>Collection Notes</Text>
                <Paper p="md" className="attachment-placeholder">
                  <Text size="sm" c="gray.4" fw={500}>Follow-up Log and Remittance Details</Text>
                </Paper>
              </Stack>
            </PremiumCard>
            <PremiumCard p="md">
              <Stack gap={4}>
                <Text fw={700}>Activity Timeline</Text>
                <AuditTimeline
                  items={[
                    { timestamp: invoice?.invoiceDate ?? new Date().toISOString(), title: 'Invoice Created', detail: 'Receivable posted from source channel.' },
                    { timestamp: invoice?.dueDate ?? new Date().toISOString(), title: 'Due Date Monitored', detail: `Aging bucket: ${invoice?.aging ?? 'Current'}.` },
                    { timestamp: new Date().toISOString(), title: 'Status Synchronized', detail: 'Realtime subscription refreshed collection status.' },
                  ]}
                />
              </Stack>
            </PremiumCard>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
