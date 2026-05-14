import { Badge, Button, Grid, Group, Select, Stack, Text, TextInput } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { MRT_ColumnDef } from 'mantine-react-table'
import { PageHeader } from '../../components/ui/PageHeader'
import { PremiumCard } from '../../components/ui/PremiumCard'
import { FinancialTable } from '../../components/tables/FinancialTable'
import { useAuthStore } from '../auth/auth.store'
import { useTenantStore } from '../../stores/tenant.store'
import { fetchTrialBalance } from '../../lib/pocketbase'
import { formatCompactAmount } from '../../lib/formatters'

export function TrialBalanceReportPage() {
  const tenantId = useAuthStore((state) => state.activeTenantId) ?? 'tenant-carmen'
  const fiscalPeriod = useTenantStore((state) => state.fiscalPeriod)
  const [property, setProperty] = useState('all')
  const [period, setPeriod] = useState(fiscalPeriod)
  const [accountRange, setAccountRange] = useState('')

  const query = useQuery({
    queryKey: ['trial-balance', tenantId, fiscalPeriod, property, period, accountRange],
    queryFn: () => fetchTrialBalance({ tenantId, fiscalPeriod }),
  })

  const rows = query.data ?? []
  const columns = useMemo<MRT_ColumnDef<(typeof rows)[number]>[]>(
    () => [
      { accessorKey: 'accountCode', header: 'Account Code' },
      { accessorKey: 'accountName', header: 'Account Name', size: 220 },
      { accessorKey: 'openingDebit', header: 'Opening Debit', Cell: ({ cell }) => <span className="mono fin-number">{formatCompactAmount(cell.getValue<number>())}</span>, mantineTableBodyCellProps: { align: 'right' } },
      { accessorKey: 'openingCredit', header: 'Opening Credit', Cell: ({ cell }) => <span className="mono fin-number">{formatCompactAmount(cell.getValue<number>())}</span>, mantineTableBodyCellProps: { align: 'right' } },
      { accessorKey: 'periodDebit', header: 'Period Debit', Cell: ({ cell }) => <span className="mono fin-number">{formatCompactAmount(cell.getValue<number>())}</span>, mantineTableBodyCellProps: { align: 'right' } },
      { accessorKey: 'periodCredit', header: 'Period Credit', Cell: ({ cell }) => <span className="mono fin-number">{formatCompactAmount(cell.getValue<number>())}</span>, mantineTableBodyCellProps: { align: 'right' } },
      { accessorKey: 'closingDebit', header: 'Closing Debit', Cell: ({ cell }) => <span className="mono fin-number">{formatCompactAmount(cell.getValue<number>())}</span>, mantineTableBodyCellProps: { align: 'right' } },
      { accessorKey: 'closingCredit', header: 'Closing Credit', Cell: ({ cell }) => <span className="mono fin-number">{formatCompactAmount(cell.getValue<number>())}</span>, mantineTableBodyCellProps: { align: 'right' } },
    ],
    [],
  )

  const totals = rows.reduce(
    (acc, row) => ({
      openingDebit: acc.openingDebit + row.openingDebit,
      openingCredit: acc.openingCredit + row.openingCredit,
      periodDebit: acc.periodDebit + row.periodDebit,
      periodCredit: acc.periodCredit + row.periodCredit,
      closingDebit: acc.closingDebit + row.closingDebit,
      closingCredit: acc.closingCredit + row.closingCredit,
    }),
    { openingDebit: 0, openingCredit: 0, periodDebit: 0, periodCredit: 0, closingDebit: 0, closingCredit: 0 },
  )

  return (
    <Stack gap="md">
      <PageHeader badge={<Badge variant="light" color="teal">Reports</Badge>} title="Trial Balance Report" subtitle="Dense, sticky, and export-ready financial report layout." actions={<Group gap="xs"><Button variant="light">Excel</Button><Button variant="light">PDF</Button><Button variant="light">CSV</Button></Group>} />
      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}><Select label="Property" data={['all', 'Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya']} value={property} onChange={(value) => setProperty(value ?? 'all')} /></Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}><Select label="Fiscal year" data={['FY2026', 'FY2025']} value="FY2026" onChange={() => undefined} /></Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}><Select label="Period" data={['FY2026 P04', 'FY2026 P05']} value={period} onChange={(value) => setPeriod(value ?? fiscalPeriod)} /></Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}><TextInput label="Account range" value={accountRange} onChange={(event) => setAccountRange(event.currentTarget.value)} /></Grid.Col>
      </Grid>
      <Grid>
        {[
          ['Opening variance', 0],
          ['Period variance', 0],
          ['Closing variance', 0],
          ['Departments', rows.length],
        ].map(([label, value]) => (
          <Grid.Col key={String(label)} span={{ base: 12, sm: 6, xl: 3 }}>
            <PremiumCard p="md">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">{label}</Text>
              <Text fw={700}>{typeof value === 'number' ? formatCompactAmount(value as number) : String(value)}</Text>
            </PremiumCard>
          </Grid.Col>
        ))}
      </Grid>
      <FinancialTable
        data={rows}
        columns={columns}
        title="Trial balance"
        subtitle={`Tenant ${tenantId} · ${fiscalPeriod}`}
        footer={
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Summary footer</Text>
            <Group gap="lg">
              <Text size="sm">Closing debit {formatCompactAmount(totals.closingDebit)}</Text>
              <Text size="sm">Closing credit {formatCompactAmount(totals.closingCredit)}</Text>
            </Group>
          </Group>
        }
      />
    </Stack>
  )
}
