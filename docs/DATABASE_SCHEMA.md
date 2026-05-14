# DATABASE SCHEMA

# Core Collections

---

# companies

```txt
id
name
code
status
created
updated
```

---

# tenants

```txt
id
company
name
code
timezone
currency
active
created
updated
```

---

# users

```txt
id
email
name
avatar
active_tenant
role
last_login
created
updated
```

---

# user_tenants

```txt
id
user
tenant
role
permissions
created
updated
```

Purpose:
- many-to-many user access
- RBAC support

---

# account_codes

```txt
id
tenant
account_code
account_name
account_type
parent_account
active
created
updated
```

---

# journal_entries

```txt
id
tenant
journal_no
posting_date
description
status
created_by
approved_by
created
updated
```

---

# journal_entry_lines

```txt
id
journal_entry
account_code
description
debit
credit
created
updated
```

---

# vendors

```txt
id
tenant
vendor_code
vendor_name
tax_id
email
phone
address
active
created
updated
```

---

# customers

```txt
id
tenant
customer_code
customer_name
tax_id
email
phone
address
active
created
updated
```

---

# ap_invoices

```txt
id
tenant
vendor
invoice_no
invoice_date
due_date
subtotal
tax_amount
total_amount
status
attachment
created
updated
```

---

# ar_invoices

```txt
id
tenant
customer
invoice_no
invoice_date
due_date
subtotal
tax_amount
total_amount
status
attachment
created
updated
```

---

# payments

```txt
id
tenant
payment_no
payment_type
reference_no
amount
payment_date
status
created
updated
```

---

# audit_logs

```txt
id
tenant
module
action
record_id
old_values
new_values
performed_by
ip_address
created
```

---

# notifications

```txt
id
tenant
title
message
type
target_user
read_status
created
```

---

# attachments

```txt
id
tenant
module
reference_id
file
uploaded_by
created
```

---

# Security Rules

Every business collection must contain:

```txt
tenant
```

PocketBase Rules Example:

```js
tenant.id ?= @request.auth.active_tenant.id
```

---

# Recommended Indexes

## Financial Tables

Indexes:
- tenant
- posting_date
- invoice_no
- account_code
- status

---

# Audit Requirements

Every critical transaction:
- must be logged
- must preserve original values
- must preserve user information

---

# Future Collections

## OCR

```txt
ocr_documents
ocr_extracted_fields
ocr_validation_results
```

## AI

```txt
ai_prompts
ai_results
ai_anomalies
```

## Hotel PMS Integration

```txt
pms_transactions
room_revenue
night_audit
```
