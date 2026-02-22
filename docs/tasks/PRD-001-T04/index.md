# PRD-001-T04: Admin Login Page

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

Build the admin login page — the entry point to the entire platform. A clean, professional
email + password form that calls the auth API, stores the JWT on success, and redirects
to the admin dashboard. Must handle validation errors (client-side) and auth errors
(server-side: wrong credentials) clearly. This is the first screen any user sees.

**Depends on:** T02 (auth context + protected routes), T03 (auth API working)

---

## Acceptance Criteria

- [ ] Login form renders at `/login` with: Email field, Password field (masked), "Sign In" button
- [ ] Client-side validation (before API call): email must be valid format; password must not be empty
- [ ] Validation errors shown inline below each field (not a toast, not an alert)
- [ ] "Sign In" button shows loading spinner while API call is in flight; button is disabled
- [ ] On `200` success: JWT and user stored in auth context + localStorage; redirected to `/admin/dashboard`
- [ ] On `401` error: inline error message — "Invalid email or password" — shown below the form
- [ ] On network error / `500`: "Something went wrong. Please try again." message shown
- [ ] Password field has a show/hide toggle (eye icon)
- [ ] Form is accessible: labels linked to inputs, Enter key submits, error messages have `role="alert"`
- [ ] Responsive: works on desktop (centered card, max-width 400px) and mobile (full width with padding)
- [ ] No "Remember me" checkbox, no "Forgot password" link (out of scope for Phase 1)

---

## UI Spec (For UX to Detail)

```
┌─────────────────────────────────┐
│                                 │
│     [LMS Platform Logo/Name]    │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Email                    │  │
│  │  [email@example.com     ] │  │
│  │                           │  │
│  │  Password                 │  │
│  │  [••••••••••••••••••] 👁  │  │
│  │                           │  │
│  │  [   Sign In   ]          │  │
│  │                           │  │
│  │  ⚠ Invalid email or       │  │
│  │    password               │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

- Background: neutral gray (`bg-muted`)
- Card: white, rounded-lg, shadow-md, p-8
- "Sign In" button: full width, primary color
- Error state: text-destructive, small text below form
- Logo/name: centered above card

---

## Form Logic

```
onSubmit:
  1. Validate with Zod (email format, password required)
  2. If errors → show inline, abort
  3. setLoading(true), disable button
  4. POST /api/auth/login { email, password }
  5. On success → authContext.login(token, user) → navigate('/admin/dashboard')
  6. On 401 → setError("Invalid email or password")
  7. On other error → setError("Something went wrong. Please try again.")
  8. setLoading(false)
```

---

## Read Before Starting

| Role      | Must Read                                                                                   |
|-----------|---------------------------------------------------------------------------------------------|
| ARCHITECT | T02 ED.md (auth context API), T03 ED.md (login API contract), frontend/guidelines/core/06-api/06a_service_pattern.md |
| UX        | ED.md (this folder), frontend/guidelines/components/COMPONENT_LIBRARY.md (check for existing form/input components), frontend/guidelines/core/04-styling/04e_styling_patterns.md |
| WORKER    | ED.md (this folder), UX.md (this folder), frontend/guidelines/core/07-forms/07a_react_hook_form.md, frontend/guidelines/core/06-api/06a_service_pattern.md |
| REVIEWER  | ED.md (this folder), UX.md (this folder), frontend/guidelines/quick-reference/review/quick_review.md, frontend/guidelines/quick-reference/review/accessibility_review.md, frontend/guidelines/quick-reference/review/forms_review.md |

---

## Produces

| Role      | Output                                                                            |
|-----------|-----------------------------------------------------------------------------------|
| ARCHITECT | ED.md — service layer design for auth, how login integrates with auth context     |
| UX        | UX.md — component spec: which Shadcn/UI components to use, exact error states, responsive breakpoints |
| WORKER    | `src/features/auth/pages/LoginPage.tsx`, `src/features/auth/services/auth.service.ts`, `src/features/auth/hooks/useLogin.ts` |
| REVIEWER  | REVIEW.md (this folder)                                                           |
