import PocketBase from 'pocketbase'
import {
  approvals,
  apInvoices,
  auditLogs,
  arInvoices,
  customers,
  dashboardSnapshotFactory,
  journalEntries,
  notifications,
  properties,
  tenants,
  trialBalanceRows,
  users,
  vendors,
} from './mockData'
import type {
  ApprovalItem,
  AuditLog,
  CurrencyCode,
  DashboardSnapshot,
  LoginTenant,
  NotificationItem,
  Property,
  UserRecord,
  Vendor,
  Customer,
  JournalEntry,
  APInvoice,
  ARInvoice,
  ConnectionStatus,
  JournalLine,
} from './mockData'
import { formatDateTime } from './formatters'

export const collectionNames = {
  tenants: 'tenants',
  users: 'users',
  roles: 'roles',
  properties: 'properties',
  fiscalPeriods: 'fiscal_periods',
  journalEntries: 'journal_entries',
  journalLines: 'journal_lines',
  apInvoices: 'ap_invoices',
  apInvoiceLines: 'ap_invoice_lines',
  arInvoices: 'ar_invoices',
  vendors: 'vendors',
  customers: 'customers',
  notifications: 'notifications',
  auditLogs: 'audit_logs',
  approvalQueue: 'approval_queue',
} as const

type QueryFilters = {
  tenantId: string
  propertyId?: string
  fiscalPeriod?: string
}

type MockLoginResult = {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  tenants: LoginTenant[]
}

export type VendorMutationInput = {
  tenantId: string
  code: string
  name: string
  category: string
  taxId?: string
  balance: number
  paymentTerms: string
  status: Vendor['status']
  risk?: Vendor['risk']
}

export type JournalMutationInput = {
  tenantId: string
  propertyId: string
  jeNumber: string
  date: string
  source: string
  description: string
  status: JournalEntry['status']
  postedBy?: string
  lines: JournalLine[]
}

export type APInvoiceMutationInput = {
  tenantId: string
  vendorId: string
  propertyId: string
  invoiceNo: string
  invoiceDate: string
  dueDate: string
  amount: number
  balance: number
  status: APInvoice['status']
  approval?: string
  aging?: string
}

export type ARInvoiceMutationInput = {
  tenantId: string
  customerId: string
  propertyId: string
  invoiceNo: string
  invoiceDate: string
  dueDate: string
  amount: number
  paid: number
  balance: number
  status: ARInvoice['status']
  aging?: string
}

const pocketBaseUrl = import.meta.env.VITE_PB_URL?.trim() ?? ''
const client = pocketBaseUrl ? new PocketBase(pocketBaseUrl) : null

const delay = async <T,>(value: T, ms = 180) =>
  new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), ms)
  })

function quote(value: string) {
  return JSON.stringify(value)
}

function ensureNonEmpty(value: string, field: string) {
  if (!value.trim()) {
    throw new Error(`${field} is required.`)
  }
}

function ensureNonNegative(value: number, field: string) {
  if (value < 0) {
    throw new Error(`${field} cannot be negative.`)
  }
}

function nowIso() {
  return new Date().toISOString()
}

function mapPropertyIdToName(propertyId?: string) {
  if (!propertyId) {
    return properties[0]?.name ?? 'Unknown Property'
  }
  return properties.find((property) => property.id === propertyId)?.name ?? propertyId
}

function mapVendorIdToName(vendorId?: string) {
  if (!vendorId) {
    return vendors[0]?.name ?? 'Unknown Vendor'
  }
  return vendors.find((vendor) => vendor.id === vendorId)?.name ?? vendorId
}

function mapCustomerIdToName(customerId?: string) {
  if (!customerId) {
    return customers[0]?.name ?? 'Unknown Customer'
  }
  return customers.find((customer) => customer.id === customerId)?.name ?? customerId
}

export function isPocketBaseConfigured() {
  return Boolean(client)
}

