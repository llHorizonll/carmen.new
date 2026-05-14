# Phase 10: REALTIME_INFRASTRUCTURE

## Goal
Wire in realtime subscription behavior and live UX updates.

## Acceptance Criteria

- PocketBase websocket subscriptions exist
- Zustand realtime store exists
- Live connection indicator exists
- Dashboard updates in realtime
- Approval queue updates in realtime
- Notification drawer receives events
- Toast notifications work
- Query invalidation works
- Realtime provider initialized globally

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

## Implementation Notes
- Realtime stream is initialized in `frontend/src/app/providers.tsx`.
- Mock/PocketBase subscription behavior lives in `frontend/src/lib/realtime.ts`.
- Notification state and live sync timestamps are stored in `frontend/src/stores/notification.store.ts`.
- Live connection status is surfaced through `frontend/src/components/ui/LiveIndicator.tsx`.
- Notification drawer UX is handled in `frontend/src/features/notifications/NotificationsPage.tsx`.

## Verification
- `npm run build`
- `npm run lint`
