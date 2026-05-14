import { Badge, Drawer, Grid, Stack, Text, TextInput, Select } from '@mantine/core'
import { useMemo, useState } from 'react'
import type { MRT_ColumnDef } from 'mantine-react-table'
import { PageHeader } from '../../components/ui/PageHeader'
import { FinancialTable } from '../../components/tables/FinancialTable'
import { PremiumCard } from '../../components/ui/PremiumCard'
import { auditLogs } from '../../lib/mockData'
import { formatDateTime } from '../../lib/formatters'
import { useDisclosure } from '@mantine/hooks'

export function AuditLogsPage() {
  const [userFilter, setUserFilter] = useState('all')
  const [moduleFilter, setModuleFilter] = useState('all')
  const [actionFilter, setActionFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [selected, setSelected] = useState<(typeof auditLogs)[number] | null>(null)
  const [open, { open: openDrawer, close }] = useDisclosure(false)

  const users = useMemo(() => ['all', ...new Set(auditLogs.map((log) => log.user))], [])
  const modules = useMemo(() => ['all', ...new Set(auditLogs.map((log) => log.module))], [])
  const actions = useMemo(() => ['all', ...new Set(auditLogs.map((log) => log.action))], [])

  const filtered = auditLogs.filter((log) => {
    const matchesUser = userFilter === 'all' || log.user === userFilter
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter
    const matchesAction = actionFilter === 'all' || log.action === actionFilter
    const matchesDate = !dateFilter || log.timestamp.startsWith(dateFilter)
    return matchesUser && matchesModule && matchesAction && matchesDate
  })

  const columns = useMemo<MRT_ColumnDef<(typeof filtered)[number]>[]>(
    () => [
      { accessorKey: 'timestamp', header: 'Timestamp', Cell: ({ cell }) => formatDateTime(cell.getValue<string>()) },
      { accessorKey: 'user', header: 'User' },
      { accessorKey: 'action', header: 'Action' },
      { accessorKey: 'module', header: 'Module' },
      { accessorKey: 'entity', header: 'Entity' },
      { accessorKey: 'property', header: 'Property' },
      { accessorKey: 'ipAddress', header: 'IP Address' },
      { accessorKey: 'status', header: 'Status' },
    ],
    [],
  )

  return (
    <Stack gap="md">
      <PageHeader badge={<Badge variant="light" color="gray">Audit Logs</Badge>} title="Audit Logs" subtitle="Dense, filterable audit trail with timeline detail drawer." />
      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}><Select label="User" data={users} value={userFilter} onChange={(value) => setUserFilter(value ?? 'all')} /></Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}><Select label="Module" data={modules} value={moduleFilter} onChange={(value) => setModuleFilter(value ?? 'all')} /></Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}><Select label="Action" data={actions} value={actionFilter} onChange={(value) => setActionFilter(value ?? 'all')} /></Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}><TextInput label="Date" type="date" value={dateFilter} onChange={(event) => setDateFilter(event.currentTarget.value)} /></Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, xl: 3 }}><PremiumCard p="md"><Text size="xs" tt="uppercase" fw={600} c="gray.4" style={{ letterSpacing: '0.08em' }}>Success</Text><Text fw={700}>{auditLogs.filter((log) => log.status === 'Success').length}</Text></PremiumCard></Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, xl: 3 }}><PremiumCard p="md"><Text size="xs" tt="uppercase" fw={600} c="gray.4" style={{ letterSpacing: '0.08em' }}>Pending</Text><Text fw={700}>{auditLogs.filter((log) => log.status === 'Pending').length}</Text></PremiumCard></Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, xl: 3 }}><PremiumCard p="md"><Text size="xs" tt="uppercase" fw={600} c="gray.4" style={{ letterSpacing: '0.08em' }}>Failed</Text><Text fw={700}>{auditLogs.filter((log) => log.status === 'Failed').length}</Text></PremiumCard></Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, xl: 3 }}><PremiumCard p="md"><Text size="xs" tt="uppercase" fw={600} c="gray.4" style={{ letterSpacing: '0.08em' }}>Rows</Text><Text fw={700}>{filtered.length}</Text></PremiumCard></Grid.Col>
      </Grid>
      <FinancialTable data={filtered} columns={columns} title="Audit entries" onRowClick={(row) => { setSelected(row); openDrawer(); }} />
      <Drawer opened={open} onClose={close} position="right" title="Audit detail" size="sm">
        <Stack gap="sm">
          <Text fw={700}>{selected?.action}</Text>
          <Text size="sm" c="gray.4" fw={500}>{selected?.detail}</Text>
          <Text size="sm" c="gray.4" fw={500}>Module {selected?.module}</Text>
          <Text size="sm" c="gray.4" fw={500}>Entity {selected?.entity}</Text>
          <Text size="sm" c="gray.4" fw={500}>Property {selected?.property}</Text>
          <Text size="sm" c="gray.4" fw={500}>IP {selected?.ipAddress}</Text>
          <Text size="sm" c="gray.4" fw={500}>Timestamp {formatDateTime(selected?.timestamp ?? new Date().toISOString())}</Text>
        </Stack>
      </Drawer>
    </Stack>
  )
}
