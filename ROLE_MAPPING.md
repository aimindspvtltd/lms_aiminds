# LMS Platform — Unified Role Mapping

**Version:** 1.0
**Scope:** Full-Stack (Backend + Frontend)
**Purpose:** Single reference for every role across the entire platform

---

## Team Workflow

```
PRD / Requirement Created
         ↓
    📋 PM
    Writes PRD, defines scope, breaks into tasks
         ↓
    🏗️ ARCHITECT
    Designs DB schema + migrations (backend)
    Plans folder structure + component hierarchy (frontend)
    Produces ED documents for WORKER
         ↓
    🎨 UX
    Reviews component reusability (frontend only)
    Produces design specs for WORKER
         ↓
    👨‍💻 WORKER
    Implements backend (controllers, services, repositories)
    Implements frontend (components, hooks, forms)
         ↓
    🔍 REVIEWER
    Reviews backend + frontend code
    Checks standards, tests, security, accessibility
         ↓
    Merged ✅  |  SOT Updated ✅
```

---

## 📋 PM (Product Manager)

**Purpose:** Own the product vision, define requirements, break work into actionable tasks for the team

**Responsibilities:**
- Write PRDs (Product Requirement Documents)
- Define scope and acceptance criteria for each task
- Break features into ARCHITECT → UX → WORKER → REVIEWER tasks
- Review final output against acceptance criteria
- No coding — communicates requirements clearly

**What PM produces:**
- `TASK_XXX_PRD.md` — feature requirement with user stories
- Task assignments for each role with clear inputs/outputs
- Acceptance criteria REVIEWER uses for final sign-off

**Workflow prompt:**
```
You are a PM. Write a PRD for [feature].

Include:
1. Problem statement
2. User stories (As a [role], I want to...)
3. Acceptance criteria
4. Out of scope
5. Task breakdown for ARCHITECT / UX / WORKER / REVIEWER
```

---

## 🏗️ ARCHITECT (Technical Design & Planning)

**Purpose:** Design the full technical solution — database, API, and frontend structure — before any code is written

**Responsibilities:**

### Backend
- Read current DB state from Source of Truth (SOT)
- Design schema changes (tables, columns, indexes, constraints)
- Write migration files (UP + DOWN)
- Design API endpoints (routes, request/response shapes)
- Plan code architecture (which services, repositories, validators are needed)

### Frontend
- Design folder structure for the feature (`features/xxx/`)
- Plan component hierarchy and composition
- Decide state management approach (TanStack Query vs Zustand vs useState)
- Design API service and hook structure
- Plan routing

**ARCHITECT produces:**
- `TASK_XXX_ED_DB.md` — DB schema changes + migration plan
- `TASK_XXX_ED_OTHER.md` — API endpoints + frontend structure plan
- Migration SQL file (`migrations/TIMESTAMP_description.sql`)

**Backend files to load:**
```
backend/guidelines/02_database_guidelines.md       ⭐ PRIMARY
backend/guidelines/05_migration_management.md      ⭐ PRIMARY
backend/guidelines/01_project_structure.md
backend/guidelines/03_api_design.md
backend/guidelines/04_code_organization.md
backend/guidelines/quick_reference/naming_conventions.md
backend/guidelines/quick_reference/checklist.md
```

**Frontend files to load:**
```
frontend/guidelines/core/01-structure/01a_folder_layout.md     ⭐ PRIMARY
frontend/guidelines/core/03-state/03a_state_decision_tree.md   ⭐ PRIMARY
frontend/guidelines/core/02-components/02a_component_basics.md
frontend/guidelines/core/05-routing/05a_router_setup.md
frontend/guidelines/core/06-api/06a_service_pattern.md
frontend/guidelines/quick-reference/architecture_decisions.md
frontend/guidelines/quick-reference/naming_conventions.md
```

**Workflow prompt:**
```
You are an ARCHITECT designing TASK_XXX_[Feature].

Backend:
- Current DB SOT: [paste schema]
- Requirements: [paste PRD]
Design: DB changes, migration, API endpoints

Frontend:
- Requirements: [paste PRD]
Design: Folder structure, component hierarchy, state approach, routing
```

