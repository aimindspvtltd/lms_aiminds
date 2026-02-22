# System Architecture

## High-Level Flow

```
Browser
   │
   ▼
React App (Vite + TypeScript)
   │  Axios HTTP requests
   ▼
Express API (Node.js)
   │  Knex.js queries
   ▼
PostgreSQL Database
```

---

## Backend Layers

Every request flows strictly through these layers — no skipping:

```
HTTP Request
     │
     ▼
┌──────────────┐
│  Middleware  │  auth, logging, rate limiting
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Controller  │  parse request, validate input (Zod), call service
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Service    │  business logic, transactions, orchestration
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Repository  │  database queries only (Knex), no logic
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  PostgreSQL  │
└──────────────┘
```

**Rule:** Controller → Service → Repository. Never skip layers.

---

## Frontend Layers

```
Page / Component
       │
       ▼
┌──────────────────┐
│  Custom Hook     │  useQuery / useMutation (TanStack Query)
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Service (fn)    │  typed API call (e.g. userService.getUser)
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Axios Instance  │  base URL, auth header, error interceptor
└──────┬───────────┘
       │
       ▼
    Express API
```

---

## Frontend Folder Structure

```
src/
├── features/               ← Feature-based modules
│   ├── auth/
│   ├── courses/
│   ├── enrollments/
│   └── payments/
├── components/
│   ├── common/             ← Shared reusable components
│   └── ui/                 ← Shadcn primitives
├── lib/
│   ├── api/                ← Axios instance + query client
│   └── utils/              ← cn(), formatDate(), etc.
├── store/                  ← Zustand stores
├── types/                  ← Shared TypeScript types
└── app/                    ← Router, providers, layout
```

---

## Authentication Flow

```
1. POST /api/v1/auth/login
       ↓
2. Server validates credentials
       ↓
3. Server returns JWT (stored in httpOnly cookie)
       ↓
4. Every subsequent request sends cookie automatically
       ↓
5. auth middleware validates JWT → populates req.user
       ↓
6. Controller proceeds (or throws 401)
```

---

## API Conventions

- Base URL: `http://localhost:3000/api/v1`
- Auth: `Authorization: Bearer <token>` header
- Request body: `snake_case` JSON keys
- All responses: `{ success: true, data: ... }` or `{ success: false, error: ... }`
- Pagination: `?page=1&limit=20` query params
