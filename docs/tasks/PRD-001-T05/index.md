# PRD-001-T05: Admin Dashboard Shell (Sidebar, Nav, Layout, Logout)

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

Build the admin layout shell — the persistent wrapper that every admin page lives inside.
This includes the sidebar with navigation links, a top header with the logged-in user's name
and a logout button, and a main content area where page content renders. Each sidebar item
shows a placeholder page for now; PRD-002, PRD-003, PRD-004 will fill them in.

This shell is the single most-reused UI component in the admin flow. Get it right here
so every subsequent admin task just drops a page component into the content area.

**Depends on:** T02 (auth context + protected routes), T04 (login page working — can navigate here)

---

## Acceptance Criteria

- [ ] `/admin/dashboard` renders the full shell: sidebar (left) + header (top) + content area (right/main)
- [ ] Sidebar shows navigation links: Dashboard, Courses, Question Bank, Quizzes, Batches
- [ ] Active route is visually highlighted in the sidebar
- [ ] Header shows: logged-in user's name (from auth context) and a "Logout" button
- [ ] Logout button: calls `authContext.logout()`, clears localStorage, redirects to `/login`
- [ ] All 5 routes render inside the shell with placeholder content:
  - `/admin/dashboard` — "Dashboard" heading + "Welcome, {name}" text
  - `/admin/courses` — "Courses" heading + "No courses yet" empty state
  - `/admin/questions` — "Question Bank" heading + "No questions yet" empty state
  - `/admin/quizzes` — "Quizzes" heading + "No quizzes yet" empty state
  - `/admin/batches` — "Batches" heading + "No batches yet" empty state
- [ ] Role guard enforced: navigating to any `/admin/*` without ADMIN JWT → `/login`
- [ ] Sidebar is collapsible on smaller screens (or hidden behind a hamburger toggle)
- [ ] Layout is desktop-first (admin works on desktop); minimum viable on tablet

---

## UI Spec (For UX to Detail)

```
┌──────────┬──────────────────────────────────────────────┐
│          │  Header: [LMS Admin]        [Admin Name] [↪] │
│ SIDEBAR  ├──────────────────────────────────────────────┤
│          │                                              │
│ • Dashboard                                             │
│ • Courses    MAIN CONTENT AREA                         │
│ • Question   (page component renders here)             │
│   Bank                                                 │
│ • Quizzes                                              │
│ • Batches                                              │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

- Sidebar width: ~240px, fixed, dark background (`bg-sidebar` or `bg-card`)
- Header height: ~56px, white/card bg, border-bottom
- Sidebar nav items: icon + label, hover state, active state (highlighted bg + primary text color)
- Logout button: ghost variant, small, in header right side
- Content area: `bg-muted/40`, padding, scrollable

---

## Component Architecture

```
src/
└── features/
    └── admin/
        ├── layout/
        │   ├── AdminLayout.tsx        ← shell: sidebar + header + <Outlet />
        │   ├── AdminSidebar.tsx       ← nav links with active state
        │   └── AdminHeader.tsx        ← user name + logout button
        └── pages/
            ├── AdminDashboardPage.tsx
            ├── AdminCoursesPage.tsx   ← placeholder (PRD-002 fills this)
            ├── AdminQuestionsPage.tsx ← placeholder (PRD-003 fills this)
            ├── AdminQuizzesPage.tsx   ← placeholder (PRD-003 fills this)
            └── AdminBatchesPage.tsx   ← placeholder (PRD-004 fills this)
```

`AdminLayout` uses React Router's `<Outlet />` so all `/admin/*` routes render inside it.

---

## Read Before Starting

| Role      | Must Read                                                                                        |
|-----------|--------------------------------------------------------------------------------------------------|
| ARCHITECT | T02 ED.md (folder structure), frontend/guidelines/core/01-structure/01a_folder_layout.md, frontend/guidelines/core/05-routing/05a_router_setup.md |
| UX        | ED.md (this folder), frontend/guidelines/components/COMPONENT_LIBRARY.md (sidebar/layout components?), frontend/guidelines/core/04-styling/04e_styling_patterns.md |
| WORKER    | ED.md (this folder), UX.md (this folder), frontend/guidelines/core/02-components/02a_component_basics.md, frontend/guidelines/quick-reference/component_library_workflow.md |
| REVIEWER  | ED.md (this folder), UX.md (this folder), frontend/guidelines/quick-reference/review/quick_review.md, frontend/guidelines/quick-reference/review/accessibility_review.md |

---

## Produces

| Role      | Output                                                                                        |
|-----------|-----------------------------------------------------------------------------------------------|
| ARCHITECT | ED.md — layout component hierarchy, routing structure (nested routes with Outlet), state approach for sidebar collapse |
| UX        | UX.md — AdminSidebar spec (nav items, active state, collapse), AdminHeader spec, empty state spec for placeholder pages |
| WORKER    | AdminLayout, AdminSidebar, AdminHeader, all 5 placeholder page components; update COMPONENT_LIBRARY.md if AdminLayout is reusable |
| REVIEWER  | REVIEW.md (this folder)                                                                       |
