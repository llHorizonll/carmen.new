# Tasks: Phase 14 PocketBase Live Data Migration

## Objective
Break the live-data migration into concrete, testable work so each module can move from mock-first behavior to real PocketBase persistence without destabilizing the app shell.

## Task List

### Task 14.1: Validate PocketBase collection readiness
- Review every file in `backend/pocketbase/collections/`
- Compare collection fields against frontend usage in `frontend/src/lib/mockData.ts`
- Confirm required tenant fields exist
- Confirm list/view/create/update/delete rules match the intended user roles
- Identify missing relations, status fields, timestamps, or numeric totals

### Task 14.2: Prepare real sample data
- Seed at least one complete tenant with properties
- Seed vendors and customers
- Seed journal entries and journal lines
- Seed AP and AR invoices
- Seed notifications and audit logs as needed for shell behavior
- Verify the data appears correctly in PocketBase admin

### Task 14.3: Expand frontend PocketBase abstraction for live mutations
- Add `create`, `update`, and `delete` helpers for vendors
- Add `saveDraft`, `post`, and delete helpers for journal entries
- Add create/update/delete helpers for AP invoices
- Add create/update/delete helpers for AR invoices
- Keep tenant-aware query helpers intact

### Task 14.4: Add finance validation helpers
- Add journal balance calculation helper
- Add guard for posting unbalanced journals
- Add shared required-field checks for vendor and invoice forms
- Ensure mutation paths surface useful errors to the UI

### Task 14.5: Migrate vendor management to real PocketBase
- Add vendor create UI
- Add vendor edit UI
- Add vendor delete action
- Invalidate and refresh vendor queries after mutations
- Verify vendor data reads and writes through PocketBase

### Task 14.6: Migrate customer management to real PocketBase
- Add customer create/edit/delete flows if missing
- Ensure the detail drawer reflects live records
- Verify tenant-scoped customer behavior

### Task 14.7: Migrate journal entry workflows to live data
- Add new journal entry route and editor
- Add save draft behavior
- Add balance validation in the UI and service layer
- Add post action with blocking on imbalance
- Add delete or reverse handling aligned with workflow rules

### Task 14.8: Migrate AP invoice workflows to live data
- Add create/edit routes or drawers
- Add save draft and submit-for-approval actions
- Add delete or void behavior where allowed
- Refresh lists and detail views after mutation

### Task 14.9: Migrate AR invoice workflows to live data
- Add create/edit routes or drawers
- Add save/update/delete behavior
- Add payment-tracking actions where applicable
- Refresh lists and detail views after mutation

### Task 14.10: Reduce mock fallback reliance
- Identify which modules still fall back to mock data
- Keep fallback only for unfinished modules
- Document which routes are fully live-data backed

### Task 14.11: Update docs and run final verification
- Update `README.md` with live-data instructions
- Update `docs/roadmap/PHASE_14_POCKETBASE_LIVE_DATA.md` with actual evidence as tasks complete
- Run `npm run build`
- Verify the main live-data routes with `VITE_PB_URL`

## Recommended Execution Order
1. Task 14.1
2. Task 14.2
3. Task 14.3
4. Task 14.4
5. Task 14.5
6. Task 14.7
7. Task 14.8
8. Task 14.9
9. Task 14.6
10. Task 14.10
11. Task 14.11

## First Module Recommendation
- Start with `vendors`

Why:
- simplest finance domain to make mutable
- lower validation complexity than journals
- good proof that live PocketBase reads and writes are working

## Second Module Recommendation
- Move to `journal_entries`

Why:
- highest-value finance workflow after vendors
- introduces draft/save/post logic and balance validation
- validates the app’s ability to handle real accounting rules
