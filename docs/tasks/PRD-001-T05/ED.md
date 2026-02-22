# PRD-001-T05: Engineering Design — Admin Dashboard Shell

**Task:** PRD-001-T05
**ARCHITECT:** —
**Date:** 2026-02-21
**Scope:** Frontend only
**Depends on:** T02 (auth store + protected routes) + T04 (login page — can navigate here)

---

## 1. Files to Create

```
src/
├── components/layout/admin/
│   ├── AdminLayout.tsx            ← Shell: sidebar + header + <Outlet />
│   ├── AdminSidebar.tsx           ← Nav links, active state, logo
│   └── AdminHeader.tsx            ← User name + logout button
│
└── pages/admin/
    ├── AdminDashboardPage.tsx     ← Welcome message (replaces placeholder)
    ├── AdminCoursesPage.tsx       ← Empty state (PRD-002 fills this)
    ├── AdminQuestionsPage.tsx     ← Empty state (PRD-003 fills this)
    ├── AdminQuizzesPage.tsx       ← Empty state (PRD-003 fills this)
    └── AdminBatchesPage.tsx       ← Empty state (PRD-004 fills this)
```

No new service or hook needed — reads auth state from Zustand store.

---

## 2. AdminLayout (`src/components/layout/admin/AdminLayout.tsx`)

```tsx
// Uses React Router <Outlet /> — all /admin/* routes render inside this shell
// ProtectedRoute (T02) wraps this, so no duplicate auth check here

export function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar — fixed left */}
      <AdminSidebar />

      {/* Right side: Header + scrollable content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
          <Outlet />    {/* Page content renders here */}
        </main>
      </div>
    </div>
  );
}
```

Layout characteristics:
- `h-screen overflow-hidden` on root — no page-level scroll, only main scrolls
- Sidebar: fixed width 240px, does not scroll with content
- Header: 56px height, sticks to top of content area
- Main: takes remaining height, scrollable vertically

---

## 3. AdminSidebar (`src/components/layout/admin/AdminSidebar.tsx`)

### Nav Items Config
```typescript
const NAV_ITEMS = [
  { label: 'Dashboard',    href: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
  { label: 'Courses',      href: ROUTES.ADMIN.COURSES,   icon: BookOpen        },
  { label: 'Question Bank',href: ROUTES.ADMIN.QUESTIONS, icon: HelpCircle      },
  { label: 'Quizzes',      href: ROUTES.ADMIN.QUIZZES,   icon: ClipboardList   },
  { label: 'Batches',      href: ROUTES.ADMIN.BATCHES,   icon: Users           },
] as const;
```

### Active State
Use `useLocation()` from react-router-dom + `NavLink` component:
```tsx
<NavLink
  to={item.href}
  className={({ isActive }) =>
    cn(
      'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
    )
  }
>
  <item.icon size={18} />
  {item.label}
</NavLink>
```

### Sidebar Structure
```tsx
<aside className="w-60 border-r bg-card flex flex-col shrink-0">
  {/* Logo / App name */}
  <div className="h-14 flex items-center px-4 border-b">
    <span className="font-semibold text-lg">LMS Admin</span>
  </div>

  {/* Nav links */}
  <nav className="flex-1 px-3 py-4 space-y-1">
    {NAV_ITEMS.map((item) => (
      <NavLink key={item.href} ... />
    ))}
  </nav>

  {/* Bottom area — reserved for future (settings, profile) */}
  <div className="p-3 border-t text-xs text-muted-foreground">
    Phase 1
  </div>
</aside>
```

---

## 4. AdminHeader (`src/components/layout/admin/AdminHeader.tsx`)

```tsx
export function AdminHeader() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();                              // Clears Zustand store + localStorage
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-6 shrink-0">
      {/* Left: Page breadcrumb placeholder */}
      <div />

      {/* Right: User info + logout */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {user?.name}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut size={14} className="mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
```

State: reads from Zustand store (`useAuthStore`) — no server calls needed.

---

## 5. Placeholder Pages

All placeholder pages follow the same minimal pattern:

```tsx
// Example: AdminCoursesPage.tsx
export function AdminCoursesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
        <p className="text-sm text-muted-foreground">
          Manage your training courses
        </p>
      </div>
      <EmptyState
        title="No courses yet"
        description="Courses will appear here once created."
      />
    </div>
  );
}
```

