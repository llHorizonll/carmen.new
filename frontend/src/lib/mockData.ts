export type ConnectionStatus = 'live' | 'reconnecting' | 'offline'

export type CurrencyCode = 'THB' | 'USD'

export type TenantSummary = {
  id: string
  groupName: string
  propertyName: string
  region: string
  activeProperties: number
  fiscalPeriod: string
  closeStatus: 'Open' | 'Soft Close' | 'Hard Close'
  currency: CurrencyCode
  lastLoginAt: string
}

export type Property = {
  id: string
  tenantId: string
  name: string
  region: string
  currency: CurrencyCode
  revenueToday: number
  occupancy: number
  adr: number
  cashPosition: number
  exceptionCount: number
}

export type UserRecord = {
  id: string
  name: string
  email: string
  role: string
  mfa: 'Enabled' | 'Pending' | 'Disabled'
  tenantAccess: string[]
  properties: string[]
  lastLogin: string
  status: 'Active' | 'Invited' | 'Suspended'
}

export type Vendor = {
  id: string
  tenantId: string
  code: string
  name: string
  category: string
  taxId: string
  balance: number
  paymentTerms: string
  status: 'Active' | 'Review' | 'Hold'
  lastActivity: string
  risk: 'Low' | 'Medium' | 'High'
}

export type Customer = {
  id: string
  tenantId: string
  code: string
  name: string
  segment: string
  creditLimit: number
  outstanding: number
  agingBucket: string
  status: 'Active' | 'Watch' | 'Blocked'
  lastInvoice: string
}

export type JournalEntry = {
  id: string
  tenantId: string
  jeNumber: string
  date: string
  property: string
  source: string
  description: string
  debit: number
  credit: number
  difference: number
  status: 'Draft' | 'Approved' | 'Posted' | 'Rejected'
  postedBy: string
  updatedAt: string
  lines: JournalLine[]
  approvalStatus: string
}

export type JournalLine = {
  accountCode: string
  accountName: string
  department: string
  debit: number
  credit: number
  memo: string
}

export type APInvoice = {
  id: string
  tenantId: string
  invoiceNo: string
  vendor: string
  property: string
  invoiceDate: string
  dueDate: string
  amount: number
  balance: number
  status: 'Pending Approval' | 'Approved' | 'Paid' | 'Overdue'
  approval: string
  aging: string
  paymentHistory: string[]
  glDistribution: { account: string; amount: number }[]
}

export type ARInvoice = {
  id: string
  tenantId: string
  invoiceNo: string
  customer: string
  property: string
  invoiceDate: string
  dueDate: string
  amount: number
  paid: number
  balance: number
  status: 'Open' | 'Collected' | 'Overdue' | 'Credit Note'
  aging: string
}

export type TrialBalanceRow = {
  accountCode: string
  accountName: string
  openingDebit: number
  openingCredit: number
  periodDebit: number
  periodCredit: number
  closingDebit: number
  closingCredit: number
  department: string
}

export type ApprovalItem = {
  id: string
  group: 'AP Invoice' | 'Journal Entry' | 'Payment Run' | 'Adjustment'
  priority: 'High' | 'Medium' | 'Low'
  requester: string
  amount: number
  sla: string
  status: 'Pending' | 'Queued' | 'Escalated'
  preview: string
}

export type AuditLog = {
  id: string
  timestamp: string
  user: string
  action: string
  module: string
  entity: string
  property: string
  ipAddress: string
  status: 'Success' | 'Failed' | 'Pending'
  detail: string
}

export type NotificationItem = {
  id: string
  type:
    | 'invoice approved'
    | 'journal posted'
    | 'sync completed'
    | 'anomaly detected'
    | 'user mentioned'
    | 'report exported'
  title: string
  message: string
  timestamp: string
  read: boolean
}

