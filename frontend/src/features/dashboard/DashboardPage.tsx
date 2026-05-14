import { Badge, Grid, Group, Stack, Text, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { StatCard } from '../../components/ui/StatCard'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { LiveIndicator } from '../../components/ui/LiveIndicator'
import { PremiumCard } from '../../components/ui/PremiumCard'
import { FinancialTable } from '../../components/tables/FinancialTable'
import { useAuthStore } from '../auth/auth.store'
import { useTenantStore } from '../../stores/tenant.store'
import { useNotificationStore } from '../../stores/notification.store'
import { fetchDashboardSnapshot, makeQueryKey } from '../../lib/pocketbase'
import { formatCompactAmount, formatCurrency, formatDateTime } from '../../lib/formatters'
import { CashPositionCard } from './components/CashPositionCard'
import { RevenueCard } from './components/RevenueCard'
import { PendingApprovalsCard } from './components/PendingApprovalsCard'
import { RealtimeActivityFeed } from './components/RealtimeActivityFeed'
import { HotelPerformanceGrid } from './components/HotelPerformanceGrid'
import { CloseProgressCard } from './components/CloseProgressCard'
import type { MRT_ColumnDef } from 'mantine-react-table'
import type { JournalEntry } from '../../lib/mockData'

export function DashboardPage() {
  const activeTenantId = useAuthStore((state) => state.activeTenantId) ?? 'tenant-carmen'
  const selectedPropertyId = useTenantStore((state) => state.selectedPropertyId) ?? 'prop-bkk'
  const fiscalPeriod = useTenantStore((state) => state.fiscalPeriod)
  const connectionStatus = useNotificationStore((state) => state.connectionStatus)
  const lastSyncAt = useNotificationStore((state) => state.lastSyncAt)

  const snapshotQuery = useQuery({
    queryKey: makeQueryKey('dashboard', { tenantId: activeTenantId, propertyId: selectedPropertyId, fiscalPeriod }),
    queryFn: () => fetchDashboardSnapshot({ tenantId: activeTenantId, propertyId: selectedPropertyId, fiscalPeriod }),
  })

  const snapshot = snapshotQuery.data

  const journalColumns = useMemo<MRT_ColumnDef<JournalEntry>[]>(
    () => [
      { accessorKey: 'jeNumber', header: 'JE Number', size: 110 },
      { accessorKey: 'date', header: 'Date', size: 100 },
      { accessorKey: 'property', header: 'Property', size: 170 },
      { accessorKey: 'source', header: 'Source', size: 120 },
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
          <Text fw={600} c={Math.abs(cell.getValue<number>()) < 0.005 ? 'teal' : 'red'} ta="right" className="mono fin-number">
            {formatCompactAmount(cell.getValue<number>())}
          </Text>
        ),
        mantineTableBodyCellProps: { align: 'right' },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        Cell: ({ cell }) => <StatusBadge value={cell.getValue<string>()} />,
      },
      { accessorKey: 'postedBy', header: 'Posted By', size: 130 },
      {
        accessorKey: 'updatedAt',
        header: 'Updated At',
        size: 150,
        Cell: ({ cell }) => formatDateTime(cell.getValue<string>()),
      },
    ],
    [],
  )

  return (
    <Stack gap="md">
      <PageHeader
        badge={<Badge variant="light" color="teal">{connectionStatus === 'live' ? 'Live websocket' : connectionStatus}</Badge>}
        title="Dashboard"
        subtitle="Dense operational finance overview for tenant-aware hotel accounting teams."
        actions={<LiveIndicator status={connectionStatus} label={lastSyncAt ? `Last sync ${formatDateTime(lastSyncAt)}` : 'Waiting for sync'} />}
      />

      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, xl: 3 }}>
          <CashPositionCard value={formatCurrency(snapshot?.cashPosition ?? 0)} delta="Liquidity across active property" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, xl: 3 }}>
          <RevenueCard value={formatCurrency(snapshot?.dailyRevenue ?? 0)} delta="Today vs prior close" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, xl: 3 }}>
          <StatCard label="Outstanding AP" value={formatCurrency(snapshot?.outstandingAP ?? 0)} delta="Payables pending approval" trend="down" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, xl: 3 }}>
          <StatCard label="Outstanding AR" value={formatCurrency(snapshot?.outstandingAR ?? 0)} delta="Receivables aging exposure" trend="up" />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <CloseProgressCard value={snapshot?.closeProgress ?? 0} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <PendingApprovalsCard count={snapshot?.pendingApprovals ?? 0} details="AP, GL, and payment queue items" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <PremiumCard p="md">
            <Stack gap={8}>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Exceptions
              </Text>
              <Title order={2}>{snapshot?.exceptions ?? 0}</Title>
              <Text size="sm" c="dimmed">
                Income audit anomalies requiring review
              </Text>
            </Stack>
          </PremiumCard>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, xl: 7 }}>
          <PremiumCard p="md">
            <Stack gap="sm">
              <Group justify="space-between">
                <div>
                  <Text fw={700}>Property performance</Text>
                  <Text size="sm" c="dimmed">
                    Occupancy, margin, and revenue signal by property.
                  </Text>
                </div>
                <Badge variant="light" color="gray">
                  Dense grid
                </Badge>
              </Group>
              <HotelPerformanceGrid items={snapshot?.propertyPerformance ?? []} />
            </Stack>
          </PremiumCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xl: 5 }}>
          <RealtimeActivityFeed items={snapshot?.activities ?? []} />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, xl: 5 }}>
          <PremiumCard p="md">
            <Stack gap="sm">
              <Text fw={700}>Income audit anomalies</Text>
              {snapshot?.anomalies.map((anomaly) => (
                <Group key={anomaly.id} justify="space-between">
                  <div>
                    <Text fw={600}>{anomaly.title}</Text>
                    <Text size="sm" c="dimmed">
                      {anomaly.property}
                    </Text>
                  </div>
                  <Badge variant="light" color={anomaly.severity === 'High' ? 'red' : anomaly.severity === 'Medium' ? 'yellow' : 'gray'}>
                    {formatCurrency(anomaly.value)}
                  </Badge>
                </Group>
              ))}
            </Stack>
          </PremiumCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xl: 7 }}>
          <FinancialTable
            data={snapshot?.recentJournals ?? []}
            columns={journalColumns}
            title="Recent journal entries"
            subtitle="Posted and draft journals in the active tenant."
            footer={
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Summary row
                </Text>
                <Group gap="md">
                  <Text size="sm">Debit {formatCurrency(snapshot?.recentJournals.reduce((sum, item) => sum + item.debit, 0) ?? 0)}</Text>
                  <Text size="sm">Credit {formatCurrency(snapshot?.recentJournals.reduce((sum, item) => sum + item.credit, 0) ?? 0)}</Text>
                </Group>
              </Group>
            }
          />
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
