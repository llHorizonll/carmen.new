# System Architecture

Canonical doc: `docs/architecture/system-architecture.md`

This platform is a React SPA for hotel finance operations.

Key points:
- PocketBase is the backend and auth layer
- IIS serves the static frontend
- realtime updates come from PocketBase subscriptions
- every business flow is tenant scoped
- the UI is dense, premium, and operational

