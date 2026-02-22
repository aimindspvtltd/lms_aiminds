# LMS Platform — Phase 1 Epic Plan

**Source:** docs/product/overview.md (PRD v2.1)
**Strategy:** Admin-first → Faculty → Student
**Created:** 2026-02-21
**Status:** Planning

---

## Approach: Why Admin First?

Admin creates ALL the data every other persona depends on:
- Admin creates Courses → Faculty can deliver them
- Admin creates Questions/Quizzes → Students can take them
- Admin creates Batches → Students can join them

Building admin first also validates the entire data model before
building the consumer-facing flows on top of it.

---

## Dependency Chain

```
PRD-001: Foundation + Admin Auth
         ↓
PRD-002: Admin — Course & Content Management
         ↓
PRD-003: Admin — Question Bank & Quiz Management
         ↓
PRD-004: Admin — Batch & Enrollment Management
         ↓                        ↓
PRD-005: Faculty Flow       PRD-006: Student Onboarding
         ↓                        ↓
         PRD-007: Student Learning Experience
                  ↓
         PRD-008: Timed Assessment
                  ↓
         PRD-009: Student Results View
```

---

## Epic Summary

| PRD     | Epic Name                            | Scope          | Tasks | Status      |
|---------|--------------------------------------|----------------|-------|-------------|
| PRD-001 | Foundation + Admin Auth              | BE + FE        | 5     | 🟡 Active   |
| PRD-002 | Admin — Course & Content Mgmt        | BE + FE        | 4     | ⬜ Pending  |
| PRD-003 | Admin — Question Bank & Quiz Mgmt    | BE + FE        | 4     | ⬜ Pending  |
| PRD-004 | Admin — Batch & Enrollment Mgmt      | BE + FE        | 3     | ⬜ Pending  |
| PRD-005 | Faculty Flow                         | BE + FE        | 5     | ⬜ Pending  |
| PRD-006 | Student Onboarding (OTP + Join Code) | BE + FE        | 3     | ⬜ Deferred |
| PRD-007 | Student Learning Experience          | BE + FE        | 4     | ⬜ Pending  |
| PRD-008 | Timed Assessment                     | BE + FE        | 5     | ⬜ Pending  |
| PRD-009 | Student Results View                 | BE + FE        | 1     | ⬜ Pending  |

---

## PRD-001 — Foundation + Admin Auth
**Goal:** Backend + DB running. Admin can log in. Admin shell with sidebar ready.
Every subsequent WORKER writes against a working auth layer.

| Task    | Description                                                               |
|---------|---------------------------------------------------------------------------|
| T01     | Backend scaffold: Spring Boot 3 + PostgreSQL + Flyway + Spring Security skeleton + full DB schema (all 14 tables) |
| T02     | Frontend scaffold: Vite + React + TypeScript + Tailwind + Shadcn/UI + TanStack Query + Axios (JWT interceptor) + auth context + protected routes |
| T03     | Admin auth API: POST /api/auth/login (email+password → JWT), POST /api/auth/register (admin-initiated), JWT filter wired |
| T04     | Admin login page: email+password form, validation, API call, JWT stored, redirect to /admin/dashboard |
| T05     | Admin dashboard shell: sidebar nav (Courses, Questions, Quizzes, Batches), header + logout, role-guard, placeholder pages |

---

## PRD-002 — Admin: Course & Content Management
**Goal:** Admin can create courses, add modules, add content blocks (video/link/quiz).

| Task    | Description                                                               |
|---------|---------------------------------------------------------------------------|
| T01     | Course CRUD API: create/list/edit/delete course, access_mode (SEQUENTIAL/OPEN) |
| T02     | Module CRUD API: add modules to course, reorder (sort_order)              |
| T03     | Content Block CRUD API: add VIDEO/LINK/QUIZ_* blocks to module, reorder   |
| T04     | Admin UI: Course list page, Course form, Module builder, Content block list with type icons |

---

## PRD-003 — Admin: Question Bank & Quiz Management
**Goal:** Admin can create questions (all 3 types), bulk upload, build quizzes.

| Task    | Description                                                               |
|---------|---------------------------------------------------------------------------|
| T01     | Question CRUD API: SCQ / MCQ / FIB creation with correct options_json + correct_answer_json format |
| T02     | Bulk question upload API: Excel parse (Apache POI), row-level validation, error report download |
| T03     | Quiz CRUD API: create quiz (mode: CLASSWORK/PRACTICE/TIMED), attach questions with ordering, configure settings |
| T04     | Admin UI: Question bank list + filters, question form (type-aware), quiz builder, bulk upload with error feedback |

