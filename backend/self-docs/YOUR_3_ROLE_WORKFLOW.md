# Your 3-Role Workflow System

**Version:** 1.0  
**Last Updated:** February 2025

---

## 🎯 Your Workflow

```
TASK Created (e.g., TASK_101_Add_OTP_Verification)
    ↓
┌────────────────────────────────────────┐
│ ARCHITECT (Design & Planning)          │
│ - Reads current DB from SOT            │
│ - Designs schema changes               │
│ - Writes migration files               │
│ - Creates ED documents                 │
└────────────────────────────────────────┘
    ↓ Delivers: ED_DB.md, ED_OTHER.md, migrations
┌────────────────────────────────────────┐
│ WORKER (Implementation)                │
│ - Reads ED documents                   │
│ - Implements code as designed          │
│ - Follows architecture patterns        │
│ - Writes tests                         │
└────────────────────────────────────────┘
    ↓ Delivers: Code, Tests
┌────────────────────────────────────────┐
│ REVIEWER (Quality Assurance)           │
│ - Reviews code quality                 │
│ - Checks standards compliance          │
│ - Verifies tests                       │
│ - Approves or requests changes         │
└────────────────────────────────────────┘
    ↓ Approved
Source of Truth (SOT) Updated
```

---

## 🏗️ Role 1: ARCHITECT

### What ARCHITECT Does

**Input:**
- Task PRD (requirements)
- Current DB state from SOT

**Responsibilities:**
1. **Read Current State:** Check SOT to understand current DB schema
2. **Design Schema Changes:** Plan what columns/tables to add/modify
3. **Write Migration Files:** Create SQL migration scripts (UP and DOWN)
4. **Create ED_DB.md:** Document database changes
5. **Create ED_OTHER.md:** Plan API endpoints and implementation approach
6. **Plan Architecture:** Outline how WORKER should structure the code

**Output:**
- `TASK_XXX_ED_DB.md` - Database design document
- `YYYYMMDDHHMMSS_description.sql` - Migration file
- `TASK_XXX_ED_OTHER.md` - API design and implementation plan

**Files Claude Loads:**
```
1. 02_database_guidelines.md      ⭐ (Schema design rules)
2. 05_migration_management.md     ⭐ (How to write migrations)
3. 01_project_structure.md        (File organization)
4. 03_api_design.md               (API endpoint design)
5. 04_code_organization.md        (Architecture patterns)
6. quick_reference/naming_conventions.md
7. quick_reference/checklist.md
```

### Example ARCHITECT Session

```
You are an ARCHITECT working on TASK_101_Add_OTP_Verification.

Current DB (from SOT):
users table:
- id BIGSERIAL PRIMARY KEY
- email VARCHAR(255) NOT NULL
- password_hash VARCHAR(255) NOT NULL
- created_at TIMESTAMP NOT NULL
- updated_at TIMESTAMP NOT NULL

Requirements (from PRD):
- Add OTP two-factor authentication
- Users can enable/disable OTP
- Store OTP secret securely

Design the database changes and create migration file.
```

**ARCHITECT Response:**
```
# TASK_101_ED_DB.md

## Current State
[Lists current schema from SOT]

## Proposed Changes
Add 3 columns to users table:
- otp_secret VARCHAR(32) - Stores TOTP secret
- otp_enabled BOOLEAN DEFAULT FALSE - OTP status
- otp_verified_at TIMESTAMP - First verification timestamp

## Migration
File: 20250210104500_add_otp_columns_to_users.sql

## Indexes
- idx_users_otp_enabled (partial, WHERE otp_enabled = true)

## Migration Script:
[Provides complete SQL migration with UP and DOWN]
```

---

## 👨‍💻 Role 2: WORKER

### What WORKER Does

**Input:**
- ED documents from ARCHITECT
- Migration already applied to DB

**Responsibilities:**
1. **Read ED Documents:** Understand the technical design
2. **Follow Architecture:** Implement using Controller → Service → Repository pattern
3. **Write Code:** Create the actual implementation
4. **Handle Errors:** Use proper error handling patterns
5. **Write Tests:** Unit and integration tests
6. **Follow Standards:** Naming conventions, code patterns

**Output:**
- `services/xxx-service.js` - Business logic
- `controllers/xxx-controller.js` - API endpoints
- `repositories/xxx-repository.js` - DB queries (if new)
- `validators/xxx-validator.js` - Input validation
- `tests/unit/` - Unit tests
- `tests/integration/` - Integration tests

