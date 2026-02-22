# PRD-001-T02: Engineering Design — Frontend Scaffold + Auth Context + Protected Routes

**Task:** PRD-001-T02
**ARCHITECT:** —
**Date:** 2026-02-21
**Scope:** Frontend only — no backend work in this task
**Runs in parallel with:** T01

---

## 1. Tech Stack + Installation

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend

# Core
npm install react-router-dom axios
npm install @tanstack/react-query @tanstack/react-query-devtools

# Forms & validation
npm install react-hook-form zod @hookform/resolvers

# UI
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npx shadcn-ui@latest init

# State
npm install zustand

# Utils
npm install clsx tailwind-merge lucide-react
```

Shadcn/UI init answers:
- Style: Default
- Base color: Slate
- CSS variables: Yes
- `cn()` utility: Yes (auto-added to `src/lib/utils.ts`)

---

## 2. Folder Structure

Per `frontend/guidelines/core/01-structure/01a_folder_layout.md`:

```
frontend/src/
│
├── app/
│   ├── App.tsx                    ← Root: QueryClientProvider + AuthProvider + Router
│   ├── router.tsx                 ← Route definitions
│   └── providers.tsx              ← All context providers composed here
│
├── features/
│   └── auth/
│       ├── components/            ← LoginForm.tsx (T04)
│       ├── hooks/                 ← useLogin.ts (T04)
│       ├── services/              ← auth.service.ts (T04)
│       ├── types/
│       │   └── auth.types.ts      ← AuthUser, LoginDto, AuthResponse
│       └── index.ts
│
├── components/
│   ├── ui/                        ← Shadcn components (auto-generated)
│   ├── layout/
│   │   └── admin/                 ← AdminLayout, AdminSidebar, AdminHeader (T05)
│   └── common/
│       └── ProtectedRoute.tsx     ← Route guard
│
├── pages/
│   ├── auth/
│   │   └── LoginPage.tsx          ← Thin wrapper (T04)
│   └── admin/
│       ├── AdminDashboardPage.tsx ← Placeholder (T05)
│       ├── AdminCoursesPage.tsx   ← Placeholder (T05)
│       ├── AdminQuestionsPage.tsx ← Placeholder (T05)
│       ├── AdminQuizzesPage.tsx   ← Placeholder (T05)
│       └── AdminBatchesPage.tsx   ← Placeholder (T05)
│
├── lib/
│   ├── api/
│   │   └── client.ts              ← Axios instance with interceptors
│   ├── utils/
│   │   └── cn.ts                  ← Already created by Shadcn init
│   └── constants/
│       └── routes.ts              ← Route path constants
│
├── stores/
│   └── auth.store.ts              ← Zustand auth store (token, user, actions)
│
├── types/
│   └── api.types.ts               ← ApiResponse<T>, PaginatedResponse<T>
│
└── styles/
    └── globals.css                ← Tailwind directives + Shadcn CSS variables
```

---

## 3. Global API Types (`src/types/api.types.ts`)

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_items: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}
```

---

## 4. Auth Types (`src/features/auth/types/auth.types.ts`)

```typescript
export type UserRole = 'ADMIN' | 'FACULTY' | 'STUDENT';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
```

---

## 5. Zustand Auth Store (`src/stores/auth.store.ts`)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/features/auth/types/auth.types';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  // Actions
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) =>
        set({ token, user, isAuthenticated: true }),

      logout: () =>
        set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'lms-auth',          // localStorage key
      partialize: (state) => ({  // Only persist token + user
        token: state.token,
        user: state.user,
      }),
    }
  )
);
```

**Decision:** Use Zustand `persist` middleware instead of manual `localStorage` — cleaner, handles hydration automatically. `isAuthenticated` derived from token/user presence.

---

## 6. Axios Client (`src/lib/api/client.ts`)

```typescript
import axios from 'axios';
import { useAuthStore } from '@/stores/auth.store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
});

// REQUEST INTERCEPTOR — attach JWT
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE INTERCEPTOR — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';     // Hard redirect
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Note:** Access store state directly via `useAuthStore.getState()` (outside React tree) — correct Zustand pattern for interceptors.

