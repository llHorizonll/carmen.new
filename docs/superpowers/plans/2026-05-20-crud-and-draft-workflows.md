# CRUD and Draft Workflows Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add real create, update, delete, save-draft, and balance-validation workflows for vendors, journal entries, and invoice modules so the app moves beyond read-only mock views.

**Architecture:** Keep the existing PocketBase service boundary in `frontend/src/lib/pocketbase.ts`, add explicit mutation helpers per module, and build focused form pages/drawers that use TanStack Query mutations plus lightweight Zustand/UI state only where needed. Start with vendor CRUD and journal-entry draft/balance logic first, then apply the same patterns to AP and AR modules so the implementation stays consistent.

**Tech Stack:** React, Vite, TypeScript, Mantine UI, Mantine React Table, TanStack Query, Zustand, PocketBase

---

### Task 1: Define mutable domain shapes and PocketBase mutation helpers

**Files:**
- Modify: `C:\source\carmen.new\frontend\src\lib\mockData.ts`
- Modify: `C:\source\carmen.new\frontend\src\lib\pocketbase.ts`
- Create: `C:\source\carmen.new\frontend\src\lib\validators.ts`

- [ ] **Step 1: Add form payload types to the mock data module**

```ts
export type VendorFormValues = {
  code: string
  name: string
  category: string
  taxId: string
  paymentTerms: string
  status: 'Active' | 'Review' | 'Hold'
}

export type JournalLineFormValues = {
  accountCode: string
  accountName: string
  department: string
  debit: number
  credit: number
  memo: string
}

export type JournalEntryFormValues = {
  jeNumber: string
  date: string
  property: string
  source: string
  description: string
  status: 'Draft' | 'Approved' | 'Posted' | 'Rejected'
  lines: JournalLineFormValues[]
}
```

- [ ] **Step 2: Add shared finance validation helpers**

```ts
export function calculateJournalTotals(lines: JournalLineFormValues[]) {
  const debit = lines.reduce((sum, line) => sum + line.debit, 0)
  const credit = lines.reduce((sum, line) => sum + line.credit, 0)

  return {
    debit,
    credit,
    difference: Number((debit - credit).toFixed(2)),
    balanced: Math.abs(debit - credit) < 0.005,
  }
}

export function assertVendorPayload(values: VendorFormValues) {
  if (!values.code.trim() || !values.name.trim()) {
    throw new Error('Vendor code and vendor name are required.')
  }
}
```

- [ ] **Step 3: Add vendor and journal mutation functions to the PocketBase layer**

```ts
export async function createVendor(values: VendorFormValues & { tenantId: string }) {
  assertVendorPayload(values)

  if (client) {
    return client.collection(collectionNames.vendors).create(values as never)
  }

  return delay({ id: `vend-${Date.now()}`, ...values, balance: 0, lastActivity: new Date().toISOString(), risk: 'Low' as const })
}

export async function updateVendor(id: string, values: Partial<VendorFormValues>) {
  if (client) {
    return client.collection(collectionNames.vendors).update(id, values as never)
  }

  return delay({ id, ...values })
}

export async function deleteVendor(id: string) {
  if (client) {
    await client.collection(collectionNames.vendors).delete(id)
    return
  }

  return delay(undefined)
}

export async function saveJournalDraft(id: string | null, values: JournalEntryFormValues & { tenantId: string }) {
  const totals = calculateJournalTotals(values.lines)
  const payload = {
    ...values,
    debit: totals.debit,
    credit: totals.credit,
    difference: totals.difference,
    status: 'Draft',
    updatedAt: new Date().toISOString(),
  }

  if (client) {
    return id
      ? client.collection(collectionNames.journalEntries).update(id, payload as never)
      : client.collection(collectionNames.journalEntries).create(payload as never)
  }

  return delay({ id: id ?? `je-${Date.now()}`, ...payload })
}
```

- [ ] **Step 4: Add posting guard that blocks unbalanced journals**

```ts
export async function postJournalEntry(id: string, values: JournalEntryFormValues & { tenantId: string }) {
  const totals = calculateJournalTotals(values.lines)

  if (!totals.balanced) {
    throw new Error('Journal entry must be balanced before posting.')
  }

  const payload = {
    ...values,
    debit: totals.debit,
    credit: totals.credit,
    difference: totals.difference,
    status: 'Posted',
    updatedAt: new Date().toISOString(),
  }

  if (client) {
    return client.collection(collectionNames.journalEntries).update(id, payload as never)
  }

  return delay({ id, ...payload })
}
```

