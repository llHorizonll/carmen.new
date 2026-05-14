import { AppShell as MantineAppShell, Box } from '@mantine/core'
import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { useAppStore } from '../../stores/app.store'
import { NotificationCenter } from './NotificationCenter'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { CommandMenu } from './CommandMenu'

export function AppShell() {
  const collapsed = useAppStore((state) => state.sidebarCollapsed)
  const location = useLocation()

  return (
    <MantineAppShell
      navbar={{
        width: collapsed ? 72 : 248,
        breakpoint: 'md',
        collapsed: { mobile: true, desktop: false },
      }}
      header={{ height: 56 }}
      aside={{ width: 0, breakpoint: 'sm', collapsed: { mobile: true, desktop: false } }}
      padding="md"
      className="premium-shell"
    >
      <MantineAppShell.Navbar className={collapsed ? 'shell-navbar collapsed' : 'shell-navbar'}>
        <Sidebar />
      </MantineAppShell.Navbar>
      <MantineAppShell.Header className="shell-header">
        <Topbar />
      </MantineAppShell.Header>
      <MantineAppShell.Main className="shell-main">
        <NotificationCenter />
        <CommandMenu />
        <AnimatePresence mode="wait">
          <Box
            key={location.pathname}
            component={motion.div}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
          >
            <Outlet />
          </Box>
        </AnimatePresence>
      </MantineAppShell.Main>
    </MantineAppShell>
  )
}
