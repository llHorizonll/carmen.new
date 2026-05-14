import {
  ActionIcon,
  AppShell,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  List,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import {
  IconActivity,
  IconAdjustmentsAlt,
  IconArrowRight,
  IconBellRinging,
  IconBuildingSkyscraper,
  IconCircleCheck,
  IconClock,
  IconDatabase,
  IconShieldCheck,
  IconSparkles,
} from '@tabler/icons-react'
import { fetchDashboardSnapshot } from './data/dashboard'
import './App.css'

const metricToneMap = {
  success: 'teal',
  warning: 'orange',
  info: 'blue',
  neutral: 'gray',
} as const

function App() {
  const dashboardQuery = useQuery({
    queryKey: ['dashboard-snapshot'],
    queryFn: fetchDashboardSnapshot,
  })

  const snapshot = dashboardQuery.data

  return (
    <AppShell header={{ height: 84 }} className="app-shell">
      <AppShell.Header className="app-header">
        <Container size="xl" className="app-header-inner">
          <Group justify="space-between" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              <ThemeIcon radius="md" size="lg" variant="gradient" gradient={{ from: 'teal', to: 'cyan' }}>
                <IconBuildingSkyscraper size={18} />
              </ThemeIcon>
              <Box>
                <Text fw={700} size="sm" c="dimmed" tt="uppercase" lh={1}>
                  Carmen New
                </Text>
                <Title order={3} className="brand-title">
                  Hotel Accounting SaaS
                </Title>
              </Box>
            </Group>

            <Group gap="xs">
              <Badge variant="light" color="teal" leftSection={<IconShieldCheck size={12} />}>
                Tenant safe
              </Badge>
              <Badge variant="light" color="blue" leftSection={<IconBellRinging size={12} />}>
                Realtime ready
              </Badge>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main className="app-main">
        <Container size="xl" className="page-container">
          <div className="orb orb-one" />
          <div className="orb orb-two" />

          <Paper className="hero-card" radius="xl" p="xl" pos="relative">
            <LoadingOverlay visible={dashboardQuery.isLoading} overlayProps={{ blur: 2 }} />
            <Stack gap="lg">
              <Group justify="space-between" align="flex-start" wrap="wrap">
                <Stack gap={6} className="hero-copy">
                  <Badge variant="light" color="cyan" leftSection={<IconSparkles size={12} />}>
                    Connected GitHub repo, local starter online
                  </Badge>
                  <Title order={1} className="hero-title">
                    Tenant-first accounting, built for Windows Server and PocketBase realtime.
                  </Title>
                  <Text size="lg" c="dimmed" maw={760}>
                    This starter keeps the architecture aligned with the docs: strict TypeScript,
                    Mantine UI, TanStack Query, tenant isolation, and audit-ready workflows.
                  </Text>
                </Stack>

                <Card className="status-card" radius="lg" withBorder>
                  <Stack gap={8}>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Active company
                      </Text>
                      <Badge color="teal" variant="light">
                        {snapshot ? snapshot.userRole : 'Loading'}
                      </Badge>
                    </Group>
                    <Title order={4}>{snapshot ? snapshot.companyName : 'Loading company'}</Title>
                    <Text size="sm" c="dimmed">
                      Tenant: {snapshot ? snapshot.tenantName : 'Loading tenant'}
                    </Text>
                    <Divider my="xs" />
                    <Text size="sm" c="dimmed">
                      Last synced: {snapshot ? snapshot.lastSyncedAt : 'Refreshing...'}
                    </Text>
                    <Group gap="xs">
                      <ThemeIcon variant="light" color="cyan" radius="md">
                        <IconActivity size={16} />
                      </ThemeIcon>
                      <Text fw={600}>PocketBase websocket channel ready</Text>
                    </Group>
                  </Stack>
                </Card>
              </Group>

              <Group gap="sm">
                <Button radius="md" rightSection={<IconArrowRight size={16} />}>
                  Open accounting dashboard
                </Button>
                <Button variant="light" radius="md" leftSection={<IconAdjustmentsAlt size={16} />}>
                  Switch tenant
                </Button>
              </Group>
            </Stack>
          </Paper>

          <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="lg" mt="xl">
            {snapshot?.metrics.map((metric) => (
              <Card key={metric.label} className="metric-card" radius="xl" withBorder>
                <Stack gap={6}>
                  <Group justify="space-between" align="flex-start">
                    <Text size="sm" c="dimmed">
                      {metric.label}
                    </Text>
                    <ThemeIcon variant="light" color={metricToneMap[metric.tone]} radius="md">
                      <IconCircleCheck size={16} />
                    </ThemeIcon>
                  </Group>
                  <Title order={2} className="metric-value">
                    {metric.value}
                  </Title>
                  <Text size="sm" c="dimmed">
                    {metric.delta}
                  </Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg" mt="xl">
            <Card className="content-card" radius="xl" withBorder>
              <Stack gap="md">
                <Group justify="space-between" align="center">
                  <div>
                    <Text fw={700}>Core workflow</Text>
                    <Text size="sm" c="dimmed">
                      From auth to posting, every step stays tenant-aware.
                    </Text>
                  </div>
                  <ThemeIcon variant="light" color="cyan" radius="md">
                    <IconClock size={16} />
                  </ThemeIcon>
                </Group>
                <List spacing="md" icon={<IconCircleCheck size={16} />}>
                  {snapshot?.workflow.map((step) => (
                    <List.Item key={step.title}>
                      <Text fw={600}>{step.title}</Text>
                      <Text size="sm" c="dimmed">
                        {step.description}
                      </Text>
                    </List.Item>
                  ))}
                </List>
              </Stack>
            </Card>

            <Card className="content-card" radius="xl" withBorder>
              <Stack gap="md">
                <Group justify="space-between" align="center">
                  <div>
                    <Text fw={700}>Guardrails</Text>
                    <Text size="sm" c="dimmed">
                      Security and tenancy rules are built into the starter.
                    </Text>
                  </div>
                  <ThemeIcon variant="light" color="teal" radius="md">
                    <IconShieldCheck size={16} />
                  </ThemeIcon>
                </Group>
                <List spacing="md" icon={<IconShieldCheck size={16} />}>
                  {snapshot?.guardrails.map((item) => (
                    <List.Item key={item.title}>
                      <Text fw={600}>{item.title}</Text>
                      <Text size="sm" c="dimmed">
                        {item.description}
                      </Text>
                    </List.Item>
                  ))}
                </List>
              </Stack>
            </Card>
          </SimpleGrid>

          <Card className="content-card" radius="xl" withBorder mt="xl">
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <div>
                  <Text fw={700}>Module roadmap</Text>
                  <Text size="sm" c="dimmed">
                    The structure matches the blueprint and leaves room for AP, AR, and reporting.
                  </Text>
                </div>
                <ThemeIcon variant="light" color="blue" radius="md">
                  <IconDatabase size={16} />
                </ThemeIcon>
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="md">
                {snapshot?.modules.map((module) => (
                  <Card key={module.title} radius="lg" withBorder className="module-card">
                    <Stack gap={8}>
                      <Badge variant="light" color="blue">
                        {module.status}
                      </Badge>
                      <Text fw={700}>{module.title}</Text>
                      <Text size="sm" c="dimmed">
                        {module.description}
                      </Text>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>
            </Stack>
          </Card>

          <Paper radius="xl" p="lg" className="footer-card" mt="xl">
            <Group justify="space-between" wrap="wrap">
              <div>
                <Text fw={700}>Local start command</Text>
                <Text size="sm" c="dimmed">
                  Run <code>npm install</code> once, then <code>npm run dev</code> to launch on
                  localhost.
                </Text>
              </div>
              <Group gap="xs">
                <ActionIcon variant="light" color="teal" radius="md" size="lg">
                  <IconBellRinging size={16} />
                </ActionIcon>
                <Text size="sm" c="dimmed">
                  Realtime notifications are wired into the UI shell.
                </Text>
              </Group>
            </Group>
          </Paper>
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}

export default App
