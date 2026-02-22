-- ============================================================
-- Migration: V3 — Seed initial admin (no-op)
-- Task: PRD-001-T01
-- Date: 2026-02-21
-- Description: Admin seeding is handled by AdminSeeder.java
--              (ApplicationRunner bean) which reads ADMIN_EMAIL
--              and ADMIN_PASSWORD from environment variables and
--              seeds on startup if no admin exists.
--              This migration is intentionally a no-op.
-- ============================================================

SELECT 1;
