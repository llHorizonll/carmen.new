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
          <PremiumCard p="sm">
            <Stack gap="sm">
              <Text fw={700}>Profile Settings</Text>
              <TextInput label="Full Name" placeholder="Maya Srisuk" size="xs" />
              <TextInput label="Email" placeholder="maya.finance@carmen.cloud" size="xs" />
            </Stack>
          </PremiumCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xl: 6 }}>
          <PremiumCard p="sm">
            <Stack gap="sm">
              <Text fw={700}>Theme Settings</Text>
              <Group justify="space-between">
                <Text size="sm" c="gray.4" fw={500}>
                  Dark Mode First
                </Text>
                <Switch checked={colorScheme === 'dark'} onChange={toggleColorScheme} />
              </Group>
              <Select label="Default Fiscal Period" data={['FY2026 P04', 'FY2026 P05', 'FY2026 P06']} value={fiscalPeriod} onChange={(value) => value && setFiscalPeriod(value)} size="xs" />
            </Stack>
          </PremiumCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xl: 6 }}>
          <PremiumCard p="sm">
            <Stack gap="sm">
              <Text fw={700}>Notification Preferences</Text>
              <Group justify="space-between">
                <Text size="sm" c="gray.4" fw={500}>
                  Invoice Approvals
                </Text>
                <Switch defaultChecked />
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="gray.4" fw={500}>
                  Journal Postings
                </Text>
                <Switch defaultChecked />
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="gray.4" fw={500}>
                  Anomalies
                </Text>
                <Switch defaultChecked />
              </Group>
            </Stack>
          </PremiumCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xl: 6 }}>
          <PremiumCard p="sm">
            <Stack gap="sm">
              <Text fw={700}>Keyboard Shortcuts</Text>
              <Text size="sm" c="gray.4" fw={500}>
                Ctrl/Cmd + K | Open Search
              </Text>
              <Text size="sm" c="gray.4" fw={500}>
                N | New Journal Entry
              </Text>
              <Text size="sm" c="gray.4" fw={500}>
                G then A | Open AP
              </Text>
              <Text size="sm" c="gray.4" fw={500}>
                G then R | Open AR
              </Text>
            </Stack>
          </PremiumCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xl: 6 }}>
          <PremiumCard p="sm">
            <Stack gap="sm">
              <Text fw={700}>Security</Text>
              <Text size="sm" c="gray.4" fw={500}>
                MFA status, session duration, and device controls.
              </Text>
            </Stack>
          </PremiumCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xl: 6 }}>
          <PremiumCard p="sm">
            <Stack gap="sm">
              <Text fw={700}>Session List</Text>
              <Text size="sm" c="gray.4" fw={500}>
                Current and recent sign-in sessions appear here.
              </Text>
            </Stack>
          </PremiumCard>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