export function getPocketBaseClient() {
  return client
}

export function hydratePocketBaseSession(session: { token: string; user: { id: string; name: string; email: string; role: string } } | null) {
  if (!client) {
    return
  }

  if (!session) {
    client.authStore.clear()
    return
  }

  client.authStore.save(session.token, session.user as never)
}

export function clearPocketBaseSession() {
  if (!client) {
    return
  }

  client.authStore.clear()
}

export function buildTenantScopedFilter(filters: QueryFilters) {
  const clauses = [`tenantId = ${quote(filters.tenantId)}`]

  if (filters.propertyId) {
    clauses.push(`propertyId = ${quote(filters.propertyId)}`)
  }

  if (filters.fiscalPeriod) {
    clauses.push(`fiscalPeriod = ${quote(filters.fiscalPeriod)}`)
  }

  return clauses.join(' && ')
}

export function makeQueryKey(scope: string, filters: QueryFilters) {
  return [scope, filters.tenantId, filters.propertyId ?? 'all', filters.fiscalPeriod ?? 'period'] as const
}

export function calculateJournalTotals(lines: JournalLine[]) {
  const debit = lines.reduce((sum, line) => sum + line.debit, 0)
  const credit = lines.reduce((sum, line) => sum + line.credit, 0)
  const difference = Number((debit - credit).toFixed(2))
  return { debit, credit, difference }
}

export function assertJournalBalanced(lines: JournalLine[]) {
  const totals = calculateJournalTotals(lines)
  if (Math.abs(totals.difference) > 0.005) {
    throw new Error('Journal cannot be posted while out of balance.')
  }
  return totals
}

export async function mockLogin(email: string, password: string): Promise<MockLoginResult> {
  if (client) {
    try {
      const auth = await client.collection(collectionNames.users).authWithPassword(email, password)
      const record = auth.record as Record<string, unknown>
      const user = {
        id: String(record.id ?? auth.record.id),
        name: String(record.name ?? 'Finance User'),
        email: String(record.email ?? email),
        role: String(record.role ?? 'Finance Manager'),
      }
      hydratePocketBaseSession({ token: auth.token, user })
      return {
        token: auth.token,
        user,
        tenants: await fetchTenantOptions(),
      }
    } catch {
      // Fall through to the mock dataset so the UI stays runnable without a PB server.
    }
  }

  const fallback = await delay({
    token: `mock.${btoa(email)}.${Date.now()}`,
    user: {
      id: 'user-001',
      name: 'Maya Srisuk',
      email,
      role: 'Finance Manager',
    },
    tenants,
  })

  hydratePocketBaseSession({ token: fallback.token, user: fallback.user })
  return fallback
}

export async function login(email: string, password: string) {
  return mockLogin(email, password)
}

async function fetchCollectionList<T>(collectionName: string, fallback: () => T[], filters?: QueryFilters) {
  if (client) {
    try {
      const records = await client.collection(collectionName).getFullList<T>({
        filter: filters ? buildTenantScopedFilter(filters) : undefined,
        sort: '-updated',
      })
      return records
    } catch {
      // Continue to mock data.
    }
  }

  return delay(fallback())
}

async function fetchCollectionOne<T>(collectionName: string, id: string, fallback: () => T) {
  if (client) {
    try {
      return await client.collection(collectionName).getOne<T>(id)
    } catch {
      // Continue to mock data.
    }
  }

  return delay(fallback())
}

export async function fetchTenantOptions() {
  return fetchCollectionList<LoginTenant>(collectionNames.tenants, () => tenants)
}

