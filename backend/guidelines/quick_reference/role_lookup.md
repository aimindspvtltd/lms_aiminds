# Role-Based File Loading - Quick Reference

**For Claude:** When user says "You are a [ROLE]", immediately load these files:

---

## 🏗️ ARCHITECT
**Phase:** Design & Planning  
**Delivers:** ED documents, migration files, technical design

```
Load:
- 02_database_guidelines.md ⭐
- 05_migration_management.md ⭐
- 01_project_structure.md
- 03_api_design.md
- 04_code_organization.md
- quick_reference/naming_conventions.md
- quick_reference/checklist.md
```

**Usage:**
```
You are an ARCHITECT. Design TASK_101_Add_OTP_Verification.
```

---

## 👨‍💻 WORKER
**Phase:** Implementation  
**Delivers:** Code implementation following ARCHITECT's design

```
Load:
- 04_code_organization.md ⭐
- 03_api_design.md
- 06_error_handling.md
- 08_security_guidelines.md
- 01_project_structure.md
- quick_reference/common_patterns.md
- quick_reference/naming_conventions.md
```

**Usage:**
```
You are a WORKER. Implement TASK_101 according to the ED documents.
```

---

## 🔍 REVIEWER
**Phase:** Code Review  
**Delivers:** Review feedback, approval/rejection, quality verification

```
Load:
- quick_reference/checklist.md ⭐
- quick_reference/naming_conventions.md ⭐
- quick_reference/common_patterns.md
- 04_code_organization.md
- 06_error_handling.md
- 07_testing_standards.md
- 10_version_control.md
- 02_database_guidelines.md
- 03_api_design.md
```

**Usage:**
```
You are a REVIEWER. Check this PR for TASK_101.
```

---

## Workflow Sequence

```
1. ARCHITECT Phase
   ↓
   Creates: ED_DB.md, ED_OTHER.md, migration files
   ↓
2. WORKER Phase
   ↓
   Creates: Code implementation
   ↓
3. REVIEWER Phase
   ↓
   Delivers: Review feedback
   ↓
   Merged & SOT Updated
```

---

## Combined Roles

**Format:** "You are a [ROLE1] and [ROLE2]"

**Action:** Load files from BOTH roles (deduplicate)

**Example:**
```
User: "You are an ARCHITECT and REVIEWER"
Load: All ARCHITECT files + All REVIEWER files (remove duplicates)

Use case: Review someone else's database design
```

---

## Token Efficiency

| Role | Files | Lines | Tokens | Savings |
|------|-------|-------|--------|---------|
| ARCHITECT | 7 | ~2,500 | ~6,250 | 48% ✅ |
| WORKER | 7 | ~2,800 | ~7,000 | 42% ✅ |
| REVIEWER | 9 | ~3,000 | ~7,500 | 38% ✅ |

**Baseline:** All files = ~4,800 lines ≈ 12,000 tokens

---

## Quick Decision Guide

**Are you designing/planning?** → ARCHITECT  
**Are you writing code?** → WORKER  
**Are you reviewing code?** → REVIEWER
