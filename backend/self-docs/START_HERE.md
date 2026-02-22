# 🎯 Backend Coding Guidelines - START HERE

**Your simplified 3-role system is ready!**

---

## 📁 What You Have

```
guidelines/
├── YOUR_3_ROLE_WORKFLOW.md     ⭐ START HERE - Complete workflow guide
├── ROLE_MAPPING.md              Detailed role definitions
│
├── Core Guidelines (10 files)
│   ├── 01_project_structure.md
│   ├── 02_database_guidelines.md
│   ├── 03_api_design.md
│   ├── 04_code_organization.md
│   ├── 05_migration_management.md
│   ├── 06_error_handling.md
│   ├── 07_testing_standards.md
│   ├── 08_security_guidelines.md
│   ├── 09_documentation.md
│   └── 10_version_control.md
│
└── quick_reference/
    ├── role_lookup.md          Quick role → files mapping
    ├── naming_conventions.md   Naming rules
    ├── common_patterns.md      Code snippets
    └── checklist.md            Review checklists
```

---

## 🎭 Your 3 Roles

```
TASK Created
    ↓
🏗️ ARCHITECT
│  - Reads current DB from SOT
│  - Designs schema changes
│  - Writes migration files
│  - Creates ED documents
│  Delivers: ED_DB.md, ED_OTHER.md, migration.sql
    ↓
👨‍💻 WORKER
│  - Reads ED documents
│  - Implements code
│  - Follows architecture
│  - Writes tests
│  Delivers: Code + Tests
    ↓
🔍 REVIEWER
│  - Reviews code quality
│  - Checks standards
│  - Verifies tests
│  - Approves/requests changes
│  Delivers: Review feedback
    ↓
SOT Updated ✅
```

---

## 🚀 How to Use

### Simple 3-Step Process:

**1. Design Phase**
```
You are an ARCHITECT. Design TASK_101_Add_OTP_Verification.
```
Claude loads: DB guidelines, migration guidelines, API design
Claude creates: ED documents + migration files

**2. Implementation Phase**
```
You are a WORKER. Implement TASK_101 according to the ED.
```
Claude loads: Code organization, API implementation, error handling
Claude creates: Code implementation

**3. Review Phase**
```
You are a REVIEWER. Check this PR for TASK_101.
```
Claude loads: Checklists, naming conventions, testing standards
Claude provides: Review feedback

---

## 📊 Benefits

### Before (1 large file):
- ❌ 12,000 tokens every query
- ❌ Slow processing
- ❌ Irrelevant info loaded
- ❌ Generic responses

### After (3 roles):
- ✅ 6,000-7,500 tokens per role (38-48% reduction)
- ✅ Fast, focused responses
- ✅ Role-specific guidance
- ✅ Precise, actionable advice

---

## 📖 Key Documents

1. **YOUR_3_ROLE_WORKFLOW.md** ⭐
   - Complete workflow explanation
   - Example sessions for each role
   - Full TASK_101 walkthrough
   
2. **ROLE_MAPPING.md**
   - Detailed role definitions
   - Exact files each role loads
   - Responsibilities and focus areas

3. **quick_reference/role_lookup.md**
   - Quick reference: Role → Files
   - Token efficiency stats
   - Usage examples

---

## 💡 Example Usage

### ARCHITECT Example:
```
You are an ARCHITECT working on TASK_101_Add_OTP_Verification.

Current users table (from SOT):
- id, email, password_hash, created_at, updated_at

Requirements from PRD:
- Add OTP two-factor authentication
- Users can enable/disable OTP

Create ED documents and migration file.
```

**Claude will:**
1. Load 7 relevant guideline files
2. Design the database schema changes
3. Write complete migration file (UP and DOWN)
4. Create ED_DB.md and ED_OTHER.md documents
5. Plan the implementation approach for WORKER

---

### WORKER Example:
```
You are a WORKER implementing TASK_101.

ARCHITECT provided:
- Migration applied ✓
- ED_OTHER.md specifies: POST /api/v1/auth/otp/enable

Implement the enableOTP feature.
```

