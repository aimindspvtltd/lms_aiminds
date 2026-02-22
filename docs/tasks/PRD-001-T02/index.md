# PRD-001-T02: Frontend Scaffold + Auth Context + Protected Routes

**PRD:** [docs/prds/PRD-001_foundation_admin_auth.md](../../prds/PRD-001_foundation_admin_auth.md)
**Status:** Pending
**Created:** 2026-02-21

---

## Assignees

| Role      | Name |
|-----------|------|
| ARCHITECT | —    |
| UX        | —    |
| WORKER    | —    |
| REVIEWER  | —    |

---

## What Needs to Be Done

Initialize the React frontend project with the full toolchain wired up: Vite + React 18 +
TypeScript, Tailwind CSS + Shadcn/UI, TanStack Query, and Axios with a JWT interceptor.
Establish the auth context (token storage, user role, login/logout actions) and the protected
route wrapper that enforces role-based access across the three route groups:
`/admin/*`, `/faculty/*`, `/student/*`.

This task runs in parallel with T01 — it has no dependency on the backend being ready.
All API calls in this task are wired up but the auth API itself comes from T03.

---

## Acceptance Criteria

- [ ] `npm run dev` starts the app with zero TypeScript errors and zero console errors
- [ ] Tailwind CSS and Shadcn/UI are initialized; `cn()` utility and `Button` component work
- [ ] TanStack Query `QueryClientProvider` wraps the app at root level
- [ ] Axios instance configured with `baseURL: /api` and request interceptor that attaches `Authorization: Bearer <token>` from auth context (skips if no token)
- [ ] Axios response interceptor catches `401` responses and redirects to `/login` (clears stored token)
- [ ] `AuthContext` provides: `user` (id, name, email, role), `token`, `login(token, user)`, `logout()`
- [ ] `login()` stores token in `localStorage`; `logout()` clears `localStorage`
- [ ] `ProtectedRoute` component: reads token + role from context; redirects to `/login` if unauthenticated; redirects to role-appropriate home if wrong role
- [ ] Route structure in place:
  - `/login` → public
  - `/admin/*` → ADMIN role required
  - `/faculty/*` → FACULTY role required
  - `/student/*` → STUDENT role required
- [ ] Navigating to `/admin/dashboard` without auth → redirected to `/login`
- [ ] Navigating to `/admin/dashboard` with a FACULTY token → redirected to `/faculty/dashboard` (wrong role redirect)

---

## Route Structure to Scaffold

```
/login                    → LoginPage (public)
/admin/dashboard          → AdminDashboardPage (placeholder)
/admin/courses            → AdminCoursesPage (placeholder)
/admin/questions          → AdminQuestionsPage (placeholder)
/admin/quizzes            → AdminQuizzesPage (placeholder)
/admin/batches            → AdminBatchesPage (placeholder)
/faculty/dashboard        → FacultyDashboardPage (placeholder)
/student/dashboard        → StudentDashboardPage (placeholder)
```

Placeholder pages show: page title in an `<h1>` and "Coming soon" text — enough to confirm routing works.

---

## Tech Stack Versions

Match what's specified in docs/tech/tech-stack.md. Key packages:
- React 18 + TypeScript
- Vite (latest stable)
- Tailwind CSS v3
- Shadcn/UI (latest)
- TanStack Query v5 (use v5 API — `placeholderData`, not `keepPreviousData`)
- React Router v6
- Axios
- React Hook Form v7 + Zod (install now, used in T04)

---

## Read Before Starting

| Role      | Must Read                                                                                      |
|-----------|------------------------------------------------------------------------------------------------|
| ARCHITECT | docs/product/overview.md (Section 9.1 Frontend Strategy), frontend/guidelines/core/01-structure/01a_folder_layout.md, frontend/guidelines/core/05-routing/05a_router_setup.md, frontend/guidelines/core/03-state/03a_state_decision_tree.md |
| UX        | ED.md (this folder), frontend/guidelines/components/COMPONENT_LIBRARY.md                       |
| WORKER    | ED.md (this folder), UX.md (this folder), frontend/guidelines/core/06-api/06a_service_pattern.md, frontend/guidelines/core/08-auth/ |
| REVIEWER  | ED.md (this folder), UX.md (this folder), frontend/guidelines/quick-reference/review/quick_review.md |

---

## Produces

| Role      | Output                                                                 |
|-----------|------------------------------------------------------------------------|
| ARCHITECT | ED.md — folder structure, state strategy, auth context design, routing plan |
| UX        | UX.md — N/A for scaffold; confirm Shadcn/UI theme tokens are set up correctly |
| WORKER    | Full frontend project: src/ folder structure, auth context, protected routes, axios instance, placeholder pages |
| REVIEWER  | REVIEW.md (this folder)                                                |
