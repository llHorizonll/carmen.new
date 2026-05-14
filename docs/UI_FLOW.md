# UI FLOW

# Login Flow

```txt
User
 ↓
Login Screen
 ↓
Authentication
 ↓
Load User Tenants
 ↓
Select Active Tenant
 ↓
Dashboard
```

---

# Dashboard

Widgets:
- Revenue Summary
- Outstanding AP
- Outstanding AR
- Cash Flow
- Realtime Alerts
- Approval Queue

---

# Navigation Structure

```txt
Dashboard
├── General Ledger
├── Accounts Payable
├── Accounts Receivable
├── Income Audit
├── Reports
├── Settings
└── Administration
```

---

# Journal Entry Flow

```txt
Create Journal
 ↓
Add Journal Lines
 ↓
Validation
 ↓
Save Draft
 ↓
Approval
 ↓
Posting
 ↓
Audit Log
```

---

# AP Invoice Flow

```txt
Upload Invoice
 ↓
OCR Scan (future)
 ↓
Validation
 ↓
Approval Workflow
 ↓
Payment
 ↓
Posting
```

---

# AR Invoice Flow

```txt
Create Invoice
 ↓
Send Invoice
 ↓
Receive Payment
 ↓
Settlement
```

---

# Approval Workflow

```txt
Requester
 ↓
Manager Approval
 ↓
Finance Approval
 ↓
Final Posting
```

---

# Realtime Notification Flow

```txt
Action Triggered
 ↓
PocketBase Realtime
 ↓
Frontend Subscription
 ↓
Notification Popup
```

---

# Mobile-Friendly Design

Requirements:
- responsive UI
- tablet-friendly accounting screens
- mobile approval screens

---

# Recommended UI Stack

- Mantine UI
- Mantine React Table
- React Hook Form
- TanStack Query

---

# Important Screens

## Dashboard
- KPI cards
- charts
- alerts

## Journal Entry Screen
- debit/credit validation
- attachment upload
- approval status

## AP Invoice Screen
- vendor selection
- OCR preview
- attachment management

## AR Screen
- customer aging
- payment history

## Reports
- trial balance
- GL report
- AP aging
- AR aging

---

# Accessibility

Requirements:
- keyboard navigation
- high contrast support
- multilingual support

---

# Future UI Features

- AI Copilot
- OCR invoice preview
- Voice search
- Advanced analytics
- Mobile app
- Dark mode