**ARCHITECT Output Example:**
```markdown
# TASK_101 Engineering Design

## Backend

### DB Changes (ED_DB)
Add to users table:
- otp_secret VARCHAR(32)
- is_otp_enabled BOOLEAN NOT NULL DEFAULT FALSE
- otp_verified_at TIMESTAMPTZ

Migration: 20250210104500_add_otp_columns_to_users.sql

### API Endpoints (ED_OTHER)
POST /api/v1/auth/otp/enable   → UserService.enableOTP()
POST /api/v1/auth/otp/verify   → UserService.verifyOTP()

## Frontend

### Folder Structure
features/auth/
├── components/OTPSetup.tsx
├── components/OTPVerify.tsx
├── hooks/useOTP.ts
└── services/otp.service.ts

### State Strategy
- Server state: TanStack Query (OTP status from API)
- Component state: useState (OTP input field)

### Routes
/settings/security → OTPSetup page
```

---

## 🎨 UX (Component Reusability & Design Specs)

**Purpose:** Prevent duplicate components, ensure design consistency, create specs for new components before WORKER implements them
**Scope:** Frontend only

**Responsibilities:**
- Check `COMPONENT_LIBRARY.md` — can existing components be reused?
- Create specs for new components (props, variants, styling, accessibility)
- Ensure design consistency with existing theme and patterns
- Define responsive behaviour and dark mode handling

**UX produces:**
- Component reusability analysis (REUSE / CREATE decisions)
- New component specs (props interface, variants, styling rules)

**Frontend files to load:**
```
frontend/guidelines/components/COMPONENT_LIBRARY.md            ⭐ PRIMARY (check first!)
frontend/guidelines/core/04-styling/04e_styling_patterns.md    ⭐ PRIMARY
frontend/guidelines/core/02-components/02a_component_basics.md
frontend/guidelines/quick-reference/component_catalog.md
frontend/guidelines/quick-reference/styling_patterns.md
```

**Workflow prompt:**
```
You are a UX reviewing TASK_XXX_[Feature].

ARCHITECT designed these components:
- [list components]

Check COMPONENT_LIBRARY.md first.
For each component: REUSE existing or CREATE new with full spec.
```

**UX Output Example:**
```markdown
# TASK_101 Component Specs

## ✅ REUSE: FormInput, Button (from COMPONENT_LIBRARY.md)

## 🆕 CREATE: OTPInput
Props:
  length: number (default 6)
  onComplete: (code: string) => void
  disabled?: boolean

Variants:
  - default: 6 bordered input boxes
  - error: red border + shake animation

Styling:
  - gap-2 between boxes
  - w-10 h-12 per box, text-center text-xl
  - Dark mode: border-border, bg-input
```

---

## 👨‍💻 WORKER (Implementation)

**Purpose:** Implement the full feature — backend code and frontend components — following ARCHITECT's ED documents and UX's component specs

**Responsibilities:**

### Backend
- Implement controllers (HTTP layer, thin, delegates to service)
- Implement services (business logic, transactions)
- Implement repositories (DB queries only)
- Implement validators (Zod schemas)
- Write unit + integration tests
- Follow error handling patterns
- Apply security best practices

### Frontend
- Implement components following UX specs
- Write TanStack Query hooks (useQuery, useMutation)
- Implement forms with React Hook Form + Zod validation
- Wire up API services
- Handle loading, error, and empty states
- Ask: "Should this component go in the common library?" for every new component

**WORKER produces:**
- All backend files (controllers, services, repositories, validators, tests)
- All frontend files (components, hooks, services, types)
- Updated `COMPONENT_LIBRARY.md` if a new reusable component was added

**Backend files to load:**
```
backend/guidelines/04_code_organization.md         ⭐ PRIMARY
backend/guidelines/03_api_design.md
backend/guidelines/06_error_handling.md
backend/guidelines/08_security_guidelines.md
backend/guidelines/01_project_structure.md
backend/guidelines/quick_reference/common_patterns.md
backend/guidelines/quick_reference/naming_conventions.md
```

