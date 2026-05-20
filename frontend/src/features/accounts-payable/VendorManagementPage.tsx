import { Badge, Button, Drawer, Grid, Group, Modal, NumberInput, Select, Stack, Text, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { MRT_ColumnDef } from 'mantine-react-table'
import { PageHeader } from '../../components/ui/PageHeader'
import { FinancialTable } from '../../components/tables/FinancialTable'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { PremiumCard } from '../../components/ui/PremiumCard'
import { useAuthStore } from '../auth/auth.store'
import { useTenantStore } from '../../stores/tenant.store'
import { createVendor, deleteVendor, fetchVendors, makeQueryKey, updateVendor, type VendorMutationInput } from '../../lib/pocketbase'
import { formatCompactAmount, formatDateTime } from '../../lib/formatters'
import { queryClient } from '../../lib/queryClient'

const emptyForm: Omit<VendorMutationInput, 'tenantId'> = {
  code: '',
  name: '',
  category: 'F&B',
  taxId: '',
  balance: 0,
  paymentTerms: 'Net 30',
  status: 'Active',
  risk: 'Low',
}

export function VendorManagementPage() {
  const tenantId = useAuthStore((state) => state.activeTenantId) ?? 'tenant-carmen'
  const fiscalPeriod = useTenantStore((state) => state.fiscalPeriod)
  const queryKey = makeQueryKey('vendors', { tenantId, fiscalPeriod })
  const query = useQuery({ queryKey, queryFn: () => fetchVendors({ tenantId, fiscalPeriod }) })
  const vendors = useMemo(() => query.data ?? [], [query.data])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<(typeof vendors)[number] | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [form, setForm] = useState(emptyForm)
  const [open, { open: openDrawer, close }] = useDisclosure(false)
  const [formOpen, { open: openForm, close: closeForm }] = useDisclosure(false)

  const createMutation = useMutation({
    mutationFn: (payload: VendorMutationInput) => createVendor(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['vendors'] })
      closeForm()
      setForm(emptyForm)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VendorMutationInput }) => updateVendor(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['vendors'] })
      closeForm()
      setForm(emptyForm)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVendor(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['vendors'] })
      close()
    },
  })

  const filtered = useMemo(
    () => vendors.filter((vendor) => vendor.name.toLowerCase().includes(search.toLowerCase()) || vendor.code.toLowerCase().includes(search.toLowerCase())),
    [search, vendors],
  )

  const columns = useMemo<MRT_ColumnDef<(typeof filtered)[number]>[]>(
    () => [
      { accessorKey: 'code', header: 'Vendor Code', size: 100 },
      { accessorKey: 'name', header: 'Vendor Name', size: 220 },
      { accessorKey: 'category', header: 'Category', size: 130 },
      { accessorKey: 'taxId', header: 'Tax ID', size: 140 },
      {
        accessorKey: 'balance',
        header: 'Balance',
        size: 110,
        Cell: ({ cell }) => <span className="mono fin-number">{formatCompactAmount(cell.getValue<number>())}</span>,
        mantineTableBodyCellProps: { align: 'right' },
      },
      { accessorKey: 'paymentTerms', header: 'Payment Terms', size: 120 },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ cell }) => <StatusBadge value={cell.getValue<string>()} />,
      },
      { accessorKey: 'lastActivity', header: 'Last Activity', Cell: ({ cell }) => formatDateTime(cell.getValue<string>()) },
    ],
    [],
  )

  const openCreate = () => {
    setFormMode('create')
    setForm(emptyForm)
    openForm()
  }

  const openEdit = () => {
    if (!selected) {
      return
    }

    setFormMode('edit')
    setForm({
      code: selected.code,
      name: selected.name,
      category: selected.category,
      taxId: selected.taxId,
      balance: selected.balance,
      paymentTerms: selected.paymentTerms,
      status: selected.status,
      risk: selected.risk,
    })
    openForm()
  }

  const submitForm = async () => {
    const payload: VendorMutationInput = {
      tenantId,
      ...form,
      risk: form.risk ?? 'Low',
      taxId: form.taxId ?? '',
    }

    if (formMode === 'create') {
      await createMutation.mutateAsync(payload)
      return
    }

    if (selected) {
      await updateMutation.mutateAsync({ id: selected.id, payload })
    }
  }

  return (
    <Stack gap="md">
      <PageHeader
        badge={<Badge variant="light" color="teal">Vendor Management</Badge>}
        title="Vendor Management"
        subtitle="Searchable vendor register with risk and payment context."
        actions={<Button onClick={openCreate}>New Vendor</Button>}
      />
      <TextInput
        label="Search Vendor"
        placeholder="Vendor code or vendor name"
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
        size="xs"
      />
      <Grid>
        {[
          ['Low Risk', vendors.filter((vendor) => vendor.risk === 'Low').length],
          ['Review', vendors.filter((vendor) => vendor.status === 'Review').length],
          ['Hold', vendors.filter((vendor) => vendor.status === 'Hold').length],
          ['Balance', vendors.reduce((sum, vendor) => sum + vendor.balance, 0)],
        ].map(([label, value]) => (
          <Grid.Col key={String(label)} span={{ base: 12, sm: 6, xl: 3 }}>
            <PremiumCard p="sm">
              <Text size="xs" tt="uppercase" fw={600} c="gray.4" style={{ letterSpacing: '0.08em' }}>
                {label}
              </Text>
              <Text fw={700}>{typeof value === 'number' && label === 'Balance' ? formatCompactAmount(value) : String(value)}</Text>
            </PremiumCard>
          </Grid.Col>
        ))}
      </Grid>
      <FinancialTable
        data={filtered}
        columns={columns}
        title="Vendors"
        subtitle={`Tenant ${tenantId} | ${fiscalPeriod}`}
        onRowClick={(row) => {
          setSelected(row)
          openDrawer()
        }}
      />
      <Drawer opened={open} onClose={close} position="right" title="Vendor Summary" size="sm">
        <Stack gap="sm">
          <Text fw={700}>{selected?.name}</Text>
          <Text size="sm" c="gray.4" fw={500}>
            {selected?.code}
          </Text>
          <StatusBadge value={selected?.status ?? 'Active'} />
          <Text size="sm" c="gray.4" fw={500}>
            Category: {selected?.category}
          </Text>
          <Text size="sm" c="gray.4" fw={500}>
            Balance: {formatCompactAmount(selected?.balance ?? 0)}
          </Text>
          <Text size="sm" c="gray.4" fw={500}>
            Last Activity: {formatDateTime(selected?.lastActivity ?? new Date().toISOString())}
          </Text>
          <Group grow>
            <Button variant="light" onClick={openEdit}>Edit</Button>
            <Button color="red" variant="light" onClick={() => selected && deleteMutation.mutate(selected.id)} loading={deleteMutation.isPending}>Delete</Button>
          </Group>
        </Stack>
      </Drawer>

      <Modal opened={formOpen} onClose={closeForm} title={formMode === 'create' ? 'Create Vendor' : 'Edit Vendor'}>
        <Stack gap="sm">
          <TextInput label="Vendor Code" value={form.code} onChange={(event) => setForm((prev) => ({ ...prev, code: event.currentTarget.value }))} required size="xs" />
          <TextInput label="Vendor Name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.currentTarget.value }))} required size="xs" />
          <TextInput label="Category" value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.currentTarget.value }))} required size="xs" />
          <TextInput label="Tax ID" value={form.taxId ?? ''} onChange={(event) => setForm((prev) => ({ ...prev, taxId: event.currentTarget.value }))} size="xs" />
          <NumberInput label="Balance" min={0} value={form.balance} onChange={(value) => setForm((prev) => ({ ...prev, balance: Number(value ?? 0) }))} required thousandSeparator="," decimalScale={2} fixedDecimalScale size="xs" />
          <TextInput label="Payment Terms" value={form.paymentTerms} onChange={(event) => setForm((prev) => ({ ...prev, paymentTerms: event.currentTarget.value }))} required size="xs" />
          <Select label="Status" data={['Active', 'Review', 'Hold']} value={form.status} onChange={(value) => setForm((prev) => ({ ...prev, status: (value ?? 'Active') as VendorMutationInput['status'] }))} size="xs" />
          <Select label="Risk" data={['Low', 'Medium', 'High']} value={form.risk} onChange={(value) => setForm((prev) => ({ ...prev, risk: (value ?? 'Low') as VendorMutationInput['risk'] }))} size="xs" />
          <Group justify="flex-end">
            <Button variant="light" onClick={closeForm}>Cancel</Button>
            <Button onClick={submitForm} loading={createMutation.isPending || updateMutation.isPending}>{formMode === 'create' ? 'Create' : 'Save'}</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}