export type DashboardSnapshot = {
  tenantId: string
  propertyId: string
  fiscalPeriod: string
  cashPosition: number
  dailyRevenue: number
  outstandingAP: number
  outstandingAR: number
  closeProgress: number
  pendingApprovals: number
  exceptions: number
  lastSyncAt: string
  connectionStatus: ConnectionStatus
  metrics: Array<{ label: string; value: number; delta: number; format: 'currency' | 'percent' | 'number' }>
  activities: Array<{
    id: string
    title: string
    detail: string
    amount: number
    timestamp: string
    type: string
  }>
  propertyPerformance: Array<{
    property: string
    revenue: number
    margin: number
    occupancy: number
    exceptions: number
    trend: 'up' | 'down' | 'flat'
  }>
  anomalies: Array<{
    id: string
    property: string
    title: string
    severity: 'High' | 'Medium' | 'Low'
    value: number
  }>
  recentJournals: JournalEntry[]
}

export type LoginTenant = {
  id: string
  groupName: string
  region: string
  activeProperties: number
  fiscalPeriod: string
  closeStatus: 'Open' | 'Soft Close' | 'Hard Close'
  lastAccessedAt: string
  propertyNames: string[]
}

export const tenants: LoginTenant[] = [
  {
    id: 'tenant-carmen',
    groupName: 'Carmen Hospitality Group',
    region: 'Bangkok Metro',
    activeProperties: 4,
    fiscalPeriod: 'FY2026 P04',
    closeStatus: 'Soft Close',
    lastAccessedAt: '2026-05-13T18:14:00Z',
    propertyNames: ['CARMEN Bangkok Riverside', 'CARMEN Phuket Resort', 'CARMEN Chiang Mai Boutique', 'CARMEN Pattaya Beach'],
  },
  {
    id: 'tenant-northstar',
    groupName: 'Northstar Hotel Collection',
    region: 'Thailand Coast',
    activeProperties: 3,
    fiscalPeriod: 'FY2026 P04',
    closeStatus: 'Open',
    lastAccessedAt: '2026-05-14T05:54:00Z',
    propertyNames: ['Northstar Hua Hin', 'Northstar Krabi Bay', 'Northstar Udon Suites'],
  },
  {
    id: 'tenant-urbanstay',
    groupName: 'Urban Stay Thailand',
    region: 'Central Thailand',
    activeProperties: 2,
    fiscalPeriod: 'FY2026 P04',
    closeStatus: 'Hard Close',
    lastAccessedAt: '2026-05-11T13:20:00Z',
    propertyNames: ['Urban Stay Silom', 'Urban Stay Asok'],
  },
]

export const properties: Property[] = [
  { id: 'prop-bkk', tenantId: 'tenant-carmen', name: 'CARMEN Bangkok Riverside', region: 'Bangkok', currency: 'THB', revenueToday: 1245000, occupancy: 0.86, adr: 4620, cashPosition: 12894000, exceptionCount: 2 },
  { id: 'prop-phuket', tenantId: 'tenant-carmen', name: 'CARMEN Phuket Resort', region: 'Phuket', currency: 'THB', revenueToday: 980000, occupancy: 0.91, adr: 7150, cashPosition: 10420000, exceptionCount: 1 },
  { id: 'prop-chiangmai', tenantId: 'tenant-carmen', name: 'CARMEN Chiang Mai Boutique', region: 'Chiang Mai', currency: 'THB', revenueToday: 524000, occupancy: 0.79, adr: 3880, cashPosition: 5484000, exceptionCount: 0 },
  { id: 'prop-pattaya', tenantId: 'tenant-carmen', name: 'CARMEN Pattaya Beach', region: 'Pattaya', currency: 'THB', revenueToday: 1124000, occupancy: 0.88, adr: 5350, cashPosition: 8744000, exceptionCount: 4 },
]