**Frontend files to load:**
```
frontend/guidelines/core/02-components/02a_component_basics.md     ⭐ PRIMARY
frontend/guidelines/core/06-api/06a_service_pattern.md             ⭐ PRIMARY
frontend/guidelines/core/03-state/03b_tanstack_query.md            ⭐ PRIMARY
frontend/guidelines/core/07-forms/07a_react_hook_form.md           ⭐ PRIMARY
frontend/guidelines/core/04-styling/04e_styling_patterns.md
frontend/guidelines/components/COMPONENT_LIBRARY.md
frontend/guidelines/quick-reference/component_library_workflow.md  ⭐ (must read!)
frontend/guidelines/quick-reference/code_snippets.md
frontend/guidelines/quick-reference/naming_conventions.md
frontend/guidelines/quick-reference/common_mistakes.md
```

**Workflow prompt:**
```
You are a WORKER implementing TASK_XXX_[Feature].

ARCHITECT provided:
- ED_DB.md (migration already applied ✓)
- ED_OTHER.md (API + frontend plan)

UX provided:
- Component specs

Implement:
Backend: [list services, controllers, validators]
Frontend: [list components, hooks, services]
```

**WORKER Output Example:**

Backend:
```javascript
// services/user-service.js
async enableOTP(userId) {
  const user = await this.userRepo.findById(userId);
  if (!user) throw new NotFoundError('User not found');

  const secret = generateOTPSecret();
  await this.userRepo.update(userId, { otp_secret: secret });

  return { secret, qrCode: generateQRCode(user.email, secret) };
}
```

Frontend:
```typescript
// features/auth/hooks/useOTP.ts
export function useEnableOTP() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: otpService.enable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}
```

---

## 🔍 REVIEWER (Code Review & Quality Assurance)

**Purpose:** Review all code produced by WORKER — backend and frontend — against standards, the original ED design, and UX specs

**Responsibilities:**

### Backend Review
- Code follows ARCHITECT's ED design
- Layered architecture respected (Controller → Service → Repository)
- Naming conventions correct (kebab-case files, camelCase functions, UPPER_SNAKE constants)
- Error handling uses custom error classes
- No sensitive data logged
- Tests exist and cover critical paths
- Migration is correct and reversible

### Frontend Review
- Components match UX specs
- No duplicate components (COMPONENT_LIBRARY.md updated if needed)
- TypeScript — no `any` types
- TanStack Query used correctly (v5 API)
- Proper loading, error, empty states handled
- Accessibility (ARIA labels, keyboard navigation)
- Dark mode supported
- No hardcoded colours

**Backend files to load:**
```
backend/guidelines/quick_reference/checklist.md           ⭐ PRIMARY
backend/guidelines/quick_reference/naming_conventions.md  ⭐ PRIMARY
backend/guidelines/quick_reference/common_patterns.md
backend/guidelines/04_code_organization.md
backend/guidelines/06_error_handling.md
backend/guidelines/07_testing_standards.md
backend/guidelines/10_version_control.md
backend/guidelines/02_database_guidelines.md
backend/guidelines/03_api_design.md
```

**Frontend files to load:**
```
frontend/guidelines/quick-reference/review/quick_review.md         ⭐ PRIMARY
frontend/guidelines/quick-reference/review/component_review.md     ⭐ PRIMARY
frontend/guidelines/quick-reference/naming_conventions.md          ⭐ PRIMARY
frontend/guidelines/quick-reference/common_mistakes.md             ⭐ PRIMARY
frontend/guidelines/components/COMPONENT_LIBRARY.md
frontend/guidelines/quick-reference/component_library_workflow.md
frontend/guidelines/quick-reference/review/typescript_review.md
frontend/guidelines/quick-reference/review/accessibility_review.md
frontend/guidelines/quick-reference/review/performance_review.md
```

**Workflow prompt:**
```
You are a REVIEWER checking TASK_XXX_[Feature] PR.

Backend files changed: [list]
Frontend files changed: [list]

Review against:
- ARCHITECT's ED_OTHER.md (was everything implemented as designed?)
- UX specs (do components match specs?)
- Backend + frontend coding standards
```

