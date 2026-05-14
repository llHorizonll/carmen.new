# HOTEL ACCOUNTING SAAS PLATFORM BLUEPRINT

# 1. Project Overview

Enterprise-grade Hotel Accounting SaaS Platform inspired by modern hotel accounting workflows similar to Carmen Software.

Primary Goals:
- Multi-tenant SaaS architecture
- Windows Server friendly deployment
- Realtime capable accounting workflows
- Enterprise security model
- Modular accounting design
- Scalable hotel/branch management
- OCR and AI ready architecture
- IIS-friendly infrastructure
- Low operational complexity

Target Users:
- Hotel groups
- Resort operators
- Hospitality finance departments
- Hotel management companies
- Multi-property hotel organizations

---

# 2. Architecture Philosophy

The system is designed as:

```txt
React SPA Frontend
        ↓
IIS Reverse Proxy
        ↓
PocketBase Backend + Realtime
        ↓
SQLite Database
```

Core Principles:
- Frontend and backend fully separated
- Windows-first deployment strategy
- Single Page Application architecture
- API-driven architecture
- Tenant isolation first
- Auditability for every financial transaction
- Realtime updates for approvals and dashboards
- Low infrastructure complexity

---

# 3. Multi-Tenant SaaS Strategy

Recommended Architecture:

```txt
1 Company = 1 PocketBase Instance
1 Company can contain multiple hotel branches/tenants
```

Example:

```txt
a1pb.yourdomain.com
 ├── Hotel Bangkok
 ├── Hotel Phuket
 └── Hotel Chiangmai
```

Benefits:
- Stronger tenant isolation
- Easier backup and restore
- Easier migration per company
- Lower risk of cross-company data leakage
- Better scalability
- Easier enterprise compliance

Each company:
- separate PocketBase instance
- separate SQLite database
- separate storage folder
- separate backup strategy
- separate IIS reverse proxy route

---

# 4. Technology Stack

# 4.1 Frontend

Frontend Framework:

```txt
React + Vite + TypeScript
```

Recommended Libraries:

- React
- Vite
- TypeScript
- React Router
- Mantine UI
- Mantine React Table
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Day.js
- Recharts

Frontend Principles:
- SPA architecture
- Mobile responsive
- Tablet friendly
- Desktop optimized
- Modular feature-based structure
- Strong typing everywhere
- Reusable components
- Realtime dashboard updates

Recommended Folder Structure:

```txt
frontend/
 ├── src/
 │   ├── modules/
 │   ├── pages/
 │   ├── layouts/
 │   ├── hooks/
 │   ├── routes/
 │   ├── services/
 │   ├── stores/
 │   ├── providers/
 │   ├── components/
 │   └── utils/
```

---

# 4.2 Backend

Backend Stack:

```txt
PocketBase
+ Go Hooks
+ Realtime Websocket
```

PocketBase Responsibilities:
- Authentication
- Realtime subscriptions
- API backend
- File storage
- RBAC
- Tenant validation
- Audit logging
- Attachment management

Backend Principles:
- Tenant-safe APIs
- Audit logs for financial transactions
- Realtime notifications
- Minimal infrastructure complexity
- Strong access validation

---

# 4.3 Infrastructure

Infrastructure Stack:

```txt
Windows Server 2022
IIS
ARR Reverse Proxy
NSSM Windows Service
win-acme SSL
```

Deployment Principles:
- Windows-first architecture
- IIS reverse proxy
- HTTPS everywhere
- PocketBase localhost-only
- Service auto restart
- Daily backup strategy

Example:

```txt
Internet
   ↓
IIS + SSL
   ↓
PocketBase localhost ports
```

---

# 5. Core Modules

# 5.1 Authentication & Authorization

Features:
- Login
- Logout
- JWT authentication
- Role-based access control
- Tenant switching
- Session management
- Password reset
- MFA ready

Roles:
- Super Admin
- Company Admin
- Finance Manager
- Accountant
- Auditor
- Read Only User

---

# 5.2 General Ledger (GL)

Features:
- Chart of Accounts
- Journal Entry
- Journal Posting
- Trial Balance
- General Ledger Report
- Financial Statements
- Fiscal Year Management
- Closing Process
- Reversing Entries
- Cost Center support

Future:
- Consolidation
- Multi-currency
- AI anomaly detection

---

# 5.3 Accounts Payable (AP)

Features:
- Vendor Management
- AP Invoice Entry
- Approval Workflow
- Payment Processing
- AP Aging Report
- Attachment Upload
- Credit Notes
- Batch Payments

Future:
- OCR invoice extraction
- AI validation
- Banking integration

---

# 5.4 Accounts Receivable (AR)

Features:
- Customer Management
- AR Invoice
- Payment Receipt
- Aging Report
- Settlement Tracking
- Credit Control

Future:
- PMS integration
- Online payment integration

---

# 5.5 Income Audit

Features:
- Night Audit Import
- Revenue Validation
- POS Validation
- Cashier Balancing
- Revenue Summary
- Exception Reports

Future:
- Automated anomaly detection
- AI reconciliation

