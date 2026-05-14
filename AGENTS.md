Build a premium fintech-style hotel accounting SaaS platform UI.

Tech stack:
- React
- Vite
- TypeScript
- Mantine UI
- Mantine React Table
- TanStack Query
- Zustand
- Framer Motion

Product context:
This is an internal authenticated hotel accounting SaaS platform for hospitality finance teams.
It is multi-tenant, realtime-enabled, and deployed on Windows Server with PocketBase backend and IIS reverse proxy.
The UI should feel like:
“Bloomberg Terminal meets Linear for hotel finance teams.”

Design direction:
- Premium fintech SaaS
- Dark mode first
- Dense but readable financial UI
- Minimal but powerful
- Professional operational accounting platform
- Realtime dashboard feel
- Inspired by Linear, Stripe Dashboard, Mercury Banking, Ramp, Arc Browser, Vercel
- NOT a generic admin dashboard
- NOT a marketing landing page
- NOT a low-density dashboard
- NOT bootstrap-looking
- NOT toy-looking widgets

Core visual style:
- Dark graphite background
- Subtle layered panels
- Thin borders
- Soft gradients only where needed
- Compact spacing
- High information density
- Monospace financial numbers
- Right-aligned amounts
- Sticky table headers
- Premium card design
- Strong typography hierarchy
- Small but readable labels
- Status indicators that feel financial/operational
- Subtle motion using Framer Motion

Architecture:
Create a React SPA with authenticated application shell.

Required app structure:
- Login page
- Tenant selection flow
- Authenticated app shell
- Compact premium sidebar
- Sticky topbar
- Main content area
- Right-side realtime notification drawer
- Dark mode first, with light mode support
- Responsive tablet layout
- Zustand store for UI/session/tenant state
- TanStack Query setup for data fetching
- Mock PocketBase API layer
- Mock realtime websocket subscription layer

Backend assumptions:
- PocketBase is the backend
- Realtime subscriptions will come from PocketBase websocket events
- Use mock data for now, but structure services as if real PocketBase collections exist

Create these folders:

src/
  app/
    App.tsx
    router.tsx
    providers.tsx
  components/
    shell/
      AppShell.tsx
      Sidebar.tsx
      Topbar.tsx
      TenantSwitcher.tsx
      CommandMenu.tsx
      NotificationCenter.tsx
    ui/
      StatCard.tsx
      PremiumCard.tsx
      StatusBadge.tsx
      AmountText.tsx
      LiveIndicator.tsx
      EmptyState.tsx
      PageHeader.tsx
      SectionHeader.tsx
      AuditTimeline.tsx
      ApprovalStatus.tsx
    tables/
      DataTable.tsx
      FinancialTable.tsx
      JournalEntryTable.tsx
      APInvoiceTable.tsx
      ARInvoiceTable.tsx
      TrialBalanceTable.tsx
  features/
    auth/
      LoginPage.tsx
      TenantSelectionPage.tsx
      auth.store.ts
    dashboard/
      DashboardPage.tsx
      components/
        RevenueCard.tsx
        CashPositionCard.tsx
        PendingApprovalsCard.tsx
        RealtimeActivityFeed.tsx
        HotelPerformanceGrid.tsx
        CloseProgressCard.tsx
    general-ledger/
      JournalEntryListPage.tsx
      JournalEntryDetailPage.tsx
    accounts-payable/
      APInvoiceListPage.tsx
      APInvoiceDetailPage.tsx
      VendorManagementPage.tsx
    accounts-receivable/
      ARInvoiceListPage.tsx
      CustomerManagementPage.tsx
    income-audit/
      IncomeAuditPage.tsx
    reports/
      TrialBalanceReportPage.tsx
    approvals/
      ApprovalQueuePage.tsx
    audit-logs/
      AuditLogsPage.tsx
    settings/
      UserSettingsPage.tsx
      SettingsPage.tsx
    users/
      UserManagementPage.tsx
  lib/
    pocketbase.ts
    queryClient.ts
    realtime.ts
    formatters.ts
    mockData.ts
  stores/
    app.store.ts
    tenant.store.ts
    notification.store.ts
  styles/
    theme.ts
    globals.css
  main.tsx

Pages to generate:

1. Login
- Premium dark login screen
- Compact centered card
- Product name: Carmen Cloud Finance
- Subtitle: Hotel Accounting Operations
- Email/password fields
- Tenant-aware login hint
- Subtle gradient background
- No marketing sections

2. Tenant Selection
- Show available hotel groups / properties
- Compact cards
- Tenant metadata:
  - hotel group name
  - region
  - active properties
  - fiscal period
  - close status
- Search/filter tenant
- Continue button
- Recent tenant shortcut

