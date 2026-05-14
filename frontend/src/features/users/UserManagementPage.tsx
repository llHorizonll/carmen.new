import { Badge, Drawer, Grid, Stack, Text, Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { PageHeader } from '../../components/ui/PageHeader'
import { PremiumCard } from '../../components/ui/PremiumCard'
import { FinancialTable } from '../../components/tables/FinancialTable'
import { users } from '../../lib/mockData'
import { formatDateTime } from '../../lib/formatters'
import type { MRT_ColumnDef } from 'mantine-react-table'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { useState, useMemo } from 'react'

export function UserManagementPage() {
  const [selected, setSelected] = useState<(typeof users)[number] | null>(null)
  const [open, { open: openDrawer, close }] = useDisclosure(false)

  const columns = useMemo<MRT_ColumnDef<(typeof users)[number]>[]>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'email', header: 'Email', size: 220 },
      { accessorKey: 'role', header: 'Role' },
      { accessorKey: 'tenantAccess', header: 'Tenant Access', Cell: ({ cell }) => (cell.getValue<string[]>().join(', ')) },
      { accessorKey: 'properties', header: 'Properties', Cell: ({ cell }) => (cell.getValue<string[]>().join(', ')) },
      { accessorKey: 'mfa', header: 'MFA', Cell: ({ cell }) => <StatusBadge value={cell.getValue<string>()} /> },
      { accessorKey: 'lastLogin', header: 'Last Login', Cell: ({ cell }) => formatDateTime(cell.getValue<string>()) },
      { accessorKey: 'status', header: 'Status', Cell: ({ cell }) => <StatusBadge value={cell.getValue<string>()} /> },
    ],
    [],
  )

  return (
    <Stack gap="md">
      <PageHeader badge={<Badge variant="light" color="blue">Users</Badge>} title="User Management" subtitle="Tenant access, roles, MFA status, and invite controls." actions={<Button>Invite user</Button>} />
      <Grid>
        <Grid.Col span={{ base: 12, xl: 8 }}>
          <FinancialTable data={users} columns={columns} onRowClick={(row) => { setSelected(row); openDrawer(); }} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, xl: 4 }}>
          <Stack gap="md">
            <PremiumCard p="md">
              <Stack gap={4}>
                <Text fw={700}>Permission matrix preview</Text>
                <Text size="sm" c="dimmed">Role-based access aligned to tenant and property scope.</Text>
              </Stack>
            </PremiumCard>
            <PremiumCard p="md">
              <Stack gap={4}>
                <Text fw={700}>Invite user</Text>
                <Text size="sm" c="dimmed">Placeholder invite workflow for finance operations teams.</Text>
              </Stack>
            </PremiumCard>
          </Stack>
        </Grid.Col>
      </Grid>
      <Drawer opened={open} onClose={close} position="right" title="User detail" size="sm">
        <Stack gap="sm">
          <Text fw={700}>{selected?.name}</Text>
          <Text size="sm" c="dimmed">{selected?.email}</Text>
          <Text size="sm" c="dimmed">Role {selected?.role}</Text>
          <StatusBadge value={selected?.status ?? 'Active'} />
          <Text size="sm" c="dimmed">Tenant access {selected?.tenantAccess.join(', ')}</Text>
          <Text size="sm" c="dimmed">Properties {selected?.properties.join(', ')}</Text>
          <Text size="sm" c="dimmed">MFA {selected?.mfa}</Text>
        </Stack>
      </Drawer>
    </Stack>
  )
}
