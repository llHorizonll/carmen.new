import { Badge, Button, Grid, Group, Stack, Text, Title } from '@mantine/core'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import type { MRT_ColumnDef } from 'mantine-react-table'
import { PageHeader } from '../../components/ui/PageHeader'
import { ApprovalStatus } from '../../components/ui/ApprovalStatus'
import { AuditTimeline } from '../../components/ui/AuditTimeline'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { PremiumCard } from '../../components/ui/PremiumCard'
import { FinancialTable } from '../../components/tables/FinancialTable'
import { fetchJournalEntry, postJournalEntry, reverseJournalEntry } from '../../lib/pocketbase'
import { formatCompactAmount, formatDate, formatDateTime } from '../../lib/formatters'
import type { JournalEntry } from '../../lib/mockData'
import { queryClient } from '../../lib/queryClient'

export function JournalEntryDetailPage() {
  const params = useParams()
  const entryId = params.id ?? 'je-1'
  const query = useQuery({
    queryKey: ['journal-entry', entryId],
    queryFn: () => fetchJournalEntry(entryId),
  })
  const postMutation = useMutation({
    mutationFn: () => postJournalEntry(entryId, entry?.lines ?? []),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['journal-entry', entryId] }),
        queryClient.invalidateQueries({ queryKey: ['journal-entries'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ])
    },
  })
  const reverseMutation = useMutation({
    mutationFn: () => reverseJournalEntry(entryId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['journal-entry', entryId] }),
        queryClient.invalidateQueries({ queryKey: ['journal-entries'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ])
    },
  })

  const entry = query.data

  const lineColumns = useMemo<MRT_ColumnDef<JournalEntry['lines'][number]>[]>(
    () => [
      { accessorKey: 'accountCode', header: 'Account Code', size: 120 },
      { accessorKey: 'accountName', header: 'Account Name', size: 180 },
      { accessorKey: 'department', header: 'Department', size: 120 },
      {
        accessorKey: 'debit',
        header: 'Debit',
        size: 110,
        Cell: ({ cell }) => <span className="mono fin-number">{formatCompactAmount(cell.getValue<number>())}</span>,
        mantineTableBodyCellProps: { align: 'right' },
      },
      {
        accessorKey: 'credit',
        header: 'Credit',
        size: 110,
        Cell: ({ cell }) => <span className="mono fin-number">{formatCompactAmount(cell.getValue<number>())}</span>,
        mantineTableBodyCellProps: { align: 'right' },
      },
      { accessorKey: 'memo', header: 'Memo', size: 220 },
    ],
    [],
  )

  const timeline = [
    { timestamp: entry?.updatedAt ?? new Date().toISOString(), title: 'Created', detail: 'Journal drafted from night audit.' },
    { timestamp: entry?.updatedAt ?? new Date().toISOString(), title: 'Reviewed', detail: 'Lines validated against tenant rules.' },
    { timestamp: entry?.updatedAt ?? new Date().toISOString(), title: 'Approved', detail: entry?.approvalStatus ?? 'Approval pending.' },
  ]

  return (
    <Stack gap="md">
      <PageHeader
        badge={<Badge variant="light" color={entry?.status === 'Posted' ? 'teal' : 'yellow'}>Journal Entry</Badge>}
        title={entry?.jeNumber ?? entryId}
        subtitle={`${entry?.property ?? ''} | ${formatDate(entry?.date ?? new Date().toISOString())} | ${entry?.source ?? ''}`}
        actions={
          <Group gap="xs">
            <Button
              onClick={() => postMutation.mutate()}
              disabled={Math.abs(entry?.difference ?? 0) > 0.005 || entry?.status === 'Posted'}
              loading={postMutation.isPending}
            >
              Post
            </Button>
            <Button variant="light" onClick={() => reverseMutation.mutate()} loading={reverseMutation.isPending}>
              Reverse
            </Button>
            <Button variant="light">Duplicate</Button>
            <Button variant="light">Export</Button>
          </Group>
        }
      />

      <Grid>
        <Grid.Col span={{ base: 12, xl: 8 }}>
          <PremiumCard p="md">
            <Stack gap="sm">
              <Group justify="space-between">
                <div>
                  <Text fw={700}>Journal Lines</Text>
                  <Text size="sm" c="gray.4" fw={500}>
                    Debit/credit lines with balance validation before posting.
                  </Text>
                </div>
                <Group gap="xs">
                  <StatusBadge value={entry?.status ?? 'Draft'} />
                  <Badge variant="light" color={Math.abs(entry?.difference ?? 0) < 0.005 ? 'teal' : 'red'}>
                    {Math.abs(entry?.difference ?? 0) < 0.005 ? 'Balanced' : 'Out of balance'}
                  </Badge>
                </Group>
              </Group>
              <FinancialTable
                data={entry?.lines ?? []}
                columns={lineColumns}
                footer={
                  <Group justify="space-between">
                    <Text size="sm" c="gray.4" fw={500}>Difference</Text>
                    <Text fw={700} className="mono fin-number">
                      {formatCompactAmount(entry?.difference ?? 0)}
                    </Text>
                  </Group>
                }
              />
            </Stack>
          </PremiumCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xl: 4 }}>
          <Stack gap="md">
            <PremiumCard p="md">
              <Stack gap={6}>
                <Text size="xs" tt="uppercase" fw={600} c="gray.4" style={{ letterSpacing: '0.08em' }}>
                  Approval Panel
                </Text>
                <Title order={3}>{entry?.approvalStatus}</Title>
                <ApprovalStatus value={entry?.status ?? 'Draft'} />
                <Text size="sm" c="gray.4" fw={500}>
                  Posted by {entry?.postedBy}
                </Text>
                <Text size="sm" c="gray.4" fw={500}>
                  Updated {formatDateTime(entry?.updatedAt ?? new Date().toISOString())}
                </Text>
              </Stack>
            </PremiumCard>
            <PremiumCard p="md">
              <Stack gap={6}>
                <Text fw={700}>Audit Timeline</Text>
                <AuditTimeline items={timeline} />
              </Stack>
            </PremiumCard>
            <PremiumCard p="md">
              <Stack gap={4}>
                <Text fw={700}>Header Summary</Text>
                <Text size="sm" c="gray.4" fw={500}>
                  JE {entry?.jeNumber} | {entry?.property}
                </Text>
                <Text size="sm" c="gray.4" fw={500}>
                  Posted Date {formatDate(entry?.date ?? new Date().toISOString())}
                </Text>
              </Stack>
            </PremiumCard>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
