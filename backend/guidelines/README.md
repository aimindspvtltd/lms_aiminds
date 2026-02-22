# Backend Coding Guidelines - Index

**Version:** 1.0  
**Last Updated:** February 2025  
**Target:** Claude AI for code assistance and review

---

## Quick Navigation

### Core Guidelines (Detailed)
1. **[Project Structure](01_project_structure.md)** - Directory layout, naming conventions
2. **[Database Guidelines](02_database_guidelines.md)** - Schema design, tables, indexes, relationships
3. **[API Design](03_api_design.md)** - RESTful standards, request/response formats
4. **[Code Organization](04_code_organization.md)** - Layered architecture, controller/service/repository
5. **[Migration Management](05_migration_management.md)** - Database migrations, versioning
6. **[Error Handling](06_error_handling.md)** - Custom errors, global handlers
7. **[Testing Standards](07_testing_standards.md)** - Unit, integration, coverage
8. **[Security Guidelines](08_security_guidelines.md)** - Auth, validation, encryption
9. **[Documentation](09_documentation.md)** - Code comments, API docs
10. **[Version Control](10_version_control.md)** - Git workflow, commits, PRs

### Quick Reference (Short)
- **[Naming Conventions](quick_reference/naming_conventions.md)** - Quick lookup table
- **[Common Patterns](quick_reference/common_patterns.md)** - Code snippets
- **[Checklists](quick_reference/checklist.md)** - PR/review checklists

---

## Query Routing Guide

**When Claude receives a query, route to:**

### Database Related
- Schema design, tables, columns → `02_database_guidelines.md`
- Migrations, schema changes → `05_migration_management.md`
- Quick naming lookup → `quick_reference/naming_conventions.md`

### API Related
- Endpoints, REST conventions → `03_api_design.md`
- Request/response format → `03_api_design.md`
- Error responses → `06_error_handling.md`

### Code Structure
- Where to put code → `01_project_structure.md`
- How to organize layers → `04_code_organization.md`
- Common patterns → `quick_reference/common_patterns.md`

### Quality & Process
- Testing → `07_testing_standards.md`
- Security → `08_security_guidelines.md`
- Documentation → `09_documentation.md`
- Git/commits → `10_version_control.md`

### Quick Tasks
- Need a checklist? → `quick_reference/checklist.md`
- Need naming help? → `quick_reference/naming_conventions.md`
- Need code example? → `quick_reference/common_patterns.md`

---

## Usage Pattern for Claude

### Role-Based Usage (Recommended)

```
User: "You are a REVIEWER. Check this PR."

Claude should:
1. Read: quick_reference/role_lookup.md
2. Load all files specified for REVIEWER role
3. Review code using role-specific perspective
4. Provide feedback based on loaded guidelines
```

### Direct Query Usage

```
User Query: "How should I structure a migration for adding OTP columns?"

Claude should:
1. Load: 05_migration_management.md (specific to migrations)
2. Load: 02_database_guidelines.md (for column naming/types)
3. Reference: quick_reference/checklist.md (migration checklist)
4. Provide answer with examples from loaded guidelines
```

**See:** `ROLE_MAPPING.md` for complete role definitions and `quick_reference/role_lookup.md` for quick file loading reference.

---

## Principles

1. **Modular** - Load only what you need
2. **Searchable** - Each file is self-contained
3. **Examples-first** - Show, don't just tell
4. **Task-oriented** - Organized by what developers do
5. **Version-aware** - References Source of Truth architecture

---

## File Sizes (approx)

| File | Lines | When to Load |
|------|-------|--------------|
| 01_project_structure.md | ~400 | Directory questions |
| 02_database_guidelines.md | ~800 | Schema/DB questions |
| 03_api_design.md | ~600 | Endpoint/REST questions |
| 04_code_organization.md | ~1000 | Architecture questions |
| 05_migration_management.md | ~500 | Migration questions |
| 06_error_handling.md | ~400 | Error/exception questions |
| 07_testing_standards.md | ~600 | Testing questions |
| 08_security_guidelines.md | ~500 | Security questions |
| 09_documentation.md | ~300 | Documentation questions |
| 10_version_control.md | ~400 | Git/commit questions |

**Quick Reference Files:** ~100-200 lines each

---

## Integration with Source of Truth

These guidelines work alongside:
- **Source of Truth Docs** (Product & Tech) - Current state of system
- **Task Folders** (TASK_XXX) - Change management
- **These Guidelines** - How to write/structure code

When a developer works on TASK_101:
1. Read Task docs (what to change)
2. Reference Source of Truth (current state)
3. Use these Guidelines (how to implement)

---

## Maintenance

- **Review:** Monthly
- **Update:** When patterns change
- **Version:** Semantic versioning
- **Changelog:** Track in version_control.md