export const vendors: Vendor[] = [
  { id: 'vend-1', tenantId: 'tenant-carmen', code: 'V-1001', name: 'Siam Fresh Produce', category: 'F&B', taxId: '0105568001234', balance: 428400, paymentTerms: 'Net 30', status: 'Active', lastActivity: '2026-05-13T09:20:00Z', risk: 'Low' },
  { id: 'vend-2', tenantId: 'tenant-carmen', code: 'V-1002', name: 'Andaman Seafood Supply', category: 'F&B', taxId: '0105568005678', balance: 312000, paymentTerms: 'Net 15', status: 'Review', lastActivity: '2026-05-14T03:10:00Z', risk: 'Medium' },
  { id: 'vend-3', tenantId: 'tenant-carmen', code: 'V-1003', name: 'Bangkok Linen Services', category: 'Housekeeping', taxId: '0105568008888', balance: 164900, paymentTerms: 'Net 30', status: 'Active', lastActivity: '2026-05-12T11:05:00Z', risk: 'Low' },
  { id: 'vend-4', tenantId: 'tenant-carmen', code: 'V-1004', name: 'Thai Beverage Distribution', category: 'Bar', taxId: '0105568009999', balance: 789400, paymentTerms: 'Net 45', status: 'Hold', lastActivity: '2026-05-10T14:45:00Z', risk: 'High' },
  { id: 'vend-5', tenantId: 'tenant-carmen', code: 'V-1005', name: 'Premier Maintenance Co.', category: 'Engineering', taxId: '0105568011111', balance: 99000, paymentTerms: 'Net 30', status: 'Active', lastActivity: '2026-05-14T06:30:00Z', risk: 'Low' },
]

export const customers: Customer[] = [
  { id: 'cust-1', tenantId: 'tenant-carmen', code: 'C-2001', name: 'Agoda', segment: 'OTA', creditLimit: 2000000, outstanding: 680000, agingBucket: '31-60', status: 'Active', lastInvoice: '2026-05-12' },
  { id: 'cust-2', tenantId: 'tenant-carmen', code: 'C-2002', name: 'Booking.com', segment: 'OTA', creditLimit: 2200000, outstanding: 940000, agingBucket: '0-30', status: 'Active', lastInvoice: '2026-05-13' },
  { id: 'cust-3', tenantId: 'tenant-carmen', code: 'C-2003', name: 'Expedia', segment: 'OTA', creditLimit: 1800000, outstanding: 410000, agingBucket: '61-90', status: 'Watch', lastInvoice: '2026-05-07' },
  { id: 'cust-4', tenantId: 'tenant-carmen', code: 'C-2004', name: 'Corporate Account - Siam Motors', segment: 'Corporate', creditLimit: 1200000, outstanding: 228000, agingBucket: '0-30', status: 'Active', lastInvoice: '2026-05-14' },
  { id: 'cust-5', tenantId: 'tenant-carmen', code: 'C-2005', name: 'Walk-in Guest Ledger', segment: 'Retail', creditLimit: 300000, outstanding: 52000, agingBucket: 'Current', status: 'Active', lastInvoice: '2026-05-14' },
]