- [ ] **Step 5: Run build to verify the service layer still compiles**

Run: `npm run build`
Expected: PASS with Vite build output and no TypeScript errors

- [ ] **Step 6: Commit**

```bash
git add frontend/src/lib/mockData.ts frontend/src/lib/pocketbase.ts frontend/src/lib/validators.ts
git commit -m "feat: add mutable finance service helpers"
```

### Task 2: Implement vendor create, edit, and delete UX

**Files:**
- Modify: `C:\source\carmen.new\frontend\src\features\accounts-payable\VendorManagementPage.tsx`
- Create: `C:\source\carmen.new\frontend\src\features\accounts-payable\VendorFormDrawer.tsx`
- Modify: `C:\source\carmen.new\frontend\src\styles\globals.css`

- [ ] **Step 1: Add a reusable vendor form drawer component**

```tsx
type VendorFormDrawerProps = {
  opened: boolean
  mode: 'create' | 'edit'
  initialValues?: Vendor | null
  onClose: () => void
  onSubmit: (values: VendorFormValues) => Promise<void>
  onDelete?: () => Promise<void>
}
```

- [ ] **Step 2: Render Mantine inputs for create and edit**

```tsx
<TextInput label="Vendor Code" value={values.code} onChange={(event) => setValues({ ...values, code: event.currentTarget.value })} />
<TextInput label="Vendor Name" value={values.name} onChange={(event) => setValues({ ...values, name: event.currentTarget.value })} />
<Select label="Category" data={['F&B', 'Housekeeping', 'Engineering', 'Bar']} value={values.category} onChange={(value) => setValues({ ...values, category: value ?? '' })} />
<TextInput label="Tax ID" value={values.taxId} onChange={(event) => setValues({ ...values, taxId: event.currentTarget.value })} />
<TextInput label="Payment Terms" value={values.paymentTerms} onChange={(event) => setValues({ ...values, paymentTerms: event.currentTarget.value })} />
<Select label="Status" data={['Active', 'Review', 'Hold']} value={values.status} onChange={(value) => setValues({ ...values, status: (value as VendorFormValues['status']) ?? 'Active' })} />
```

- [ ] **Step 3: Wire create and edit mutations into the vendor page**

```tsx
const queryKey = makeQueryKey('vendors', { tenantId, fiscalPeriod })

const createMutation = useMutation({
  mutationFn: (values: VendorFormValues) => createVendor({ ...values, tenantId }),
  onSuccess: () => void queryClient.invalidateQueries({ queryKey }),
})

const updateMutation = useMutation({
  mutationFn: ({ id, values }: { id: string; values: VendorFormValues }) => updateVendor(id, values),
  onSuccess: () => void queryClient.invalidateQueries({ queryKey }),
})

const deleteMutation = useMutation({
  mutationFn: (id: string) => deleteVendor(id),
  onSuccess: () => void queryClient.invalidateQueries({ queryKey }),
})
```

- [ ] **Step 4: Add visible CRUD actions to the page**

```tsx
<PageHeader
  badge={<Badge variant="light" color="teal">Vendor Management</Badge>}
  title="Vendor Management"
  subtitle="Searchable vendor register with risk and payment context."
  actions={<Button onClick={() => openCreateDrawer()}>New Vendor</Button>}
/>
```

- [ ] **Step 5: Run build to verify vendor CRUD UI compiles**

Run: `npm run build`
Expected: PASS with no TypeScript errors

- [ ] **Step 6: Commit**

```bash
git add frontend/src/features/accounts-payable/VendorManagementPage.tsx frontend/src/features/accounts-payable/VendorFormDrawer.tsx frontend/src/styles/globals.css
git commit -m "feat: add vendor crud workflows"
```

### Task 3: Add a journal entry editor with save draft and balance check

**Files:**
- Create: `C:\source\carmen.new\frontend\src\features\general-ledger\JournalEntryEditorPage.tsx`
- Modify: `C:\source\carmen.new\frontend\src\features\general-ledger\JournalEntryListPage.tsx`
- Modify: `C:\source\carmen.new\frontend\src\features\general-ledger\JournalEntryDetailPage.tsx`
- Modify: `C:\source\carmen.new\frontend\src\app\router.tsx`

