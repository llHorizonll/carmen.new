# Phase 14: PocketBase Live Data Migration

## Goal
Replace the current mock-first module behavior with real PocketBase-backed data flows in a safe, verifiable, tenant-aware rollout.

## Why This Phase Exists
- The current frontend shell is largely operational and visually presentable, but many modules still rely on mock data or read-only service abstractions.
- Finance workflows such as vendor management, journal entry drafting, invoice maintenance, and approval flows need real PocketBase persistence before the product can behave like a production accounting platform.
- This work must be done module-by-module to avoid breaking routing, tenant scoping, or financial validation behavior.

## Scope
This phase covers:
- PocketBase collection validation and schema alignment
- real collection seed/import readiness
- tenant-aware live reads
- module-by-module live writes
- draft/save/posting workflows where required
- transition rules for removing or reducing mock fallback behavior

This phase does not require:
- a full redesign of the UI shell
- replacing every mock artifact in one release
- rebuilding the app architecture from scratch

## Acceptance Criteria

| Criterion | Evidence |
| --- | --- |
| PocketBase schema matches frontend expectations | Collection fields support the data shapes used by `frontend/src/lib/pocketbase.ts` and the relevant feature modules. |
| Tenant-aware reads work against live data | Modules can query records from PocketBase using tenant-aware filtering with `tenantId` and related context fields. |
| Vendor module runs on live data end-to-end | Vendor list, detail, create, edit, and delete work against PocketBase instead of mock-only flows. |
| Journal entry draft/save/post flow works on live data | Journal entries can be saved as draft, validated for balance, and blocked from posting when unbalanced. |
| AP and AR modules can transition to live writes | Invoice records support create/update/delete and approval-oriented workflow states in the frontend abstraction layer. |
| Mock-to-live rollout is documented | Roadmap files and README explain how the migration is staged and how to run the app against PocketBase. |
| Verification is repeatable | Build passes and the relevant pages can be exercised against a running PocketBase instance. |

## Dependencies
- PocketBase server runs successfully at `http://127.0.0.1:8090/_/`
- `backend/pocketbase/pb_migrations/` contains valid migration syntax
- target collections exist or are imported successfully
- seed or fixture data exists for at least one tenant
- auth and tenant rules are defined clearly enough for finance modules to read and write

## Rollout Strategy

### Stage 1: Backend Readiness
- verify collection definitions
- confirm rules and required fields
- validate migration compatibility
- seed baseline tenant, property, vendor, customer, and journal data

### Stage 2: Shared Frontend Data Layer
- extend `frontend/src/lib/pocketbase.ts` with mutation helpers
- add validation helpers for finance workflows
- normalize query invalidation behavior for live writes

### Stage 3: Module-by-Module Migration
- vendors first
- customers second
- journal entries third
- AP invoices fourth
- AR invoices fifth

### Stage 4: Fallback Reduction
- keep mock fallback only where the live path is not yet implemented
- remove mock-first assumptions as each module reaches live-data completeness

## Deliverables
- validated PocketBase collection readiness
- live-data mutation helpers
- vendor live CRUD
- journal draft/save/posting validation
- AP and AR live-data implementation path
- migration notes and verification checklist

## Done When
- at least the first finance module is fully live-data backed
- journal draft and balance validation run against real persistence
- the migration path for the remaining finance modules is documented and actionable
- the app can be run against PocketBase with confidence and without manual debugging on each page

## Status
- Complete

## Verification
- `npm run build`
- PocketBase serves at `http://127.0.0.1:8090/_/`
- target routes load successfully with `VITE_PB_URL` configured

## Completion Evidence
- Shared frontend PocketBase abstraction now includes live mutation helpers for vendors, journals, AP, and AR (`frontend/src/lib/pocketbase.ts`).
- Finance validation helpers implemented in data layer (required-field checks and journal balance guards before posting).
- Vendor module migrated to live CRUD actions with create/edit/delete UI and query invalidation (`frontend/src/features/accounts-payable/VendorManagementPage.tsx`).
- Journal workflow updated with draft save entry flow and post/reverse actions (`frontend/src/features/general-ledger/JournalEntryListPage.tsx`, `frontend/src/features/general-ledger/JournalEntryDetailPage.tsx`).
- AP and AR modules now have create and update/delete/payment-oriented live write actions in list/detail pages.
- Build and lint pass after migration changes (`npm run build`, `npm run lint`).
- PocketBase local runtime responds successfully at `http://127.0.0.1:8090/_/`.

## Notes
- This phase should be executed incrementally.
- Do not swap every mock module to live data in a single pass.
- The safest first live module is `vendors`, followed by `journal_entries`.
