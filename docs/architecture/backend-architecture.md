# Backend Architecture

## Backend
- PocketBase
- Windows Server deployment
- IIS reverse proxy
- realtime websocket subscriptions

## Collections
- tenants
- users
- roles
- properties
- journal_entries
- journal_lines
- ap_invoices
- ar_invoices
- vendors
- customers
- notifications
- audit_logs
- approval_queue

## Requirements
- multi-tenant aware
- RBAC
- audit logging
- soft delete
- realtime subscriptions
- tenant-scoped queries

## PocketBase Integration

Frontend code should treat PocketBase as the API layer:

```ts
import PocketBase from 'pocketbase'

export const pb = new PocketBase(import.meta.env.VITE_PB_URL)
```

## Realtime

Use collection subscriptions for live updates:

```ts
pb.collection('notifications').subscribe('*')
```