export async function fetchDashboardSnapshot(filters: QueryFilters & { currency?: CurrencyCode }): Promise<DashboardSnapshot> {
  if (client) {
    try {
      const [tenantRecords, propertyRecords, apRecords, arRecords, journalRecords, notificationRecords] = await Promise.all([
        fetchTenantOptions(),
        fetchCollectionList<Property>(collectionNames.properties, () => properties, filters),
        fetchAPInvoices(filters),
        fetchARInvoices(filters),
        fetchJournalEntries(filters),
        fetchNotifications(),
      ])

      const selectedProperty = propertyRecords.find((property) => property.id === filters.propertyId) ?? propertyRecords[0]
      const activeTenant = tenantRecords.find((tenant) => tenant.id === filters.tenantId) ?? tenantRecords[0]

      const anomalies = [
        { id: 'anom-1', property: propertyRecords[0]?.name ?? 'Unknown', title: 'Room revenue variance', severity: 'High', value: 45_800 },
        { id: 'anom-2', property: propertyRecords[1]?.name ?? 'Unknown', title: 'F&B mix variance', severity: 'Medium', value: 12_200 },
        { id: 'anom-3', property: propertyRecords[2]?.name ?? 'Unknown', title: 'Cash drawer discrepancy', severity: 'Low', value: 8_200 },
      ] as DashboardSnapshot['anomalies']

      return {
        tenantId: filters.tenantId,
        propertyId: selectedProperty?.id ?? 'prop-bkk',
        fiscalPeriod: filters.fiscalPeriod ?? activeTenant?.fiscalPeriod ?? 'FY2026 P04',
        cashPosition: selectedProperty?.cashPosition ?? 0,
        dailyRevenue: selectedProperty?.revenueToday ?? 0,
        outstandingAP: apRecords.reduce((sum, invoice) => sum + invoice.balance, 0),
        outstandingAR: arRecords.reduce((sum, invoice) => sum + invoice.balance, 0),
        closeProgress: 0.72,
        pendingApprovals: 3,
        exceptions: selectedProperty?.exceptionCount ?? 0,
        lastSyncAt: notificationRecords[0]?.timestamp ?? new Date().toISOString(),
        connectionStatus: 'live' as ConnectionStatus,
        metrics: [
          { label: 'Cash position', value: selectedProperty?.cashPosition ?? 0, delta: 12_400, format: 'currency' as const },
          { label: 'Daily revenue', value: selectedProperty?.revenueToday ?? 0, delta: 0.086, format: 'currency' as const },
          { label: 'Close progress', value: 0.72, delta: 0.08, format: 'percent' as const },
          { label: 'Exceptions', value: selectedProperty?.exceptionCount ?? 0, delta: -1, format: 'number' as const },
        ],
        activities: journalRecords.slice(0, 3).map((entry, index) => ({
          id: `${entry.id}-${index}`,
          title: entry.description,
          detail: `${entry.source} from ${entry.property}`,
          amount: entry.debit,
          timestamp: entry.updatedAt,
          type: 'journal posted',
        })),
        propertyPerformance: propertyRecords.map((property, index) => ({
          property: property.name,
          revenue: property.revenueToday,
          margin: 0.32 + index * 0.03,
          occupancy: property.occupancy,
          exceptions: property.exceptionCount,
          trend: (index === 1 ? 'flat' : index % 2 === 0 ? 'up' : 'down') as 'up' | 'down' | 'flat',
        })),
        anomalies,
        recentJournals: journalRecords as JournalEntry[],
      } as DashboardSnapshot
    } catch {
      // Fall through to the mock snapshot.
    }
  }

  return delay(dashboardSnapshotFactory(filters) as DashboardSnapshot)
}

export async function fetchJournalEntries(filters: QueryFilters) {
  return fetchCollectionList<JournalEntry>(collectionNames.journalEntries, () => journalEntries.filter((entry) => entry.tenantId === filters.tenantId), filters)
}

export async function fetchJournalEntry(id: string) {
  return fetchCollectionOne<JournalEntry>(collectionNames.journalEntries, id, () => journalEntries.find((entry) => entry.id === id) ?? journalEntries[0])
}

