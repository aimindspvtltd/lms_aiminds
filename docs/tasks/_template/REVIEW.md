# Code Review — PRD-XXX-T##

**Reviewed by:** REVIEWER
**Date:** YYYY-MM-DD
**PR / Branch:** _link or branch name_

---

## Backend Review

### Code Organization
- [ ] Controller is thin — delegates to service
- [ ] Service contains business logic only
- [ ] Repository contains DB queries only
- [ ] Validator schema defined for all inputs

### Naming Conventions
- [ ] Files: kebab-case (`user-service.js`)
- [ ] Classes: PascalCase (`UserService`)
- [ ] Methods: camelCase (`enableOTP`)
- [ ] Constants: UPPER_SNAKE_CASE

### Error Handling
- [ ] Custom error classes used (NotFoundError, ValidationError, etc.)
- [ ] No sensitive data in logs (passwords, OTP secrets, tokens)
- [ ] All async methods have try/catch → next(error)

### Tests
- [ ] Unit tests for new service methods
- [ ] Integration test for each new API endpoint
- [ ] Edge cases covered

### DB / Migration
- [ ] Migration has both UP and DOWN
- [ ] Uses TIMESTAMPTZ (not TIMESTAMP)
- [ ] Soft delete respected (`WHERE deleted_at IS NULL`)

---

## Frontend Review

### Component
- [ ] Matches UX spec (props, variants, layout)
- [ ] Named export (not default export)
- [ ] Props interface defined in TypeScript

### TypeScript
- [ ] No `any` types
- [ ] All props typed
- [ ] Service return types defined

### TanStack Query
- [ ] v5 API used (`placeholderData`, not `keepPreviousData`)
- [ ] Query key factory pattern followed
- [ ] Cache invalidated after mutations

### Styling
- [ ] Tailwind utility classes only (no hardcoded colours)
- [ ] Dark mode handled (`dark:` classes)
- [ ] Responsive behaviour as per UX spec

### Accessibility
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation works
- [ ] Loading and error states handled

### Component Library
- [ ] COMPONENT_LIBRARY.md updated if new reusable component was created

---

## Issues Found

### ❌ Must Fix (blocking)
_List issues that must be resolved before merge_

### ⚠️ Should Fix (non-blocking)
_List warnings or improvements to consider_

---

## Verdict

- [ ] ✅ **APPROVED** — ready to merge
- [ ] 🔄 **REQUEST CHANGES** — fix issues above and re-request review

---

## Post-Merge Checklist (ARCHITECT)

- [ ] `docs/db/SOT.md` updated with new schema (if DB changed)
- [ ] PRD task status updated to **Done**
