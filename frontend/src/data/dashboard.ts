import dayjs from 'dayjs'

export type DashboardMetric = {
  label: string
  value: string
  delta: string
  tone: 'success' | 'warning' | 'info' | 'neutral'
}

export type WorkflowStep = {
  title: string
  description: string
}

export type Guardrail = {
  title: string
  description: string
}

export type ModuleCard = {
  title: string
  description: string
  status: string
}

export type DashboardSnapshot = {
  companyName: string
  tenantName: string
  userRole: string
  lastSyncedAt: string
  metrics: DashboardMetric[]
  workflow: WorkflowStep[]
  guardrails: Guardrail[]
  modules: ModuleCard[]
}

const snapshot: DashboardSnapshot = {
  companyName: 'Carmen Hospitality Group',
  tenantName: 'Hotel Bangkok',
  userRole: 'Finance Manager',
  lastSyncedAt: dayjs().format('DD MMM YYYY, HH:mm:ss'),
  metrics: [
    {
      label: 'Revenue summary',
      value: '฿18.2M',
      delta: '+12.4% vs last period',
      tone: 'success',
    },
    {
      label: 'Outstanding AP',
      value: '฿4.8M',
      delta: '18 invoices pending',
      tone: 'warning',
    },
    {
      label: 'Outstanding AR',
      value: '฿2.1M',
      delta: '6 customers aging > 30 days',
      tone: 'info',
    },
    {
      label: 'Approval queue',
      value: '14',
      delta: 'Realtime PocketBase updates',
      tone: 'neutral',
    },
  ],
  workflow: [
    {
      title: 'Authenticate',
      description: 'JWT login with role-based access controls and tenant membership checks.',
    },
    {
      title: 'Select tenant',
      description: 'Load the active branch or hotel before any business data becomes visible.',
    },
    {
      title: 'Create entries',
      description: 'Draft journals, AP invoices, and AR invoices with tenant-scoped records.',
    },
    {
      title: 'Approve and post',
      description: 'Push approval events through realtime subscriptions, then log every action.',
    },
  ],
  guardrails: [
    {
      title: 'Tenant isolation',
      description: 'Every business collection stays tenant-scoped and server-side validated.',
    },
    {
      title: 'Audit logging',
      description: 'Critical financial actions are recorded with old and new values.',
    },
    {
      title: 'Realtime ready',
      description: 'PocketBase subscriptions can fan out approval and notification updates.',
    },
  ],
  modules: [
    {
      title: 'General Ledger',
      description: 'Chart of accounts, journal entry, posting, and trial balance.',
      status: 'Phase 1',
    },
    {
      title: 'Accounts Payable',
      description: 'Vendor invoices, approvals, payments, and attachment handling.',
      status: 'Phase 2',
    },
    {
      title: 'Accounts Receivable',
      description: 'Customers, invoicing, aging, and settlement tracking.',
      status: 'Phase 2',
    },
    {
      title: 'Notifications',
      description: 'Realtime alerts for approvals, posting events, and exception handling.',
      status: 'Always on',
    },
  ],
}

export async function fetchDashboardSnapshot(): Promise<DashboardSnapshot> {
  await new Promise((resolve) => window.setTimeout(resolve, 240))
  return snapshot
}