export async function fetchAPInvoices(filters: QueryFilters) {
  return fetchCollectionList<APInvoice>(collectionNames.apInvoices, () => apInvoices.filter((invoice) => invoice.tenantId === filters.tenantId), filters)
}

export async function fetchAPInvoice(id: string) {
  return fetchCollectionOne<APInvoice>(collectionNames.apInvoices, id, () => apInvoices.find((invoice) => invoice.id === id) ?? apInvoices[0])
}

export async function fetchVendors(filters: QueryFilters) {
  return fetchCollectionList<Vendor>(collectionNames.vendors, () => vendors.filter((vendor) => vendor.tenantId === filters.tenantId), filters)
}

export async function fetchVendor(id: string) {
  return fetchCollectionOne<Vendor>(collectionNames.vendors, id, () => vendors.find((vendor) => vendor.id === id) ?? vendors[0])
}

export async function createVendor(input: VendorMutationInput) {
  ensureNonEmpty(input.code, 'Vendor code')
  ensureNonEmpty(input.name, 'Vendor name')
  ensureNonNegative(input.balance, 'Vendor balance')

  const payload = {
    ...input,
    taxId: input.taxId ?? '',
    risk: input.risk ?? 'Low',
    lastActivity: nowIso(),
  }

  if (client) {
    return client.collection(collectionNames.vendors).create<Vendor>(payload as never)
  }

  const mockRecord: Vendor = {
    id: `vend-${Date.now()}`,
    ...payload,
  }

  return delay(mockRecord)
}

export async function updateVendor(id: string, input: VendorMutationInput) {
  ensureNonEmpty(id, 'Vendor id')
  ensureNonEmpty(input.code, 'Vendor code')
  ensureNonEmpty(input.name, 'Vendor name')
  ensureNonNegative(input.balance, 'Vendor balance')

  const payload = {
    ...input,
    taxId: input.taxId ?? '',
    risk: input.risk ?? 'Low',
    lastActivity: nowIso(),
  }

  if (client) {
    return client.collection(collectionNames.vendors).update<Vendor>(id, payload as never)
  }

  const existing = vendors.find((vendor) => vendor.id === id) ?? vendors[0]
  return delay({ ...existing, ...payload, id })
}

export async function deleteVendor(id: string) {
  ensureNonEmpty(id, 'Vendor id')
  if (client) {
    await client.collection(collectionNames.vendors).delete(id)
    return
  }
  await delay(true)
}

export async function fetchARInvoices(filters: QueryFilters) {
  return fetchCollectionList<ARInvoice>(collectionNames.arInvoices, () => arInvoices.filter((invoice) => invoice.tenantId === filters.tenantId), filters)
}

export async function fetchARInvoice(id: string) {
  return fetchCollectionOne<ARInvoice>(collectionNames.arInvoices, id, () => arInvoices.find((invoice) => invoice.id === id) ?? arInvoices[0])
}

export async function createARInvoice(input: ARInvoiceMutationInput) {
  ensureNonEmpty(input.invoiceNo, 'AR invoice number')
  ensureNonNegative(input.amount, 'AR amount')

  if (client) {
    return client.collection(collectionNames.arInvoices).create<ARInvoice>(input as never)
  }

  const mockRecord: ARInvoice = {
    id: `ar-${Date.now()}`,
    tenantId: input.tenantId,
    invoiceNo: input.invoiceNo,
    customer: mapCustomerIdToName(input.customerId),
    property: mapPropertyIdToName(input.propertyId),
    invoiceDate: input.invoiceDate,
    dueDate: input.dueDate,
    amount: input.amount,
    paid: input.paid,
    balance: input.balance,
    status: input.status,
    aging: input.aging ?? 'Current',
  }

  return delay(mockRecord)
}