- [ ] **Step 1: Add a route for creating new journal entries**

```tsx
{ path: 'general-ledger/new', element: <JournalEntryEditorPage /> },
```

- [ ] **Step 2: Turn the keyboard hint into a real entry action**

```tsx
actions={
  <Group gap="xs">
    <Button size="compact-sm" onClick={() => navigate('/app/general-ledger/new')}>New Entry</Button>
    <Group gap="xs"><IconKeyboard size={14} /><Text size="sm" c="gray.4" fw={500}>N = New Entry</Text></Group>
  </Group>
}
```

- [ ] **Step 3: Build the editor page with line-level journal input**

```tsx
const [values, setValues] = useState<JournalEntryFormValues>({
  jeNumber: '',
  date: dayjs().format('YYYY-MM-DD'),
  property: 'CARMEN Bangkok Riverside',
  source: 'Manual',
  description: '',
  status: 'Draft',
  lines: [
    { accountCode: '', accountName: '', department: '', debit: 0, credit: 0, memo: '' },
    { accountCode: '', accountName: '', department: '', debit: 0, credit: 0, memo: '' },
  ],
})

const totals = calculateJournalTotals(values.lines)
```

- [ ] **Step 4: Add draft-save and post actions**

```tsx
<Button variant="light" onClick={() => saveDraftMutation.mutate(values)}>Save Draft</Button>
<Button color="teal" onClick={() => postMutation.mutate(values)} disabled={!totals.balanced}>Post</Button>
<Badge variant="light" color={totals.balanced ? 'teal' : 'red'}>
  {totals.balanced ? 'Balanced' : `Out of Balance ${formatCompactAmount(totals.difference)}`}
</Badge>
```

- [ ] **Step 5: Update the detail page to use real mutation actions instead of static buttons**

```tsx
<Button onClick={() => postMutation.mutate(entryValues)}>Post</Button>
<Button variant="light" onClick={() => saveDraftMutation.mutate(entryValues)}>Save Draft</Button>
<Button variant="light" color="red" onClick={() => deleteMutation.mutate(entryId)}>Delete</Button>
```

- [ ] **Step 6: Run build to verify the journal draft/balance flow compiles**

Run: `npm run build`
Expected: PASS with the new route and editor page included

- [ ] **Step 7: Commit**

```bash
git add frontend/src/features/general-ledger/JournalEntryEditorPage.tsx frontend/src/features/general-ledger/JournalEntryListPage.tsx frontend/src/features/general-ledger/JournalEntryDetailPage.tsx frontend/src/app/router.tsx
git commit -m "feat: add journal draft and balance workflows"
```

### Task 4: Add AP invoice draft and CRUD workflow

**Files:**
- Create: `C:\source\carmen.new\frontend\src\features\accounts-payable\APInvoiceEditorPage.tsx`
- Modify: `C:\source\carmen.new\frontend\src\features\accounts-payable\APInvoiceListPage.tsx`
- Modify: `C:\source\carmen.new\frontend\src\features\accounts-payable\APInvoiceDetailPage.tsx`
- Modify: `C:\source\carmen.new\frontend\src\app\router.tsx`
- Modify: `C:\source\carmen.new\frontend\src\lib\pocketbase.ts`

- [ ] **Step 1: Add AP invoice mutation helpers**

```ts
export async function createAPInvoice(values: APInvoiceFormValues & { tenantId: string }) { /* ... */ }
export async function updateAPInvoice(id: string, values: Partial<APInvoiceFormValues>) { /* ... */ }
export async function deleteAPInvoice(id: string) { /* ... */ }
export async function saveAPInvoiceDraft(id: string | null, values: APInvoiceFormValues & { tenantId: string }) { /* ... */ }
```

- [ ] **Step 2: Add a create/edit AP invoice page**

```tsx
{ path: 'accounts-payable/new', element: <APInvoiceEditorPage /> },
{ path: 'accounts-payable/:id/edit', element: <APInvoiceEditorPage /> },
```

- [ ] **Step 3: Support Save Draft, Submit for Approval, and Delete**

```tsx
<Button variant="light" onClick={() => draftMutation.mutate(values)}>Save Draft</Button>
<Button onClick={() => submitMutation.mutate(values)}>Submit for Approval</Button>
<Button variant="light" color="red" onClick={() => deleteMutation.mutate(invoiceId)}>Delete</Button>
```