3. Dashboard
Create a dense realtime operational finance dashboard:
- Cash position
- Daily revenue
- Outstanding AP
- Outstanding AR
- Month-end close progress
- Pending approvals
- Exceptions
- Realtime hotel activity feed
- Property performance grid
- Income audit anomalies
- Recent journal entries
- Live websocket indicator
- Last sync timestamp
Use premium cards, compact charts, status pills, and financial formatting.

4. Journal Entry List
- Mantine React Table
- Columns:
  - JE Number
  - Date
  - Property
  - Source
  - Description
  - Debit
  - Credit
  - Difference
  - Status
  - Posted By
  - Updated At
- Compact rows
- Sticky header
- Right-aligned amounts
- Monospace financial numbers
- Filters:
  - date range
  - property
  - status
  - source
- Keyboard shortcut hint: N = New Entry
- Summary row for total debit/credit

5. Journal Entry Detail
- Header with JE number, status, posted date
- Two-column layout:
  - left: journal lines table
  - right: audit timeline / approval panel
- Journal lines columns:
  - Account Code
  - Account Name
  - Department
  - Debit
  - Credit
  - Memo
- Show balanced / out-of-balance indicator
- Action buttons:
  - Post
  - Reverse
  - Duplicate
  - Export
- Activity timeline

6. AP Invoice List
- Compact invoice table
- Columns:
  - Invoice No
  - Vendor
  - Property
  - Invoice Date
  - Due Date
  - Amount
  - Balance
  - Status
  - Approval
  - Aging
- Filters:
  - vendor
  - due date
  - status
  - property
- Cards:
  - Due Today
  - Overdue
  - Pending Approval
  - Payment Run Total

7. AP Invoice Detail
- Invoice header summary
- Vendor card
- Amount breakdown
- Approval workflow
- GL distribution table
- Attachment preview placeholder
- Payment history
- Audit trail
- Realtime approval status update indicator

8. Vendor Management
- Vendor list table
- Columns:
  - Vendor Code
  - Vendor Name
  - Category
  - Tax ID
  - Balance
  - Payment Terms
  - Status
  - Last Activity
- Vendor risk/status badges
- Compact search
- Side drawer detail preview

9. AR Invoice List
- Customer invoice table
- Columns:
  - Invoice No
  - Customer
  - Property
  - Invoice Date
  - Due Date
  - Amount
  - Paid
  - Balance
  - Status
  - Aging
- Cards:
  - Total Receivable
  - Overdue AR
  - Collected Today
  - Credit Notes

10. Customer Management
- Customer table
- Columns:
  - Customer Code
  - Customer Name
  - Segment
  - Credit Limit
  - Outstanding
  - Aging Bucket
  - Status
  - Last Invoice
- Detail drawer
- Customer financial summary

11. Trial Balance Report
- Dense report layout
- Filters:
  - property
  - fiscal year
  - period
  - account range
  - department
- Trial balance table columns:
  - Account Code
  - Account Name
  - Opening Debit
  - Opening Credit
  - Period Debit
  - Period Credit
  - Closing Debit
  - Closing Credit
- Sticky header
- Summary footer
- Export buttons:
  - Excel
  - PDF
  - CSV
- Variance indicator

12. Approval Queue
- Queue layout for approvals
- Group by:
  - AP Invoice
  - Journal Entry
  - Payment Run
  - Adjustment
- Show priority, requester, amount, SLA, status
- Quick approve/reject actions
- Side preview panel
- Keyboard-friendly actions

13. Realtime Notifications
- Notification center/drawer
- Types:
  - invoice approved
  - journal posted
  - sync completed
  - anomaly detected
  - user mentioned
  - report exported
- Lightweight toast notifications
- Read/unread state
- Realtime live indicator
- Notification grouping by time

14. Audit Logs
- Dense audit table
- Columns:
  - Timestamp
  - User
  - Action
  - Module
  - Entity
  - Property
  - IP Address
  - Status
- Filters:
  - user
  - module
  - action
  - date
- Timeline style detail drawer

15. User Settings
- Profile settings
- Theme settings
- Notification preferences
- Keyboard shortcut list
- Default tenant
- Default fiscal period
- Security section
- Session list placeholder

16. User Management
- User table
- Columns:
  - Name
  - Email
  - Role
  - Tenant Access
  - Properties
  - MFA
  - Last Login
  - Status
- Role badges
- Permission matrix preview
- Invite user button

Global UI requirements:

App Shell:
- Sidebar width around 248px desktop
- Collapsed sidebar around 72px
- Topbar height around 56px
- Sticky topbar
- Sidebar groups:
  - Overview
  - Accounting
  - Operations
  - Administration
- Include tenant switcher in sidebar or topbar
- Include command menu trigger
- Include realtime status indicator
- Include user profile menu

Sidebar style:
- Compact
- Premium
- Dark
- Thin borders
- Active route with subtle highlight
- Icons
- No oversized menu items
- No generic admin look

Topbar:
- Breadcrumb
- Search / command menu trigger
- Fiscal period selector
- Property selector
- Live sync indicator
- Notifications button
- User avatar

