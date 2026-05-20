import { Badge, Stack, Text } from '@mantine/core'
import { PageHeader } from '../../components/ui/PageHeader'
import { PremiumCard } from '../../components/ui/PremiumCard'

export function TenantAdministrationPage() {
  return (
    <Stack gap="md">
      <PageHeader badge={<Badge variant="light" color="gray">Tenant Admin</Badge>} title="Tenant Administration" subtitle="Manage tenant policy, property access, and operational controls." />
      <PremiumCard p="md">
        <Text fw={700}>Tenant administration</Text>
        <Text size="sm" c="dimmed">Configure tenant-level access policy, fiscal defaults, and property mapping for finance teams.</Text>
      </PremiumCard>
    </Stack>
  )
}
