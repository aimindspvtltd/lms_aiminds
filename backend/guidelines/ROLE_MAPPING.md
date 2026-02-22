# Role-Based Guidelines Mapping

This file defines which guideline files each role should access based on your team's workflow.

---

## Your Team's Workflow

```
TASK_101 Created
    ↓
ARCHITECT → Creates ED, designs DB schema, writes migration files
    ↓
WORKER → Implements according to ARCHITECT's plan
    ↓
REVIEWER → Reviews code, ensures standards compliance
    ↓
Merged & SOT Updated
```

---

## 🏗️ ARCHITECT (Technical Design & Planning)

**Purpose:** Create Engineering Design (ED) documents, design database schema changes, write migration files, plan the technical implementation

**Responsibilities:**
- Read current DB structure from Source of Truth
- Design new schema changes (tables, columns, indexes)
- Write migration files (UP and DOWN)
- Create ED documents outlining:
  - DB changes needed
  - API endpoints to be created
  - Code structure/architecture
  - Technical approach
- Plan how WORKER should implement the feature

**Access:**
- `02_database_guidelines.md` ⭐ (PRIMARY - Design DB schema)
- `05_migration_management.md` ⭐ (PRIMARY - Write migrations)
- `01_project_structure.md` (Plan folder/file structure)
- `03_api_design.md` (Design API endpoints)
- `04_code_organization.md` (Plan code architecture)
- `quick_reference/naming_conventions.md` (Ensure consistent naming)
- `quick_reference/checklist.md` (Migration checklist)

**Focus Areas:**
- Understanding current DB state
- Designing schema changes
- Writing migration scripts
- Creating comprehensive ED documents
- Planning implementation approach

**Example Usage:**
```
You are an ARCHITECT working on TASK_101_Add_OTP_Verification.

Current DB state (from SOT):
- users table has: id, email, password_hash, created_at, updated_at

Task requirements (from PRD):
- Add OTP-based two-factor authentication
- Keep existing email verification

Create:
1. ED_DB.md - Database changes needed
2. Migration file - SQL to add OTP columns
3. ED_OTHER.md - API endpoints and implementation plan
```

**ARCHITECT Output Example:**
```markdown
# TASK_101_ED_DB.md

## Current State (from SOT)
users table:
- id BIGSERIAL PRIMARY KEY
- email VARCHAR(255) NOT NULL
- password_hash VARCHAR(255) NOT NULL
- created_at TIMESTAMP NOT NULL
- updated_at TIMESTAMP NOT NULL

## Proposed Changes
Add columns for OTP verification:
- otp_secret VARCHAR(32) - Store TOTP secret
- otp_enabled BOOLEAN NOT NULL DEFAULT FALSE - OTP status
- otp_verified_at TIMESTAMP - When OTP was first verified

## Migration File
20250210104500_add_otp_columns_to_users.sql

## Indexes
- idx_users_otp_enabled (partial index on otp_enabled = true)

## Updated State (for SOT)
After migration, users table will have all current columns plus the 3 new OTP columns.
```

---

## 👨‍💻 WORKER (Implementation)

**Purpose:** Implement the feature according to ARCHITECT's plan and ED documents

**Responsibilities:**
- Read ED documents created by ARCHITECT
- Implement code following the technical plan
- Create controllers, services, repositories
- Write API endpoints as designed
- Follow code organization patterns
- Implement error handling
- Write code that passes REVIEWER checks

**Access:**
- `04_code_organization.md` ⭐ (PRIMARY - How to structure code)
- `03_api_design.md` (Implement API endpoints)
- `06_error_handling.md` (Implement error handling)
- `08_security_guidelines.md` (Implement securely)
- `01_project_structure.md` (Where to put files)
- `quick_reference/common_patterns.md` (Code patterns to follow)
- `quick_reference/naming_conventions.md` (Naming rules)

**Focus Areas:**
- Following ARCHITECT's technical design
- Implementing layered architecture (Controller → Service → Repository)
- Writing clean, maintainable code
- Proper error handling
- Security best practices

**Example Usage:**
```
You are a WORKER implementing TASK_101_Add_OTP_Verification.

ARCHITECT has provided:
- ED_DB.md (DB changes - migration already written and applied)
- ED_OTHER.md (API endpoints to create: POST /api/v1/auth/otp/enable, POST /api/v1/auth/otp/verify)

Implement:
1. UserService.enableOTP() method
2. UserService.verifyOTP() method
3. AuthController.enableOTP() endpoint
4. AuthController.verifyOTP() endpoint
5. OTPValidator schema
```

**WORKER Output Example:**
```javascript
// services/user-service.js
class UserService {
  async enableOTP(userId) {
    // 1. Get user
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    
    // 2. Generate OTP secret
    const secret = generateOTPSecret();
    
    // 3. Update user
    await this.userRepo.update(userId, {
      otp_secret: secret,
      otp_enabled: false // Not enabled until verified
    });
    
    // 4. Generate QR code
    const qrCode = generateQRCode(user.email, secret);
    
    return { secret, qrCode };
  }
}
```

---

## 🔍 REVIEWER (Code Review & Quality Assurance)

**Purpose:** Review pull requests, ensure code quality, verify standards compliance

**Responsibilities:**
- Review WORKER's implementation
- Check code follows ARCHITECT's design
- Verify naming conventions
- Check error handling
- Verify tests exist and pass
- Check commit messages
- Ensure documentation is updated
- Verify migration was applied correctly

**Access:**
- `quick_reference/checklist.md` ⭐ (PRIMARY - Review checklist)
- `quick_reference/naming_conventions.md` ⭐ (PRIMARY - Verify naming)
- `quick_reference/common_patterns.md` (Verify patterns)
- `04_code_organization.md` (Check architecture)
- `06_error_handling.md` (Check error handling)
- `07_testing_standards.md` (Verify tests)
- `10_version_control.md` (Check commits)
- `02_database_guidelines.md` (Verify DB changes if any)
- `03_api_design.md` (Check API conventions)

