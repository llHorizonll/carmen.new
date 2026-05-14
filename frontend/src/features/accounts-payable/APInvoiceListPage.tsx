import { Badge, Grid, Select, Stack, Text, TextInput } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MRT_ColumnDef } from 'mantine-react-table'
import { PageHeader } from '../../components/ui/PageHeader'
import { FinancialTable } from '../../components/tables/FinancialTable'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { useAuthStore } from '../auth/auth.store'
import { useTenantStore } from '../../stores/tenant.store'
import { fetchAPInvoices, makeQueryKey } from '../../lib/pocketbase'
import { formatCompactAmount, formatDate } from '../../lib/formatters'
import { PremiumCard } from '../../components/ui/PremiumCard'

export function APInvoiceListPage() {
  const navigate = useNavigate()
  const tenantId = useAuthStore((state) => state.activeTenantId) ?? 'tenant-carmen'
  const fiscalPeriod = useTenantStore((state) => state.fiscalPeriod)
  const [vendorFilter, setVendorFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [propertyFilter, setPropertyFilter] = useState('all')
  const [dueFilter, setDueFilter] = useState('')

  const query = useQuery({
    queryKey: makeQueryKey('ap-invoices', { tenantId, fiscalPeriod }),
    queryFn: () => fetchAPInvoices({ tenantId, fiscalPeriod }),
  })

  const invoices = useMemo(() => query.data ?? [], [query.data])
  const vendors = useMemo(() => ['all', ...new Set(invoices.map((invoice) => invoice.vendor))], [invoices])
  const properties = useMemo(() => ['all', ...new Set(invoices.map((invoice) => invoice.property))], [invoices])
  const statuses = useMemo(() => ['all', ...new Set(invoices.map((invoice) => invoice.status))], [invoices])

  const filtered = invoices.filter((invoice) => {
    const matchesVendor = vendorFilter === 'all' || invoice.vendor === vendorFilter
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    const matchesProperty = propertyFilter === 'all' || invoice.property === propertyFilter
    const matchesDue = !dueFilter || invoice.dueDate <= dueFilter
    return matchesVendor && matchesStatus && matchesProperty && matchesDue
  })

  const columns = useMemo<MRT_ColumnDef<(typeof filtered)[number]>[]>(
    () => [
      { accessorKey: 'invoiceNo', header: 'Invoice No', size: 120 },
      { accessorKey: 'vendor', header: 'Vendor', size: 180 },
      { accessorKey: 'property', header: 'Property', size: 180 },
      { accessorKey: 'invoiceDate', header: 'Invoice Date', size: 110, Cell: ({ cell }) => formatDate(cell.getValue<string>()) },
      { accessorKey: 'dueDate', header: 'Due Date', size: 110, Cell: ({ cell }) => formatDate(cell.getValue<string>()) },
      {
        accessorKey: 'amount',
        header: 'Amount',
        size: 110,
        Cell: ({ cell }) => <span className="mono fin-number">{formatCompactAmount(cell.getValue<number>())}</span>,
        mantineTableBodyCellProps: { align: 'right' },
      },
      {
        accessorKey: 'balance',
        header: 'Balance',
        size: 110,
        Cell: ({ cell }) => <span className="mono fin-number">{formatCompactAmount(cell.getValue<number>())}</span>,
        mantineTableBodyCellProps: { align: 'right' },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ cell }) => <StatusBadge value={cell.getValue<string>()} />,
      },
      { accessorKey: 'approval', header: 'Approval', size: 110 },
      { accessorKey: 'aging', header: 'Aging', size: 100 },
    ],
    [],
  )

  return (
    <Stack gap="md">
      <PageHeader
        badge={<Badge variant="light" color="teal">Accounts Payable</Badge>}
        title="AP Invoice List"
        subtitle="Compact invoice control with filters, aging, and approval signals."
      />

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <TextInput label="Due date" type="date" value={dueFilter} onChange={(event) => setDueFilter(event.currentTarget.value)} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Select label="Vendor" data={vendors} value={vendorFilter} onChange={(value) => setVendorFilter(value ?? 'all')} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Select label="Property" data={properties} value={propertyFilter} onChange={(value) => setPropertyFilter(value ?? 'all')} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Select label="Status" data={statuses} value={statusFilter} onChange={(value) => setStatusFilter(value ?? 'all')} />
        </Grid.Col>
      </Grid>

      <Grid>
        {[
          ['Due Today', filtered.filter((item) => item.aging === 'Due Today').reduce((sum, item) => sum + item.balance, 0)],
          ['Overdue', filtered.filter((item) => item.status === 'Overdue').reduce((sum, item) => sum + item.balance, 0)],
          ['Pending Approval', filtered.filter((item) => item.status === 'Pending Approval').reduce((sum, item) => sum + item.balance, 0)],
          ['Payment Run Total', filtered.reduce((sum, item) => sum + item.balance, 0)],
        ].map(([label, value]) => (
          <Grid.Col key={String(label)} span={{ base: 12, sm: 6, xl: 3 }}>
            <PremiumCard p="md">
              <Stack gap={4}>
                <Text size="xs" tt="uppercase" fw={600} c="gray.4" style={{ letterSpacing: '0.08em' }}>
                  {label}
                </Text>
                <Text fw={700}>{formatCompactAmount(value as number)}</Text>
              </Stack>
            </PremiumCard>
          </Grid.Col>
        ))}
      </Grid>

      <FinancialTable
        data={filtered}
        columns={columns}
        title="AP invoices"
        subtitle={`Tenant ${tenantId} | ${fiscalPeriod}`}
        onRowClick={(row) => navigate(`/app/accounts-payable/${row.id}`)}
      />
    </Stack>
  )
}
