migrate((app) => {
  const requiredCollections = [
    "tenants",
    "users",
    "roles",
    "properties",
    "fiscal_periods",
    "journal_entries",
    "journal_lines",
    "ap_invoices",
    "ap_invoice_lines",
    "ar_invoices",
    "vendors",
    "customers",
    "notifications",
    "audit_logs",
    "approval_queue",
  ]

  requiredCollections.forEach((name) => {
    const collection = app.findCollectionByNameOrId(name)
    if (!collection) {
      throw new Error(`Required collection missing: ${name}`)
    }
  })
}, (app) => {
  void app
})
