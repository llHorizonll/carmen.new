import { Badge, Button, Grid, Modal, NumberInput, Select, Stack, Text, TextInput } from '@mantine/core'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MRT_ColumnDef } from 'mantine-react-table'
import { PageHeader } from '../../components/ui/PageHeader'
import { FinancialTable } from '../../components/tables/FinancialTable'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { PremiumCard } from '../../components/ui/PremiumCard'
import { useAuthStore } from '../auth/auth.store'
import { useTenantStore } from '../../stores/tenant.store'
import { createARInvoice, fetchARInvoices, makeQueryKey } from '../../lib/pocketbase'
import { formatCompactAmount, formatDate } from '../../lib/formatters'
import { queryClient } from '../../lib/queryClient'

export function ARInvoiceListPage() {
  const navigate = useNavigate()
  const tenantId = useAuthStore((state) => state.activeTenantId) ?? 'tenant-carmen'
  const fiscalPeriod = useTenantStore((state) => state.fiscalPeriod)
  const [statusFilter, setStatusFilter] = useState('all')
  const [propertyFilter, setPropertyFilter] = useState('all')
  const [customerFilter, setCustomerFilter] = useState('all')
  const [dueDate, setDueDate] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({
    invoiceNo: '',
    customerId: 'cust-1',
    propertyId: 'prop-bkk',
    invoiceDate: '',
    dueDate: '',
    amount: 0,
    paid: 0,
    balance: 0,
    status: 'Open' as const,
    aging: 'Current',
  })

  const query = useQuery({ queryKey: makeQueryKey('ar-invoices', { tenantId, fiscalPeriod }), queryFn: () => fetchARInvoices({ tenantId, fiscalPeriod }) })
  const createMutation = useMutation({
    mutationFn: () => createARInvoice({ tenantId, ...form }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ar-invoices'] })
      setCreateOpen(false)
      setForm({
        invoiceNo: '',
        customerId: 'cust-1',
        propertyId: 'prop-bkk',
        invoiceDate: '',
        dueDate: '',
        amount: 0,
        paid: 0,
        balance: 0,
        status: 'Open',
        aging: 'Current',
      })
    },
  })
  const invoices = useMemo(() => query.data ?? [], [query.data])

  const statuses = useMemo(() => [{ value: 'all', label: 'All' }, ...new Set(invoices.map((invoice) => invoice.status)).values()].map((item) => typeof item === 'string' ? { value: item, label: item } : item), [invoices])
  const properties = useMemo(() => [{ value: 'all', label: 'All' }, ...new Set(invoices.map((invoice) => invoice.property)).values()].map((item) => typeof item === 'string' ? { value: item, label: item } : item), [invoices])
  const customers = useMemo(() => [{ value: 'all', label: 'All' }, ...new Set(invoices.map((invoice) => invoice.customer)).values()].map((item) => typeof item === 'string' ? { value: item, label: item } : item), [invoices])

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
      <PageHeader badge={<Badge variant="light" color="blue">Accounts Receivable</Badge>} title="AR Invoice List" subtitle="Receivables register with customer exposure, aging buckets, and collection status." actions={<Button onClick={() => setCreateOpen(true)}>New AR Invoice</Button>} />
      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}><TextInput label="Due Date" type="date" value={dueDate} onChange={(event) => setDueDate(event.currentTarget.value)} size="xs" /></Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}><Select label="Customer" data={customers} value={customerFilter} onChange={(value) => setCustomerFilter(value ?? 'all')} size="xs" /></Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}><Select label="Property" data={properties} value={propertyFilter} onChange={(value) => setPropertyFilter(value ?? 'all')} size="xs" /></Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}><Select label="Status" data={statuses} value={statusFilter} onChange={(value) => setStatusFilter(value ?? 'all')} size="xs" /></Grid.Col>
      </Grid>
      <Grid>
        {[
          ['Total Receivable', filtered.reduce((sum, row) => sum + row.balance, 0)],
          ['Overdue AR', filtered.filter((row) => row.status === 'Overdue').reduce((sum, row) => sum + row.balance, 0)],
          ['Collected Today', filtered.filter((row) => row.status === 'Collected').reduce((sum, row) => sum + row.paid, 0)],
          ['Credit Notes', 1],
        ].map(([label, value]) => (
          <Grid.Col key={String(label)} span={{ base: 12, sm: 6, xl: 3 }}>
            <PremiumCard p="sm">
              <Text size="xs" tt="uppercase" fw={600} c="gray.4" style={{ letterSpacing: '0.08em' }}>{label}</Text>
              <Text fw={700}>{formatCompactAmount(value as number)}</Text>
            </PremiumCard>
          </Grid.Col>
        ))}
      </Grid>
      <FinancialTable data={filtered} columns={columns} title="AR Invoices" subtitle={`Tenant ${tenantId} | ${fiscalPeriod}`} onRowClick={(row) => navigate(`/app/accounts-receivable/${row.id}`)} />
      <Modal opened={createOpen} onClose={() => setCreateOpen(false)} title="Create AR Invoice">
        <Stack gap="sm">
          <TextInput label="Invoice Number" description="Customer-facing invoice reference." value={form.invoiceNo} onChange={(event) => setForm((prev) => ({ ...prev, invoiceNo: event.currentTarget.value }))} size="xs" />
          <Select label="Customer" data={[{ value: 'cust-1', label: 'Agoda' }, { value: 'cust-2', label: 'Booking.com' }, { value: 'cust-3', label: 'Expedia' }, { value: 'cust-4', label: 'Corporate Account - Siam Motors' }, { value: 'cust-5', label: 'Walk-in Guest Ledger' }]} value={form.customerId} onChange={(value) => setForm((prev) => ({ ...prev, customerId: value ?? 'cust-1' }))} size="xs" />
          <Select label="Property" data={[{ value: 'prop-bkk', label: 'CARMEN Bangkok Riverside' }, { value: 'prop-phuket', label: 'CARMEN Phuket Resort' }, { value: 'prop-chiangmai', label: 'CARMEN Chiang Mai Boutique' }, { value: 'prop-pattaya', label: 'CARMEN Pattaya Beach' }]} value={form.propertyId} onChange={(value) => setForm((prev) => ({ ...prev, propertyId: value ?? 'prop-bkk' }))} size="xs" />
          <TextInput label="Invoice Date" type="date" value={form.invoiceDate} onChange={(event) => setForm((prev) => ({ ...prev, invoiceDate: event.currentTarget.value }))} size="xs" />
          <TextInput label="Due Date" type="date" value={form.dueDate} onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.currentTarget.value }))} size="xs" />
          <NumberInput label="Amount" description="Receivable amount before collection." thousandSeparator="," decimalScale={2} fixedDecimalScale min={0} value={form.amount} onChange={(value) => setForm((prev) => ({ ...prev, amount: Number(value ?? 0), balance: Number(value ?? 0) }))} size="xs" />
          <Select label="Status" data={['Open', 'Collected', 'Overdue', 'Credit Note']} value={form.status} onChange={(value) => setForm((prev) => ({ ...prev, status: (value ?? 'Open') as typeof form.status }))} size="xs" />
          <Button onClick={() => createMutation.mutate()} loading={createMutation.isPending}>Save Invoice</Button>
        </Stack>
      </Modal>
    </Stack>
  )
}
