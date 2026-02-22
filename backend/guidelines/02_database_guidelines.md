# Database Guidelines

**Focus:** Schema design, tables, columns, indexes, relationships

---

## Table Design Principles

### Primary Keys

```sql
-- ✓ Always use BIGSERIAL for scalability
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    -- other columns
);

-- ✗ Avoid INT (can overflow at 2.1 billion)
CREATE TABLE users (
    id INT PRIMARY KEY,  -- Bad for growing tables
    -- other columns
);
```

**Why BIGSERIAL?**
- Range: 1 to 9,223,372,036,854,775,807
- Auto-incrementing
- Future-proof

---

## Required Columns

### Timestamps (Mandatory)

Every table MUST have:

```sql
CREATE TABLE table_name (
    id BIGSERIAL PRIMARY KEY,
    
    -- Your columns here
    
    -- Timestamps (REQUIRED)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP  -- For soft deletes (nullable)
);
```

### Auto-Update `updated_at`

```sql
-- Create trigger function (once per database)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

---

## Naming Standards

### Tables

| Rule | Example |
|------|---------|
| Plural nouns | `users`, `orders`, `products` |
| snake_case | `user_profiles`, `order_items` |
| Descriptive | `email_verification_tokens` (not `tokens`) |

```sql
-- ✓ Good
CREATE TABLE user_profiles (...);
CREATE TABLE order_items (...);

-- ✗ Bad
CREATE TABLE UserProfile (...);    -- PascalCase
CREATE TABLE user_profile (...);   -- Singular
CREATE TABLE profile (...);        -- Too generic
```

### Columns

| Type | Naming | Example |
|------|--------|---------|
| Regular columns | `snake_case` | `full_name`, `email_address` |
| Boolean columns | `is_` or `has_` prefix | `is_active`, `has_verified` |
| Timestamps | `_at` suffix | `created_at`, `verified_at` |
| Foreign keys | `{table}_id` | `user_id`, `order_id` |
| JSON columns | descriptive | `metadata`, `settings` |

```sql
-- ✓ Good naming
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ✗ Bad naming
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    Email VARCHAR(255),           -- PascalCase
    name VARCHAR(255),            -- Vague
    active BOOLEAN,               -- Not prefixed
    verified TIMESTAMP,           -- Not suffixed
    creation_date TIMESTAMP       -- Inconsistent
);
```

---

## Column Definitions

### String Columns

```sql
-- Email addresses
email VARCHAR(255) NOT NULL

-- Names (allow Unicode)
full_name VARCHAR(255)

-- Phone numbers
phone_number VARCHAR(20)

-- Short codes
status VARCHAR(50) NOT NULL DEFAULT 'pending'

-- Long text (descriptions, notes)
description TEXT

-- ✗ Avoid generic TEXT for structured data
user_info TEXT  -- Bad, use specific columns instead
```

### Numeric Columns

```sql
-- Currency (always use DECIMAL, not FLOAT)
total_amount DECIMAL(10,2) NOT NULL  -- 10 digits, 2 decimal places
price DECIMAL(10,2) NOT NULL

-- Integers
quantity INTEGER NOT NULL
age INTEGER

-- Big numbers
view_count BIGINT DEFAULT 0

-- ✗ Never use FLOAT/REAL for money
price FLOAT  -- Bad! Rounding errors
```

### Boolean Columns

```sql
-- Always provide defaults
is_active BOOLEAN NOT NULL DEFAULT TRUE
is_verified BOOLEAN NOT NULL DEFAULT FALSE
has_premium BOOLEAN NOT NULL DEFAULT FALSE

-- ✗ Avoid nullable booleans (confusing)
is_active BOOLEAN  -- Bad, NULL is ambiguous
```

### Timestamp Columns

```sql
-- Use TIMESTAMP (not DATE unless you only need date)
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

-- Nullable timestamps (for events that may not have occurred)
verified_at TIMESTAMP
last_login_at TIMESTAMP
deleted_at TIMESTAMP

-- ✗ Avoid storing as strings
created_at VARCHAR(50)  -- Bad!
```

### JSON Columns

```sql
-- Use JSONB for better performance and indexing
metadata JSONB
settings JSONB DEFAULT '{}'

-- Create indexes on JSON fields if needed
CREATE INDEX idx_users_settings_theme 
    ON users ((settings->>'theme'));
```

---

## Constraints

### NOT NULL Constraints

```sql
-- Required fields
email VARCHAR(255) NOT NULL,
password_hash VARCHAR(255) NOT NULL,

