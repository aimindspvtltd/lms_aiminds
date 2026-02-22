-- ============================================================
-- Migration: V2 — Create users table
-- Task: PRD-001-T01
-- Date: 2026-02-21
-- Description: Single users table for all platform personas.
--              No institution/org link here — student-to-org
--              association will be handled in a later PRD.
-- ============================================================

-- UP
BEGIN;

CREATE TABLE users (
    id              BIGSERIAL       PRIMARY KEY,
    email           VARCHAR(255),                           -- nullable: OTP-only students may not have email
    phone           VARCHAR(20),                            -- nullable: may be absent initially
    name            VARCHAR(255)    NOT NULL,
    role            VARCHAR(20)     NOT NULL,
    password_hash   VARCHAR(255),                           -- null for OTP-only students
    status          VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE',
    last_login_at   TIMESTAMP,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP,                              -- soft delete

    CONSTRAINT users_role_check
        CHECK (role IN ('ADMIN', 'FACULTY', 'STUDENT')),

    CONSTRAINT users_status_check
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),

    CONSTRAINT users_email_format_check
        CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Partial unique indexes: allow multiple NULLs, enforce uniqueness for non-null values
CREATE UNIQUE INDEX idx_users_email_unique
    ON users(email)
    WHERE email IS NOT NULL AND deleted_at IS NULL;

CREATE UNIQUE INDEX idx_users_phone_unique
    ON users(phone)
    WHERE phone IS NOT NULL AND deleted_at IS NULL;

CREATE INDEX idx_users_role
    ON users(role)
    WHERE deleted_at IS NULL;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE users IS 'All platform users: ADMIN, FACULTY, STUDENT. Student-to-org link handled separately.';
COMMENT ON COLUMN users.password_hash IS 'BCrypt hash (cost 12). NULL for OTP-only students.';
COMMENT ON COLUMN users.deleted_at IS 'Soft delete. NULL = active record.';

COMMIT;

-- ============================================================
-- DOWN
-- ============================================================

BEGIN;

DROP TABLE IF EXISTS users CASCADE;

COMMIT;
