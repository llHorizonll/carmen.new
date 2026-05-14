# API Spec

This project uses PocketBase as the backend API and realtime source.

## Core Contract
- every request is tenant scoped
- the frontend reads and writes through PocketBase collections
- collection names match the domain model in `docs/data/database-schema.md`

## Expected Resources
- tenants
- properties
- users
- roles
- journal entries
- journal lines
- AP invoices
- AR invoices
- vendors
- customers
- notifications
- audit logs
- approval queue

## Client Behavior
- use TanStack Query for cached reads
- invalidate by tenant and property
- subscribe to collection changes for live updates

## Security Rules
- never trust client-selected tenant alone
- verify permission before mutation
- write audit logs for all business actions

