# SYSTEM ARCHITECTURE

# Overview

Hotel Accounting SaaS Platform inspired by Carmen-style hotel accounting workflows.

Architecture Goals:
- Windows Server Friendly
- Multi-tenant SaaS
- Realtime capable
- Low operational complexity
- Enterprise-ready security
- Offline-capable internal workflows
- Easy deployment and backup

---

# Core Architecture

```txt
Users
  ↓
IIS Reverse Proxy + SSL
  ↓
Next.js Frontend
  ↓
PocketBase API + Realtime
  ↓
SQLite Database
```

---

# Recommended Stack

## Frontend
- Next.js (TypeScript)
- Mantine UI
- Zustand
- TanStack Query
- React Hook Form
- Day.js

## Backend
- PocketBase
- Go Hooks
- PocketBase Realtime

## Infrastructure
- Windows Server 2022
- IIS
- ARR Reverse Proxy
- NSSM
- win-acme SSL

## Reporting
- FastReport
- Excel Export
- PDF Export

## OCR / AI Future
- Typhoon OCR
- Invoice AI Validation
- LLM-based Accounting Assistant

---

# Multi-Tenant Design

Recommended Pattern:

```txt
1 Company = 1 PocketBase Instance
1 Company can contain many hotel branches / tenants
```

Example:

```txt
a1pb.yourdomain.com
 ├── Hotel Bangkok
 ├── Hotel Phuket
 └── Hotel Chiangmai
```

Benefits:
- Better isolation
- Easier backup
- Easier migration
- Better compliance
- Lower blast radius

---

# Deployment Layout

```txt
D:\apps\pocketbase\
├── company-a\
├── company-b\
└── company-c\
```

Each instance:
- separate SQLite
- separate storage
- separate backup

---

# IIS Reverse Proxy

```txt
Internet
 ↓
IIS + SSL
 ↓
PocketBase localhost ports
```

Example:

```txt
a1pb.yourdomain.com → 127.0.0.1:8091
b1pb.yourdomain.com → 127.0.0.1:8092
```

---

# Realtime Architecture

PocketBase realtime websocket:

```txt
Frontend
 ↓
wss://domain/api/realtime
 ↓
PocketBase subscriptions
```

Realtime Use Cases:
- approval notifications
- accounting posting updates
- live dashboards
- audit alerts

---

# Backup Strategy

Critical folders:

```txt
pb_data/data.db
pb_data/storage
```

Recommended:
- daily backup
- offsite backup
- retention policy
- snapshot before upgrades

---

# Monitoring

Recommended:
- Windows Event Viewer
- IIS Logs
- PocketBase logs
- Uptime monitoring
- Disk space alerts

---

# Scaling Strategy

Phase 1:
- single server

Phase 2:
- separate frontend/backend

Phase 3:
- dedicated reporting server

Phase 4:
- tenant-based server clustering

---

# Security Principles

- HTTPS only
- RBAC everywhere
- tenant isolation
- audit logging
- MFA support
- encrypted backups
- firewall restrictions

---

# Future Expansion

- Mobile App
- OCR Invoice Scanner
- AI Financial Assistant
- Hotel PMS integration
- POS integration
- Banking integration
- AI anomaly detection
