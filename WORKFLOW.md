# LMS Platform — Workflow Guide

**Read this first. This is the KT (Knowledge Transfer) document for every role.**

---

## How Work Gets Done

Every feature on this platform follows a fixed numbered workflow:

```
PM creates PRD-XXX + task folders
         ↓
ARCHITECT writes ED.md for each task
         ↓
UX writes UX.md for each task
         ↓
WORKER implements code for each task
         ↓
REVIEWER reviews and approves
         ↓
Merged ✅ → SOT updated ✅
```

No role starts work until the previous role's output is ready.

---

## Task Numbering System

```
PRD-001              ← A feature or epic (e.g., User Authentication)
PRD-001-T01          ← Task 1 within PRD-001 (e.g., Login flow)
PRD-001-T02          ← Task 2 within PRD-001 (e.g., OTP setup)

PRD-002              ← Another feature (e.g., Course Management)
PRD-002-T01          ← Task 1 within PRD-002
```

**Rule:** When someone says "Work on PRD-001-T02", you go to `docs/tasks/PRD-001-T02/` and read everything there.

---

## Folder Structure

```
lms-platform/
│
├── docs/
│   ├── product/                    ← What the product is (PM reads this)
│   │   ├── overview.md             ← Vision, user types, core modules
│   │   └── features/               ← One file per feature area
│   │       ├── auth.md
│   │       ├── courses.md
│   │       ├── enrollments.md
│   │       └── payments.md
│   │
│   ├── tech/                       ← Technical reference (all devs read this)
│   │   ├── tech-stack.md           ← Technologies + versions
│   │   ├── architecture.md         ← System layers + how they connect
│   │   └── env-setup.md            ← How to run locally
│   │
│   ├── db/                         ← Database documentation (ARCHITECT reads this)
│   │   ├── SOT.md                  ← Current full schema — updated after every merge
│   │   └── tables/                 ← One file per table: purpose, columns, rules
│   │       ├── users.md
│   │       ├── courses.md
│   │       ├── course_content.md
│   │       ├── enrollments.md
│   │       └── payments.md
│   │
│   ├── prds/                       ← PM creates these
│   │   ├── _template.md            ← Copy this to create a new PRD
│   │   └── PRD-XXX_feature.md
│   │
│   └── tasks/                      ← One folder per task — the main working area
│       ├── _template/              ← Copy this entire folder for each new task
│       │   ├── index.md            ← Task brief, status, assignees
│       │   ├── ED.md               ← ARCHITECT writes this
│       │   ├── UX.md               ← UX writes this
│       │   └── REVIEW.md          ← REVIEWER writes this
│       └── PRD-XXX-T##/           ← Actual task folder (one per task)
│
├── WORKFLOW.md                     ← This file
├── ROLE_MAPPING.md                 ← Role definitions + which guideline files to load
│
├── backend/
│   └── guidelines/                 ← Backend coding standards
└── frontend/
    └── guidelines/                 ← Frontend coding standards
```

---

## Role-by-Role Instructions

---

### 📋 PM

**When you start a new feature:**

1. Read `docs/product/overview.md` and the relevant `docs/product/features/*.md`
2. Create `docs/prds/PRD-XXX_feature_name.md` using `docs/prds/_template.md`
3. Break the feature into tasks — each task should be independently implementable
4. For each task, copy `docs/tasks/_template/` → `docs/tasks/PRD-XXX-T##/`
5. Fill in `docs/tasks/PRD-XXX-T##/index.md` with what needs to be done
6. Update the task table in the PRD with task IDs and assignees

**Prompt for Claude:**
```
You are a PM. Create a PRD for [feature name].

Reference: docs/product/features/[relevant].md
Read it, then create:
1. docs/prds/PRD-XXX_[feature].md
2. index.md for each task under docs/tasks/PRD-XXX-T##/
```

---

### 🏗️ ARCHITECT

**When assigned a task:**

1. Read `docs/tasks/PRD-XXX-T##/index.md` — understand what's needed
2. Read `docs/prds/PRD-XXX.md` — understand the full feature context
3. Read `docs/db/SOT.md` — understand the current database state
4. Read relevant `docs/db/tables/*.md` — understand table details
5. Read `backend/guidelines/` + `frontend/guidelines/` for coding standards
6. Write `docs/tasks/PRD-XXX-T##/ED.md`
7. Write the migration SQL file in `backend/migrations/`
8. After merge: update `docs/db/SOT.md` to reflect the new schema

**Prompt for Claude:**
```
You are an ARCHITECT. Work on PRD-XXX-T##.

Read:
- docs/tasks/PRD-XXX-T##/index.md
- docs/db/SOT.md
- backend/guidelines/02_database_guidelines.md
- backend/guidelines/05_migration_management.md
- frontend/guidelines/core/01-structure/01a_folder_layout.md

Then write docs/tasks/PRD-XXX-T##/ED.md
```

**Output:** `ED.md` + migration SQL file

---

### 🎨 UX

**When assigned a task:**

