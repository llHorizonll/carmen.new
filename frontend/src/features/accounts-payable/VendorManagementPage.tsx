import { Badge, Drawer, Grid, Stack, Text, TextInput } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { MRT_ColumnDef } from 'mantine-react-table'
import { PageHeader } from '../../components/ui/PageHeader'
import { FinancialTable } from '../../components/tables/FinancialTable'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { PremiumCard } from '../../components/ui/PremiumCard'
import { useAuthStore } from '../auth/auth.store'
import { useTenantStore } from '../../stores/tenant.store'
import { fetchVendors, makeQueryKey } from '../../lib/pocketbase'
import { formatCompactAmount, formatDateTime } from '../../lib/formatters'
import { useDisclosure } from '@mantine/hooks'

export function VendorManagementPage() {
  const tenantId = useAuthStore((state) => state.activeTenantId) ?? 'tenant-carmen'
  const fiscalPeriod = useTenantStore((state) => state.fiscalPeriod)
  const query = useQuery({ queryKey: makeQueryKey('vendors', { tenantId, fiscalPeriod }), queryFn: () => fetchVendors({ tenantId, fiscalPeriod }) })
  const vendors = useMemo(() => query.data ?? [], [query.data])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<(typeof vendors)[number] | null>(null)
  const [open, { open: openDrawer, close }] = useDisclosure(false)

  const filtered = useMemo(
    () => vendors.filter((vendor) => vendor.name.toLowerCase().includes(search.toLowerCase()) || vendor.code.toLowerCase().includes(search.toLowerCase())),
    [search, vendors],
  )

  const columns = useMemo<MRT_ColumnDef<(typeof filtered)[number]>[]>(
    () => [
      { accessorKey: 'code', header: 'Vendor Code', size: 100 },
      { accessorKey: 'name', header: 'Vendor Name', size: 220 },
      { accessorKey: 'category', header: 'Category', size: 130 },
      { accessorKey: 'taxId', header: 'Tax ID', size: 140 },
      {
        accessorKey: 'balance',
        header: 'Balance',
        size: 110,
        Cell: ({ cell }) => <span className="mono fin-number">{formatCompactAmount(cell.getValue<number>())}</span>,
        mantineTableBodyCellProps: { align: 'right' },
      },
      { accessorKey: 'paymentTerms', header: 'Payment Terms', size: 120 },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ cell }) => <StatusBadge value={cell.getValue<string>()} />,
      },
      { accessorKey: 'lastActivity', header: 'Last Activity', Cell: ({ cell }) => formatDateTime(cell.getValue<string>()) },
    ],
    [],
  )

  return (
    <Stack gap="md">
      <PageHeader badge={<Badge variant="light" color="teal">Vendor Management</Badge>} title="Vendor Management" subtitle="Searchable vendor register with risk and payment context." />
      <TextInput label="Search vendor" value={search} onChange={(event) => setSearch(event.currentTarget.value)} />
      <Grid>
        {[
          ['Low risk', vendors.filter((vendor) => vendor.risk === 'Low').length],
          ['Review', vendors.filter((vendor) => vendor.status === 'Review').length],
          ['Hold', vendors.filter((vendor) => vendor.status === 'Hold').length],
          ['Balance', vendors.reduce((sum, vendor) => sum + vendor.balance, 0)],
        ].map(([label, value]) => (
          <Grid.Col key={String(label)} span={{ base: 12, sm: 6, xl: 3 }}>
            <PremiumCard p="md">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">{label}</Text>
              <Text fw={700}>{typeof value === 'number' && label === 'Balance' ? formatCompactAmount(value) : String(value)}</Text>
            </PremiumCard>
          </Grid.Col>
        ))}
      </Grid>
      <FinancialTable
        data={filtered}
        columns={columns}
        title="Vendors"
        subtitle={`Tenant ${tenantId} · ${fiscalPeriod}`}
        onRowClick={(row) => {
          setSelected(row)
          openDrawer()
        }}
      />
      <Drawer opened={open} onClose={close} position="right" title="Vendor detail" size="sm">
        <Stack gap="sm">
          <Text fw={700}>{selected?.name}</Text>
          <Text size="sm" c="dimmed">{selected?.code}</Text>
          <StatusBadge value={selected?.status ?? 'Active'} />
          <Text size="sm" c="dimmed">Category {selected?.category}</Text>
          <Text size="sm" c="dimmed">Balance {formatCompactAmount(selected?.balance ?? 0)}</Text>
          <Text size="sm" c="dimmed">Last activity {formatDateTime(selected?.lastActivity ?? new Date().toISOString())}</Text>
        </Stack>
      </Drawer>
    </Stack>
  )
}
