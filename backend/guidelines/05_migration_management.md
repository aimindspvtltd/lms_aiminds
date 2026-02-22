# Migration Management Guidelines

**Focus:** Database migrations, versioning, rollback strategies

---

## Migration Basics

### What are Migrations?

Migrations are versioned scripts that:
- Modify database schema
- Are tracked and applied in order
- Can be rolled back
- Keep database in sync across environments

---

## File Naming Convention

```
Format: YYYYMMDDHHMMSS_descriptive_action.sql

Examples:
20250210103000_create_users_table.sql
20250210104500_add_otp_columns_to_users.sql
20250210110000_create_orders_table.sql
20250211093000_add_indexes_to_users_email.sql
20250212140000_add_foreign_key_orders_user.sql
```

**Rules:**
- Timestamp ensures chronological order
- Descriptive name explains the change
- Use snake_case
- One migration = one logical change

---

## Migration Structure

### Complete Migration Template

```sql
-- migrations/20250210103000_create_users_table.sql

-- ============================================
-- Migration: Create users table
-- Task: TASK_101_Add_OTP_Verification
-- Author: John Doe
-- Date: 2025-02-10
-- Description: Initial users table with email and OTP verification
-- ============================================

-- UP Migration
BEGIN;

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone_number VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    CONSTRAINT users_email_unique UNIQUE(email)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(id) WHERE is_active = TRUE;

COMMIT;

-- ============================================
-- DOWN Migration (Rollback)
-- ============================================

BEGIN;

DROP TABLE IF EXISTS users CASCADE;

COMMIT;
```

---

## Migration Types

### 1. Create Table

```sql
-- UP
BEGIN;

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT products_price_check CHECK (price >= 0),
    CONSTRAINT products_stock_check CHECK (stock >= 0)
);

CREATE INDEX idx_products_name ON products(name);

COMMIT;

-- DOWN
BEGIN;

DROP TABLE IF EXISTS products CASCADE;

COMMIT;
```

### 2. Add Columns

```sql
-- migrations/20250210104500_add_otp_columns_to_users.sql

-- UP
BEGIN;

ALTER TABLE users 
    ADD COLUMN otp_secret VARCHAR(32),
    ADD COLUMN otp_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN otp_verified_at TIMESTAMP;

CREATE INDEX idx_users_otp_enabled ON users(otp_enabled) WHERE otp_enabled = TRUE;

COMMIT;

-- DOWN
BEGIN;

DROP INDEX IF EXISTS idx_users_otp_enabled;

ALTER TABLE users 
    DROP COLUMN IF EXISTS otp_secret,
    DROP COLUMN IF EXISTS otp_enabled,
    DROP COLUMN IF EXISTS otp_verified_at;

COMMIT;
```

### 3. Modify Column

```sql
-- UP
BEGIN;

ALTER TABLE users 
    ALTER COLUMN email TYPE VARCHAR(320);  -- Increase email length

COMMIT;

-- DOWN
BEGIN;

ALTER TABLE users 
    ALTER COLUMN email TYPE VARCHAR(255);  -- Revert to original

COMMIT;
```

### 4. Add Index

```sql
-- UP
BEGIN;

CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Composite index
CREATE INDEX idx_orders_user_status 
    ON orders(user_id, status) 
    WHERE deleted_at IS NULL;

COMMIT;

-- DOWN
BEGIN;

DROP INDEX IF EXISTS idx_orders_user_status;
DROP INDEX IF EXISTS idx_orders_created_at;

COMMIT;
```

### 5. Add Foreign Key

```sql
-- UP
BEGIN;

ALTER TABLE orders 
    ADD CONSTRAINT orders_user_fk 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE;

CREATE INDEX idx_orders_user_id ON orders(user_id);

COMMIT;

-- DOWN
BEGIN;

DROP INDEX IF EXISTS idx_orders_user_id;

ALTER TABLE orders 
    DROP CONSTRAINT IF EXISTS orders_user_fk;

COMMIT;
```

### 6. Data Migration

```sql
-- UP
BEGIN;

-- Add new column
ALTER TABLE users ADD COLUMN status VARCHAR(50);

-- Migrate data
UPDATE users 
SET status = CASE 
    WHEN is_active = TRUE THEN 'active'
    ELSE 'inactive'
END;

-- Make column NOT NULL after data migration
ALTER TABLE users 
    ALTER COLUMN status SET NOT NULL,
    ALTER COLUMN status SET DEFAULT 'active';

COMMIT;

-- DOWN
BEGIN;

ALTER TABLE users DROP COLUMN IF EXISTS status;

COMMIT;
```

---

## Migration Best Practices

### 1. Always Use Transactions

```sql
-- ✓ Good
BEGIN;
-- changes
COMMIT;

-- ✗ Bad (no transaction)
-- changes without BEGIN/COMMIT
```

### 2. Always Include Rollback

```sql
-- Every migration must have both UP and DOWN
-- Even if DOWN is just dropping the table
```

### 3. Test Locally First

```bash
# Apply migration
psql -d mydb -f migrations/20250210103000_create_users_table.sql

# Test rollback
psql -d mydb -c "BEGIN; DROP TABLE users; COMMIT;"
```

### 4. Never Modify Existing Migrations