**Claude will:**
1. Load 7 implementation-focused files
2. Create UserService.enableOTP() method
3. Create AuthController.enableOTP() endpoint
4. Create OTPValidator schema
5. Write unit and integration tests
6. Follow all code organization patterns

---

### REVIEWER Example:
```
You are a REVIEWER checking TASK_101 PR.

Files changed:
- services/user-service.js
- controllers/auth-controller.js
- validators/otp-validator.js
- tests/...

[paste code here]
```

**Claude will:**
1. Load 9 review-focused files
2. Check code organization
3. Verify naming conventions
4. Check error handling
5. Verify test coverage
6. Provide structured feedback with ✅ ⚠️ ❌

---

## ✅ What's Different from Before?

**Old System (11 generic roles):**
- Too many roles to choose from
- Some roles you'd never use
- Confusing which role to pick

**New System (3 roles matching your workflow):**
- ✅ Exactly matches your actual process
- ✅ Clear when to use each role
- ✅ Sequential workflow (ARCHITECT → WORKER → REVIEWER)
- ✅ Each role has specific deliverables

---

## 🎯 Quick Reference

| When? | Role | Command |
|-------|------|---------|
| Planning/Design | ARCHITECT | `You are an ARCHITECT. Design [TASK].` |
| Writing Code | WORKER | `You are a WORKER. Implement [TASK].` |
| Code Review | REVIEWER | `You are a REVIEWER. Check [PR].` |

---

## 📂 File Organization

**14 modular files instead of 1 huge file:**
- 10 core guidelines (200-1000 lines each)
- 4 quick references (100-200 lines each)

**Each role loads only what it needs:**
- ARCHITECT: 7 files (~2,500 lines)
- WORKER: 7 files (~2,800 lines)
- REVIEWER: 9 files (~3,000 lines)

---

## 🔄 Integration with Your System

```
Your Project Structure:

Source of Truth (SOT)
├── Product/
│   └── Features/Authentication.md      ← Current state
└── Tech/
    └── DB/users_table.md               ← Current schema

Tasks/
└── TASK_101/
    ├── PRD.md                          ← What to build
    ├── ED_DB.md                        ← ARCHITECT creates
    ├── ED_OTHER.md                     ← ARCHITECT creates
    └── MASTER.md

Guidelines/ ← THIS SYSTEM
├── ROLE_MAPPING.md                     ← How to use roles
└── [14 guideline files]                ← What to follow

Backend Code/
└── [Implemented by WORKER]
```

**Workflow:**
1. Read TASK PRD
2. **ARCHITECT** reads SOT + creates ED
3. **WORKER** reads ED + implements
4. **REVIEWER** checks implementation
5. After approval: Update SOT

---

## 🎓 Next Steps

1. **Read:** `YOUR_3_ROLE_WORKFLOW.md` (5 min read)
2. **Try:** Start with ARCHITECT on a simple task
3. **Practice:** Complete one full TASK through all 3 roles
4. **Reference:** Keep `role_lookup.md` handy

---

## ❓ FAQ

**Q: Can I combine roles?**
A: Yes! `You are an ARCHITECT and REVIEWER.` loads files from both.

**Q: What if I just have a quick question?**
A: No role needed. Just ask: "How do I name a database table?"

**Q: Can I add more guidelines?**
A: Yes! Add new .md files and update ROLE_MAPPING.md

**Q: Do I need to specify role every time?**
A: Yes, for best results. Role assignment ensures Claude loads the right context.

---

## 🎉 You're Ready!

Your system is:
✅ Modular (14 files, not 1)
✅ Role-based (3 roles matching your workflow)
✅ Efficient (38-48% token savings)
✅ Scalable (easy to update/extend)

**Start using it now:**
```
You are an ARCHITECT. Design my next feature.
```

---

**Questions?** Check `YOUR_3_ROLE_WORKFLOW.md` for detailed examples!
