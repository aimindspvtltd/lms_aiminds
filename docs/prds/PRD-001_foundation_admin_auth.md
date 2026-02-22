# PRD-001: Foundation + Admin Authentication

**Status:** In Progress
**Created by:** PM
**Date:** 2026-02-21
**Product ref:** docs/product/overview.md (Section 2.1 — Admin, Section 6, Section 7, Section 12.1)

---

## Problem Statement

Nothing can be built until the project scaffolding exists and an admin can log in.
The admin is the single person who creates all content (courses, questions, quizzes, batches)
that faculty and students depend on. Without a working admin auth layer, every subsequent
API endpoint has no security context to validate against, and no frontend protected routes
can be established.

This PRD covers the absolute foundation: both apps running, DB schema in place, admin
authenticated, and an admin shell UI ready to receive feature work in PRD-002 onwards.

---

## User Stories

- As an **Admin**, I want to log in with my email and password so that I can access the admin panel securely
- As an **Admin**, I want to see a dashboard with navigation to all management sections (Courses, Questions, Quizzes, Batches) so that I can manage the platform
- As an **Admin**, I want the system to reject unauthenticated requests so that no one can access protected data without logging in
- As a **Developer**, I want a full DB schema in place from Day 1 so that no destructive migrations are needed as features are added

---

## Acceptance Criteria

- [ ] Spring Boot app starts, connects to PostgreSQL, runs all Flyway migrations successfully
- [ ] All 14 core tables are created with correct columns, types, constraints, and indexes
- [ ] `POST /api/auth/login` returns a signed JWT for valid admin credentials
- [ ] `POST /api/auth/login` returns 401 for invalid credentials — no stack traces in response
- [ ] JWT is validated on every subsequent request; invalid/expired JWT returns 401
- [ ] Only users with role `ADMIN` can access `/api/admin/**` endpoints
- [ ] React app starts with `npm run dev`, no errors in console
- [ ] Navigating to `/admin/*` without a valid JWT redirects to `/login`
- [ ] Admin login page accepts email + password, calls auth API, stores JWT, redirects to dashboard
- [ ] Admin dashboard shows sidebar with: Courses, Question Bank, Quizzes, Batches nav items
- [ ] Logout clears the session and redirects to `/login`
- [ ] Each sidebar nav item shows a placeholder page (empty state, ready for PRD-002+)

---

## Out of Scope

- OTP login for students (PRD-006)
- Batch join code flow for students (PRD-006)
- Faculty login page (PRD-005 — reuses same auth API, separate UI)
- Any admin data management (Courses, Questions, Batches) — those are PRD-002, PRD-003, PRD-004
- Redis integration (config-only in this PRD, not wired for features yet)
- Email / SMS sending (not needed until PRD-006)

---

## Tasks

| Task ID      | Description                                              | Status  | ARCHITECT | UX  | WORKER | REVIEWER |
|--------------|----------------------------------------------------------|---------|-----------|-----|--------|----------|
| PRD-001-T01  | Backend scaffold + Spring Security skeleton + full DB schema | Pending | —     | —   | —      | —        |
| PRD-001-T02  | Frontend scaffold + auth context + protected routes      | Pending | —         | —   | —      | —        |
| PRD-001-T03  | Admin auth API (login + register + JWT filter)           | Pending | —         | —   | —      | —        |
| PRD-001-T04  | Admin login page                                         | Pending | —         | —   | —      | —        |
| PRD-001-T05  | Admin dashboard shell (sidebar, nav, layout, logout)     | Pending | —         | —   | —      | —        |

**Implementation order:** T01 → T03 (backend ready) in parallel with T02 (frontend ready), then T04 → T05

---

## Notes

- **Admin = You in Phase 1.** There is only one admin account. Seed it via `POST /api/auth/register` with Postman after first run.
- **DB schema is the most critical output of T01.** The PRD overview (Section 7) defines all 14 entities. Get this right Day 1 — downstream migrations are expensive.
- **T02 and T01 can run in parallel** — backend and frontend scaffolding are independent.
- **T03 depends on T01** (Spring Security needs DB + JWT config).
- **T04 and T05 depend on T02 + T03** (login page needs auth API to call; shell needs route guards).
- Spring Security must be configured to permit `/api/auth/**` without a JWT and require JWT for all other `/api/**` routes.
- Frontend JWT storage: `localStorage` for simplicity in Phase 1. Axios interceptor attaches `Authorization: Bearer <token>` to every request.