```
✗ Never edit: 20250210103000_create_users_table.sql

✓ Create new: 20250212150000_add_bio_column_to_users.sql
```

### 5. Keep Migrations Small

```
✓ One logical change per migration
✗ Don't combine create_users + create_orders in one file
```

### 6. Document Task Reference

```sql
-- Task: TASK_101_Add_OTP_Verification
-- This helps track why the change was made
```

---

## Migration Tracking

### Schema Migrations Table

```sql
CREATE TABLE schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Track Applied Migrations

```javascript
// After applying migration
INSERT INTO schema_migrations (version) 
VALUES ('20250210103000_create_users_table');
```

---

## Running Migrations

### Manual Execution

```bash
# Apply single migration
psql -d mydb -f migrations/20250210103000_create_users_table.sql

# Apply all pending migrations
for file in migrations/*.sql; do
    psql -d mydb -f "$file"
done
```

### Node.js Migration Runner

```javascript
// scripts/run-migrations.js

const fs = require('fs');
const path = require('path');
const db = require('../config/database');

async function runMigrations() {
  // Ensure tracking table exists
  await db.schema.createTableIfNotExists('schema_migrations', (table) => {
    table.string('version').primary();
    table.timestamp('applied_at').defaultTo(db.fn.now());
  });

  // Get applied migrations
  const applied = await db('schema_migrations').pluck('version');

  // Get all migration files
  const migrationsDir = path.join(__dirname, '../migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  // Run pending migrations
  for (const file of files) {
    const version = file.replace('.sql', '');
    
    if (applied.includes(version)) {
      console.log(`✓ ${file} (already applied)`);
      continue;
    }

    console.log(`→ Running ${file}...`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    
    // Extract UP migration (before DOWN marker)
    const upMigration = sql.split('-- DOWN Migration')[0];
    
    await db.raw(upMigration);
    await db('schema_migrations').insert({ version });
    
    console.log(`✓ ${file} applied successfully`);
  }

  console.log('\nAll migrations complete!');
}

runMigrations()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
```

---

## Rollback Strategy

### Rollback Single Migration

```javascript
// scripts/rollback-migration.js

async function rollbackMigration(version) {
  const file = `${version}.sql`;
  const filePath = path.join(__dirname, '../migrations', file);
  
  const sql = fs.readFileSync(filePath, 'utf8');
  
  // Extract DOWN migration
  const downMigration = sql.split('-- DOWN Migration')[1];
  
  if (!downMigration) {
    throw new Error('No DOWN migration found');
  }
  
  await db.raw(downMigration);
  await db('schema_migrations').where({ version }).del();
  
  console.log(`✓ Rolled back ${file}`);
}
```

---

## Common Scenarios

### Scenario 1: Add New Feature (OTP)

```
1. Create migration: 20250210104500_add_otp_columns_to_users.sql
2. Add columns: otp_secret, otp_enabled, otp_verified_at
3. Add indexes
4. Test locally
5. Apply to staging
6. Apply to production
7. Update Source of Truth docs
```

### Scenario 2: Fix Production Bug

```
1. Create hotfix migration: 20250212160000_fix_email_constraint.sql
2. Test locally
3. Apply to production immediately
4. Backport to development
```

### Scenario 3: Data Migration

```sql
-- Safe data migration pattern
BEGIN;

-- 1. Add new column (nullable)
ALTER TABLE users ADD COLUMN new_column VARCHAR(50);

-- 2. Migrate data
UPDATE users SET new_column = old_column WHERE condition;

-- 3. Make NOT NULL (after verifying data)
ALTER TABLE users ALTER COLUMN new_column SET NOT NULL;

-- 4. Drop old column (in separate migration if risky)
-- ALTER TABLE users DROP COLUMN old_column;

COMMIT;
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Run Migrations

on:
  push:
    branches: [main]

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Run migrations
        run: |
          npm install
          npm run migrate:up
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## Source of Truth Integration

### Workflow

```
TASK_101 created
  ↓
Migration written: 20250210104500_add_otp_columns.sql
  ↓
Migration tested locally
  ↓
Migration applied to staging
  ↓
Migration applied to production
  ↓
Source of Truth updated: Tech/DB/users_table.md
  ↓
TASK_101 closed
```

### Update Source of Truth

After migration is successful:

```markdown
# Tech/DB/users_table.md

Table: users
Last Updated: TASK_101

Columns:
- id (BIGSERIAL PRIMARY KEY)
- email (VARCHAR(255) NOT NULL)
- ...
- otp_secret (VARCHAR(32))        ← Added by TASK_101
- otp_enabled (BOOLEAN)           ← Added by TASK_101
- otp_verified_at (TIMESTAMP)     ← Added by TASK_101
```

---

## Checklist

Before committing a migration:

- [ ] Migration has timestamp-based filename
- [ ] UP migration included
- [ ] DOWN migration included
- [ ] Uses BEGIN/COMMIT transaction
- [ ] References task ID in comments
- [ ] Tested locally (UP and DOWN)
- [ ] Doesn't modify existing migrations
- [ ] One logical change only
- [ ] Indexes added for foreign keys
- [ ] Constraints are named

---

**Related Guidelines:**
- [Database Guidelines](02_database_guidelines.md) - Schema design
- [Version Control](10_version_control.md) - Committing migrations
