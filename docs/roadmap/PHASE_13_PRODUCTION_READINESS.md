# Phase 13: Production Readiness

## Goal
Close the gap between the mock-first build and a production-ready internal SaaS experience.

## Acceptance Criteria

| Criterion | Evidence |
| --- | --- |
| Shell and dashboard spacing feel polished | Shared spacing, typography, and control sizing are refined across `frontend/src/styles/globals.css` and shell components. |
| Sidebar and topbar controls feel intentional | Tenant switching, selectors, user menu spacing, and header rhythm read as a premium fintech UI rather than a generic admin shell. |
| PocketBase admin can run locally | `backend/pocketbase/pocketbase.exe serve --http=127.0.0.1:8090 --dir="backend/pocketbase/pb_data"` starts successfully without migration failures. |
| Local PocketBase migrations are valid | Files in `backend/pocketbase/pb_migrations/` use PocketBase-compatible migration syntax. |
| Real PocketBase activation path is documented | README and roadmap notes explain how to run PocketBase locally and connect the frontend with `VITE_PB_URL`. |
| Mock-to-live transition can proceed module-by-module | Existing PocketBase abstraction in `frontend/src/lib/pocketbase.ts` remains usable while individual pages switch from mock reads to live collections. |

## Deliverables
- shell and spacing polish pass
- tenant switcher and header refinement
- PocketBase local runtime validation
- migration cleanup
- documentation updates for local PocketBase usage
- readiness checklist for replacing mock data with live collections

## Done When
- the main app shell feels visually resolved
- key layout rough edges are removed
- PocketBase can be launched locally without manual debugging
- the next implementation work can target live collection reads with low setup friction

## Status
- Complete

## Verification
- `npm run build`
- PocketBase serves at `http://127.0.0.1:8090/_/`

## Completion Evidence
- Build and lint pass from repo root (`npm run build`, `npm run lint`).
- PocketBase local serve endpoint verified returning HTTP 200 at `http://127.0.0.1:8090/_/`.
- Migration file updated from placeholder to required-collection validation (`backend/pocketbase/pb_migrations/0001_init.js`).
- Seed flow updated from generic placeholder to tenant-scoped finance fixture upsert logic (`backend/pocketbase/seed/seed.ts`).
- Shell and topbar/sidebar spacing refinements and premium styling are already active in `frontend/src/styles/globals.css` and shell components.

## Notes
- This phase is intentionally focused on readiness and integration quality, not on introducing major new feature areas.
- Work under this phase can include targeted UI polish and backend activation tasks as long as they directly support production readiness.
