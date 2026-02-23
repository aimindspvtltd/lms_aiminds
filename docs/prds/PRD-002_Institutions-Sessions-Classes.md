# PRD-002: Institutions, Sessions, and Classes

**Status:** Draft  
**Created by:** Claude Code  
**Date:** 2023-05-12
**Product ref:** docs/product/features/institutions-sessions-classes.md

---

## Problem Statement

The LMS platform currently lacks the ability for administrators to manage the core educational entities - institutions, sessions (batches), and classes. Users are unable to create, update, or view details of these entities, making it difficult to organize and track the various educational programs and cohorts using the platform.

---

## User Stories

- As an admin, I want to be able to create new institutions with details like name, address, contact information, so that I can onboard new educational providers.
- As an admin, I want to be able to create new sessions (batches) within an institution, with details like start/end dates, program, capacity, etc. so that I can organize student enrollments.
- As an admin, I want to be able to create new classes within a session, so that I can associate students and faculty with them.
- As a faculty member, I want to be able to view the list of institutions, sessions, and classes, and details of each, so that I can understand the organizational structure.
- As a student, I want to be able to see the session and class I am enrolled in, and key details about them, so that I can stay informed about my program.

---

## Acceptance Criteria

- [ ] Admins can create, update, and delete institutions
- [ ] Admins can create, update, and delete sessions within an institution
- [ ] Admins can create, update, and delete classes within a session
- [ ] Email is a required field for student profiles
- [ ] Students can be added to the platform for the first time or associated with a new session if they were registered previously
- [ ] Students can be enrolled in one or more classes within a session
- [ ] Faculty members can be assigned to teach one or more classes within a session
- [ ] Students and faculty can view the institution, session, and class details they are associated with
- [ ] Admins have robust sorting, filtering, and search capabilities for institutions, sessions, classes, students, and faculty
- [ ] The admin UI provides a smooth and efficient experience for managing all these entities
- [ ] Basic analytics (enrollment numbers, session/class details) are available

---

## Out of Scope

- Notifications and advanced analytics are not part of the initial scope.
- Integration with external systems (like student information systems) is not included in this phase.

---

## Tasks

| Task ID        | Description                    | Status    | ARCHITECT | UX  | WORKER | REVIEWER |
|----------------|--------------------------------|-----------|-----------|-----|--------|----------|
| PRD-002-T01    | Design the Institutions data model and CRUD API endpoints | Pending | - | - | - | - |
| PRD-002-T02    | Implement the Institutions management UI | Pending | - | - | - | - |
| PRD-002-T03    | Design the Sessions and Classes data model and CRUD API endpoints | Pending | - | - | - | - |
| PRD-002-T04    | Implement the Sessions management UI | Pending | - | - | - | - |
| PRD-002-T05    | Implement the Classes management UI | Pending | - | - | - | - |
| PRD-002-T06    | Implement student and faculty associations | Pending | - | - | - | - |
| PRD-002-T07    | Implement data upload functionality for students | Pending | - | - | - | - |

---

## Notes

- This feature should be prioritized as it is a core requirement for the LMS platform to function effectively.
- Careful consideration should be given to the UI/UX to ensure a smooth administrative experience.
- Integration with other features like attendance tracking will be crucial in the future.