import { ActionIcon, Box, Divider, Group, NavLink, Stack, Text, ThemeIcon } from '@mantine/core'
import {
  IconLayoutDashboard,
  IconBook2,
  IconReceipt2,
  IconUsersGroup,
  IconFileAnalytics,
  IconTimeline,
  IconSettings2,
  IconMessages,
  IconBellRinging,
  IconMenu2,
  IconUsers,
  IconClipboardCheck,
  IconFiles,
  IconGauge,
  IconSearch,
} from '@tabler/icons-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '../../stores/app.store'
import { useAuthStore } from '../../features/auth/auth.store'
import { useTenantStore } from '../../stores/tenant.store'
import { TenantSwitcher } from './TenantSwitcher'
import { LiveIndicator } from '../ui/LiveIndicator'
import { useNotificationStore } from '../../stores/notification.store'

const groups = [
  {
    title: 'Overview',
    items: [{ to: '/app/dashboard', label: 'Dashboard', icon: IconGauge }],
  },
  {
    title: 'Accounting',
    items: [
      { to: '/app/general-ledger', label: 'General Ledger', icon: IconBook2 },
      { to: '/app/accounts-payable', label: 'Accounts Payable', icon: IconReceipt2 },
      { to: '/app/accounts-receivable', label: 'Accounts Receivable', icon: IconFiles },
      { to: '/app/income-audit', label: 'Income Audit', icon: IconTimeline },
      { to: '/app/trial-balance', label: 'Trial Balance', icon: IconFileAnalytics },
      { to: '/app/approvals', label: 'Approvals', icon: IconClipboardCheck },
    ],
  },
  {
    title: 'Operations',
    items: [
      { to: '/app/audit-logs', label: 'Audit Logs', icon: IconSearch },
      { to: '/app/users', label: 'Users', icon: IconUsers },
      { to: '/app/notifications', label: 'Notifications', icon: IconBellRinging },
    ],
  },
  {
    title: 'Administration',
    items: [
      { to: '/app/settings', label: 'Settings', icon: IconSettings2 },
      { to: '/app/user-settings', label: 'User Settings', icon: IconMessages },
      { to: '/app/tenant-admin', label: 'Tenant Admin', icon: IconUsersGroup },
    ],
  },
]

export function Sidebar() {
  const collapsed = useAppStore((state) => state.sidebarCollapsed)
  const setCollapsed = useAppStore((state) => state.setSidebarCollapsed)
  const selectedTenantId = useTenantStore((state) => state.selectedTenantId)
  const session = useAuthStore((state) => state.session)
  const connectionStatus = useNotificationStore((state) => state.connectionStatus)
  const unreadCount = useNotificationStore((state) => state.items.filter((item) => !item.read).length)
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Stack gap="md" className="shell-sidebar-inner">
      <Group justify="space-between" align="flex-start">
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size="lg" radius="md" variant="light" color="teal">
            <IconLayoutDashboard size={18} />
          </ThemeIcon>
          {!collapsed ? (
            <Box>
              <Text fw={700}>Carmen Cloud Finance</Text>
              <Text size="xs" c="rgba(255,255,255,.78)" fw={500}>
                Hotel Accounting Operations
              </Text>
            </Box>
          ) : null}
        </Group>
        <ActionIcon variant="subtle" onClick={() => setCollapsed(!collapsed)} aria-label="Collapse sidebar">
          <IconMenu2 size={16} />
        </ActionIcon>
      </Group>

      {!collapsed ? (
        <Stack gap={6} className="sidebar-meta">
          <Text className="ui-label" c="rgba(255,255,255,.82)" fw={700}>
            Signed in
          </Text>
          <Text fw={600}>{session?.user.name}</Text>
          <Text size="sm" c="rgba(255,255,255,.78)" fw={500} lineClamp={1}>
            {session?.user.email}
          </Text>
          <TenantSwitcher />
          <LiveIndicator status={connectionStatus} label={`Live sync | ${unreadCount} alerts`} />
        </Stack>
      ) : null}

      <Divider />

      <Stack gap="lg" className="sidebar-nav">
        {groups.map((group) => (
          <Stack key={group.title} gap={4}>
            {!collapsed ? (
              <Text className="ui-label sidebar-group-title" c="rgba(255,255,255,.82)" fw={700}>
                {group.title}
              </Text>
            ) : null}
            <Stack gap={2}>
              {group.items.map((item) => {
                const Icon = item.icon
                const active = location.pathname.startsWith(item.to)
                return (
                  <NavLink
                    key={item.to}
                    label={collapsed ? undefined : item.label}
                    leftSection={<Icon size={16} />}
                    active={active}
                    onClick={() => navigate(item.to)}
                    className="shell-nav-link"
                    variant="subtle"
                    childrenOffset={collapsed ? 0 : 28}
                  />
                )
              })}
            </Stack>
          </Stack>
        ))}
      </Stack>

      {!collapsed ? (
        <Box className="sidebar-footer">
          <Text className="ui-label" c="rgba(255,255,255,.82)" fw={700}>
            Active tenant
          </Text>
          <Text fw={700}>{selectedTenantId ?? 'Select tenant'}</Text>
          <Text size="sm" c="rgba(255,255,255,.78)" fw={500}>
            Realtime-ready PocketBase shell.
          </Text>
        </Box>
      ) : null}
    </Stack>
  )
}
