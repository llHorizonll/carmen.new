import { Badge, Button, Menu, ScrollArea, Stack, Text } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { useAuthStore } from '../../features/auth/auth.store'
import { useTenantStore } from '../../stores/tenant.store'
import { tenants } from '../../lib/mockData'

export function TenantSwitcher() {
  const selectedTenantId = useTenantStore((state) => state.selectedTenantId)
  const setTenant = useAuthStore((state) => state.setActiveTenant)
  const activeTenant = tenants.find((tenant) => tenant.id === selectedTenantId) ?? tenants[0]

  return (
    <Menu shadow="lg" width={340} position="bottom-start" withinPortal>
      <Menu.Target>
        <Button variant="subtle" rightSection={<IconChevronDown size={14} />} className="tenant-switcher-button">
          <Stack gap={0} align="flex-start">
            <Text className="ui-label" c="rgba(255,255,255,.82)" fw={700}>
              Tenant
            </Text>
            <Text size="sm" fw={600} lineClamp={1}>
              {activeTenant?.groupName ?? 'Select tenant'}
            </Text>
          </Stack>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <ScrollArea h={260}>
          <Stack gap={4}>
            {tenants.map((tenant) => (
              <Menu.Item key={tenant.id} onClick={() => setTenant(tenant.id)}>
                <Stack gap={2}>
                  <Text fw={700}>{tenant.groupName}</Text>
                  <Text size="xs" c="rgba(255,255,255,.76)" fw={500}>
                    {tenant.region} | {tenant.activeProperties} properties
                  </Text>
                  <Badge variant="light" color={tenant.closeStatus === 'Hard Close' ? 'teal' : tenant.closeStatus === 'Soft Close' ? 'yellow' : 'gray'}>
                    {tenant.fiscalPeriod} | {tenant.closeStatus}
                  </Badge>
                </Stack>
              </Menu.Item>
            ))}
          </Stack>
        </ScrollArea>
      </Menu.Dropdown>
    </Menu>
  )
}