export async function updateARInvoice(id: string, input: ARInvoiceMutationInput) {
  ensureNonEmpty(id, 'AR invoice id')
  if (client) {
    return client.collection(collectionNames.arInvoices).update<ARInvoice>(id, input as never)
  }

  const existing = arInvoices.find((invoice) => invoice.id === id) ?? arInvoices[0]
  return delay({
    ...existing,
    id,
    tenantId: input.tenantId,
    invoiceNo: input.invoiceNo,
    customer: mapCustomerIdToName(input.customerId),
    property: mapPropertyIdToName(input.propertyId),
    invoiceDate: input.invoiceDate,
    dueDate: input.dueDate,
    amount: input.amount,
    paid: input.paid,
    balance: input.balance,
    status: input.status,
    aging: input.aging ?? existing.aging,
  })
}

export async function deleteARInvoice(id: string) {
  ensureNonEmpty(id, 'AR invoice id')
  if (client) {
    await client.collection(collectionNames.arInvoices).delete(id)
    return
  }
  await delay(true)
}

export async function recordARPayment(id: string, amount: number) {
  ensureNonEmpty(id, 'AR invoice id')
  ensureNonNegative(amount, 'Payment amount')
  const current = await fetchARInvoice(id)
  const paid = Math.min(current.amount, current.paid + amount)
  const balance = Math.max(0, current.amount - paid)
  const status: ARInvoice['status'] = balance <= 0 ? 'Collected' : current.status

  if (client) {
    return client.collection(collectionNames.arInvoices).update<ARInvoice>(id, {
      paid,
      balance,
      status,
    } as never)
  }

  return delay({
    ...current,
    paid,
    balance,
    status,
  })
}

export async function fetchCustomers(filters: QueryFilters) {
  return fetchCollectionList<Customer>(collectionNames.customers, () => customers.filter((customer) => customer.tenantId === filters.tenantId), filters)
}

export async function fetchCustomer(id: string) {
  return fetchCollectionOne<Customer>(collectionNames.customers, id, () => customers.find((customer) => customer.id === id) ?? customers[0])
}

export async function saveJournalDraft(input: JournalMutationInput) {
  ensureNonEmpty(input.jeNumber, 'Journal number')
  ensureNonEmpty(input.description, 'Journal description')
  if (!input.lines.length) {
    throw new Error('At least one journal line is required.')
  }

  const totals = calculateJournalTotals(input.lines)

  const payload = {
    tenantId: input.tenantId,
    propertyId: input.propertyId,
    jeNumber: input.jeNumber,
    date: input.date,
    source: input.source,
    description: input.description,
    debit: totals.debit,
    credit: totals.credit,
    difference: totals.difference,
    status: input.status,
    postedBy: input.postedBy ?? 'System',
    updatedAtLabel: nowIso(),
  }

  if (client) {
    return client.collection(collectionNames.journalEntries).create<JournalEntry>(payload as never)
  }

  const mockRecord: JournalEntry = {
    id: `je-${Date.now()}`,
    tenantId: input.tenantId,
    jeNumber: input.jeNumber,
    date: input.date,
    property: mapPropertyIdToName(input.propertyId),
    source: input.source,
    description: input.description,
    debit: totals.debit,
    credit: totals.credit,
    difference: totals.difference,
    status: input.status,
    postedBy: input.postedBy ?? 'System',
    updatedAt: nowIso(),
    approvalStatus: input.status,
    lines: input.lines,
  }

  return delay(mockRecord)
}

export async function postJournalEntry(id: string, lines: JournalLine[]) {
  ensureNonEmpty(id, 'Journal id')
  const totals = assertJournalBalanced(lines)

  if (client) {
    return client.collection(collectionNames.journalEntries).update<JournalEntry>(id, {
      status: 'Posted',
      difference: totals.difference,
      debit: totals.debit,
      credit: totals.credit,
      updatedAtLabel: nowIso(),
    } as never)
  }

  const existing = journalEntries.find((entry) => entry.id === id) ?? journalEntries[0]
  return delay({
    ...existing,
    status: 'Posted' as const,
    difference: totals.difference,
    debit: totals.debit,
    credit: totals.credit,
    updatedAt: nowIso(),
  })
}

