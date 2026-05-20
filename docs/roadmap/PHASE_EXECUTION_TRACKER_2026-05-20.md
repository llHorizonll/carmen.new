# Phase Execution Tracker - 2026-05-20

This tracker is the operational checklist to move from current state to true "everything pass".

## Current Overall State
- Build: PASS (`npm run build` at repo root)
- Lint: PASS (`npm run lint` at repo root)
- PocketBase runtime: PASS (`http://127.0.0.1:8090/_/` reachable)
- Phase status: 01-14 complete

## Phase 13 - Production Readiness

1. [x] Replace placeholder migration in `backend/pocketbase/pb_migrations/0001_init.js`
- Done evidence: migration now validates required collection presence and fails fast if missing.
- Verify: run PocketBase and confirm no migration errors on boot.

2. [x] Replace generic seed with realistic finance fixtures in `backend/pocketbase/seed/seed.ts`
- Done evidence: seed now upserts tenant/property/vendor/customer/journal/AP/AR/notification/audit/approval records aligned to schema.
- Verify: run seed and inspect records in PocketBase admin.

3. [x] Verify live app mode with `VITE_PB_URL`
- Done evidence: app loads key pages while reading from live PB without silent fallback dependency.
- Verify: set env var and check dashboard/vendors/journals/AP/AR routes.

4. [x] Close placeholder-level admin/settings sections
- Done evidence: no placeholder subtitles/messages for required operational pages.
- Verify: route walkthrough screenshots/manual checks.

5. [x] Mark Phase 13 complete in roadmap docs
- Done evidence: `docs/roadmap/PHASE_13_PRODUCTION_READINESS.md` status = Complete and includes verification evidence.

## Phase 14 - PocketBase Live Data Migration

1. [x] Task 14.1 Collection readiness audit
- Done evidence: field/rule mapping documented against frontend usage.

2. [x] Task 14.2 Real sample dataset
- Done evidence: seed includes a complete Carmen tenant scenario with linked records.

3. [x] Task 14.3 Frontend mutation helpers
- Done evidence: vendor/journal/AP/AR create-update-delete/post helpers now exist in `frontend/src/lib/pocketbase.ts`.

4. [x] Task 14.4 Finance validation helpers
- Done evidence: journal balance checks and required field/amount guards added to mutation paths.

5. [x] Task 14.5 Vendor live CRUD migration
- Done evidence: vendor page has create/edit/delete UI actions and query invalidation wiring.

6. [x] Task 14.7 Journal live workflow migration
- Done evidence: draft/save/post/reverse behaviors enforce balance validation.

7. [x] Task 14.8 AP live workflow migration
- Done evidence: create/edit/submit/delete(or void) paths active and reflected in list/detail.

8. [x] Task 14.9 AR live workflow migration
- Done evidence: create/edit/delete/payment updates active and reflected in list/detail.

9. [x] Task 14.10 Reduce mock fallback footprint
- Done evidence: fallback used only in explicitly unfinished routes/modules.

10. [x] Task 14.11 Final verification + docs
- Done evidence: build/lint pass, PB live route checks pass, README + roadmap updated with real instructions and proof.

## Exit Criteria for "Everything Pass"
- [x] Root build/lint pass
- [x] PB runtime pass
- [x] Phase 13 marked complete with evidence
- [x] Phase 14 marked complete with evidence
- [x] Live write workflows verified for vendors, journals, AP, AR
- [x] Mock fallback constrained and documented
