# System Architecture

This is a single-page application for hotel finance operations.

## Runtime
- React + Vite + TypeScript
- Mantine UI for the component system
- TanStack Query for server state
- Zustand for app and session state
- Framer Motion for subtle transitions

## Backend
- PocketBase is the source of truth for data and auth
- realtime updates come from PocketBase websocket subscriptions
- the app is deployed as static assets behind IIS on Windows Server

## Multi-Tenant Rules
- every business query is scoped by tenant
- tenant selection is explicit
- property-scoped views inherit the active tenant
- audit logs are required for state-changing operations

## UI Shape
- auth screen
- tenant selection screen
- protected shell
- dense finance dashboard
- table-heavy accounting modules

## Operational Goals
- fast navigation
- high information density
- realtime confidence
- professional accounting workflows

