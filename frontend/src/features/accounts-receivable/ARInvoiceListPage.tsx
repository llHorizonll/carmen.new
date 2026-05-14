import { Badge, Grid, Select, Stack, Text, TextInput } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MRT_ColumnDef } from 'mantine-react-table'
import { PageHeader } from '../../components/ui/PageHeader'
import { FinancialTable } from '../../components/tables/FinancialTable'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { PremiumCard } from '../../components/ui/PremiumCard'
import { useAuthStore } from '../auth/auth.store'
import { useTenantStore } from '../../stores/tenant.store'
import { fetchARInvoices, makeQueryKey } from '../../lib/pocketbase'
import { formatCompactAmount, formatDate } from '../../lib/formatters'

export function ARInvoiceListPage() {
  const navigate = useNavigate()
  const tenantId = useAuthStore((state) => state.activeTenantId) ?? 'tenant-carmen'
  const fiscalPeriod = useTenantStore((state) => state.fiscalPeriod)
  const [statusFilter, setStatusFilter] = useState('all')
  const [propertyFilter, setPropertyFilter] = useState('all')
  const [customerFilter, setCustomerFilter] = useState('all')
  const [dueDate, setDueDate] = useState('')

  const query = useQuery({ queryKey: makeQueryKey('ar-invoices', { tenantId, fiscalPeriod }), queryFn: () => fetchARInvoices({ tenantId, fiscalPeriod }) })
  const invoices = useMemo(() => query.data ?? [], [query.data])

  const statuses = useMemo(() => ['all', ...new Set(invoices.map((invoice) => invoice.status))], [invoices])
  const properties = useMemo(() => ['all', ...new Set(invoices.map((invoice) => invoice.property))], [invoices])
  const customers = useMemo(() => ['all', ...new Set(invoices.map((invoice) => invoice.customer))], [invoices])

  const filtered = invoices.filter((invoice) => {
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    const matchesProperty = propertyFilter === 'all' || invoice.property === propertyFilter
    const matchesCustomer = customerFilter === 'all' || invoice.customer === customerFilter
    const matchesDue = !dueDate || invoice.dueDate <= dueDate
    return matchesStatus && matchesProperty && matchesCustomer && matchesDue
  })

  const columns = useMemo<MRT_ColumnDef<(typeof filtered)[number]>[]>(
    () => [
      { accessorKey: 'invoiceNo', header: 'Invoice No', size: 120 },
      { accessorKey: 'customer', header: 'Customer', size: 180 },
      { accessorKey: 'property', header: 'Property', size: 180 },
      { accessorKey: 'invoiceDate', header: 'Invoice Date', Cell: ({ cell }) => formatDate(cell.getValue<string>()) },
      { accessorKey: 'dueDate', header: 'Due Date', Cell: ({ cell }) => formatDate(cell.getValue<string>()) },
      {
        accessorKey: 'amount',
        header: 'Amount',
        Cell: ({ cell }) => <span className="mono fin-number">{formatCompactAmount(cell.getValue<number>())}</span>,
        mantineTableBodyCellProps: { align: 'right' },
      },
      {
        accessorKey: 'paid',
        header: 'Paid',
        Cell: ({ cell }) => <span className="mono fin-number">{formatCompactAmount(cell.getValue<number>())}</span>,
        mantineTableBodyCellProps: { align: 'right' },
      },
      {
        accessorKey: 'balance',
        header: 'Balance',
        Cell: ({ cell }) => <span className="mono fin-number">{formatCompactAmount(cell.getValue<number>())}</span>,
        mantineTableBodyCellProps: { align: 'right' },
      },
      { accessorKey: 'status', header: 'Status', Cell: ({ cell }) => <StatusBadge value={cell.getValue<string>()} /> },
      { accessorKey: 'aging', header: 'Aging' },
    ],
    [],
  )

  return (
    <Stack gap="md">
      <PageHeader badge={<Badge variant="light" color="blue">Accounts Receivable</Badge>} title="AR Invoice List" subtitle="Dense receivables control with customer, aging, and collection context." />
      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}><TextInput label="Due date" type="date" value={dueDate} onChange={(event) => setDueDate(event.currentTarget.value)} /></Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}><Select label="Customer" data={customers} value={customerFilter} onChange={(value) => setCustomerFilter(value ?? 'all')} /></Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}><Select label="Property" data={properties} value={propertyFilter} onChange={(value) => setPropertyFilter(value ?? 'all')} /></Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}><Select label="Status" data={statuses} value={statusFilter} onChange={(value) => setStatusFilter(value ?? 'all')} /></Grid.Col>
      </Grid>
      <Grid>
        {[
          ['Total Receivable', filtered.reduce((sum, row) => sum + row.balance, 0)],
          ['Overdue AR', filtered.filter((row) => row.status === 'Overdue').reduce((sum, row) => sum + row.balance, 0)],
          ['Collected Today', filtered.filter((row) => row.status === 'Collected').reduce((sum, row) => sum + row.paid, 0)],
          ['Credit Notes', 1],
        ].map(([label, value]) => (
          <Grid.Col key={String(label)} span={{ base: 12, sm: 6, xl: 3 }}>
            <PremiumCard p="md">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">{label}</Text>
              <Text fw={700}>{formatCompactAmount(value as number)}</Text>
            </PremiumCard>
          </Grid.Col>
        ))}
      </Grid>
      <FinancialTable data={filtered} columns={columns} title="AR invoices" subtitle={`Tenant ${tenantId} | ${fiscalPeriod}`} onRowClick={(row) => navigate(`/app/accounts-receivable/${row.id}`)} />
    </Stack>
  )
}