Tables:
- Use Mantine React Table
- Compact density by default
- Sticky headers
- Row hover state
- Row click opens detail page or drawer
- Amount columns right-aligned
- Amounts use tabular/monospace font
- Negative amounts visually distinct but subtle
- Summary rows
- Status badges
- Column filters
- Global search
- Pagination
- Table toolbar with export/action buttons

Dark mode:
- Dark mode is default
- Use Mantine color scheme
- Create premium custom theme
- Avoid pure black
- Use graphite/slate backgrounds
- Use subtle border colors
- Use restrained accent colors

Motion:
- Use Framer Motion subtly
- Page transitions should be minimal
- Cards can fade/slide slightly
- Notifications can slide from right
- Avoid flashy animation

Responsive:
- Desktop-first dense UI
- Tablet responsive
- Sidebar collapses on tablet
- Tables remain horizontally scrollable
- Cards become 2-column on tablet
- Avoid mobile marketing layout

Mock data:
Create realistic hotel finance mock data:
- Properties:
  - CARMEN Bangkok Riverside
  - CARMEN Phuket Resort
  - CARMEN Chiang Mai Boutique
  - CARMEN Pattaya Beach
- Tenants:
  - Carmen Hospitality Group
  - Northstar Hotel Collection
  - Urban Stay Thailand
- Vendors:
  - Siam Fresh Produce
  - Andaman Seafood Supply
  - Bangkok Linen Services
  - Thai Beverage Distribution
  - Premier Maintenance Co.
- Customers:
  - Agoda
  - Booking.com
  - Expedia
  - Corporate Account - Siam Motors
  - Walk-in Guest Ledger
- Account examples:
  - 10000 Cash on Hand
  - 10100 Bank Account
  - 11000 Accounts Receivable
  - 20000 Accounts Payable
  - 30000 Owner Equity
  - 40000 Room Revenue
  - 41000 F&B Revenue
  - 50000 Cost of Sales
  - 60000 Payroll Expense
  - 70000 Operating Expense

Realtime simulation:
- Create mock realtime events every few seconds
- Update dashboard metrics subtly
- Push notification to notification store
- Show live activity feed
- Show connection status:
  - Live
  - Reconnecting
  - Offline
- Use Zustand store for notifications

State management:
- Zustand stores:
  - auth session
  - selected tenant
  - selected property
  - UI state
  - notifications
  - realtime connection status

Data fetching:
- Setup TanStack Query
- Create mock service functions that simulate PocketBase collections
- Use query keys by tenant/property/fiscal period
- Keep code ready to replace mock services with real PocketBase SDK

Formatting:
- Currency: THB and USD support
- Date format suitable for finance teams
- Amount formatting with thousands separator
- Use negative amount formatting
- Use fiscal period labels

Important design quality bar:
The UI must look like a real production fintech SaaS product.
It must not look like a school project, generic dashboard template, or bootstrap admin panel.
Every page should be dense, structured, and operational.
Prefer compact professional layouts over empty whitespace.

Generate all required code files.
Make the app runnable with:
npm install
npm run dev

Also include:
- package.json
- vite config
- tsconfig
- Mantine setup
- React Router setup
- global CSS
- mock data
- README with run instructions

Backend requirements:

Use PocketBase as the backend.

Generate:
- PocketBase integration layer
- PocketBase SDK setup
- Auth provider
- Realtime subscriptions
- Collection schemas
- Example migration files
- API abstraction layer
- Tenant-aware queries
- Role-based access control structure

Create backend folder structure:

backend/
  pocketbase/
    pb_data/
    pb_migrations/
    pb_hooks/
    seed/
      seed.ts
    collections/
      tenants.json
      users.json
      properties.json
      journal_entries.json
      journal_lines.json
      ap_invoices.json
      ar_invoices.json
      vendors.json
      customers.json
      notifications.json
      audit_logs.json

Generate PocketBase collections:
- tenants
- users
- roles
- properties
- fiscal_periods
- journal_entries
- journal_lines
- ap_invoices
- ap_invoice_lines
- ar_invoices
- vendors
- customers
- notifications
- audit_logs
- approval_queue

Requirements:
- multi-tenant aware
- role-based permissions
- realtime subscriptions
- soft delete support
- created_by / updated_by tracking
- audit logging

Generate:
- PocketBase auth integration
- login flow
- session persistence
- websocket realtime listeners
- tenant-scoped query helpers

Frontend integration:
Create:
src/lib/pocketbase.ts

with:
- PocketBase client
- auth helpers
- realtime subscription helpers
- tenant context helpers

Generate realistic example code:

const pb = new PocketBase(import.meta.env.VITE_PB_URL)

export async function login(email, password) {
  return await pb.collection('users').authWithPassword(email, password)
}

export function subscribeToNotifications(callback) {
  return pb.collection('notifications').subscribe('*', callback)
}