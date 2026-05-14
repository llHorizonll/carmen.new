import { Badge, Grid, Group, Stack, Text } from '@mantine/core'
import { PageHeader } from '../../components/ui/PageHeader'
import { PremiumCard } from '../../components/ui/PremiumCard'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../auth/auth.store'
import { useTenantStore } from '../../stores/tenant.store'
import { fetchDashboardSnapshot, makeQueryKey } from '../../lib/pocketbase'
import { formatCurrency, formatDateTime } from '../../lib/formatters'

export function IncomeAuditPage() {
  const tenantId = useAuthStore((state) => state.activeTenantId) ?? 'tenant-carmen'
  const propertyId = useTenantStore((state) => state.selectedPropertyId) ?? 'prop-bkk'
  const fiscalPeriod = useTenantStore((state) => state.fiscalPeriod)
  const query = useQuery({ queryKey: makeQueryKey('income-audit', { tenantId, propertyId, fiscalPeriod }), queryFn: () => fetchDashboardSnapshot({ tenantId, propertyId, fiscalPeriod }) })
  const snapshot = query.data

  return (
    <Stack gap="md">
      <PageHeader badge={<Badge variant="light" color="orange">Income Audit</Badge>} title="Income Audit" subtitle="Night audit, POS checks, and revenue validation in a realtime operational view." />
      <Grid>
        {[
          ['Revenue today', formatCurrency(snapshot?.dailyRevenue ?? 0)],
          ['Exceptions', String(snapshot?.exceptions ?? 0)],
          ['Last sync', snapshot?.lastSyncAt ? formatDateTime(snapshot.lastSyncAt) : 'Pending'],
        ].map(([label, value]) => (
          <Grid.Col key={String(label)} span={{ base: 12, md: 4 }}>
            <PremiumCard p="md">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">{label}</Text>
              <Text fw={700}>{value}</Text>
            </PremiumCard>
          </Grid.Col>
        ))}
      </Grid>
      <Grid>
        <Grid.Col span={{ base: 12, xl: 8 }}>
          <PremiumCard p="md">
            <Stack gap="sm">
              <Text fw={700}>Anomaly feed</Text>
              {snapshot?.anomalies.map((anomaly) => (
                <Group key={anomaly.id} justify="space-between">
                  <div>
                    <Text fw={600}>{anomaly.title}</Text>
                    <Text size="sm" c="dimmed">{anomaly.property}</Text>
                  </div>
                  <Badge variant="light" color={anomaly.severity === 'High' ? 'red' : 'yellow'}>
                    {formatCurrency(anomaly.value)}
                  </Badge>
                </Group>
              ))}
            </Stack>
          </PremiumCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xl: 4 }}>
          <Stack gap="md">
            <PremiumCard p="md">
              <Text fw={700}>Validation rules</Text>
              <Text size="sm" c="dimmed">Revenue buckets, cashier reconciliation, and room audit checks.</Text>
            </PremiumCard>
            <PremiumCard p="md">
              <Text fw={700}>Realtime status</Text>
              <Text size="sm" c="dimmed">{snapshot?.connectionStatus}</Text>
            </PremiumCard>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