**Files Claude Loads:**
```
1. 04_code_organization.md        ⭐ (Layered architecture)
2. 03_api_design.md               (API implementation)
3. 06_error_handling.md           (Error patterns)
4. 08_security_guidelines.md      (Security)
5. 01_project_structure.md        (Where to put files)
6. quick_reference/common_patterns.md
7. quick_reference/naming_conventions.md
```

### Example WORKER Session

```
You are a WORKER implementing TASK_101_Add_OTP_Verification.

ARCHITECT has provided:
- Migration applied ✓ (otp_secret, otp_enabled, otp_verified_at added)
- ED_OTHER.md specifies:
  - POST /api/v1/auth/otp/enable - Enable OTP for user
  - POST /api/v1/auth/otp/verify - Verify OTP code

Implement:
1. UserService methods (enableOTP, verifyOTP)
2. AuthController endpoints
3. OTPValidator schema
4. Unit tests
```

**WORKER Response:**
```javascript
// services/user-service.js
async enableOTP(userId) {
  const user = await this.userRepo.findById(userId);
  if (!user) throw new NotFoundError('User not found');
  
  const secret = generateOTPSecret();
  await this.userRepo.update(userId, {
    otp_secret: secret,
    otp_enabled: false  // Enabled after first verification
  });
  
  const qrCode = generateQRCode(user.email, secret);
  return { secret, qrCode };
}

// controllers/auth-controller.js
async enableOTP(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await this.userService.enableOTP(userId);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
}

// validators/otp-validator.js
const EnableOTPSchema = z.object({
  // Schema definition
});

// tests/unit/services/user-service.test.js
describe('enableOTP', () => {
  it('should generate OTP secret for user', async () => {
    // Test implementation
  });
});
```

---

## 🔍 Role 3: REVIEWER

### What REVIEWER Does

**Input:**
- Pull Request with code changes
- ARCHITECT's ED documents (for context)

**Responsibilities:**
1. **Check Code Quality:** Clean, maintainable, follows patterns
2. **Verify Standards:** Naming conventions, file structure
3. **Check Architecture:** Follows layered pattern
4. **Verify Error Handling:** Proper use of custom errors
5. **Check Tests:** Adequate coverage, tests pass
6. **Verify Security:** No vulnerabilities
7. **Check Commits:** Proper commit messages
8. **Approve or Request Changes**

**Output:**
- Code review comments
- Checklist verification
- Approval ✓ or Request Changes ✗

**Files Claude Loads:**
```
1. quick_reference/checklist.md           ⭐ (Review checklist)
2. quick_reference/naming_conventions.md  ⭐ (Naming rules)
3. quick_reference/common_patterns.md     (Expected patterns)
4. 04_code_organization.md                (Architecture check)
5. 06_error_handling.md                   (Error patterns)
6. 07_testing_standards.md                (Test requirements)
7. 10_version_control.md                  (Git standards)
8. 02_database_guidelines.md              (If DB changes)
9. 03_api_design.md                       (API standards)
```

### Example REVIEWER Session

```
You are a REVIEWER checking TASK_101_Add_OTP_Verification PR.

Files changed:
- services/user-service.js (added enableOTP, verifyOTP)
- controllers/auth-controller.js (added 2 endpoints)
- validators/otp-validator.js (new file)
- tests/unit/services/user-service.test.js (tests added)

Review for:
- Code organization
- Error handling
- Naming conventions
- Test coverage
- Security issues
```

**REVIEWER Response:**
```
PR Review: TASK_101_Add_OTP_Verification

✅ PASSED: Code Organization
- Proper service layer separation
- Controller delegates to service correctly
- Repository pattern not needed (uses existing UserRepository)

✅ PASSED: Error Handling
- NotFoundError for missing user ✓
- ValidationError for invalid OTP ✓
- Custom errors used correctly ✓

✅ PASSED: Naming Conventions
- Files: kebab-case ✓
- Methods: camelCase (enableOTP, verifyOTP) ✓
- Variables: camelCase ✓

✅ PASSED: Security
- OTP secret properly generated ✓
- No plain text storage ✓
- Input validation present ✓

⚠️ WARNING: Testing
- Unit tests: Present ✓
- Integration tests: Missing for /auth/otp/enable endpoint
- Coverage: 82% (meets 80% minimum) ✓

❌ ISSUES:
1. Missing validation: Should check if OTP already enabled
2. Missing JSDoc comments on new methods
3. QR code generation not unit tested

Recommendation: REQUEST CHANGES
- Add validation for already-enabled check
- Add JSDoc comments
- Add integration test for endpoint
- Consider adding QR code test
```

