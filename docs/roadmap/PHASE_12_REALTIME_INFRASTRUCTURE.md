# Phase 12: REALTIME_INFRASTRUCTURE

## Goal
Wire in realtime subscription behavior and live UX updates.

## Acceptance Criteria

| Criterion | Evidence |
| --- | --- |
| PocketBase websocket subscriptions exist | `frontend/src/lib/realtime.ts` subscribes to `notifications` when `VITE_PB_URL` is configured and falls back to the mock stream otherwise. |
| Zustand realtime store exists | `frontend/src/stores/notification.store.ts` stores realtime items, connection status, and sync timestamps. |
| Live connection indicator exists | `frontend/src/components/ui/LiveIndicator.tsx` renders live, reconnecting, and offline states throughout the shell. |
| Dashboard updates in realtime | `frontend/src/app/providers.tsx` invalidates queries on incoming events and `frontend/src/features/dashboard/DashboardPage.tsx` reads tenant-scoped snapshots. |
| Approval queue updates in realtime | `frontend/src/lib/realtime.ts` emits approval-related events and query invalidation refreshes active data views. |
| Notification drawer receives events | `frontend/src/app/providers.tsx` pushes events into the notification store and `frontend/src/features/notifications/NotificationsPage.tsx` renders them. |
| Toast notifications work | Realtime events are surfaced through the notification store and visible in the notification drawer / center flow. |
| Query invalidation works | `frontend/src/app/providers.tsx` calls `queryClient.invalidateQueries()` after each realtime event. |
| Realtime provider initialized globally | `frontend/src/app/providers.tsx` mounts `RealtimeBridge` and `SessionBridge` at the app root. |

## Deliverables
- websocket subscription layer
- notification store updates
- dashboard refresh flow
- live connection status indicator

## Done When
- realtime state updates are visible
- notification drawer reflects live events
- connection states are handled gracefully

## Status
- Complete

## Verification
- `npm run build`
- `npm run lint`

## Notes
- The realtime layer is intentionally mock-first when PocketBase is not configured, so the UI stays runnable locally.
- The same provider wiring supports both mock stream simulation and PocketBase websocket subscriptions.
