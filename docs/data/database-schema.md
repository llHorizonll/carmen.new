# Database Schema

## journal_entries
- tenant_id
- property_id
- journal_no
- posting_date
- source
- description
- total_debit
- total_credit
- status
- created_by

## journal_lines
- journal_entry_id
- account_code
- account_name
- department
- debit
- credit
- memo

## ap_invoices
- tenant_id
- property_id
- vendor_id
- invoice_no
- invoice_date
- due_date
- amount
- balance
- status

## ar_invoices
- customer_id
- invoice_no
- amount
- balance
- aging_bucket

## notifications
- type
- title
- message
- is_read
- created_at

