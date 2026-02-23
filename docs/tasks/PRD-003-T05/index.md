# PRD-003-T05: Create integration points for future quiz functionality

**Parent PRD:** PRD-003_Course-Creation
**Status:** Pending
**Assignee:** ARCHITECT, WORKER

---

## Overview

Design and implement the integration points that will allow quiz functionality to be seamlessly added to the course system in the future. This includes database schema preparation and API contracts.

---

## Requirements

1. Extend ContentBlock to support quiz references
2. Design quiz-related content block types (QUIZ_PRACTICE, QUIZ_EVALUATION)
3. Create placeholder API endpoints for quiz integration
4. Define the contract between course and quiz modules
5. Implement validation that prevents quiz content blocks until quiz module exists
6. Document the integration approach for future developers
7. Create migration path for when quiz module is ready

---

## Integration Points

1. **Database Level**
   - ContentBlock.quiz_id foreign key (nullable)
   - Quiz type enums in ContentBlock.type

2. **API Level**
   - GET /api/admin/quizzes (for selection)
   - Quiz validation in content block creation

3. **Frontend Level**
   - Quiz selector component interface
   - Quiz preview placeholder

4. **Service Level**
   - QuizIntegrationService interface
   - Validation hooks

---

## Deliverables

1. Database schema updates
2. Interface definitions
3. Placeholder implementations
4. Integration documentation
5. Migration strategy document

---

## Dependencies

- PRD-003-T01 (Data model must support quiz fields)
- Coordination with future quiz team

---

## Notes

- Keep integration points minimal but sufficient
- Use feature flags to hide quiz options
- Ensure backward compatibility
- Document assumptions about quiz module