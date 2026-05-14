import { ActionIcon, Avatar, Breadcrumbs, Button, Group, Menu, Select, Text } from '@mantine/core'
import { IconBell, IconChevronRight, IconCommand, IconMoon, IconSun, IconLogout } from '@tabler/icons-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '../../stores/app.store'
import { useAuthStore } from '../../features/auth/auth.store'
import { useNotificationStore } from '../../stores/notification.store'
import { useTenantStore } from '../../stores/tenant.store'
import { LiveIndicator } from '../ui/LiveIndicator'
import { TenantSwitcher } from './TenantSwitcher'

const breadcrumbMap: Record<string, string> = {
  dashboard: 'Dashboard',
  'general-ledger': 'General Ledger',
  'accounts-payable': 'Accounts Payable',
  'accounts-receivable': 'Accounts Receivable',
  'income-audit': 'Income Audit',
  'trial-balance': 'Trial Balance',
  approvals: 'Approval Queue',
  'audit-logs': 'Audit Logs',
  users: 'Users',
  notifications: 'Notifications',
  settings: 'Settings',
  'user-settings': 'User Settings',
  'tenant-admin': 'Tenant Admin',
}

export function Topbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const colorScheme = useAppStore((state) => state.colorScheme)
  const toggleColorScheme = useAppStore((state) => state.toggleColorScheme)
  const setCommandMenuOpen = useAppStore((state) => state.setCommandMenuOpen)
  const setNotificationDrawerOpen = useAppStore((state) => state.setNotificationDrawerOpen)
  const session = useAuthStore((state) => state.session)
  const logout = useAuthStore((state) => state.logout)
  const connectionStatus = useNotificationStore((state) => state.connectionStatus)
  const lastSyncAt = useNotificationStore((state) => state.lastSyncAt)
  const setFiscalPeriod = useTenantStore((state) => state.setFiscalPeriod)
  const setProperty = useTenantStore((state) => state.setProperty)
  const fiscalPeriod = useTenantStore((state) => state.fiscalPeriod)
  const selectedPropertyId = useTenantStore((state) => state.selectedPropertyId)

  const routeKey = location.pathname.split('/').filter(Boolean).at(-1) ?? 'dashboard'
  const crumbs = location.pathname.startsWith('/app')
    ? ['Carmen Cloud', breadcrumbMap[routeKey] ?? 'Workspace']
    : ['Carmen Cloud']

  return (
    <Group justify="space-between" align="center" wrap="nowrap" className="shell-topbar-inner">
      <Group gap="sm" wrap="nowrap" className="shell-breadcrumbs">
        <Breadcrumbs separator={<IconChevronRight size={12} />}>
          {crumbs.map((crumb) => (
            <Text key={crumb} size="sm" c="rgba(255,255,255,.72)" fw={600}>
              {crumb}
            </Text>
          ))}
        </Breadcrumbs>
      </Group>

      <Group gap="xs" wrap="nowrap" className="shell-topbar-actions">
        <TenantSwitcher />
        <Select
          value={fiscalPeriod}
          onChange={(value) => value && setFiscalPeriod(value)}
          data={['FY2026 P04', 'FY2026 P05', 'FY2026 P06']}
          size="sm"
          w={140}
          comboboxProps={{ withinPortal: false }}
        />
        <Select
          value={selectedPropertyId}
          onChange={(value) => value && setProperty(value)}
          data={[
            { value: 'prop-bkk', label: 'Bangkok Riverside' },
            { value: 'prop-phuket', label: 'Phuket Resort' },
            { value: 'prop-chiangmai', label: 'Chiang Mai Boutique' },
            { value: 'prop-pattaya', label: 'Pattaya Beach' },
          ]}
          size="sm"
          w={180}
          comboboxProps={{ withinPortal: false }}
        />
        <Button variant="subtle" leftSection={<IconCommand size={14} />} onClick={() => setCommandMenuOpen(true)}>
          Command
        </Button>
        <ActionIcon variant="subtle" size="lg" onClick={() => setNotificationDrawerOpen(true)} aria-label="Notifications">
          <IconBell size={16} />
        </ActionIcon>
        <ActionIcon variant="subtle" size="lg" onClick={toggleColorScheme} aria-label="Toggle color scheme">
          {colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
        </ActionIcon>
        <LiveIndicator status={connectionStatus} label={lastSyncAt ? `Synced ${lastSyncAt}` : 'Live'} />
        <Menu shadow="lg" position="bottom-end" withinPortal>
          <Menu.Target>
            <Button variant="subtle" leftSection={<Avatar radius="xl" size="sm">{session?.user.name?.slice(0, 1) ?? 'C'}</Avatar>}>
              {session?.user.name ?? 'User'}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>{session?.user.role}</Menu.Label>
            <Menu.Item onClick={() => navigate('/app/settings')}>Settings</Menu.Item>
            <Menu.Item onClick={() => toggleColorScheme()}>
              {colorScheme === 'dark' ? 'Light mode' : 'Dark mode'}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red" onClick={logout} leftSection={<IconLogout size={14} />}>
              Sign out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  )
}
