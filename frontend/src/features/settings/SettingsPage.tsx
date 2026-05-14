import { Badge, Grid, Stack, Text } from '@mantine/core'
import { PageHeader } from '../../components/ui/PageHeader'
import { PremiumCard } from '../../components/ui/PremiumCard'

export function SettingsPage() {
  return (
    <Stack gap="md">
      <PageHeader badge={<Badge variant="light" color="gray">Settings</Badge>} title="Settings" subtitle="Administrative preferences and tenant configuration placeholders." />
      <Grid>
        {['Tenant policies', 'Workflow defaults', 'Audit rules', 'Notifications'].map((title) => (
          <Grid.Col key={title} span={{ base: 12, md: 6 }}>
            <PremiumCard p="md">
              <Text fw={700}>{title}</Text>
              <Text size="sm" c="gray.4" fw={500}>
                Placeholder configuration panel for {title.toLowerCase()}.
              </Text>
            </PremiumCard>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  )
}
