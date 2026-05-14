import { Badge, Box, Divider, Grid, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { StatCard } from '../../components/ui/StatCard'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { LiveIndicator } from '../../components/ui/LiveIndicator'
import { PremiumCard } from '../../components/ui/PremiumCard'
import { FinancialTable } from '../../components/tables/FinancialTable'
import { useAuthStore } from '../auth/auth.store'
import { useTenantStore } from '../../stores/tenant.store'
import { useNotificationStore } from '../../stores/notification.store'
import { fetchDashboardSnapshot, makeQueryKey } from '../../lib/pocketbase'
import { formatCurrency, formatDateTime } from '../../lib/formatters'
import { CloseProgressCard } from './components/CloseProgressCard'
import { RealtimeActivityFeed } from './components/RealtimeActivityFeed'
import { HotelPerformanceGrid } from './components/HotelPerformanceGrid'
import { PendingApprovalsCard } from './components/PendingApprovalsCard'
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
        Cell: ({ cell }) => <span className="mono fin-number">{formatCurrency(cell.getValue<number>())}</span>,
        mantineTableBodyCellProps: { align: 'right' },
      },
      {
        accessorKey: 'credit',
        header: 'Credit',
        size: 110,
        Cell: ({ cell }) => <span className="mono fin-number">{formatCurrency(cell.getValue<number>())}</span>,
        mantineTableBodyCellProps: { align: 'right' },
      },
      {
        accessorKey: 'difference',
        header: 'Difference',
        size: 110,
        Cell: ({ cell }) => (
          <Text fw={600} c={Math.abs(cell.getValue<number>()) < 0.005 ? 'teal' : 'red'} ta="right" className="mono fin-number">
            {formatCurrency(cell.getValue<number>())}
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
    <Stack gap="md" className="dashboard-page">
      <PremiumCard p="md" className="dashboard-hero">
        <Stack gap="sm">
          <Group justify="space-between" align="flex-start" wrap="wrap">
            <Box>
              <Group gap="xs" mb={6}>
                <Badge variant="light" color="teal">
                  {connectionStatus === 'live' ? 'Live websocket' : connectionStatus}
                </Badge>
                <Badge variant="light" color="gray">
                  {snapshot?.fiscalPeriod ?? fiscalPeriod}
                </Badge>
              </Group>
              <Title order={1} className="page-title">
                Dashboard
              </Title>
              <Text c="rgba(255,255,255,.76)" maw={760} size="sm" fw={500} lh={1.55}>
                Operational finance overview for tenant-aware hotel accounting teams.
              </Text>
            </Box>
            <Stack gap={4} align="flex-end">
              <LiveIndicator status={connectionStatus} label={lastSyncAt ? `Synced ${formatDateTime(lastSyncAt)}` : 'Waiting for sync'} />
              <Text className="ui-label" c="rgba(255,255,255,.82)" fw={700}>
                Property {selectedPropertyId}
              </Text>
            </Stack>
          </Group>
          <Divider color="rgba(148,163,184,0.16)" />
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="sm" className="dashboard-metrics">
            <StatCard label="Cash position" value={formatCurrency(snapshot?.cashPosition ?? 0)} delta="Liquidity across active property" trend="up" hint="Live liquidity" />
            <StatCard label="Daily revenue" value={formatCurrency(snapshot?.dailyRevenue ?? 0)} delta="Today vs prior close" trend="up" />
            <StatCard label="Outstanding AP" value={formatCurrency(snapshot?.outstandingAP ?? 0)} delta="Payables pending approval" trend="down" />
            <StatCard label="Outstanding AR" value={formatCurrency(snapshot?.outstandingAR ?? 0)} delta="Receivables aging exposure" trend="up" />
          </SimpleGrid>
        </Stack>
      </PremiumCard>

      <Grid style={{ gap: 'var(--mantine-spacing-md)' }} align="stretch">
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack gap="md">
            <CloseProgressCard value={snapshot?.closeProgress ?? 0} />
            <PendingApprovalsCard count={snapshot?.pendingApprovals ?? 0} details="AP, GL, and payment queue items" />
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 4 }}>
          <PremiumCard p="md" className="dashboard-panel">
            <Stack gap="sm">
              <Group justify="space-between">
                <div>
                  <Text className="ui-label" c="rgba(255,255,255,.82)" fw={700}>
                    Exceptions
                  </Text>
                  <Title order={2} className="dashboard-count">
                    {snapshot?.exceptions ?? 0}
                  </Title>
                </div>
                <Badge variant="light" color="red">
                  Income audit
                </Badge>
              </Group>
              <Text size="sm" c="rgba(255,255,255,.76)" fw={500}>
                Anomalies requiring review before close.
              </Text>
              <Divider color="rgba(148,163,184,0.12)" />
              {snapshot?.anomalies.map((anomaly) => (
                <Group key={anomaly.id} justify="space-between" wrap="nowrap">
                  <div>
                    <Text fw={600}>{anomaly.title}</Text>
                    <Text size="xs" c="rgba(255,255,255,.76)" fw={500}>
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

        <Grid.Col span={{ base: 12, lg: 4 }}>
          <RealtimeActivityFeed items={snapshot?.activities ?? []} />
        </Grid.Col>
      </Grid>

      <Grid style={{ gap: 'var(--mantine-spacing-md)' }}>
        <Grid.Col span={{ base: 12, xl: 7 }}>
          <PremiumCard p="md" className="dashboard-panel">
            <Stack gap="sm">
              <Group justify="space-between">
                <div>
                  <Text fw={700}>Property performance</Text>
                  <Text size="sm" c="rgba(255,255,255,.76)" fw={500}>
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
          <FinancialTable
            data={snapshot?.recentJournals ?? []}
            columns={journalColumns}
            title="Recent journal entries"
            subtitle="Posted and draft journals in the active tenant."
            footer={
              <Group justify="space-between">
                <Text size="sm" c="rgba(255,255,255,.76)" fw={500}>
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
