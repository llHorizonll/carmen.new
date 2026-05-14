import { Badge, Grid, Group, Select, Stack, Text, TextInput } from '@mantine/core'
import { IconKeyboard } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MRT_ColumnDef } from 'mantine-react-table'
import { PageHeader } from '../../components/ui/PageHeader'
import { FinancialTable } from '../../components/tables/FinancialTable'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { useAuthStore } from '../auth/auth.store'
import { useTenantStore } from '../../stores/tenant.store'
import { fetchJournalEntries, makeQueryKey } from '../../lib/pocketbase'
import { formatCompactAmount, formatDateTime } from '../../lib/formatters'

export function JournalEntryListPage() {
  const navigate = useNavigate()
  const tenantId = useAuthStore((state) => state.activeTenantId) ?? 'tenant-carmen'
  const fiscalPeriod = useTenantStore((state) => state.fiscalPeriod)
  const [propertyFilter, setPropertyFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const query = useQuery({
    queryKey: makeQueryKey('journal-entries', { tenantId, fiscalPeriod }),
    queryFn: () => fetchJournalEntries({ tenantId, fiscalPeriod }),
  })

  const entries = useMemo(() => query.data ?? [], [query.data])
  const properties = useMemo(() => ['all', ...new Set(entries.map((entry) => entry.property))], [entries])
  const statuses = useMemo(() => ['all', ...new Set(entries.map((entry) => entry.status))], [entries])
  const sources = useMemo(() => ['all', ...new Set(entries.map((entry) => entry.source))], [entries])

  const filtered = entries.filter((entry) => {
    const matchesProperty = propertyFilter === 'all' || entry.property === propertyFilter
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter
    const matchesSource = sourceFilter === 'all' || entry.source === sourceFilter
    const matchesStart = !startDate || entry.date >= startDate
    const matchesEnd = !endDate || entry.date <= endDate
    return matchesProperty && matchesStatus && matchesSource && matchesStart && matchesEnd
  })

  const columns = useMemo<MRT_ColumnDef<(typeof filtered)[number]>[]>(
    () => [
      { accessorKey: 'jeNumber', header: 'JE Number', size: 120 },
      { accessorKey: 'date', header: 'Date', size: 110 },
      { accessorKey: 'property', header: 'Property', size: 180 },
      { accessorKey: 'source', header: 'Source', size: 130 },
      { accessorKey: 'description', header: 'Description', size: 240 },
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
      {
        accessorKey: 'difference',
        header: 'Difference',
        size: 110,
        Cell: ({ cell }) => (
          <Text ta="right" fw={600} c={Math.abs(cell.getValue<number>()) < 0.005 ? 'teal' : 'red'} className="mono fin-number">
            {formatCompactAmount(cell.getValue<number>())}
          </Text>
        ),
        mantineTableBodyCellProps: { align: 'right' },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 110,
        Cell: ({ cell }) => <StatusBadge value={cell.getValue<string>()} />,
      },
      { accessorKey: 'postedBy', header: 'Posted By', size: 130 },
      { accessorKey: 'updatedAt', header: 'Updated At', size: 160, Cell: ({ cell }) => formatDateTime(cell.getValue<string>()) },
    ],
    [],
  )

  return (
    <Stack gap="md">
      <PageHeader
        badge={<Badge variant="light" color="gray">General Ledger</Badge>}
        title="Journal Entry List"
        subtitle="Dense operational journal control with filters, sticky headers, and finance-friendly amounts."
        actions={<Group gap="xs"><IconKeyboard size={14} /><Text size="sm" c="dimmed">N = New Entry</Text></Group>}
      />

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <TextInput label="Start date" type="date" value={startDate} onChange={(event) => setStartDate(event.currentTarget.value)} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <TextInput label="End date" type="date" value={endDate} onChange={(event) => setEndDate(event.currentTarget.value)} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 2 }}>
          <Select label="Property" data={properties} value={propertyFilter} onChange={(value) => setPropertyFilter(value ?? 'all')} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 2 }}>
          <Select label="Status" data={statuses} value={statusFilter} onChange={(value) => setStatusFilter(value ?? 'all')} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 2 }}>
          <Select label="Source" data={sources} value={sourceFilter} onChange={(value) => setSourceFilter(value ?? 'all')} />
        </Grid.Col>
      </Grid>

      <FinancialTable
        data={filtered}
        columns={columns}
        title="Journal entries"
        subtitle={`Tenant ${tenantId} | ${fiscalPeriod}`}
        onRowClick={(row) => navigate(`/app/general-ledger/${row.id}`)}
        footer={
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Summary row
            </Text>
            <Group gap="lg">
              <Text size="sm">Debit {formatCompactAmount(filtered.reduce((sum, row) => sum + row.debit, 0))}</Text>
              <Text size="sm">Credit {formatCompactAmount(filtered.reduce((sum, row) => sum + row.credit, 0))}</Text>
            </Group>
          </Group>
        }
      />
    </Stack>
  )
}
