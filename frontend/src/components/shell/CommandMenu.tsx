import { Modal, Stack, Text, TextInput, UnstyledButton } from '@mantine/core'
import { useHotkeys } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../stores/app.store'

const commands = [
  { label: 'Open Dashboard', path: '/app/dashboard' },
  { label: 'Go to Journal Entries', path: '/app/general-ledger' },
  { label: 'Go to AP Invoices', path: '/app/accounts-payable' },
  { label: 'Go to AR Invoices', path: '/app/accounts-receivable' },
  { label: 'View Trial Balance', path: '/app/trial-balance' },
  { label: 'Open Approvals', path: '/app/approvals' },
  { label: 'Open Notifications', path: '/app/notifications' },
  { label: 'Open Settings', path: '/app/settings' },
]

export function CommandMenu() {
  const open = useAppStore((state) => state.commandMenuOpen)
  const setOpen = useAppStore((state) => state.setCommandMenuOpen)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useHotkeys([
    ['mod+k', () => setOpen(true)],
    ['Escape', () => setOpen(false)],
  ])

  const filtered = useMemo(
    () =>
      commands.filter((command) => command.label.toLowerCase().includes(search.toLowerCase())),
    [search],
  )

  return (
    <Modal opened={open} onClose={() => setOpen(false)} title="Command menu" size="md" centered overlayProps={{ blur: 4 }}>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Search finance workflows, pages, and actions.
        </Text>
        <TextInput
          placeholder="Type to search..."
          leftSection={<IconSearch size={14} />}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          autoFocus
        />
        <Stack gap={4}>
          {filtered.map((command) => (
            <UnstyledButton
              key={command.path}
              onClick={() => {
                navigate(command.path)
                setOpen(false)
              }}
              className="command-item"
            >
              <Text fw={600}>{command.label}</Text>
            </UnstyledButton>
          ))}
        </Stack>
      </Stack>
    </Modal>
  )
}