---

## PRD-004 — Admin: Batch & Enrollment Management
**Goal:** Admin can create training batches, assign faculty, enroll students, share join code.

| Task    | Description                                                               |
|---------|---------------------------------------------------------------------------|
| T01     | Batch CRUD API: create batch (course + faculty + date range), auto-generate 6-char join code, status management |
| T02     | Student enrollment API: pre-enroll by email/phone, list students per batch, remove student |
| T03     | Admin UI: Batch list, batch creation form, student roster management, join code display + copy |

---

## PRD-005 — Faculty Flow
**Goal:** Faculty logs in, sees their batch, runs classroom mode, controls assessments, exports results.

| Task    | Description                                                               |
|---------|---------------------------------------------------------------------------|
| T01     | Faculty auth: email+password login (reuses PRD-001 auth API), faculty protected routes /faculty/* |
| T02     | Faculty dashboard: assigned batches list, batch detail → module + content block sequence |
| T03     | Classwork projector UI: full-screen projector layout, question display → reveal answer, Previous/Next/End, keyboard shortcuts, 48px text |
| T04     | Assessment control: WebSocket (STOMP/SockJS) — launch timed quiz, extend time, release results, live student-count monitoring |
| T05     | Results dashboard + Excel export: score table per student, per-question breakdown, Apache POI Excel (2 sheets) |

---

## PRD-006 — Student Onboarding  ⬜ Deferred
**Goal:** Student joins via code on phone in < 60 seconds. OTP login for returning students.

| Task    | Description                                                               |
|---------|---------------------------------------------------------------------------|
| T01     | OTP auth API: POST /api/auth/otp/send, POST /api/auth/otp/verify → JWT    |
| T02     | Join code API: POST /api/auth/join (code + name + phone → enrolled + JWT) |
| T03     | Student join/login UI: join code flow (mobile-first), OTP verify screen   |

---

## PRD-007 — Student Learning Experience
**Goal:** Student browses course content, tracks progress, takes practice quizzes.

| Task    | Description                                                               |
|---------|---------------------------------------------------------------------------|
| T01     | Student dashboard + content browser API: enrolled batches, module list, content blocks, sequential/open access gate |
| T02     | Student progress tracking: mark content block complete, prerequisite checks for sequential mode |
| T03     | Student content viewer UI: YouTube embed, link card, sequential navigation, progress indicators |
| T04     | Practice quiz: backend session (start, answer, auto-save, resume) + UI (SCQ/MCQ/FIB, instant feedback, end summary) |

---

## PRD-008 — Timed Assessment
**Goal:** Server-side timer, auto-submit, answer persistence, WebSocket events.

| Task    | Description                                                               |
|---------|---------------------------------------------------------------------------|
| T01     | Quiz session backend: QuizSession lifecycle (PENDING→LIVE→ENDED), server-side timer, auto-submit on expiry |
| T02     | Assessment availability modes: SCHEDULED (time window), MODULE_UNLOCK (prereq check), FACULTY_TRIGGERED (WebSocket launch) |
| T03     | Answer persistence: save every 10 sec + on navigation, IndexedDB local backup, POST /sync on reconnect (last-timestamp wins) |
| T04     | Timed quiz UI: countdown (server-synced), free-navigation, flag-for-review, 30-sec warning, submit confirmation dialog |
| T05     | Extend time + dual-device guard: WebSocket extend-time event updates UI timer; detect same student on 2 devices |

---

## PRD-009 — Student Results View
**Goal:** Student sees score + correct answers + explanations after faculty releases results.

| Task    | Description                                                               |
|---------|---------------------------------------------------------------------------|
| T01     | Student results page: score card (total/%, pass/fail), per-question review (my answer vs correct + explanation), locked until results released |

---

## Open Questions (Resolve Before PRD-001 Kickoff)

- [ ] Redis in Phase 1? Recommend: include config, use DB for timer initially
- [ ] SMTP provider for OTP email (SendGrid / Spring Mail)?
- [ ] SMS gateway for OTP SMS?
- [ ] Docker from Day 1?
- [ ] Staging cloud provider for Week 5?
