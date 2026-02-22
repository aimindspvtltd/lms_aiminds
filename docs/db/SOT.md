# Database Source of Truth (SOT)

**Last updated after:** PRD-001-T01 (ARCHITECT phase)
**Updated by:** ARCHITECT
**Rule:** This file is updated by ARCHITECT after every task that changes the DB schema is merged.

---

## All Tables

| Table | Migration | PRD | Description |
|-------|-----------|-----|-------------|
| `users` | V2 | PRD-001 | All platform users: ADMIN, FACULTY, STUDENT |

---

## Schema

### `users`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGSERIAL | PRIMARY KEY | |
| email | VARCHAR(255) | nullable, UNIQUE (partial index) | OTP-only students may omit |
| phone | VARCHAR(20) | nullable, UNIQUE (partial index) | may be absent initially |
| name | VARCHAR(255) | NOT NULL | |
| role | VARCHAR(20) | NOT NULL, CHECK IN ('ADMIN','FACULTY','STUDENT') | |
| password_hash | VARCHAR(255) | nullable | BCrypt cost 12. NULL for OTP-only students |
| status | VARCHAR(20) | NOT NULL DEFAULT 'ACTIVE', CHECK IN ('ACTIVE','INACTIVE','SUSPENDED') | |
| last_login_at | TIMESTAMP | nullable | |
| created_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | auto-updated via trigger |
| deleted_at | TIMESTAMP | nullable | soft delete |

**Indexes:**
- `idx_users_email_unique` — UNIQUE (email) WHERE email IS NOT NULL AND deleted_at IS NULL
- `idx_users_phone_unique` — UNIQUE (phone) WHERE phone IS NOT NULL AND deleted_at IS NULL
- `idx_users_role` — (role) WHERE deleted_at IS NULL

**Notes:**
- No org/institution link on this table. Student-to-institution association will be added in a later PRD via a dedicated join table.

---

## Migration History

| Version | File | PRD | Description |
|---------|------|-----|-------------|
| V1 | `V1__create_update_trigger_function.sql` | PRD-001-T01 | Auto-update trigger function |
| V2 | `V2__create_users.sql` | PRD-001-T01 | Users table |
| V3 | `V3__seed_initial_admin.sql` | PRD-001-T01 | Seed initial admin user |
