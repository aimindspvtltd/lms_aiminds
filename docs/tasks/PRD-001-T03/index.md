# PRD-001-T03: Admin Auth API (Login + Register + JWT Filter)

**PRD:** [docs/prds/PRD-001_foundation_admin_auth.md](../../prds/PRD-001_foundation_admin_auth.md)
**Status:** Pending
**Created:** 2026-02-21

---

## Assignees

| Role      | Name |
|-----------|------|
| ARCHITECT | —    |
| UX        | N/A (backend only) |
| WORKER    | —    |
| REVIEWER  | —    |

---

## What Needs to Be Done

Implement the two auth endpoints needed for admin access — login (email + password → JWT)
and register (admin-initiated user creation for any role). Wire the JWT validation filter
into Spring Security so every protected endpoint validates the token before processing the
request. This task is the security layer every subsequent task's API depends on.

**Depends on:** T01 (Spring Security skeleton + DB schema must exist)

---

## Acceptance Criteria

- [ ] `POST /api/auth/login` — returns `200` with `{ token, user: { id, name, email, role } }` for valid credentials
- [ ] `POST /api/auth/login` — returns `401` with `{ error: "Invalid credentials" }` for wrong email or password. No stack trace, no field-level hints (do not say "email not found" vs "wrong password")
- [ ] `POST /api/auth/register` — creates a new user with specified role; returns `201` with user id. Restricted to `ADMIN` role (requires valid admin JWT)
- [ ] Passwords are stored as bcrypt hash (min cost factor 12). Plain text never logged or returned
- [ ] JWT payload contains: `sub` (userId), `role`, `email`, `iat`, `exp`
- [ ] JWT expiry: configurable via `application.yml` (default: 24 hours for Phase 1)
- [ ] JWT filter validates token on every request to `/api/**` except `/api/auth/**`
- [ ] Expired or malformed JWT returns `401` — no `500`
- [ ] Spring Security `SecurityContext` populated with authenticated user so `@PreAuthorize("hasRole('ADMIN')")` works on any endpoint
- [ ] Unit tests: login with valid credentials, login with wrong password, login with unknown email, expired JWT, malformed JWT

---

## API Contracts

### POST /api/auth/login
```
Request:
{
  "email": "admin@example.com",
  "password": "secret"
}

Response 200:
{
  "token": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}

Response 401:
{
  "error": "Invalid credentials"
}
```

### POST /api/auth/register
```
Request (requires ADMIN JWT):
{
  "name": "Jane Trainer",
  "email": "jane@example.com",
  "password": "tempPassword123",
  "phone": "+91-9876543210",
  "role": "FACULTY",
  "orgId": "uuid"
}

Response 201:
{
  "id": "uuid",
  "name": "Jane Trainer",
  "email": "jane@example.com",
  "role": "FACULTY"
}
```

---

## Code Architecture

```
backend/
└── src/main/java/com/lms/
    ├── auth/
    │   ├── AuthController.java       ← thin: delegates to AuthService
    │   ├── AuthService.java          ← login logic, bcrypt verify, JWT issue
    │   ├── AuthRepository.java       ← findByEmail()
    │   ├── dto/
    │   │   ├── LoginRequest.java     ← Zod-equivalent: @NotBlank validation
    │   │   ├── LoginResponse.java
    │   │   └── RegisterRequest.java
    │   └── jwt/
    │       ├── JwtUtil.java          ← generate, validate, extractClaims
    │       └── JwtAuthFilter.java    ← OncePerRequestFilter
    └── config/
        └── SecurityConfig.java       ← permitAll /auth/**, requireAuth all else
```

---

## Read Before Starting

| Role      | Must Read                                                                     |
|-----------|-------------------------------------------------------------------------------|
| ARCHITECT | ED.md from T01 (security config already designed), backend/guidelines/03_api_design.md, backend/guidelines/08_security_guidelines.md |
| WORKER    | ED.md (this folder), backend/guidelines/04_code_organization.md, backend/guidelines/06_error_handling.md, backend/guidelines/08_security_guidelines.md |
| REVIEWER  | ED.md (this folder), backend/guidelines/quick_reference/checklist.md, backend/guidelines/08_security_guidelines.md |

---

## Produces

| Role      | Output                                                                      |
|-----------|-----------------------------------------------------------------------------|
| ARCHITECT | ED.md — JWT design (claims, expiry, storage), API contracts, security filter flow |
| WORKER    | AuthController, AuthService, AuthRepository, JwtUtil, JwtAuthFilter, SecurityConfig, DTOs, tests |
| REVIEWER  | REVIEW.md (this folder)                                                     |