export const journalEntries: JournalEntry[] = [
  {
    id: 'je-1',
    tenantId: 'tenant-carmen',
    jeNumber: 'JV-260501',
    date: '2026-05-14',
    property: 'CARMEN Bangkok Riverside',
    source: 'Night Audit',
    description: 'Room revenue posting for day close',
    debit: 1864200,
    credit: 1864200,
    difference: 0,
    status: 'Posted',
    postedBy: 'Maya Srisuk',
    updatedAt: '2026-05-14T06:44:00Z',
    approvalStatus: 'Posted 06:44',
    lines: [
      { accountCode: '11000', accountName: 'Accounts Receivable', department: 'Front Office', debit: 1864200, credit: 0, memo: 'Room charges' },
      { accountCode: '40000', accountName: 'Room Revenue', department: 'Revenue', debit: 0, credit: 1553500, memo: 'Room revenue' },
      { accountCode: '41000', accountName: 'F&B Revenue', department: 'Outlet', debit: 0, credit: 310700, memo: 'Restaurant revenue' },
    ],
  },
  {
    id: 'je-2',
    tenantId: 'tenant-carmen',
    jeNumber: 'JV-260499',
    date: '2026-05-13',
    property: 'CARMEN Phuket Resort',
    source: 'AP Accrual',
    description: 'Maintenance accrual for month-end',
    debit: 92000,
    credit: 92000,
    difference: 0,
    status: 'Approved',
    postedBy: 'Niran',
    updatedAt: '2026-05-13T18:00:00Z',
    approvalStatus: 'Finance approved',
    lines: [
      { accountCode: '70000', accountName: 'Operating Expense', department: 'Engineering', debit: 92000, credit: 0, memo: 'Preventive maintenance' },
      { accountCode: '20000', accountName: 'Accounts Payable', department: 'AP', debit: 0, credit: 92000, memo: 'Accrued liability' },
    ],
  },
  {
    id: 'je-3',
    tenantId: 'tenant-carmen',
    jeNumber: 'JV-260497',
    date: '2026-05-12',
    property: 'CARMEN Pattaya Beach',
    source: 'Income Audit',
    description: 'Variance correction from cash count',
    debit: 12800,
    credit: 12800,
    difference: 0,
    status: 'Draft',
    postedBy: 'Somchai',
    updatedAt: '2026-05-12T16:50:00Z',
    approvalStatus: 'Awaiting review',
    lines: [
      { accountCode: '10000', accountName: 'Cash on Hand', department: 'Cashier', debit: 12800, credit: 0, memo: 'Cash difference' },
      { accountCode: '60000', accountName: 'Payroll Expense', department: 'Admin', debit: 0, credit: 12800, memo: 'Adjustment offset' },
    ],
  },
]

export const apInvoices: APInvoice[] = [
  { id: 'ap-1', tenantId: 'tenant-carmen', invoiceNo: 'AP-24019', vendor: 'Siam Fresh Produce', property: 'CARMEN Bangkok Riverside', invoiceDate: '2026-05-14', dueDate: '2026-05-14', amount: 248400, balance: 248400, status: 'Pending Approval', approval: 'Manager', aging: 'Due Today', paymentHistory: ['Received 2h ago'], glDistribution: [{ account: '50000 Cost of Sales', amount: 212400 }, { account: '20000 Accounts Payable', amount: 36000 }] },
  { id: 'ap-2', tenantId: 'tenant-carmen', invoiceNo: 'AP-24018', vendor: 'Andaman Seafood Supply', property: 'CARMEN Phuket Resort', invoiceDate: '2026-05-12', dueDate: '2026-05-13', amount: 182000, balance: 54000, status: 'Overdue', approval: 'Finance', aging: '1-7', paymentHistory: ['Partial payment 2026-05-13'], glDistribution: [{ account: '50000 Cost of Sales', amount: 156000 }, { account: '20000 Accounts Payable', amount: 26000 }] },
  { id: 'ap-3', tenantId: 'tenant-carmen', invoiceNo: 'AP-24017', vendor: 'Bangkok Linen Services', property: 'CARMEN Chiang Mai Boutique', invoiceDate: '2026-05-11', dueDate: '2026-06-10', amount: 86400, balance: 86400, status: 'Approved', approval: 'Manager', aging: 'Current', paymentHistory: ['Approved 2026-05-13'], glDistribution: [{ account: '70000 Operating Expense', amount: 86400 }] },
  { id: 'ap-4', tenantId: 'tenant-carmen', invoiceNo: 'AP-24016', vendor: 'Thai Beverage Distribution', property: 'CARMEN Pattaya Beach', invoiceDate: '2026-05-10', dueDate: '2026-05-25', amount: 312800, balance: 312800, status: 'Pending Approval', approval: 'Manager', aging: '8-30', paymentHistory: [], glDistribution: [{ account: '41000 F&B Revenue', amount: 312800 }] },
]

