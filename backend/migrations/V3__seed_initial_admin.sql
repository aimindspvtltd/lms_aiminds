-- ============================================================
-- Migration: V3 — Seed initial admin user
-- Task: PRD-001-T01
-- Date: 2026-02-21
-- Description: Bootstrap the first ADMIN user so login works
--              from day one. Without this, /auth/register is
--              unreachable (it requires an existing ADMIN JWT).
--
-- WORKER ACTION REQUIRED:
--   Replace the password_hash placeholder before running.
--   Generate with: new BCryptPasswordEncoder(12).encode("yourPassword")
--   Default login email: admin@lms.internal
-- ============================================================

-- UP
BEGIN;

INSERT INTO users (email, name, role, password_hash, status)
VALUES (
    'admin@lms.internal',
    'Platform Admin',
    'ADMIN',
    '$2a$12$REPLACE_THIS_WITH_REAL_BCRYPT_HASH_GENERATED_BY_WORKER',
    'ACTIVE'
);

COMMIT;

-- ============================================================
-- DOWN
-- ============================================================

BEGIN;

DELETE FROM users WHERE email = 'admin@lms.internal';

COMMIT;