export async function reverseJournalEntry(id: string) {
  ensureNonEmpty(id, 'Journal id')
  if (client) {
    return client.collection(collectionNames.journalEntries).update<JournalEntry>(id, {
      status: 'Rejected',
      updatedAtLabel: nowIso(),
    } as never)
  }

  const existing = journalEntries.find((entry) => entry.id === id) ?? journalEntries[0]
  return delay({
    ...existing,
    status: 'Rejected' as const,
    updatedAt: nowIso(),
    approvalStatus: 'Reversed',
  })
}

export async function createAPInvoice(input: APInvoiceMutationInput) {
  ensureNonEmpty(input.invoiceNo, 'AP invoice number')
  ensureNonNegative(input.amount, 'AP amount')

  if (client) {
    return client.collection(collectionNames.apInvoices).create<APInvoice>(input as never)
  }

  const mockRecord: APInvoice = {
    id: `ap-${Date.now()}`,
    tenantId: input.tenantId,
    invoiceNo: input.invoiceNo,
    vendor: mapVendorIdToName(input.vendorId),
    property: mapPropertyIdToName(input.propertyId),
    invoiceDate: input.invoiceDate,
    dueDate: input.dueDate,
    amount: input.amount,
    balance: input.balance,
    status: input.status,
    approval: input.approval ?? 'Pending',
    aging: input.aging ?? 'Current',
    paymentHistory: [],
    glDistribution: [],
  }

  return delay(mockRecord)
}

export async function updateAPInvoice(id: string, input: APInvoiceMutationInput) {
  ensureNonEmpty(id, 'AP invoice id')
  if (client) {
    return client.collection(collectionNames.apInvoices).update<APInvoice>(id, input as never)
  }

  const existing = apInvoices.find((invoice) => invoice.id === id) ?? apInvoices[0]
  return delay({
    ...existing,
    id,
    tenantId: input.tenantId,
    invoiceNo: input.invoiceNo,
    vendor: mapVendorIdToName(input.vendorId),
    property: mapPropertyIdToName(input.propertyId),
    invoiceDate: input.invoiceDate,
    dueDate: input.dueDate,
    amount: input.amount,
    balance: input.balance,
    status: input.status,
    approval: input.approval ?? existing.approval,
    aging: input.aging ?? existing.aging,
  })
}

export async function deleteAPInvoice(id: string) {
  ensureNonEmpty(id, 'AP invoice id')
  if (client) {
    await client.collection(collectionNames.apInvoices).delete(id)
    return
  }
  await delay(true)
}

export async function fetchTrialBalance(filters: QueryFilters) {
  void filters
  return delay(trialBalanceRows)
}

export async function fetchApprovals(filters: QueryFilters) {
  return fetchCollectionList<ApprovalItem>(collectionNames.approvalQueue, () => approvals, filters)
}

export async function fetchAuditLogs(filters: QueryFilters) {
  return fetchCollectionList<AuditLog>(collectionNames.auditLogs, () => auditLogs, filters)
}

export async function fetchNotifications() {
  return fetchCollectionList<NotificationItem>(collectionNames.notifications, () => notifications)
}

export async function fetchNotificationsForTenant(filters: QueryFilters) {
  return fetchCollectionList<NotificationItem>(collectionNames.notifications, () => notifications, filters)
}

export async function fetchUsers() {
  return fetchCollectionList<UserRecord>(collectionNames.users, () => users)
}

export function getCurrentFiscalPeriod() {
  return 'FY2026 P04'
}

export function getCurrentPropertyId() {
  return properties[0]?.id ?? 'prop-bkk'
}

export function createMockAuditStamp(action: string) {
  return `${action} | ${formatDateTime(new Date().toISOString())}`
}

export type { ConnectionStatus, CurrencyCode, QueryFilters, MockLoginResult }