export const arInvoices: ARInvoice[] = [
  { id: 'ar-1', tenantId: 'tenant-carmen', invoiceNo: 'AR-8801', customer: 'Agoda', property: 'CARMEN Bangkok Riverside', invoiceDate: '2026-05-13', dueDate: '2026-05-27', amount: 680000, paid: 220000, balance: 460000, status: 'Open', aging: '0-30' },
  { id: 'ar-2', tenantId: 'tenant-carmen', invoiceNo: 'AR-8802', customer: 'Booking.com', property: 'CARMEN Phuket Resort', invoiceDate: '2026-05-12', dueDate: '2026-05-26', amount: 940000, paid: 0, balance: 940000, status: 'Overdue', aging: '31-60' },
  { id: 'ar-3', tenantId: 'tenant-carmen', invoiceNo: 'AR-8803', customer: 'Expedia', property: 'CARMEN Pattaya Beach', invoiceDate: '2026-05-08', dueDate: '2026-05-22', amount: 410000, paid: 410000, balance: 0, status: 'Collected', aging: 'Current' },
  { id: 'ar-4', tenantId: 'tenant-carmen', invoiceNo: 'AR-8804', customer: 'Corporate Account - Siam Motors', property: 'CARMEN Chiang Mai Boutique', invoiceDate: '2026-05-14', dueDate: '2026-05-29', amount: 228000, paid: 0, balance: 228000, status: 'Open', aging: '0-30' },
]

export const trialBalanceRows: TrialBalanceRow[] = [
  { accountCode: '10000', accountName: 'Cash on Hand', openingDebit: 1200000, openingCredit: 0, periodDebit: 540000, periodCredit: 310000, closingDebit: 1430000, closingCredit: 0, department: 'Finance' },
  { accountCode: '10100', accountName: 'Bank Account', openingDebit: 8200000, openingCredit: 0, periodDebit: 1800000, periodCredit: 2200000, closingDebit: 7800000, closingCredit: 0, department: 'Finance' },
  { accountCode: '11000', accountName: 'Accounts Receivable', openingDebit: 1650000, openingCredit: 0, periodDebit: 940000, periodCredit: 680000, closingDebit: 1910000, closingCredit: 0, department: 'AR' },
  { accountCode: '20000', accountName: 'Accounts Payable', openingDebit: 0, openingCredit: 0, periodDebit: 620000, periodCredit: 1040000, closingDebit: 0, closingCredit: 420000, department: 'AP' },
  { accountCode: '40000', accountName: 'Room Revenue', openingDebit: 0, openingCredit: 19600000, periodDebit: 0, periodCredit: 2854000, closingDebit: 0, closingCredit: 22454000, department: 'Revenue' },
  { accountCode: '41000', accountName: 'F&B Revenue', openingDebit: 0, openingCredit: 6300000, periodDebit: 0, periodCredit: 920000, closingDebit: 0, closingCredit: 7220000, department: 'Revenue' },
  { accountCode: '50000', accountName: 'Cost of Sales', openingDebit: 4200000, openingCredit: 0, periodDebit: 880000, periodCredit: 0, closingDebit: 5080000, closingCredit: 0, department: 'Operations' },
  { accountCode: '70000', accountName: 'Operating Expense', openingDebit: 0, openingCredit: 0, periodDebit: 1960000, periodCredit: 0, closingDebit: 1960000, closingCredit: 0, department: 'Operations' },
]

export const approvals: ApprovalItem[] = [
  { id: 'appr-1', group: 'AP Invoice', priority: 'High', requester: 'Kanya', amount: 248400, sla: '1h 15m', status: 'Pending', preview: 'Siam Fresh Produce invoice AP-24019 for Riverside.' },
  { id: 'appr-2', group: 'Journal Entry', priority: 'Medium', requester: 'Niran', amount: 1120000, sla: '3h 05m', status: 'Queued', preview: 'Month-end accrual batch for city properties.' },
  { id: 'appr-3', group: 'Payment Run', priority: 'High', requester: 'Mali', amount: 726000, sla: '45m', status: 'Escalated', preview: 'Supplier disbursement for Phuket and Pattaya.' },
  { id: 'appr-4', group: 'Adjustment', priority: 'Low', requester: 'Somchai', amount: 12800, sla: '5h 20m', status: 'Pending', preview: 'Cash variance adjustment after night audit.' },
]