---

## 7. Route Constants (`src/lib/constants/routes.ts`)

```typescript
export const ROUTES = {
  LOGIN: '/login',
  ADMIN: {
    ROOT:      '/admin',
    DASHBOARD: '/admin/dashboard',
    COURSES:   '/admin/courses',
    QUESTIONS: '/admin/questions',
    QUIZZES:   '/admin/quizzes',
    BATCHES:   '/admin/batches',
  },
  FACULTY: {
    DASHBOARD: '/faculty/dashboard',
  },
  STUDENT: {
    DASHBOARD: '/student/dashboard',
  },
} as const;
```

---

## 8. Protected Route (`src/components/common/ProtectedRoute.tsx`)

```typescript
interface ProtectedRouteProps {
  allowedRole: UserRole;
}

// Behavior:
// 1. No token → redirect to /login (replace, not push)
// 2. Wrong role → redirect to role's own home (/admin → /faculty → /student)
// 3. Correct role → render <Outlet />
```

Role-to-home mapping:
```
ADMIN   → /admin/dashboard
FACULTY → /faculty/dashboard
STUDENT → /student/dashboard
```

---

## 9. Router (`src/app/router.tsx`)

```typescript
// Route tree structure
<BrowserRouter>
  <Routes>
    {/* Public */}
    <Route path="/login" element={<LoginPage />} />

    {/* Admin (role-guarded) */}
    <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/courses"   element={<AdminCoursesPage />} />
        <Route path="/admin/questions" element={<AdminQuestionsPage />} />
        <Route path="/admin/quizzes"   element={<AdminQuizzesPage />} />
        <Route path="/admin/batches"   element={<AdminBatchesPage />} />
      </Route>
    </Route>

    {/* Faculty (placeholder for T-PRD-005) */}
    <Route element={<ProtectedRoute allowedRole="FACULTY" />}>
      <Route path="/faculty/dashboard" element={<FacultyDashboardPage />} />
    </Route>

    {/* Student (placeholder for T-PRD-006+) */}
    <Route element={<ProtectedRoute allowedRole="STUDENT" />}>
      <Route path="/student/dashboard" element={<StudentDashboardPage />} />
    </Route>

    {/* Default redirects */}
    <Route path="/"  element={<Navigate to="/login" replace />} />
    <Route path="*"  element={<Navigate to="/login" replace />} />
  </Routes>
</BrowserRouter>
```

---

## 10. App Entry (`src/app/App.tsx`)

```typescript
// Composition order:
QueryClientProvider (TanStack Query)
  └── router (BrowserRouter)
         └── ReactQueryDevtools (dev only)

// TanStack Query config:
defaultOptions: {
  queries: {
    staleTime: 5 * 60 * 1000,   // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  }
}
```

---

## 11. Vite Config (`vite.config.ts`)

```typescript
// Path aliases to configure:
'@' → './src'

// Dev proxy (avoids CORS during local dev):
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    }
  }
}
```

---

## 12. Environment Variables (`.env.example`)

```bash
VITE_API_URL=http://localhost:8080/api/v1
```

---

## 13. What WORKER Must Deliver

| File | Description |
|------|-------------|
| `package.json` | All dependencies installed |
| `vite.config.ts` | Path alias `@` + dev proxy |
| `tailwind.config.ts` | Shadcn content paths configured |
| `src/types/api.types.ts` | Global API types |
| `src/stores/auth.store.ts` | Zustand auth store with persist |
| `src/lib/api/client.ts` | Axios instance with both interceptors |
| `src/lib/constants/routes.ts` | ROUTES constants |
| `src/components/common/ProtectedRoute.tsx` | Role-based route guard |
| `src/app/router.tsx` | Full route tree |
| `src/app/App.tsx` | Root with providers |
| `src/features/auth/types/auth.types.ts` | Auth type definitions |
| `src/pages/admin/*.tsx` | All 5 placeholder admin pages |
| `src/pages/auth/LoginPage.tsx` | Placeholder only (T04 fills this) |
| `.env.example` | Env template |

**Verify:** `npm run dev` starts with zero TS errors. `/admin/dashboard` without auth → `/login`.