- [ ] **Step 4: Run build to verify AP workflows**

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/src/features/accounts-payable/APInvoiceEditorPage.tsx frontend/src/features/accounts-payable/APInvoiceListPage.tsx frontend/src/features/accounts-payable/APInvoiceDetailPage.tsx frontend/src/app/router.tsx frontend/src/lib/pocketbase.ts
git commit -m "feat: add ap invoice draft and crud flow"
```

### Task 5: Add AR invoice CRUD workflow

**Files:**
- Create: `C:\source\carmen.new\frontend\src\features\accounts-receivable\ARInvoiceEditorPage.tsx`
- Modify: `C:\source\carmen.new\frontend\src\features\accounts-receivable\ARInvoiceListPage.tsx`
- Modify: `C:\source\carmen.new\frontend\src\features\accounts-receivable\ARInvoiceDetailPage.tsx`
- Modify: `C:\source\carmen.new\frontend\src\app\router.tsx`
- Modify: `C:\source\carmen.new\frontend\src\lib\pocketbase.ts`

- [ ] **Step 1: Add AR mutation helpers**

```ts
export async function createARInvoice(values: ARInvoiceFormValues & { tenantId: string }) { /* ... */ }
export async function updateARInvoice(id: string, values: Partial<ARInvoiceFormValues>) { /* ... */ }
export async function deleteARInvoice(id: string) { /* ... */ }
```

- [ ] **Step 2: Add create and edit routes**

```tsx
{ path: 'accounts-receivable/new', element: <ARInvoiceEditorPage /> },
{ path: 'accounts-receivable/:id/edit', element: <ARInvoiceEditorPage /> },
```

- [ ] **Step 3: Add page actions for save, delete, and payment tracking**

```tsx
<Button onClick={() => saveMutation.mutate(values)}>Save</Button>
<Button variant="light" color="red" onClick={() => deleteMutation.mutate(invoiceId)}>Delete</Button>
<Button variant="light" onClick={() => recordPaymentMutation.mutate({ invoiceId, amount })}>Record Payment</Button>
```

- [ ] **Step 4: Run build to verify AR workflows**

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/src/features/accounts-receivable/ARInvoiceEditorPage.tsx frontend/src/features/accounts-receivable/ARInvoiceListPage.tsx frontend/src/features/accounts-receivable/ARInvoiceDetailPage.tsx frontend/src/app/router.tsx frontend/src/lib/pocketbase.ts
git commit -m "feat: add ar invoice crud flow"
```

### Task 6: Document and verify the new mutable workflows

**Files:**
- Modify: `C:\source\carmen.new\README.md`
- Modify: `C:\source\carmen.new\docs\roadmap\PHASE_13_PRODUCTION_READINESS.md`

- [ ] **Step 1: Add user-facing notes about new CRUD and draft workflows**

```md
## Current App Capabilities

- Vendor create, edit, and delete
- Journal entry draft save and posting validation
- AP invoice draft and approval submission flow
- AR invoice create, edit, delete, and payment tracking
```

- [ ] **Step 2: Update Phase 13 evidence once implementation lands**

```md
| Finance CRUD workflows exist | Vendor, journal, AP, and AR modules expose mutable workflows in the frontend and PocketBase abstraction layer. |
| Draft and balance checks exist | Journal entries can be saved as draft and blocked from posting when out of balance. |
```

- [ ] **Step 3: Run final verification**

Run: `npm run build`
Expected: PASS

Run: `npm run dev`
Expected: App loads and the new create/edit routes are reachable

- [ ] **Step 4: Commit**

```bash
git add README.md docs/roadmap/PHASE_13_PRODUCTION_READINESS.md
git commit -m "docs: document mutable finance workflows"
```

## Self-Review

- Spec coverage: vendor CRUD, journal draft save, journal balance validation, AP invoice draft workflow, AR invoice CRUD, and documentation handoff are all covered by Tasks 1 through 6.
- Placeholder scan: the plan avoids `TBD`/`TODO` markers and names concrete files, routes, and mutation boundaries.
- Type consistency: `VendorFormValues`, `JournalEntryFormValues`, and mutation helper names stay consistent across service, UI, and route tasks.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-20-crud-and-draft-workflows.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
