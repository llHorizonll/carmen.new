# Carmen Cloud Finance

Premium fintech-style hotel accounting SaaS UI for hospitality finance teams.

## Stack

- React
- Vite
- TypeScript
- Mantine UI
- Mantine React Table
- TanStack Query
- Zustand
- Framer Motion

## Run

```bash
npm install
npm run dev
```

## Notes

- Dark mode is the default.
- Authentication, tenant selection, realtime notifications, and data tables are mock-backed for now.
- Set `VITE_PB_URL` to point the app at a PocketBase instance. Without it, the app uses mock fallbacks.
- `npm run lint` and `npm run build` should stay green before shipping UI changes.
- The UI is organized as an authenticated application shell, not a marketing page.
