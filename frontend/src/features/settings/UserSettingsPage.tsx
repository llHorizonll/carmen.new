import { Badge, Grid, Group, Select, Stack, Switch, Text, TextInput } from '@mantine/core'
import { PageHeader } from '../../components/ui/PageHeader'
import { PremiumCard } from '../../components/ui/PremiumCard'
import { useAppStore } from '../../stores/app.store'
import { useTenantStore } from '../../stores/tenant.store'

export function UserSettingsPage() {
  const colorScheme = useAppStore((state) => state.colorScheme)
  const toggleColorScheme = useAppStore((state) => state.toggleColorScheme)
  const fiscalPeriod = useTenantStore((state) => state.fiscalPeriod)
  const setFiscalPeriod = useTenantStore((state) => state.setFiscalPeriod)

  return (
    <Stack gap="md">
      <PageHeader badge={<Badge variant="light" color="gray">User Settings</Badge>} title="User Settings" subtitle="Profile, theme, notifications, shortcuts, and security preferences." />
      <Grid>
        <Grid.Col span={{ base: 12, xl: 6 }}>
          <PremiumCard p="md">
            <Stack gap="sm">
              <Text fw={700}>Profile settings</Text>
              <TextInput label="Full name" placeholder="Maya Srisuk" />
              <TextInput label="Email" placeholder="maya.finance@carmen.cloud" />
            </Stack>
          </PremiumCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xl: 6 }}>
          <PremiumCard p="md">
            <Stack gap="sm">
              <Text fw={700}>Theme settings</Text>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Dark mode first</Text>
                <Switch checked={colorScheme === 'dark'} onChange={toggleColorScheme} />
              </Group>
              <Select label="Default fiscal period" data={['FY2026 P04', 'FY2026 P05', 'FY2026 P06']} value={fiscalPeriod} onChange={(value) => value && setFiscalPeriod(value)} />
            </Stack>
          </PremiumCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xl: 6 }}>
          <PremiumCard p="md">
            <Stack gap="sm">
              <Text fw={700}>Notification preferences</Text>
              <Group justify="space-between"><Text size="sm" c="dimmed">Invoice approvals</Text><Switch defaultChecked /></Group>
              <Group justify="space-between"><Text size="sm" c="dimmed">Journal postings</Text><Switch defaultChecked /></Group>
              <Group justify="space-between"><Text size="sm" c="dimmed">Anomalies</Text><Switch defaultChecked /></Group>
            </Stack>
          </PremiumCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xl: 6 }}>
          <PremiumCard p="md">
            <Stack gap="sm">
              <Text fw={700}>Keyboard shortcuts</Text>
              <Text size="sm" c="dimmed">Ctrl/Cmd + K · command menu</Text>
              <Text size="sm" c="dimmed">N · new journal entry</Text>
              <Text size="sm" c="dimmed">G then A · open AP</Text>
              <Text size="sm" c="dimmed">G then R · open AR</Text>
            </Stack>
          </PremiumCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xl: 6 }}>
          <PremiumCard p="md">
            <Stack gap="sm">
              <Text fw={700}>Security</Text>
              <Text size="sm" c="dimmed">MFA status, session duration, and device controls.</Text>
            </Stack>
          </PremiumCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xl: 6 }}>
          <PremiumCard p="md">
            <Stack gap="sm">
              <Text fw={700}>Session list</Text>
              <Text size="sm" c="dimmed">Placeholder for current and recent sessions.</Text>
            </Stack>
          </PremiumCard>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
