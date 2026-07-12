# TransitOps — Frontend (React + Vite + Ant Design)

SPA for the TransitOps platform: login/signup, dashboard with KPIs + charts, vehicle & driver
CRUD, trip lifecycle (create/dispatch/complete/cancel), maintenance workflow, fuel & expense
logging, and a reports page with CSV export.

## Stack
React 18 (Vite), Ant Design 5, Tailwind CSS, Axios, Recharts, React Router.

## Setup

```
npm install
cp .env.example .env      # point VITE_API_BASE_URL at your backend
npm run dev                # http://localhost:5173
```

Make sure the Spring Boot backend is running on `http://localhost:8080` (or update
`VITE_API_BASE_URL` / `vite.config.js` proxy target).

## Build for production
```
npm run build
npm run preview
```

## Structure
```
src/
  api/axiosClient.js       -> axios instance, attaches JWT, redirects to /login on 401
  context/AuthContext.jsx  -> login/signup/logout, persisted in localStorage
  components/Layout.jsx    -> sidebar nav + header (role badge, logout)
  components/PrivateRoute.jsx
  pages/
    Login.jsx / Signup.jsx
    Dashboard.jsx           -> KPI cards + pie/bar charts (Recharts)
    Vehicles.jsx            -> CRUD table, status-managed fields disabled appropriately
    Drivers.jsx             -> CRUD table, expired-license highlighting
    Trips.jsx               -> core lifecycle: create (DRAFT) -> Dispatch -> Complete/Cancel
    Maintenance.jsx         -> open/close records, auto vehicle status flip
    FuelExpenses.jsx        -> tabbed fuel logs + expenses
    Reports.jsx             -> operational cost table + CSV export button
```

## Notes
- `npm install` and `npm run build` were both run successfully in the environment this was
  generated in (Vite build completed with zero errors) — the app is ready to run against a live
  backend.
- Ant Design components (Table, Form, Modal, Tag, Tabs) are used throughout for a
  production-looking UI with zero custom CSS, per the build plan's stack rationale.
