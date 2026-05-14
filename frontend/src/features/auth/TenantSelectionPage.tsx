import { Badge, Button, Card, Grid, Group, Select, Stack, Text, TextInput, Title } from '@mantine/core'
import { IconArrowRight, IconSearch } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from './auth.store'
import { useTenantStore } from '../../stores/tenant.store'
import { tenants } from '../../lib/mockData'
import { PremiumCard } from '../../components/ui/PremiumCard'

export function TenantSelectionPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const activeTenantId = useAuthStore((state) => state.activeTenantId)
  const setActiveTenant = useAuthStore((state) => state.setActiveTenant)
  const recentTenantIds = useTenantStore((state) => state.recentTenantIds)
  const pushRecentTenant = useTenantStore((state) => state.pushRecentTenant)
  const search = useTenantStore((state) => state.search)
  const setSearch = useTenantStore((state) => state.setSearch)
  const [selectedRecent, setSelectedRecent] = useState<string | null>(recentTenantIds[0] ?? null)

  const filteredTenants = useMemo(
    () => tenants.filter((tenant) => tenant.groupName.toLowerCase().includes(search.toLowerCase()) || tenant.region.toLowerCase().includes(search.toLowerCase())),
    [search],
  )

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const continueToApp = async (tenantId: string) => {
    setActiveTenant(tenantId)
    pushRecentTenant(tenantId)
    navigate('/app/dashboard')
  }

  return (
    <div className="tenant-page">
      <Stack gap="md">
        <PremiumCard p="lg">
          <Group justify="space-between" align="flex-start" wrap="wrap">
            <div>
              <Text className="ui-label" c="rgba(255,255,255,.82)" fw={700}>
                Tenant selection
              </Text>
              <Title order={1}>Choose the active hotel group</Title>
              <Text c="rgba(255,255,255,.76)" maw={760} size="sm" fw={500} lh={1.55}>
                Select the tenant that scopes all reporting, approvals, and realtime updates.
              </Text>
            </div>
            <Group gap="xs">
              <Badge variant="light" color="teal">
                Recent tenant ready
              </Badge>
              <Button variant="subtle" onClick={() => navigate('/login')}>
                Switch user
              </Button>
            </Group>
          </Group>
        </PremiumCard>

        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Group grow align="end" className="tenant-search-row">
              <TextInput
                label="Search tenant"
                placeholder="Hotel group or region"
                leftSection={<IconSearch size={14} />}
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
              />
              <Select
                label="Recent tenant"
                data={recentTenantIds.map((id) => ({ value: id, label: tenants.find((tenant) => tenant.id === id)?.groupName ?? id }))}
                value={selectedRecent}
                onChange={setSelectedRecent}
              />
            </Group>
          </Grid.Col>
        </Grid>

        <Grid>
          {filteredTenants.map((tenant) => {
            const isSelected = tenant.id === activeTenantId
            return (
              <Grid.Col key={tenant.id} span={{ base: 12, md: 6 }}>
                <Card className={`tenant-card premium-card ${isSelected ? 'selected' : ''}`} p="lg">
                  <Stack gap="sm">
                    <Group justify="space-between" align="flex-start">
                      <div>
                        <Text fw={700}>{tenant.groupName}</Text>
                        <Text size="sm" c="rgba(255,255,255,.76)" fw={500}>
                          {tenant.region}
                        </Text>
                      </div>
                      <Badge variant="light" color={tenant.closeStatus === 'Hard Close' ? 'teal' : tenant.closeStatus === 'Soft Close' ? 'yellow' : 'gray'}>
                        {tenant.closeStatus}
                      </Badge>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="rgba(255,255,255,.76)" fw={500}>
                        Active properties
                      </Text>
                      <Text fw={600}>{tenant.activeProperties}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="rgba(255,255,255,.76)" fw={500}>
                        Fiscal period
                      </Text>
                      <Text fw={600}>{tenant.fiscalPeriod}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="rgba(255,255,255,.76)" fw={500}>
                        Properties
                      </Text>
                      <Text fw={600} ta="right">
                        {tenant.propertyNames.slice(0, 2).join(' | ')}
                      </Text>
                    </Group>
                    <Button onClick={() => continueToApp(tenant.id)} rightSection={<IconArrowRight size={16} />}>
                      Continue
                    </Button>
                  </Stack>
                </Card>
              </Grid.Col>
            )
          })}
        </Grid>
      </Stack>
    </div>
  )
}
