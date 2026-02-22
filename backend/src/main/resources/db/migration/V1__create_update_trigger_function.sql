-- ============================================================
-- Migration: V1 — Create auto-update trigger function
-- Task: PRD-001-T01
-- Date: 2026-02-21
-- Description: One-time trigger function used by all tables
--              to auto-update the updated_at column on row update.
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