1. Read `docs/tasks/PRD-XXX-T##/index.md`
2. Read `docs/tasks/PRD-XXX-T##/ED.md` — understand what frontend is needed
3. Read `frontend/guidelines/components/COMPONENT_LIBRARY.md` — check reusability **first**
4. Read `frontend/guidelines/core/04-styling/04e_styling_patterns.md`
5. Write `docs/tasks/PRD-XXX-T##/UX.md`

**Prompt for Claude:**
```
You are a UX designer. Work on PRD-XXX-T##.

Read:
- docs/tasks/PRD-XXX-T##/index.md
- docs/tasks/PRD-XXX-T##/ED.md
- frontend/guidelines/components/COMPONENT_LIBRARY.md

Check which components can be reused.
Then write docs/tasks/PRD-XXX-T##/UX.md
```

**Output:** `UX.md`

---

### 👨‍💻 WORKER

**When assigned a task:**

1. Read `docs/tasks/PRD-XXX-T##/ED.md` — this is your backend + frontend blueprint
2. Read `docs/tasks/PRD-XXX-T##/UX.md` — this is your component spec
3. Read relevant `backend/guidelines/` and `frontend/guidelines/` files
4. Implement everything listed in the ED
5. For every new frontend component — ask: "Should this go in COMPONENT_LIBRARY.md?"
6. If yes — update `frontend/guidelines/components/COMPONENT_LIBRARY.md`

**Prompt for Claude:**
```
You are a WORKER. Implement PRD-XXX-T##.

Read:
- docs/tasks/PRD-XXX-T##/ED.md
- docs/tasks/PRD-XXX-T##/UX.md
- backend/guidelines/04_code_organization.md
- frontend/guidelines/core/02-components/02a_component_basics.md
- frontend/guidelines/core/06-api/06a_service_pattern.md
- frontend/guidelines/quick-reference/component_library_workflow.md

Implement all backend and frontend code as described in the ED.
```

**Output:** All backend + frontend code

---

### 🔍 REVIEWER

**When assigned a task:**

1. Read `docs/tasks/PRD-XXX-T##/ED.md` — what was supposed to be built
2. Read `docs/tasks/PRD-XXX-T##/UX.md` — what components were supposed to look like
3. Review the actual code changes
4. Write `docs/tasks/PRD-XXX-T##/REVIEW.md` using the template
5. If approved: notify PM to update task status; notify ARCHITECT to update SOT if DB changed

**Prompt for Claude:**
```
You are a REVIEWER. Review PRD-XXX-T##.

Read:
- docs/tasks/PRD-XXX-T##/ED.md
- docs/tasks/PRD-XXX-T##/UX.md
- backend/guidelines/quick_reference/checklist.md
- frontend/guidelines/quick-reference/review/quick_review.md

[paste code changes or PR diff]

Write docs/tasks/PRD-XXX-T##/REVIEW.md
```

**Output:** `REVIEW.md` with verdict

---

## Golden Rules

| Rule | Detail |
|------|--------|
| No WORKER starts without ED + UX | ARCHITECT and UX must finish first |
| No REVIEWER starts without code | WORKER must finish first |
| SOT is always current | ARCHITECT updates `docs/db/SOT.md` after every DB-changing merge |
| Every reusable component is documented | WORKER updates COMPONENT_LIBRARY.md before PR |
| Task numbers are sacred | Always reference `PRD-XXX-T##` in commits, PRs, and comments |
| Guidelines are the law | If your code doesn't match the guidelines, REVIEWER will reject it |

---

## Starting a New Task — Quick Checklist

```
PM:
  □ Created docs/prds/PRD-XXX.md
  □ Created docs/tasks/PRD-XXX-T##/index.md for each task

ARCHITECT:
  □ Read index.md + SOT.md + PRD
  □ Written ED.md
  □ Written migration file

UX:
  □ Read index.md + ED.md
  □ Checked COMPONENT_LIBRARY.md
  □ Written UX.md

WORKER:
  □ Read ED.md + UX.md
  □ Implemented all backend code
  □ Implemented all frontend code
  □ Updated COMPONENT_LIBRARY.md (if applicable)
  □ Written tests

REVIEWER:
  □ Read ED.md + UX.md
  □ Reviewed all code
  □ Written REVIEW.md
  □ Approved or requested changes

Post-merge:
  □ SOT.md updated (if DB changed)
  □ PRD task status updated to Done
```

---

## Key Documents Quick Reference

| What you need | Where to find it |
|---------------|-----------------|
| Product vision | `docs/product/overview.md` |
| Feature details | `docs/product/features/*.md` |
| Current DB schema | `docs/db/SOT.md` |
| Table details | `docs/db/tables/[table].md` |
| Tech stack | `docs/tech/tech-stack.md` |
| System architecture | `docs/tech/architecture.md` |
| Local setup | `docs/tech/env-setup.md` |
| Role responsibilities | `ROLE_MAPPING.md` |
| Backend coding rules | `backend/guidelines/` |
| Frontend coding rules | `frontend/guidelines/` |
| Reusable components | `frontend/guidelines/components/COMPONENT_LIBRARY.md` |
| This workflow | `WORKFLOW.md` (you are here) |
