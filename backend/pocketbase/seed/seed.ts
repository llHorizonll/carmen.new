import PocketBase from 'pocketbase'

const url = process.env.PB_URL ?? 'http://127.0.0.1:8090'
const adminEmail = process.env.PB_ADMIN_EMAIL ?? 'admin@example.com'
const adminPassword = process.env.PB_ADMIN_PASSWORD ?? 'change-me'

const seedCollections = [
  'tenants',
  'users',
  'roles',
  'properties',
  'fiscal_periods',
  'journal_entries',
  'journal_lines',
  'ap_invoices',
  'ap_invoice_lines',
  'ar_invoices',
  'vendors',
  'customers',
  'notifications',
  'audit_logs',
  'approval_queue',
] as const

export async function seedPocketBase() {
  const pb = new PocketBase(url)
  await pb.admins.authWithPassword(adminEmail, adminPassword)

  for (const collection of seedCollections) {
    // Example seed entry. Replace with production seed fixtures as the collections solidify.
    await pb.collection(collection).create({ name: `${collection}-seed`, tenantId: 'tenant-carmen' } as never)
  }
}

if (import.meta.main) {
  void seedPocketBase()
}
