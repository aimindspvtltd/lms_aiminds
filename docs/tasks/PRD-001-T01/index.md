# PRD-001-T01: Backend Scaffold + Spring Security Skeleton + Full DB Schema

**PRD:** [docs/prds/PRD-001_foundation_admin_auth.md](../../prds/PRD-001_foundation_admin_auth.md)
**Status:** Pending
**Created:** 2026-02-21

---

## Assignees

| Role      | Name |
|-----------|------|
| ARCHITECT | —    |
| UX        | N/A (backend only) |
| WORKER    | —    |
| REVIEWER  | —    |

---

## What Needs to Be Done

Initialize the Spring Boot backend project with all infrastructure wired up: PostgreSQL connection,
Flyway migrations for the complete DB schema (all 14 core tables), and the Spring Security skeleton
(JWT utility, security filter chain, role enum). No business logic endpoints yet — just the project
foundation every subsequent task builds on top of.

This task has no dependency on any other task. It is the starting point.

---

## Acceptance Criteria

- [ ] Spring Boot 3 app starts with `./mvnw spring-boot:run` with no errors
- [ ] PostgreSQL connection established (application.yml profile: local, Docker Compose for DB)
- [ ] Flyway runs all migrations on startup — `flyway_schema_history` table shows all migrations applied
- [ ] All 14 core tables exist with correct columns, data types, constraints, and indexes (see DB schema below)
- [ ] Spring Security configured: `/api/auth/**` is public; all other `/api/**` routes require a valid JWT
- [ ] Unauthenticated request to any protected route returns `401 Unauthorized` (no stack trace in body)
- [ ] JWT utility class: generate token (with userId, role, email claims), validate token, extract claims
- [ ] `Role` enum defined: `ADMIN`, `FACULTY`, `STUDENT`
- [ ] Docker Compose file present for local PostgreSQL + Redis (Redis config only — no features wired yet)

---

## DB Schema to Implement

All 14 tables from PRD overview Section 7.1. Full details in migration SQL.

| Table               | Key Columns                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| organizations       | id, name, subdomain, logo_url, settings_json, created_at                    |
| users               | id, org_id, email, phone, name, role(ADMIN/FACULTY/STUDENT), password_hash, otp_secret, status, created_at |
| courses             | id, org_id, title, description, duration_days, access_mode(SEQUENTIAL/OPEN), created_at |
| modules             | id, course_id, title, sort_order, created_at                                |
| content_blocks      | id, module_id, type(VIDEO/LINK/QUIZ_CLASSWORK/QUIZ_PRACTICE/QUIZ_TIMED), title, sort_order, config_json |
| questions           | id, org_id, type(SCQ/MCQ/FIB), text, options_json, correct_answer_json, explanation, topic_tag, difficulty |
| quizzes             | id, org_id, title, quiz_mode(CLASSWORK/PRACTICE/TIMED), time_limit_min, shuffle_questions, shuffle_options, scoring_mode, settings_json |
| quiz_questions      | quiz_id, question_id, sort_order, marks                                      |
| batches             | id, org_id, course_id, faculty_user_id, title, start_date, end_date, join_code, poll_enabled, status |
| batch_students      | batch_id, student_user_id, enrolled_at, status                              |
| quiz_sessions       | id, batch_id, quiz_id, started_by, started_at, ends_at, status, extended_min, availability_mode, scheduled_start, scheduled_end |
| student_responses   | id, session_id, student_user_id, question_id, response_json, is_correct, score, answered_at, time_spent_sec |
| student_quiz_results| id, session_id, student_user_id, total_score, max_score, pct, submitted_at, is_auto_submitted |
| student_progress    | id, batch_id, student_user_id, content_block_id, status(NOT_STARTED/IN_PROGRESS/COMPLETED), completed_at |

**Indexes to create:**
- `users(email)` — unique, login lookup
- `users(phone)` — unique where not null, OTP lookup
- `users(org_id)`
- `modules(course_id)`
- `content_blocks(module_id)`
- `quiz_questions(quiz_id)`
- `batches(join_code)` — unique, join code lookup
- `batches(org_id, faculty_user_id)`
- `batch_students(batch_id, student_user_id)` — unique composite
- `quiz_sessions(batch_id, quiz_id)`
- `student_responses(session_id, student_user_id)`
- `student_quiz_results(session_id, student_user_id)` — unique composite
- `student_progress(batch_id, student_user_id, content_block_id)` — unique composite

---

## Read Before Starting

| Role      | Must Read                                                                         |
|-----------|-----------------------------------------------------------------------------------|
| ARCHITECT | docs/db/SOT.md, docs/product/overview.md (Section 7), backend/guidelines/02_database_guidelines.md, backend/guidelines/05_migration_management.md |
| WORKER    | ED.md (this folder), backend/guidelines/01_project_structure.md, backend/guidelines/04_code_organization.md |
| REVIEWER  | ED.md (this folder), backend/guidelines/quick_reference/checklist.md, backend/guidelines/02_database_guidelines.md |

---

## Produces

| Role      | Output                                                        |
|-----------|---------------------------------------------------------------|
| ARCHITECT | ED.md (this folder) — Spring Security design, JWT approach, migration plan |
| WORKER    | Spring Boot project, all Flyway migration SQL files, docker-compose.yml |
| REVIEWER  | REVIEW.md (this folder)                                       |
