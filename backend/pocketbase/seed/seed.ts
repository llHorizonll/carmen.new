import PocketBase from 'pocketbase'

type RecordData = Record<string, unknown>

const url = process.env.PB_URL ?? 'http://127.0.0.1:8090'
const adminEmail = process.env.PB_ADMIN_EMAIL ?? 'admin@example.com'
const adminPassword = process.env.PB_ADMIN_PASSWORD ?? 'change-me'

const tenantId = 'tenant-carmen'

async function upsertByField(pb: PocketBase, collection: string, key: string, value: string, payload: RecordData) {
  const escaped = value.replace(/"/g, '\\"')
  const records = await pb.collection(collection).getList(1, 1, { filter: `${key} = "${escaped}"` })
  const existing = records.items[0]

  if (existing) {
    await pb.collection(collection).update(existing.id, payload as never)
    return existing.id
  }

  const created = await pb.collection(collection).create(payload as never)
  return created.id
}

export async function seedPocketBase() {
  const pb = new PocketBase(url)
  await pb.admins.authWithPassword(adminEmail, adminPassword)

  const now = new Date().toISOString()

  await upsertByField(pb, 'tenants', 'groupName', 'Carmen Hospitality Group', {
    groupName: 'Carmen Hospitality Group',
    region: 'Bangkok Metro',
    fiscalPeriod: 'FY2026 P04',
    closeStatus: 'Soft Close',
    activeProperties: 4,
    currency: 'THB',
  })

  const roleId = await upsertByField(pb, 'roles', 'name', 'Finance Manager', {
    name: 'Finance Manager',
    scope: 'tenant',
    permissions: {
      modules: ['general-ledger', 'accounts-payable', 'accounts-receivable', 'reports', 'approvals'],
      actions: ['read', 'create', 'update', 'approve', 'post', 'export'],
    },
  })

  void roleId

  const propertyRecords = [
    { key: 'CARMEN Bangkok Riverside', region: 'Bangkok', currency: 'THB', revenueToday: 1245000, occupancy: 0.86, adr: 4620, cashPosition: 12894000, exceptionCount: 2 },
    { key: 'CARMEN Phuket Resort', region: 'Phuket', currency: 'THB', revenueToday: 980000, occupancy: 0.91, adr: 7150, cashPosition: 10420000, exceptionCount: 1 },
    { key: 'CARMEN Chiang Mai Boutique', region: 'Chiang Mai', currency: 'THB', revenueToday: 524000, occupancy: 0.79, adr: 3880, cashPosition: 5484000, exceptionCount: 0 },
    { key: 'CARMEN Pattaya Beach', region: 'Pattaya', currency: 'THB', revenueToday: 1124000, occupancy: 0.88, adr: 5350, cashPosition: 8744000, exceptionCount: 4 },
  ]

  const propertyIdMap = new Map<string, string>()

  for (const property of propertyRecords) {
    const id = await upsertByField(pb, 'properties', 'name', property.key, {
      tenantId,
      ...property,
      name: property.key,
    })
    propertyIdMap.set(property.key, id)
  }

  await upsertByField(pb, 'fiscal_periods', 'label', 'FY2026 P04', {
    tenantId,
    label: 'FY2026 P04',
    year: 'FY2026',
    period: 'P04',
    status: 'Soft Close',
  })

  const vendorData = [
    { code: 'V-1001', name: 'Siam Fresh Produce', category: 'F&B', taxId: '0105568001234', balance: 428400, paymentTerms: 'Net 30', status: 'Active', lastActivity: now, risk: 'Low' },
    { code: 'V-1002', name: 'Andaman Seafood Supply', category: 'F&B', taxId: '0105568005678', balance: 312000, paymentTerms: 'Net 15', status: 'Review', lastActivity: now, risk: 'Medium' },
    { code: 'V-1003', name: 'Bangkok Linen Services', category: 'Housekeeping', taxId: '0105568008888', balance: 164900, paymentTerms: 'Net 30', status: 'Active', lastActivity: now, risk: 'Low' },
    { code: 'V-1004', name: 'Thai Beverage Distribution', category: 'Bar', taxId: '0105568009999', balance: 789400, paymentTerms: 'Net 45', status: 'Hold', lastActivity: now, risk: 'High' },
    { code: 'V-1005', name: 'Premier Maintenance Co.', category: 'Engineering', taxId: '0105568011111', balance: 99000, paymentTerms: 'Net 30', status: 'Active', lastActivity: now, risk: 'Low' },
  ]

  const vendorIdMap = new Map<string, string>()
  for (const vendor of vendorData) {
    const id = await upsertByField(pb, 'vendors', 'code', vendor.code, { tenantId, ...vendor })
    vendorIdMap.set(vendor.name, id)
  }

  const customerData = [
    { code: 'C-2001', name: 'Agoda', segment: 'OTA', creditLimit: 2000000, outstanding: 680000, agingBucket: '31-60', status: 'Active', lastInvoice: '2026-05-12 00:00:00.000Z' },
    { code: 'C-2002', name: 'Booking.com', segment: 'OTA', creditLimit: 2200000, outstanding: 940000, agingBucket: '0-30', status: 'Active', lastInvoice: '2026-05-13 00:00:00.000Z' },
    { code: 'C-2003', name: 'Expedia', segment: 'OTA', creditLimit: 1800000, outstanding: 410000, agingBucket: '61-90', status: 'Watch', lastInvoice: '2026-05-07 00:00:00.000Z' },
    { code: 'C-2004', name: 'Corporate Account - Siam Motors', segment: 'Corporate', creditLimit: 1200000, outstanding: 228000, agingBucket: '0-30', status: 'Active', lastInvoice: '2026-05-14 00:00:00.000Z' },
    { code: 'C-2005', name: 'Walk-in Guest Ledger', segment: 'Retail', creditLimit: 300000, outstanding: 52000, agingBucket: 'Current', status: 'Active', lastInvoice: '2026-05-14 00:00:00.000Z' },
  ]

  const customerIdMap = new Map<string, string>()
  for (const customer of customerData) {
    const id = await upsertByField(pb, 'customers', 'code', customer.code, { tenantId, ...customer })
    customerIdMap.set(customer.name, id)
  }

  const je1Id = await upsertByField(pb, 'journal_entries', 'jeNumber', 'JV-260501', {
    tenantId,
    propertyId: propertyIdMap.get('CARMEN Bangkok Riverside'),
    jeNumber: 'JV-260501',
    date: '2026-05-14 00:00:00.000Z',
    source: 'Night Audit',
    description: 'Room revenue posting for day close',
    debit: 1864200,
    credit: 1864200,
    difference: 0,
    status: 'Posted',
    postedBy: 'Maya Srisuk',
    updatedAtLabel: now,
  })

  await upsertByField(pb, 'journal_entries', 'jeNumber', 'JV-260499', {
    tenantId,
    propertyId: propertyIdMap.get('CARMEN Phuket Resort'),
    jeNumber: 'JV-260499',
    date: '2026-05-13 00:00:00.000Z',
    source: 'AP Accrual',
    description: 'Maintenance accrual for month-end',
    debit: 92000,
    credit: 92000,
    difference: 0,
    status: 'Approved',
    postedBy: 'Niran',
    updatedAtLabel: now,
  })

  await upsertByField(pb, 'journal_lines', 'memo', 'Room charges', {
    journalEntryId: je1Id,
    accountCode: '11000',
    accountName: 'Accounts Receivable',
    department: 'Front Office',
    debit: 1864200,
    credit: 0,
    memo: 'Room charges',
  })

  await upsertByField(pb, 'ap_invoices', 'invoiceNo', 'AP-24019', {
    tenantId,
    vendorId: vendorIdMap.get('Siam Fresh Produce'),
    propertyId: propertyIdMap.get('CARMEN Bangkok Riverside'),
    invoiceNo: 'AP-24019',
    invoiceDate: '2026-05-14 00:00:00.000Z',
    dueDate: '2026-05-14 00:00:00.000Z',
    amount: 248400,
    balance: 248400,
    status: 'Pending Approval',
    approval: 'Manager',
    aging: 'Due Today',
  })

  await upsertByField(pb, 'ar_invoices', 'invoiceNo', 'AR-8801', {
    tenantId,
    customerId: customerIdMap.get('Agoda'),
    propertyId: propertyIdMap.get('CARMEN Bangkok Riverside'),
    invoiceNo: 'AR-8801',
    invoiceDate: '2026-05-13 00:00:00.000Z',
    dueDate: '2026-05-27 00:00:00.000Z',
    amount: 680000,
    paid: 220000,
    balance: 460000,
    status: 'Open',
    aging: '0-30',
  })

  await upsertByField(pb, 'notifications', 'title', 'AP Invoice approved', {
    tenantId,
    type: 'invoice approved',
    title: 'AP Invoice approved',
    message: 'AP-24019 approved for payment',
    timestamp: now,
    read: false,
  })

  await upsertByField(pb, 'audit_logs', 'entity', 'JV-260501', {
    tenantId,
    timestamp: now,
    user: 'Maya Srisuk',
    action: 'Posted journal',
    module: 'General Ledger',
    entity: 'JV-260501',
    property: 'CARMEN Bangkok Riverside',
    ipAddress: '10.12.8.23',
    status: 'Success',
    detail: 'Journal posted and locked.',
  })

  await upsertByField(pb, 'approval_queue', 'preview', 'Siam Fresh Produce invoice AP-24019 for Riverside.', {
    tenantId,
    group: 'AP Invoice',
    priority: 'High',
    requester: 'Kanya',
    amount: 248400,
    sla: '1h 15m',
    status: 'Pending',
    preview: 'Siam Fresh Produce invoice AP-24019 for Riverside.',
  })

  console.log('PocketBase seed complete')
}

if (import.meta.main) {
  void seedPocketBase()
}