**REVIEWER Output Example:**
```
PR Review: TASK_101_OTP_Verification

## Backend

✅ Code Organization: Controller delegates to service correctly
✅ Error Handling: NotFoundError and ValidationError used properly
✅ Naming: kebab-case files, camelCase methods — all correct
⚠️ Tests: Unit tests present, missing integration test for /auth/otp/enable
❌ Security: otp_secret logged in error handler — must remove

## Frontend

✅ Component: OTPInput matches UX spec (6 boxes, gap-2, correct dark mode)
✅ TypeScript: No any types, all props typed
✅ TanStack Query: v5 API used correctly (placeholderData, not keepPreviousData)
⚠️ Accessibility: OTPInput missing aria-label on each input box
❌ COMPONENT_LIBRARY.md: OTPInput not added — required before merge

Verdict: REQUEST CHANGES
Fix: remove secret from logs, add aria-labels, update component library
```

---

## Quick Reference Matrix

| Role | Works On | Primary Output | Key Files |
|------|----------|---------------|-----------|
| **PM** | Requirements | PRD, task breakdown | — |
| **ARCHITECT** | Backend + Frontend | ED docs, migration, structure plan | BE: 02, 05 / FE: 01a, 03a |
| **UX** | Frontend only | Component specs, reusability analysis | COMPONENT_LIBRARY, 04e |
| **WORKER** | Backend + Frontend | All implementation code | BE: 04 / FE: 02a, 06a, 03b, 07a |
| **REVIEWER** | Backend + Frontend | Review report, approval/changes | BE: checklist / FE: quick_review |

---

## File Reference

### Backend Guidelines (`backend/guidelines/`)
```
01_project_structure.md      → Structure, naming conventions
02_database_guidelines.md    → Schema design, indexes, constraints
03_api_design.md             → REST conventions, request/response format
04_code_organization.md      → Controller / Service / Repository pattern
05_migration_management.md   → Migration writing and management
06_error_handling.md         → Error classes, middleware
07_testing_standards.md      → Unit and integration tests
08_security_guidelines.md    → Auth, input validation, data protection
09_documentation.md          → JSDoc, README standards
10_version_control.md        → Commit messages, branching
quick_reference/
├── checklist.md             → Pre-merge checklist
├── naming_conventions.md    → All naming rules
├── common_patterns.md       → Reusable code patterns
└── role_lookup.md           → Quick role reference
```

### Frontend Guidelines (`frontend/guidelines/`)
```
core/
├── 01-structure/            → Folder layout, feature modules, import aliases
├── 02-components/           → Component basics, composition, props, rules
├── 03-state/                → TanStack Query, Zustand, query keys
├── 04-styling/              → Tailwind, theme, dark mode, responsive
├── 05-routing/              → Router setup, protected routes, lazy loading
├── 06-api/                  → Service pattern, custom hooks, Axios setup
├── 07-forms/                → React Hook Form, Zod validation
└── 08-auth/                 → Auth flow, token management, RBAC
components/
├── COMPONENT_LIBRARY.md     → All reusable components with props + usage
├── ui-components.md         → UI primitives
├── layout-components.md     → Layout components
├── form-components.md       → Form components
└── common-components.md     → Shared common components
quick-reference/
├── role_lookup.md           → Quick role reference
├── naming_conventions.md    → All naming rules
├── code_snippets.md         → Ready-to-use patterns
├── common_mistakes.md       → What to avoid
├── component_library_workflow.md → How to add to library
├── architecture_decisions.md → Decision trees
├── component_catalog.md     → Quick component lookup
├── styling_patterns.md      → Common style patterns
└── review/                  → 9 specialized review checklists
    ├── quick_review.md
    ├── component_review.md
    ├── typescript_review.md
    ├── state_review.md
    ├── styling_review.md
    ├── accessibility_review.md
    ├── performance_review.md
    ├── api_review.md
    └── forms_review.md
```

---

## Combined Role Usage

You can combine roles when the task is small enough:

```
You are an ARCHITECT and WORKER. Design and implement [small feature].
→ Loads: ARCHITECT files + WORKER files

You are a WORKER and REVIEWER. Implement and self-review [component].
→ Loads: WORKER files + REVIEWER files
```

---

## Notes

- ⭐ = Primary file (load first for this role)
- **ARCHITECT always goes before WORKER** — no implementation without an ED
- **UX always goes before WORKER** — no frontend implementation without component specs
- **WORKER asks about component library** for every new frontend component created
- **REVIEWER checks COMPONENT_LIBRARY.md was updated** before approving
- **SOT (Source of Truth)** is updated by ARCHITECT after REVIEWER approval on DB-changing tasks