-- Optional fields (omit NOT NULL)
phone_number VARCHAR(20),
bio TEXT
```

### UNIQUE Constraints

```sql
-- Named constraints (recommended)
CONSTRAINT users_email_unique UNIQUE(email)

-- Or inline
email VARCHAR(255) NOT NULL UNIQUE

-- Composite unique
CONSTRAINT user_roles_unique UNIQUE(user_id, role_id)
```

### CHECK Constraints

```sql
-- Validate enum-like values
CONSTRAINT orders_status_check 
    CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'))

-- Validate email format
CONSTRAINT users_email_check 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')

-- Validate ranges
CONSTRAINT products_price_check 
    CHECK (price > 0)

CONSTRAINT users_age_check 
    CHECK (age >= 0 AND age <= 150)
```

### Foreign Key Constraints

```sql
-- Standard foreign key with cascade delete
CONSTRAINT orders_user_fk 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE

-- Cascade options:
-- ON DELETE CASCADE   - Delete child when parent deleted
-- ON DELETE SET NULL  - Set FK to NULL when parent deleted
-- ON DELETE RESTRICT  - Prevent parent deletion if children exist
-- ON UPDATE CASCADE   - Update FK when parent PK changes

-- Example with SET NULL
CONSTRAINT orders_coupon_fk 
    FOREIGN KEY (coupon_id) 
    REFERENCES coupons(id) 
    ON DELETE SET NULL
```

---

## Indexes

### When to Add Indexes

✓ **Always index:**
- Primary keys (automatic)
- Foreign keys
- Columns in WHERE clauses
- Columns in JOIN conditions
- Columns in ORDER BY clauses

✗ **Don't index:**
- Small tables (<1000 rows)
- Columns rarely queried
- Columns with low cardinality (few unique values)
- Every column (hurts write performance)

### Single Column Index

```sql
-- Standard index
CREATE INDEX idx_users_email ON users(email);

-- Unique index
CREATE UNIQUE INDEX idx_users_username ON users(username);

-- Case-insensitive index
CREATE INDEX idx_users_email_lower ON users(LOWER(email));
```

### Composite Index

**Order matters!** Most selective column first.

```sql
-- Good: user_id is most selective
CREATE INDEX idx_orders_user_created 
    ON orders(user_id, created_at DESC);

-- Query this helps:
SELECT * FROM orders 
WHERE user_id = 123 
ORDER BY created_at DESC;

-- Bad: created_at first (less selective)
CREATE INDEX idx_orders_created_user 
    ON orders(created_at, user_id);  -- Less efficient for above query
```

### Partial Index

```sql
-- Index only active users
CREATE INDEX idx_users_active 
    ON users(id) 
    WHERE is_active = TRUE;

-- Index only verified emails
CREATE INDEX idx_users_verified_email 
    ON users(email) 
    WHERE email_verified_at IS NOT NULL;
```

### Index Naming Convention

```
idx_{table}_{column(s)}_{optional_descriptor}

Examples:
idx_users_email
idx_users_created_at
idx_orders_user_created
idx_users_active          (partial index)
idx_users_email_unique    (unique index)
```

---

## Relationships

### One-to-Many

```sql
-- Parent table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Child table
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    CONSTRAINT orders_user_fk 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

-- Index the foreign key
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

### Many-to-Many (Junction Table)

```sql
-- Table 1
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL
);

-- Table 2
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- Junction table
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_by BIGINT,  -- Who assigned this role
    
    -- Composite primary key
    PRIMARY KEY (user_id, role_id),
    
    -- Foreign keys
    CONSTRAINT user_roles_user_fk 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT user_roles_role_fk 
        FOREIGN KEY (role_id) 
        REFERENCES roles(id) 
        ON DELETE CASCADE
);

-- Indexes (automatically created for PK, but add reverse lookup)
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
```

### Self-Referencing (Hierarchical)

```sql
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id BIGINT,
    
    CONSTRAINT categories_parent_fk 
        FOREIGN KEY (parent_id) 
        REFERENCES categories(id) 
        ON DELETE CASCADE
);

CREATE INDEX idx_categories_parent_id ON categories(parent_id);
```

---

## Complete Table Example

