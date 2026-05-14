# API SPECIFICATION

# Authentication

---

## POST /api/auth/login

Purpose:
- authenticate user

Request:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

Response:

```json
{
  "token": "jwt",
  "user": {}
}
```

---

## POST /api/auth/switch-tenant

Purpose:
- switch active tenant

---

# General Ledger APIs

---

## GET /api/gl/accounts

Returns chart of accounts.

---

## POST /api/gl/journal-entry

Create journal entry.

---

## POST /api/gl/journal-entry/:id/post

Post journal entry.

---

## GET /api/gl/trial-balance

Generate trial balance.

Parameters:
- startDate
- endDate

---

## GET /api/gl/general-ledger

Generate general ledger report.

---

# AP APIs

---

## GET /api/ap/vendors

List vendors.

---

## POST /api/ap/invoices

Create AP invoice.

---

## POST /api/ap/invoices/:id/approve

Approve invoice.

---

## POST /api/ap/payments

Create payment.

---

# AR APIs

---

## GET /api/ar/customers

List customers.

---

## POST /api/ar/invoices

Create AR invoice.

---

## GET /api/ar/aging

Generate aging report.

---

# Notification APIs

---

## GET /api/notifications

Get notifications.

---

## POST /api/notifications/read

Mark notification as read.

---

# Realtime Events

---

## GL Events

```txt
journal.created
journal.posted
```

---

## AP Events

```txt
invoice.created
invoice.approved
payment.created
```

---

## Notification Events

```txt
notification.created
```

---

# Security Requirements

All APIs must:
- require JWT
- validate tenant
- validate permissions
- write audit logs

---

# Rate Limiting

Recommended:
- login rate limit
- upload rate limit
- API burst protection

---

# File Upload Rules

Allowed:
- PDF
- Excel
- Images

Maximum:
- configurable per tenant

---

# Future APIs

## OCR

```txt
POST /api/ocr/scan
POST /api/ocr/validate
```

## AI Assistant

```txt
POST /api/ai/analyze-financials
POST /api/ai/detect-anomaly
```

## PMS Integration

```txt
POST /api/pms/import-night-audit
```
