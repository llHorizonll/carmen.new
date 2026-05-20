import { Badge, Button, Grid, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import type { MRT_ColumnDef } from 'mantine-react-table'
import { PageHeader } from '../../components/ui/PageHeader'
import { PremiumCard } from '../../components/ui/PremiumCard'
import { AuditTimeline } from '../../components/ui/AuditTimeline'
import { ApprovalStatus } from '../../components/ui/ApprovalStatus'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { FinancialTable } from '../../components/tables/FinancialTable'
import { deleteAPInvoice, fetchAPInvoice, updateAPInvoice } from '../../lib/pocketbase'
import { formatCompactAmount, formatDate } from '../../lib/formatters'
import { LiveIndicator } from '../../components/ui/LiveIndicator'
import type { APInvoice } from '../../lib/mockData'
import { queryClient } from '../../lib/queryClient'

export function APInvoiceDetailPage() {
  const params = useParams()
  const invoiceId = params.id ?? 'ap-1'
  const query = useQuery({
    queryKey: ['ap-invoice', invoiceId],
    queryFn: () => fetchAPInvoice(invoiceId),
  })
  const approvalMutation = useMutation({
    mutationFn: (status: APInvoice['status']) =>
      updateAPInvoice(invoiceId, {
        tenantId: invoice?.tenantId ?? 'tenant-carmen',
        vendorId: 'vend-1',
        propertyId: 'prop-bkk',
        invoiceNo: invoice?.invoiceNo ?? invoiceId,
        invoiceDate: invoice?.invoiceDate ?? new Date().toISOString(),
        dueDate: invoice?.dueDate ?? new Date().toISOString(),
        amount: invoice?.amount ?? 0,
        balance: status === 'Paid' ? 0 : (invoice?.balance ?? 0),
        status,
        approval: status === 'Approved' ? 'Finance' : invoice?.approval,
        aging: invoice?.aging ?? 'Current',
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['ap-invoice', invoiceId] }),
        queryClient.invalidateQueries({ queryKey: ['ap-invoices'] }),
      ])
    },
  })
  const deleteMutation = useMutation({
    mutationFn: () => deleteAPInvoice(invoiceId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ap-invoices'] })
    },
  })

  const invoice = query.data
  const glColumns = useMemo<MRT_ColumnDef<APInvoice['glDistribution'][number]>[]>(
    () => [
      { accessorKey: 'account', header: 'GL Account', size: 220 },
      {
        accessorKey: 'amount',
        header: 'Amount',
        Cell: ({ cell }) => <span className="mono fin-number">{formatCompactAmount(cell.getValue<number>())}</span>,
        mantineTableBodyCellProps: { align: 'right' },
      },
    ],
    [],
  )

  return (
    <Stack gap="md">
      <PageHeader
        badge={<Badge variant="light" color="yellow">AP Invoice Detail</Badge>}
        title={invoice?.invoiceNo ?? invoiceId}
        subtitle={`${invoice?.vendor ?? ''} | ${invoice?.property ?? ''} | Due ${formatDate(invoice?.dueDate ?? new Date().toISOString())}`}
        actions={
          <Group gap="xs">
            <Button onClick={() => approvalMutation.mutate('Approved')} loading={approvalMutation.isPending}>Approve</Button>
            <Button variant="light" onClick={() => approvalMutation.mutate('Overdue')} loading={approvalMutation.isPending}>Reject</Button>
            <Button variant="light" onClick={() => approvalMutation.mutate('Paid')} loading={approvalMutation.isPending}>Mark Paid</Button>
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
                  <Text fw={700}>Invoice summary</Text>
                  <Text size="sm" c="gray.4" fw={500}>
                    Header totals, approval status, and payment posture.
                  </Text>
                </div>
                <LiveIndicator status="live" label="Approval Status Updating" />
              </Group>
              <Group justify="space-between">
                <Text c="gray.4" fw={500}>Invoice amount</Text>
                <Text fw={700} className="mono fin-number">{formatCompactAmount(invoice?.amount ?? 0)}</Text>
              </Group>
              <Group justify="space-between">
                <Text c="gray.4" fw={500}>Balance</Text>
                <Text fw={700} className="mono fin-number">{formatCompactAmount(invoice?.balance ?? 0)}</Text>
              </Group>
              <Group justify="space-between">
                <Text c="gray.4" fw={500}>Approval</Text>
                <ApprovalStatus value={invoice?.status ?? 'Pending Approval'} />
              </Group>
              <FinancialTable data={invoice?.glDistribution ?? []} columns={glColumns} title="GL Distribution" />
            </Stack>
          </PremiumCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xl: 4 }}>
          <Stack gap="md">
            <PremiumCard p="md">
              <Stack gap={4}>
                <Text size="xs" tt="uppercase" fw={600} c="gray.4" style={{ letterSpacing: '0.08em' }}>Vendor</Text>
                <Title order={3}>{invoice?.vendor}</Title>
                <Text size="sm" c="gray.4" fw={500}>{invoice?.property}</Text>
                <Text size="sm" c="gray.4" fw={500}>Invoice Date {formatDate(invoice?.invoiceDate ?? new Date().toISOString())}</Text>
                <Text size="sm" c="gray.4" fw={500}>Due Date {formatDate(invoice?.dueDate ?? new Date().toISOString())}</Text>
              </Stack>
            </PremiumCard>
            <PremiumCard p="md">
              <Stack gap={4}>
                <Text fw={700}>Approval workflow</Text>
                <Text size="sm" c="gray.4" fw={500}>{invoice?.approval}</Text>
                <StatusBadge value={invoice?.status ?? 'Pending Approval'} />
              </Stack>
            </PremiumCard>
            <PremiumCard p="md">
              <Stack gap={4}>
                <Text fw={700}>Attachment</Text>
                <Paper p="md" className="attachment-placeholder">
                  <Text size="sm" c="gray.4" fw={500}>Invoice PDF preview panel</Text>
                </Paper>
              </Stack>
            </PremiumCard>
            <PremiumCard p="md">
              <Stack gap={4}>
                <Text fw={700}>Payment history</Text>
                {(invoice?.paymentHistory ?? []).map((item) => (
                  <Text key={item} size="sm" c="gray.4" fw={500}>{item}</Text>
                ))}
              </Stack>
            </PremiumCard>
            <PremiumCard p="md">
              <Stack gap={4}>
                <Text fw={700}>Audit trail</Text>
                <AuditTimeline items={[{ timestamp: invoice?.invoiceDate ?? new Date().toISOString(), title: 'Invoice created', detail: 'Captured from AP intake.' }, { timestamp: invoice?.dueDate ?? new Date().toISOString(), title: 'Due checked', detail: 'Aging status updated.' }, { timestamp: new Date().toISOString(), title: 'Workflow update', detail: 'Realtime approval indicator refreshed.' }]} />
              </Stack>
            </PremiumCard>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
