# Carmen Cloud Finance

Premium fintech-style hotel accounting SaaS for hospitality finance teams.

## Repo Layout

- `frontend/` - React + Vite + TypeScript app
- `backend/pocketbase/` - PocketBase collection schemas, seed, and migration scaffolding
- `docs/` - roadmap, architecture, and design documentation

## Run Locally

From PowerShell on this PC:

```powershell
cd C:\source\carmen.new\frontend
npm install
npm run dev
```

Optional PocketBase mode:

```powershell
$env:VITE_PB_URL="http://127.0.0.1:8090"
npm run dev
```

## Verify

```powershell
npm run build
npm run lint
```

## Notes

- The app runs with mock data by default if PocketBase is not configured.
- Roadmap phases 01 through 12 are marked complete in `docs/roadmap/`.
- The UI is organized as an authenticated shell, not a marketing site.
