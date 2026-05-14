/* eslint-disable react-refresh/only-export-components */
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { useAuthStore } from '../features/auth/auth.store'
import { AppShell } from '../components/shell/AppShell'
import { LoginPage } from '../features/auth/LoginPage'
import { TenantSelectionPage } from '../features/auth/TenantSelectionPage'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { JournalEntryListPage } from '../features/general-ledger/JournalEntryListPage'
import { JournalEntryDetailPage } from '../features/general-ledger/JournalEntryDetailPage'
import { APInvoiceListPage } from '../features/accounts-payable/APInvoiceListPage'
import { APInvoiceDetailPage } from '../features/accounts-payable/APInvoiceDetailPage'
import { VendorManagementPage } from '../features/accounts-payable/VendorManagementPage'
import { ARInvoiceListPage } from '../features/accounts-receivable/ARInvoiceListPage'
import { CustomerManagementPage } from '../features/accounts-receivable/CustomerManagementPage'
import { IncomeAuditPage } from '../features/income-audit/IncomeAuditPage'
import { TrialBalanceReportPage } from '../features/reports/TrialBalanceReportPage'
import { ApprovalQueuePage } from '../features/approvals/ApprovalQueuePage'
import { AuditLogsPage } from '../features/audit-logs/AuditLogsPage'
import { NotificationsPage } from '../features/notifications/NotificationsPage'
import { UserSettingsPage } from '../features/settings/UserSettingsPage'
import { SettingsPage } from '../features/settings/SettingsPage'
import { TenantAdministrationPage } from '../features/settings/TenantAdministrationPage'
import { UserManagementPage } from '../features/users/UserManagementPage'

function ProtectedGate() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const activeTenantId = useAuthStore((state) => state.activeTenantId)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!activeTenantId) {
    return <Navigate to="/tenant-selection" replace />
  }

  return <AppShell />
}

function RootGate() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const activeTenantId = useAuthStore((state) => state.activeTenantId)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!activeTenantId) {
    return <Navigate to="/tenant-selection" replace />
  }

  return <Navigate to="/app/dashboard" replace />
}

export const router = createBrowserRouter([
  { path: '/', element: <RootGate /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/tenant-selection', element: <TenantSelectionPage /> },
  { path: '/tenants', element: <Navigate to="/tenant-selection" replace /> },
  {
    path: '/app',
    element: <ProtectedGate />,
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'general-ledger', element: <JournalEntryListPage /> },
      { path: 'general-ledger/:id', element: <JournalEntryDetailPage /> },
      { path: 'accounts-payable', element: <APInvoiceListPage /> },
      { path: 'accounts-payable/:id', element: <APInvoiceDetailPage /> },
      { path: 'vendors', element: <VendorManagementPage /> },
      { path: 'accounts-receivable', element: <ARInvoiceListPage /> },
      { path: 'accounts-receivable/:id', element: <CustomerManagementPage /> },
      { path: 'income-audit', element: <IncomeAuditPage /> },
      { path: 'trial-balance', element: <TrialBalanceReportPage /> },
      { path: 'approvals', element: <ApprovalQueuePage /> },
      { path: 'audit-logs', element: <AuditLogsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'users', element: <UserManagementPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'user-settings', element: <UserSettingsPage /> },
      { path: 'tenant-admin', element: <TenantAdministrationPage /> },
    ],
  },
])