### `EmptyState` Component
This is a simple reusable component — create it in `src/components/common/EmptyState.tsx`:
```tsx
interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}
```

**Add to COMPONENT_LIBRARY.md** — used by multiple pages, will be used across all admin list pages in PRD-002+.

### Dashboard page (slightly different)
```tsx
export function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        Welcome back, {user?.name}
      </h1>
      <p className="text-muted-foreground">
        Use the sidebar to manage courses, questions, quizzes, and batches.
      </p>
    </div>
  );
}
```

---

## 6. Route Registration (update `src/app/router.tsx` from T02)

T02 already scaffolds the route tree. T05 just fills in the real layout component:

```tsx
// Replace placeholder AdminLayout reference with real import
import { AdminLayout } from '@/components/layout/admin/AdminLayout';

// Route tree (already defined in T02, AdminLayout now real):
<Route element={<ProtectedRoute allowedRole="ADMIN" />}>
  <Route element={<AdminLayout />}>
    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
    <Route path="/admin/courses"   element={<AdminCoursesPage />} />
    <Route path="/admin/questions" element={<AdminQuestionsPage />} />
    <Route path="/admin/quizzes"   element={<AdminQuizzesPage />} />
    <Route path="/admin/batches"   element={<AdminBatchesPage />} />
    <Route index element={<Navigate to="/admin/dashboard" replace />} />
  </Route>
</Route>
```

---

## 7. Icons to Use (lucide-react)

```
LayoutDashboard  → Dashboard
BookOpen         → Courses
HelpCircle       → Question Bank
ClipboardList    → Quizzes
Users            → Batches
LogOut           → Logout button
```

---

## 8. Responsiveness

Admin UI is **desktop-first**. Per PRD: "Faculty UI = desktop-only. Admin UI = basic."

- Sidebar: always visible on desktop (≥ 1024px). On mobile (<1024px): hidden by default, toggled via hamburger in header.
- Hamburger toggle: `useState(false)` for sidebar open/closed. Keep it simple.
- This mobile behavior is a **stretch goal** — prioritize desktop. If time-constrained, skip mobile sidebar toggle for now (note in REVIEW.md as known limitation).

---

## 9. Component Library Update

After T05, WORKER must update `frontend/guidelines/components/COMPONENT_LIBRARY.md`:

| Component | Type | Add to library? |
|-----------|------|-----------------|
| `AdminLayout` | Feature-specific layout | Yes — documents the shell pattern |
| `AdminSidebar` | Feature-specific | No — too admin-specific |
| `AdminHeader` | Feature-specific | No — too admin-specific |
| `EmptyState` | Truly reusable (used in 5+ pages) | **YES** — add to common |

---

## 10. What WORKER Must Deliver

| File | Description |
|------|-------------|
| `src/components/layout/admin/AdminLayout.tsx` | Shell with Outlet |
| `src/components/layout/admin/AdminSidebar.tsx` | Nav with active state |
| `src/components/layout/admin/AdminHeader.tsx` | User + logout |
| `src/components/common/EmptyState.tsx` | Reusable empty state |
| `src/pages/admin/AdminDashboardPage.tsx` | Welcome page |
| `src/pages/admin/AdminCoursesPage.tsx` | Empty state |
| `src/pages/admin/AdminQuestionsPage.tsx` | Empty state |
| `src/pages/admin/AdminQuizzesPage.tsx` | Empty state |
| `src/pages/admin/AdminBatchesPage.tsx` | Empty state |
| Update `COMPONENT_LIBRARY.md` | Add `EmptyState` |

**Manual test checklist:**
- [ ] Login → redirected to `/admin/dashboard` with shell visible
- [ ] Sidebar shows all 5 nav items with correct icons
- [ ] Active nav item is highlighted (Dashboard highlighted on `/admin/dashboard`)
- [ ] Header shows logged-in user's name
- [ ] Logout button → clears auth → redirected to `/login`
- [ ] Navigating to each page shows correct title + empty state
- [ ] Direct URL to `/admin/courses` without login → `/login`
- [ ] Page does not scroll behind the header (correct overflow setup)
