import { Badge, Stack, Text } from '@mantine/core'
import { PageHeader } from '../../components/ui/PageHeader'
import { PremiumCard } from '../../components/ui/PremiumCard'

export function TenantAdministrationPage() {
  return (
    <Stack gap="md">
      <PageHeader badge={<Badge variant="light" color="gray">Tenant Admin</Badge>} title="Tenant Administration" subtitle="Tenant policy and property administration placeholder." />
      <PremiumCard p="md">
        <Text fw={700}>Tenant administration</Text>
        <Text size="sm" c="dimmed">Reserved for tenant configuration, access policy, and property mapping.</Text>
      </PremiumCard>
    </Stack>
  )
}
