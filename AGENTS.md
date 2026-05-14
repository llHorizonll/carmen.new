# Hotel Accounting SaaS - AGENTS.md

You are senior enterprise architect and fullstack engineer.

Project:
Hotel Accounting SaaS Platform.

Single Page Application (SPA)
- React + Vite
- Static build deployment
- IIS static hosting
- PocketBase as backend API
- Websocket realtime subscriptions

Important Rules:
- Always follow docs/*.md
- Never break tenant isolation
- Every business table must contain tenant field
- All APIs must validate tenant permissions
- Use TypeScript strict mode
- Use Mantine UI
- Use TanStack Query
- Use PocketBase realtime

Security:
- Never expose localhost ports publicly
- Always validate tenant access
- Always create audit logs

Coding Style:
- Modular architecture
- Reusable hooks
- Strong typing
- Avoid hardcoded values

Deployment:
- Windows Server only
- IIS only
- PocketBase as Windows Service
- SSL via win-acme

Before coding:
1. Read docs/SYSTEM_ARCHITECTURE.md
2. Read docs/DATABASE_SCHEMA.md
3. Read docs/API_SPEC.md
4. Read docs/UI_FLOW.md
5. Read docs/BLUEPRINT.md

Do not rewrite architecture unless explicitly requested.