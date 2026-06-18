# TaskFlow — Junior Frontend Take-Home Task

A full-featured task management app demonstrating JWT auth, Zustand state management, Axios interceptors, reusable components, React optimization hooks, Tailwind CSS v4, and responsive design.

## Demo accounts
- `nishan@gmail.com` / `nishan123`
- `shrestha@gmail.com` / `shrestha123`

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 19 + Vite |
| State management | Zustand (devtools + persist middleware) |
| HTTP client | Axios with request/response interceptors |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Auth | JWT (simulated — no backend required) |

---

## Features Demonstrated

### JWT Token Authentication
- `src/utils/jwt.js` — token creation, parsing, and expiry validation
- Token stored in `localStorage`, rehydrated on app load via `initAuth()`
- Axios **request interceptor** auto-attaches `Authorization: Bearer <token>` to every request
- Axios **response interceptor** catches 401 errors and dispatches a global `auth:logout` event

### State Management (Zustand)
- `src/store/authStore.js` — user, token, loading/error state with `persist` middleware
- `src/store/taskStore.js` — tasks, filters, CRUD operations with `devtools` support
- Open Redux DevTools in your browser to inspect both stores

### Axios Interceptors
- `src/api/client.js` — request interceptor adds auth; response interceptor handles 401/403/5xx globally
- Mock API handlers simulate real network latency (400–800ms)

### Reusable Components (`src/components/ui/`)
- `Button` — variants (primary, secondary, danger, ghost), sizes, loading spinner, `forwardRef`
- `Input` — label, validation error, hint text, `forwardRef`, disabled state
- `Select` — option list with label and error
- `Modal` — Escape key to close, scroll lock, ARIA attributes (`role="dialog"`, `aria-modal`)
- `Badge` — status and priority color variants
- `Toast` — lightweight notification system (no external library)

### React Optimization Hooks
- `useMemo` — filtered task list and stats recompute only when `tasks` or `filter` changes
- `useCallback` — stable handler references (`handleStatusChange`, `handleDelete`, `handleFilterChange`) prevent unnecessary child re-renders
- `React.memo` on `TaskCard` — card only re-renders when its own task or handler refs change

### Responsive Design
- Mobile-first Tailwind with `sm:` and `lg:` breakpoints
- Task grid: 1 col (mobile) → 2 col (tablet) → 3 col (desktop)
- Stats row: 2 col (mobile) → 4 col (tablet)

---

## Folder Structure

```
src/
├── api/
│   ├── client.js        # Axios instance + interceptors + mock API
│   └── mockData.js      # Seed users and tasks
├── components/
│   ├── ui/              # Generic primitives (Button, Input, Modal…)
│   ├── tasks/           # Feature components (TaskCard, TaskForm, TaskFilters)
│   └── ProtectedRoute.jsx
├── hooks/
│   ├── useAuth.js       # Auth hook with side effects
│   └── useTasks.js      # Tasks hook with useMemo + useCallback
├── pages/
│   ├── LoginPage.jsx
│   └── DashboardPage.jsx
├── store/
│   ├── authStore.js     # Zustand auth store
│   └── taskStore.js     # Zustand task store
└── utils/
    └── jwt.js           # JWT encode/decode/validate
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 and sign in with a demo account.

---

## Design Decisions

**Zustand over Redux** — Less boilerplate, same DevTools experience via the `devtools` middleware. Better fit for a focused app without Redux's action/reducer ceremony.

**Mock API without a backend** — The task focuses on frontend skills. The mock in `client.js` simulates real latency and error codes (401, 403, 500), keeping interceptors fully testable without any infra.

**`memo` + `useCallback` on TaskCard** — With many tasks in the grid, every store write (create, update) would re-render all cards without memoization. Stable callbacks + `memo` scope re-renders to only the affected card.