export const auditLogs: AuditLog[] = [
  { id: 'log-1', timestamp: '2026-05-14T07:02:00Z', user: 'Maya Srisuk', action: 'Posted journal', module: 'General Ledger', entity: 'JV-260501', property: 'CARMEN Bangkok Riverside', ipAddress: '10.12.8.23', status: 'Success', detail: 'Journal posted and locked.' },
  { id: 'log-2', timestamp: '2026-05-14T06:47:00Z', user: 'Niran', action: 'Approved invoice', module: 'Accounts Payable', entity: 'AP-24019', property: 'CARMEN Bangkok Riverside', ipAddress: '10.12.8.24', status: 'Success', detail: 'Approval recorded with audit trail.' },
  { id: 'log-3', timestamp: '2026-05-14T06:18:00Z', user: 'Somchai', action: 'Flagged anomaly', module: 'Income Audit', entity: 'Room Revenue', property: 'CARMEN Pattaya Beach', ipAddress: '10.12.9.14', status: 'Pending', detail: 'Variance above threshold.' },
  { id: 'log-4', timestamp: '2026-05-13T22:05:00Z', user: 'Mali', action: 'Exported report', module: 'Reports', entity: 'Trial Balance', property: 'CARMEN Phuket Resort', ipAddress: '10.12.8.18', status: 'Success', detail: 'CSV export completed.' },
  { id: 'log-5', timestamp: '2026-05-13T19:44:00Z', user: 'Aek', action: 'Updated vendor', module: 'AP', entity: 'V-1004', property: 'CARMEN Bangkok Riverside', ipAddress: '10.12.8.19', status: 'Success', detail: 'Payment terms changed to Net 45.' },
]

export const notifications: NotificationItem[] = [
  { id: 'note-1', type: 'invoice approved', title: 'AP Invoice approved', message: 'AP-24019 approved for payment', timestamp: '2026-05-14T07:04:00Z', read: false },
  { id: 'note-2', type: 'journal posted', title: 'Journal posted', message: 'JV-260501 posted successfully', timestamp: '2026-05-14T07:02:00Z', read: false },
  { id: 'note-3', type: 'sync completed', title: 'Sync completed', message: 'PocketBase realtime sync refreshed', timestamp: '2026-05-14T07:01:00Z', read: true },
  { id: 'note-4', type: 'anomaly detected', title: 'Variance detected', message: 'Pattaya room revenue above threshold', timestamp: '2026-05-14T06:18:00Z', read: false },
  { id: 'note-5', type: 'user mentioned', title: 'Mentioned in comment', message: 'Niran tagged you on AP workflow', timestamp: '2026-05-13T18:12:00Z', read: true },
  { id: 'note-6', type: 'report exported', title: 'Report exported', message: 'Trial balance CSV downloaded', timestamp: '2026-05-13T22:05:00Z', read: true },
]

export const recentTenantIds = ['tenant-carmen', 'tenant-northstar']

export const loginHint = 'Use your finance account. Access is tenant-aware after login.'

