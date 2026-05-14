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
import type { CurrencyCode } from './mockData'
import { formatDateTime } from './formatters'
import type { ConnectionStatus } from './mockData'

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
  tenants: typeof tenants
}

const delay = async <T,>(value: T, ms = 180) =>
  new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), ms)
  })

export async function mockLogin(email: string, password: string): Promise<MockLoginResult> {
  void password
  return delay({
    token: `mock.${btoa(email)}.${Date.now()}`,
    user: {
      id: 'user-001',
      name: 'Maya Srisuk',
      email,
      role: 'Finance Manager',
    },
    tenants,
  })
}

export async function fetchTenantOptions() {
  return delay(tenants)
}

export async function fetchDashboardSnapshot(filters: QueryFilters & { currency?: CurrencyCode }) {
  return delay(dashboardSnapshotFactory(filters))
}

export async function fetchJournalEntries(filters: QueryFilters) {
  return delay(journalEntries.filter((entry) => entry.tenantId === filters.tenantId))
}

export async function fetchJournalEntry(id: string) {
  return delay(journalEntries.find((entry) => entry.id === id) ?? journalEntries[0])
}

export async function fetchAPInvoices(filters: QueryFilters) {
  return delay(apInvoices.filter((invoice) => invoice.tenantId === filters.tenantId))
}

export async function fetchAPInvoice(id: string) {
  return delay(apInvoices.find((invoice) => invoice.id === id) ?? apInvoices[0])
}

export async function fetchVendors(filters: QueryFilters) {
  return delay(vendors.filter((vendor) => vendor.tenantId === filters.tenantId))
}

export async function fetchVendor(id: string) {
  return delay(vendors.find((vendor) => vendor.id === id) ?? vendors[0])
}

export async function fetchARInvoices(filters: QueryFilters) {
  return delay(arInvoices.filter((invoice) => invoice.tenantId === filters.tenantId))
}

export async function fetchCustomers(filters: QueryFilters) {
  return delay(customers.filter((customer) => customer.tenantId === filters.tenantId))
}

export async function fetchCustomer(id: string) {
  return delay(customers.find((customer) => customer.id === id) ?? customers[0])
}

export async function fetchTrialBalance(filters: QueryFilters) {
  void filters
  return delay(trialBalanceRows)
}

export async function fetchApprovals(filters: QueryFilters) {
  void filters
  return delay(approvals)
}

export async function fetchAuditLogs(filters: QueryFilters) {
  void filters
  return delay(auditLogs)
}

export async function fetchNotifications() {
  return delay(notifications)
}

export async function fetchUsers() {
  return delay(users)
}

export function makeQueryKey(scope: string, filters: QueryFilters) {
  return [scope, filters.tenantId, filters.propertyId ?? 'all', filters.fiscalPeriod ?? 'period'] as const
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

export type { ConnectionStatus, CurrencyCode }