---

# 5.6 Reporting

Features:
- Financial Reports
- Trial Balance
- Balance Sheet
- Profit & Loss
- AP Aging
- AR Aging
- Revenue Reports
- Excel Export
- PDF Export

Recommended:
- FastReport integration

---

# 5.7 Notification System

Features:
- Realtime notifications
- Approval alerts
- System alerts
- Financial warnings
- Audit notifications

Realtime Transport:

```txt
PocketBase Websocket Realtime
```

---

# 6. Security Architecture

Core Security Rules:
- HTTPS only
- JWT required
- Tenant validation everywhere
- RBAC validation
- Audit logging required
- SQL injection prevention
- Upload validation
- Rate limiting
- File access restrictions

Tenant Isolation Rule:

Every business collection must contain:

```txt
tenant
```

PocketBase Rule Example:

```js
tenant.id ?= @request.auth.active_tenant.id
```

Critical Security Requirements:
- Never trust frontend filtering only
- Validate tenant server-side
- Audit all financial changes
- Restrict admin APIs
- Log suspicious actions

---

# 7. Realtime Architecture

Realtime Features:
- Approval notifications
- Dashboard refresh
- Posting updates
- Financial alerts
- User notifications

Architecture:

```txt
Frontend
 ↓
wss://domain/api/realtime
 ↓
PocketBase subscriptions
```

Use Cases:
- invoice approved
- journal posted
- payment completed
- dashboard refresh
- approval queue updates

---

# 8. Windows Server Friendly Deployment

Deployment Goals:
- No Linux dependency
- No Kubernetes requirement
- No Docker requirement
- IIS compatible
- Easy backup and restore
- Easy maintenance

Recommended Structure:

```txt
D:\apps\pocketbase\
 ├── company-a\
 ├── company-b\
 └── company-c\
```

IIS Example:

```txt
a1pb.yourdomain.com → 127.0.0.1:8091
b1pb.yourdomain.com → 127.0.0.1:8092
```

Services:
- NSSM managed services
- auto restart enabled
- Windows startup enabled

SSL:
- win-acme
- Let's Encrypt
- auto renewal

---

# 9. Backup & Disaster Recovery

Critical Backup Targets:

```txt
pb_data/data.db
pb_data/storage
```

Recommended:
- daily backup
- offsite backup
- encrypted backup
- snapshot before upgrade
- monthly restore test

Disaster Recovery Goals:
- low downtime
- tenant-specific restore
- quick rollback capability

---

# 10. OCR & AI Future Roadmap

# OCR Features

Future OCR Features:
- Invoice OCR scanning
- Receipt scanning
- AP invoice extraction
- AI field validation

Recommended Future Engine:

```txt
Typhoon OCR
```

---

# AI Features

Future AI Features:
- AI accounting assistant
- Financial anomaly detection
- Smart reconciliation
- AI forecasting
- AI report summarization
- AI audit assistant

Potential Integrations:
- OpenAI APIs
- Local LLMs
- Ollama
- RAG document search

---

# 11. Integration Roadmap

Future Integrations:
- Hotel PMS systems
- POS systems
- Banking APIs
- Payroll systems
- Government tax systems
- BI dashboards
- ERP integrations

---

# 12. Development Workflow

Recommended Development Flow:

```txt
1. Auth + Multi-Tenant
2. GL Module
3. AP Module
4. AR Module
5. Reporting
6. Realtime Notifications
7. OCR Integration
8. AI Features
```

Recommended Documentation:

```txt
/docs
 ├── SYSTEM_ARCHITECTURE.md
 ├── DATABASE_SCHEMA.md
 ├── API_SPEC.md
 ├── UI_FLOW.md
 └── BLUEPRINT.md
```

Recommended AI Coding Workflow:

```txt
AGENTS.md
+ docs/*.md
+ /goal
```

---

# 13. Coding Standards

Requirements:
- TypeScript strict mode
- Reusable modules
- Modular architecture
- Tenant-safe queries
- Strong validation
- Consistent naming
- Reusable UI components

Do Not:
- hardcode tenant values
- bypass RBAC
- skip audit logs
- expose localhost backend ports

---

# 14. Recommended Project Structure

```txt
hotel-accounting-saas/
├── AGENTS.md
├── docs/
├── frontend/
├── backend/
├── infra/
└── scripts/
```

Frontend:

```txt
frontend/
 ├── src/
 ├── public/
 ├── dist/
 └── vite.config.ts
```

Backend:

```txt
backend/
 ├── pocketbase/
 ├── hooks/
 ├── migrations/
 └── scripts/
```

---

# 15. Long-Term Vision

Long-Term Goals:
- Enterprise hotel accounting platform
- Multi-country support
- Multi-currency support
- AI-assisted accounting
- OCR-first AP workflow
- Real-time financial intelligence
- Cloud + on-premise deployment
- White-label SaaS support

Final Vision:

```txt
Modern Hotel Financial Platform
Built for Windows Infrastructure
Realtime + AI Ready
Enterprise Multi-Tenant SaaS
```