export const users: UserRecord[] = [
  {
    id: 'user-1',
    name: 'Maya Srisuk',
    email: 'maya.finance@carmen.cloud',
    role: 'Finance Manager',
    mfa: 'Enabled',
    tenantAccess: ['Carmen Hospitality Group', 'Northstar Hotel Collection'],
    properties: ['CARMEN Bangkok Riverside', 'CARMEN Phuket Resort'],
    lastLogin: '2026-05-14T06:58:00Z',
    status: 'Active',
  },
  {
    id: 'user-2',
    name: 'Niran Chaiwat',
    email: 'niran.ap@carmen.cloud',
    role: 'Accountant',
    mfa: 'Enabled',
    tenantAccess: ['Carmen Hospitality Group'],
    properties: ['CARMEN Chiang Mai Boutique'],
    lastLogin: '2026-05-13T21:11:00Z',
    status: 'Active',
  },
  {
    id: 'user-3',
    name: 'Somchai Rattanakosin',
    email: 'somchai.audit@carmen.cloud',
    role: 'Auditor',
    mfa: 'Pending',
    tenantAccess: ['Urban Stay Thailand'],
    properties: ['Urban Stay Silom'],
    lastLogin: '2026-05-12T17:43:00Z',
    status: 'Invited',
  },
]

export function dashboardSnapshotFactory(filters: { tenantId: string; propertyId?: string; fiscalPeriod?: string }) {
  const selectedProperty = properties.find((property) => property.id === filters.propertyId) ?? properties[0]

  return {
    tenantId: filters.tenantId,
    propertyId: selectedProperty?.id ?? 'prop-bkk',
    fiscalPeriod: filters.fiscalPeriod ?? 'FY2026 P04',
    cashPosition: selectedProperty?.cashPosition ?? 0,
    dailyRevenue: selectedProperty?.revenueToday ?? 0,
    outstandingAP: apInvoices.reduce((sum, invoice) => sum + invoice.balance, 0),
    outstandingAR: arInvoices.reduce((sum, invoice) => sum + invoice.balance, 0),
    closeProgress: 0.72,
    pendingApprovals: approvals.filter((approval) => approval.status !== 'Pending').length + 3,
    exceptions: selectedProperty?.exceptionCount ?? 0,
    lastSyncAt: '2026-05-14T07:04:20Z',
    connectionStatus: 'live' as const,
    metrics: [
      { label: 'Cash position', value: selectedProperty?.cashPosition ?? 0, delta: 12_400, format: 'currency' as const },
      { label: 'Daily revenue', value: selectedProperty?.revenueToday ?? 0, delta: 0.086, format: 'currency' as const },
      { label: 'Close progress', value: 0.72, delta: 0.08, format: 'percent' as const },
      { label: 'Exceptions', value: selectedProperty?.exceptionCount ?? 0, delta: -1, format: 'number' as const },
    ],
    activities: [
      {
        id: 'act-1',
        title: 'AP invoice approved',
        detail: 'Siam Fresh Produce invoice AP-24019 approved',
        amount: 248400,
        timestamp: '2026-05-14T07:03:00Z',
        type: 'invoice approved',
      },
      {
        id: 'act-2',
        title: 'Night audit posted',
        detail: 'Bangkok Riverside room revenue booked',
        amount: 1864200,
        timestamp: '2026-05-14T06:44:00Z',
        type: 'journal posted',
      },
      {
        id: 'act-3',
        title: 'Sync completed',
        detail: 'Realtime channel refreshed',
        amount: 0,
        timestamp: '2026-05-14T06:40:00Z',
        type: 'sync completed',
      },
    ],
    propertyPerformance: properties.map((property, index) => ({
      property: property.name,
      revenue: property.revenueToday,
      margin: 0.32 + index * 0.03,
      occupancy: property.occupancy,
      exceptions: property.exceptionCount,
      trend: (index === 1 ? 'flat' : index % 2 === 0 ? 'up' : 'down') as 'up' | 'down' | 'flat',
    })),
    anomalies: [
      { id: 'anom-1', property: 'CARMEN Pattaya Beach', title: 'Room revenue variance', severity: 'High', value: 45800 },
      { id: 'anom-2', property: 'CARMEN Bangkok Riverside', title: 'F&B mix variance', severity: 'Medium', value: 12200 },
      { id: 'anom-3', property: 'CARMEN Phuket Resort', title: 'Cash drawer discrepancy', severity: 'Low', value: 8200 },
    ],
    recentJournals: journalEntries,
  }
}
