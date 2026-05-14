import { Badge, Drawer, Grid, Stack, Text, TextInput } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { MRT_ColumnDef } from 'mantine-react-table'
import { useDisclosure } from '@mantine/hooks'
import { PageHeader } from '../../components/ui/PageHeader'
import { FinancialTable } from '../../components/tables/FinancialTable'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { PremiumCard } from '../../components/ui/PremiumCard'
import { useAuthStore } from '../auth/auth.store'
import { useTenantStore } from '../../stores/tenant.store'
import { fetchCustomers } from '../../lib/pocketbase'
import { formatCompactAmount, formatDate } from '../../lib/formatters'

export function CustomerManagementPage() {
  const tenantId = useAuthStore((state) => state.activeTenantId) ?? 'tenant-carmen'
  const fiscalPeriod = useTenantStore((state) => state.fiscalPeriod)
  const query = useQuery({ queryKey: ['customers', tenantId, fiscalPeriod], queryFn: () => fetchCustomers({ tenantId, fiscalPeriod }) })
  const customers = useMemo(() => query.data ?? [], [query.data])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<(typeof customers)[number] | null>(null)
  const [open, { open: openDrawer, close }] = useDisclosure(false)

  const filtered = useMemo(
    () => customers.filter((customer) => customer.name.toLowerCase().includes(search.toLowerCase()) || customer.code.toLowerCase().includes(search.toLowerCase())),
    [customers, search],
  )

  const columns = useMemo<MRT_ColumnDef<(typeof filtered)[number]>[]>(
    () => [
      { accessorKey: 'code', header: 'Customer Code' },
      { accessorKey: 'name', header: 'Customer Name', size: 220 },
      { accessorKey: 'segment', header: 'Segment' },
      {
        accessorKey: 'creditLimit',
        header: 'Credit Limit',
        Cell: ({ cell }) => <span className="mono fin-number">{formatCompactAmount(cell.getValue<number>())}</span>,
        mantineTableBodyCellProps: { align: 'right' },
      },
      {
        accessorKey: 'outstanding',
        header: 'Outstanding',
        Cell: ({ cell }) => <span className="mono fin-number">{formatCompactAmount(cell.getValue<number>())}</span>,
        mantineTableBodyCellProps: { align: 'right' },
      },
      { accessorKey: 'agingBucket', header: 'Aging Bucket' },
      { accessorKey: 'status', header: 'Status', Cell: ({ cell }) => <StatusBadge value={cell.getValue<string>()} /> },
      { accessorKey: 'lastInvoice', header: 'Last Invoice', Cell: ({ cell }) => formatDate(cell.getValue<string>()) },
    ],
    [],
  )

  return (
    <Stack gap="md">
      <PageHeader badge={<Badge variant="light" color="blue">Customer Management</Badge>} title="Customer Management" subtitle="Customer exposure, aging, and financial summary in one place." />
      <TextInput label="Search customer" value={search} onChange={(event) => setSearch(event.currentTarget.value)} />
      <Grid>
        {[
          ['Total outstanding', customers.reduce((sum, customer) => sum + customer.outstanding, 0)],
          ['Watch list', customers.filter((customer) => customer.status === 'Watch').length],
          ['Blocked', customers.filter((customer) => customer.status === 'Blocked').length],
          ['Credit limit', customers.reduce((sum, customer) => sum + customer.creditLimit, 0)],
        ].map(([label, value]) => (
          <Grid.Col key={String(label)} span={{ base: 12, sm: 6, xl: 3 }}>
            <PremiumCard p="md">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">{label}</Text>
              <Text fw={700}>{typeof value === 'number' ? formatCompactAmount(value as number) : String(value)}</Text>
            </PremiumCard>
          </Grid.Col>
        ))}
      </Grid>
      <FinancialTable data={filtered} columns={columns} title="Customers" subtitle={`Tenant ${tenantId} · ${fiscalPeriod}`} onRowClick={(row) => { setSelected(row); openDrawer(); }} />
      <Drawer opened={open} onClose={close} position="right" title="Customer summary" size="sm">
        <Stack gap="sm">
          <Text fw={700}>{selected?.name}</Text>
          <Text size="sm" c="dimmed">{selected?.segment}</Text>
          <StatusBadge value={selected?.status ?? 'Active'} />
          <Text size="sm" c="dimmed">Outstanding {formatCompactAmount(selected?.outstanding ?? 0)}</Text>
          <Text size="sm" c="dimmed">Credit limit {formatCompactAmount(selected?.creditLimit ?? 0)}</Text>
          <Text size="sm" c="dimmed">Last invoice {selected?.lastInvoice}</Text>
        </Stack>
      </Drawer>
    </Stack>
  )
}
