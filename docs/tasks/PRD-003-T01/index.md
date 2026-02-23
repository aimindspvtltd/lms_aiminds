# PRD-003-T01: Design the data model for courses, modules, and sessions

**Parent PRD:** PRD-003_Course-Creation
**Status:** Pending
**Assignee:** ARCHITECT

---

## Overview

Design a comprehensive data model to support the course creation feature, including courses, modules (sessions), and content blocks. The model should be extensible to accommodate future quiz integration.

---

## Requirements

1. Design entities for Course, Module, and ContentBlock
2. Include audit columns (created_at, updated_at, created_by, updated_by) for all entities
3. Support different content types (VIDEO, LINK, INTERACTIVE_DOCUMENT)
4. Enable hierarchical structure: Course → Module → ContentBlock
5. Support both SEQUENTIAL and OPEN access modes for courses
6. Design with future quiz integration in mind

---

## Deliverables

1. Entity Relationship Diagram (ERD)
2. Detailed table schemas with column specifications
3. Migration SQL scripts
4. Documentation in ED.md

---

## Dependencies

- Review existing data model in docs/product/overview.md
- Coordinate with quiz feature team for future integration points

---

## Notes

- Follow existing database naming conventions
- Consider performance implications for large courses
- Ensure referential integrity with proper foreign keys