---

## 🔄 Complete Example Workflow

### Phase 1: ARCHITECT

```bash
# Session starts
User: You are an ARCHITECT. Design TASK_101_Add_OTP_Verification.

Current DB (users table):
- id, email, password_hash, created_at, updated_at

Requirements:
- Add OTP 2FA
- Users enable/disable OTP
```

**ARCHITECT Delivers:**
1. `TASK_101_ED_DB.md`
2. `20250210104500_add_otp_columns_to_users.sql`
3. `TASK_101_ED_OTHER.md`

### Phase 2: Apply Migration

```bash
# DBA or DevOps applies migration
psql -d mydb -f migrations/20250210104500_add_otp_columns_to_users.sql
```

### Phase 3: WORKER

```bash
# Session starts
User: You are a WORKER. Implement TASK_101 according to ED documents.

[Provides ED_DB.md and ED_OTHER.md content]
```

**WORKER Delivers:**
1. `services/user-service.js` (with enableOTP, verifyOTP)
2. `controllers/auth-controller.js` (endpoints)
3. `validators/otp-validator.js`
4. `tests/unit/services/user-service.test.js`
5. `tests/integration/api/auth.test.js`

### Phase 4: REVIEWER

```bash
# Session starts
User: You are a REVIEWER. Review TASK_101 PR.

Files:
- services/user-service.js
- controllers/auth-controller.js
- validators/otp-validator.js
- tests/...

[Provides code]
```

**REVIEWER Delivers:**
- Review feedback
- Issues list
- Approval or change requests

### Phase 5: Update SOT

After REVIEWER approves and PR merges:

```markdown
# Tech/DB/users_table.md (SOT updated)

Current State:
- id BIGSERIAL PRIMARY KEY
- email VARCHAR(255) NOT NULL
- password_hash VARCHAR(255) NOT NULL
- otp_secret VARCHAR(32)              ← Added TASK_101
- otp_enabled BOOLEAN DEFAULT FALSE   ← Added TASK_101
- otp_verified_at TIMESTAMP           ← Added TASK_101
- created_at TIMESTAMP NOT NULL
- updated_at TIMESTAMP NOT NULL

Last Updated: TASK_101 (2025-02-10)
```

---

## 📊 Token Efficiency

| Role | Files Loaded | Token Usage | Savings |
|------|--------------|-------------|---------|
| ARCHITECT | 7 files (~2,500 lines) | ~6,250 | 48% ✅ |
| WORKER | 7 files (~2,800 lines) | ~7,000 | 42% ✅ |
| REVIEWER | 9 files (~3,000 lines) | ~7,500 | 38% ✅ |

**vs Loading All:** ~12,000 tokens

---

## 💡 Usage Tips

### For ARCHITECT
- Always read current SOT before designing
- Write complete UP and DOWN migrations
- Be specific in ED documents for WORKER
- Include indexes and constraints in design

### For WORKER
- Read ED documents thoroughly first
- Ask ARCHITECT if design is unclear
- Follow patterns from common_patterns.md
- Write tests as you implement

### For REVIEWER
- Use checklist.md systematically
- Be constructive in feedback
- Reference specific guideline sections
- Check both code AND tests

---

## 🎯 Quick Commands

**Start as ARCHITECT:**
```
You are an ARCHITECT. Design [TASK_ID].
```

**Start as WORKER:**
```
You are a WORKER. Implement [TASK_ID] according to the ED.
```

**Start as REVIEWER:**
```
You are a REVIEWER. Check this PR for [TASK_ID].
```

---

## ✅ Success Criteria

**ARCHITECT Success:**
- ✓ ED documents are clear and complete
- ✓ Migration has UP and DOWN
- ✓ Migration tested locally
- ✓ WORKER can implement without questions

**WORKER Success:**
- ✓ Code follows ED design
- ✓ All patterns followed
- ✓ Tests written and passing
- ✓ No security issues

**REVIEWER Success:**
- ✓ Code meets all standards
- ✓ Tests adequate
- ✓ Documentation updated
- ✓ Ready to merge

---

**Ready to use! Just assign the role and Claude will load the right guidelines automatically.** 🚀