**Focus Areas:**
- Code quality and maintainability
- Standards compliance
- Test coverage
- Security concerns
- Documentation completeness

**Example Usage:**
```
You are a REVIEWER checking TASK_101_Add_OTP_Verification PR.

Files changed:
- services/user-service.js (added enableOTP, verifyOTP)
- controllers/auth-controller.js (added endpoints)
- validators/otp-validator.js (new file)
- tests/unit/services/user-service.test.js (new tests)

Review against:
- Code organization standards
- Error handling patterns
- Naming conventions
- Test coverage requirements
```

**REVIEWER Output Example:**
```
PR Review: TASK_101_Add_OTP_Verification

✅ Code Organization:
- Service layer properly separated
- Repository pattern followed
- Controller is thin and delegates to service

✅ Error Handling:
- Throws NotFoundError when user doesn't exist
- Throws ValidationError for invalid OTP
- Custom errors used correctly

✅ Naming Conventions:
- Methods use camelCase: enableOTP(), verifyOTP()
- Variables follow standards
- File names follow kebab-case

⚠️ Testing:
- Unit tests present (good)
- Missing integration test for /auth/otp/enable endpoint
- Test coverage: 85% (meets minimum 80%)

❌ Issues Found:
1. Missing input validation in enableOTP (should check if already enabled)
2. QR code generation not tested
3. Missing JSDoc comments on new methods

Recommendation: Request changes - fix validation and add comments before merge.
```

---

## Quick Reference Matrix

| Role | Primary Files | Secondary Files | Quick Refs |
|------|--------------|-----------------|------------|
| **ARCHITECT** | 02, 05 | 01, 03, 04 | naming, checklist |
| **WORKER** | 04 | 03, 06, 08, 01 | common_patterns, naming |
| **REVIEWER** | checklist, naming, patterns | 04, 06, 07, 10, 02, 03 | all 3 |

**File Number Reference:**
- 01 = Project Structure
- 02 = Database Guidelines
- 03 = API Design
- 04 = Code Organization
- 05 = Migration Management
- 06 = Error Handling
- 07 = Testing Standards
- 08 = Security Guidelines
- 09 = Documentation
- 10 = Version Control

---

## Workflow Example

### Complete TASK_101 Flow

**1. ARCHITECT Phase:**
```
You are an ARCHITECT. Design TASK_101_Add_OTP_Verification.

Requirements from PRD:
- Add two-factor authentication using OTP
- Users can enable/disable OTP
- Keep existing email verification
```

**ARCHITECT delivers:**
- `TASK_101_ED_DB.md` - DB schema changes
- `20250210104500_add_otp_columns_to_users.sql` - Migration file
- `TASK_101_ED_OTHER.md` - API design and implementation plan

---

**2. WORKER Phase:**
```
You are a WORKER implementing TASK_101.

ARCHITECT provided:
- Migration applied ✓
- ED documents with API design ✓

Implement the code as designed.
```

**WORKER delivers:**
- `services/user-service.js` - Business logic
- `controllers/auth-controller.js` - Endpoints
- `validators/otp-validator.js` - Validation
- `tests/` - Unit and integration tests

---

**3. REVIEWER Phase:**
```
You are a REVIEWER. Check TASK_101 PR.

Files changed:
- services/user-service.js
- controllers/auth-controller.js
- validators/otp-validator.js
- tests/unit/services/user-service.test.js
- tests/integration/api/auth.test.js
```

**REVIEWER delivers:**
- Code review feedback
- Approval or requested changes
- Verification checklist completed

---

## Token Efficiency

### ARCHITECT (Design Phase)
- Files loaded: 7 files
- Total lines: ~2,500
- Token usage: ~6,250 tokens
- **Savings: 48% vs loading all**

### WORKER (Implementation Phase)
- Files loaded: 7 files
- Total lines: ~2,800
- Token usage: ~7,000 tokens
- **Savings: 42% vs loading all**

### REVIEWER (Review Phase)
- Files loaded: 9 files
- Total lines: ~3,000
- Token usage: ~7,500 tokens
- **Savings: 38% vs loading all**

**Baseline:** Loading all 14 files = ~4,800 lines ≈ 12,000 tokens

---

## Usage Instructions

### For Claude

When user assigns a role:

```
User: "You are an ARCHITECT. Design the schema for user profiles."

Claude's Process:
1. Identify role: ARCHITECT
2. Load files:
   - 02_database_guidelines.md
   - 05_migration_management.md
   - 01_project_structure.md
   - 03_api_design.md
   - 04_code_organization.md
   - quick_reference/naming_conventions.md
   - quick_reference/checklist.md
3. Create ED documents and migration files
4. Provide comprehensive technical design
```

### For Developers

Assign role based on current phase:

**Planning/Design:**
```
You are an ARCHITECT. Design [feature].
```

**Implementation:**
```
You are a WORKER. Implement [feature] according to the ED.
```

**Code Review:**
```
You are a REVIEWER. Check this PR for [feature].
```

---

## Combined Roles

You can combine roles when needed:

```
You are an ARCHITECT and REVIEWER. Review this DB schema design.
→ Loads: ARCHITECT files + REVIEWER files (deduplicated)
```

---

## Notes

- ⭐ = Primary file (most critical for this role)
- Each role focuses on specific phase of development
- Roles work sequentially: ARCHITECT → WORKER → REVIEWER
- Source of Truth (SOT) is updated after REVIEWER approval
- ARCHITECT reads current SOT, WORKER implements changes, REVIEWER verifies