```sql
-- ============================================
-- Table: users
-- Purpose: Store user accounts
-- ============================================

CREATE TABLE users (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Authentication
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Profile
    full_name VARCHAR(255),
    phone_number VARCHAR(20),
    bio TEXT,
    avatar_url VARCHAR(500),
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- OTP (from TASK_101)
    otp_secret VARCHAR(32),
    otp_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    otp_verified_at TIMESTAMP,
    
    -- Timestamps (REQUIRED)
    email_verified_at TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,  -- Soft delete
    
    -- Constraints
    CONSTRAINT users_email_unique UNIQUE(email),
    CONSTRAINT users_email_check CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    )
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(id) WHERE is_active = TRUE;
CREATE INDEX idx_users_verified ON users(id) WHERE is_verified = TRUE;
CREATE INDEX idx_users_otp_enabled ON users(id) WHERE otp_enabled = TRUE;

-- Trigger for updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE users IS 'User accounts and profiles';
COMMENT ON COLUMN users.otp_secret IS 'TOTP secret for 2FA (added in TASK_101)';
```

---

## Performance Tips

### 1. Use Appropriate Data Types

```sql
-- ✓ Good: Right-sized
status VARCHAR(50)
country_code CHAR(2)

-- ✗ Bad: Oversized
status VARCHAR(1000)
country_code VARCHAR(255)
```

### 2. Avoid SELECT *

```sql
-- ✗ Bad
SELECT * FROM users WHERE id = 1;

-- ✓ Good
SELECT id, email, full_name FROM users WHERE id = 1;
```

### 3. Use LIMIT for Large Result Sets

```sql
-- Always paginate
SELECT * FROM orders 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 0;
```

### 4. Analyze Query Plans

```sql
EXPLAIN ANALYZE 
SELECT * FROM orders 
WHERE user_id = 123 
ORDER BY created_at DESC;
```

---

## Soft Deletes

```sql
-- Add deleted_at column
deleted_at TIMESTAMP

-- "Delete" by setting timestamp
UPDATE users 
SET deleted_at = CURRENT_TIMESTAMP 
WHERE id = 123;

-- Filter out deleted in queries
SELECT * FROM users 
WHERE deleted_at IS NULL;

-- Create view for active records
CREATE VIEW active_users AS
SELECT * FROM users WHERE deleted_at IS NULL;
```

---

## JSON Column Usage

```sql
-- Create table with JSONB
CREATE TABLE user_preferences (
    user_id BIGINT PRIMARY KEY,
    settings JSONB NOT NULL DEFAULT '{}',
    CONSTRAINT user_preferences_user_fk 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

-- Insert JSON data
INSERT INTO user_preferences (user_id, settings)
VALUES (1, '{"theme": "dark", "language": "en", "notifications": true}');

-- Query JSON fields
SELECT * FROM user_preferences 
WHERE settings->>'theme' = 'dark';

-- Update JSON fields
UPDATE user_preferences 
SET settings = jsonb_set(settings, '{theme}', '"light"')
WHERE user_id = 1;

-- Index JSON fields
CREATE INDEX idx_user_preferences_theme 
    ON user_preferences ((settings->>'theme'));
```

---

## Common Patterns

### Audit Columns

```sql
-- Add to track who created/modified
created_by BIGINT,
updated_by BIGINT,

CONSTRAINT table_created_by_fk 
    FOREIGN KEY (created_by) 
    REFERENCES users(id)
```

### Versioning

```sql
-- Add version number for optimistic locking
version INTEGER NOT NULL DEFAULT 1,

-- Update logic:
UPDATE table 
SET column = value, version = version + 1 
WHERE id = ? AND version = ?;
```

### Status Tracking

```sql
status VARCHAR(50) NOT NULL DEFAULT 'draft',
status_changed_at TIMESTAMP,

CONSTRAINT table_status_check CHECK (
    status IN ('draft', 'published', 'archived')
)
```

---

## Summary Checklist

- [ ] Table name is plural, snake_case
- [ ] Primary key is BIGSERIAL
- [ ] Has created_at, updated_at timestamps
- [ ] Has deleted_at for soft deletes (if needed)
- [ ] Foreign keys have constraints with ON DELETE action
- [ ] Foreign keys are indexed
- [ ] Unique constraints are named
- [ ] CHECK constraints validate data
- [ ] Columns have appropriate data types
- [ ] NOT NULL used for required fields
- [ ] Trigger added for auto-updating updated_at

---

**Related Guidelines:**
- [Migration Management](05_migration_management.md) - How to create/modify tables
- [Code Organization](04_code_organization.md) - Repository layer (database access)
