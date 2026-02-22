# Project Structure Guidelines

**Focus:** Directory layout and naming conventions

---

## Directory Layout

```
backend/
├── src/
│   ├── controllers/        # Request handlers (HTTP layer)
│   ├── services/          # Business logic
│   ├── models/            # Database models (ORM entities)
│   ├── repositories/      # Data access layer
│   ├── middlewares/       # Express middlewares (auth, logging, etc.)
│   ├── validators/        # Input validation schemas
│   ├── utils/             # Helper functions
│   ├── config/            # Configuration files
│   └── routes/            # API route definitions
├── migrations/            # Database migrations (timestamped)
├── seeds/                 # Database seed data
├── tests/
│   ├── unit/             # Unit tests (isolated)
│   ├── integration/      # Integration tests (with DB)
│   └── e2e/              # End-to-end tests
├── docs/                  # API documentation, diagrams
├── scripts/               # Utility scripts (migrations, seeds)
├── .env.example          # Environment variables template
├── package.json
└── README.md
```

---

## Naming Conventions

### Files

| Type | Convention | Example |
|------|-----------|---------|
| JavaScript files | `kebab-case.js` | `user-service.js` |
| Test files | `{name}.test.js` | `user-service.test.js` |
| Config files | `kebab-case.js` | `database-config.js` |
| Migration files | `timestamp_description.sql` | `20250210103000_create_users_table.sql` |

### Code

| Type | Convention | Example |
|------|-----------|---------|
| Classes | `PascalCase` | `UserService`, `OrderController` |
| Functions | `camelCase` | `getUserById`, `createOrder` |
| Variables | `camelCase` | `userId`, `orderTotal` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRY_ATTEMPTS`, `API_BASE_URL` |
| Private methods | `_camelCase` | `_validateEmail` (prefix with underscore) |

### Database

| Type | Convention | Example |
|------|-----------|---------|
| Tables | `snake_case` (plural) | `users`, `order_items` |
| Columns | `snake_case` | `created_at`, `user_id` |
| Indexes | `idx_{table}_{column}` | `idx_users_email` |
| Constraints | `{table}_{column}_{type}` | `users_email_unique` |
| Foreign keys | `{referenced_table}_id` | `user_id`, `order_id` |

---

## File Organization by Layer

### Controllers (`src/controllers/`)

**Purpose:** Handle HTTP requests, call services, return responses

```javascript
// user-controller.js
// order-controller.js
// auth-controller.js
```

**Naming:**
- Singular resource + "controller"
- Example: `user-controller.js` (not `users-controller.js`)

### Services (`src/services/`)

**Purpose:** Business logic, orchestration, transactions

```javascript
// user-service.js
// order-service.js
// email-service.js
// payment-service.js
```

**Naming:**
- Singular resource + "service"
- Example: `user-service.js`

### Repositories (`src/repositories/`)

**Purpose:** Database queries only, no business logic

```javascript
// user-repository.js
// order-repository.js
// product-repository.js
```

**Naming:**
- Singular resource + "repository"
- Example: `user-repository.js`

### Validators (`src/validators/`)

**Purpose:** Input validation schemas (Zod, Joi, etc.)

```javascript
// user-validator.js
// order-validator.js
```

**Naming:**
- Singular resource + "validator"
- Exports schema objects like `CreateUserSchema`, `UpdateUserSchema`

### Middlewares (`src/middlewares/`)

**Purpose:** Request processing (auth, logging, rate limiting)

```javascript
// auth.js
// error-handler.js
// rate-limiter.js
// logger.js
```

**Naming:**
- Descriptive, kebab-case
- Avoid suffix unless needed for clarity

### Utils (`src/utils/`)

**Purpose:** Reusable helper functions

```javascript
// crypto.js         // Password hashing, encryption
// api-response.js   // Response formatting
// errors.js         // Custom error classes
// logger.js         // Logging utilities
// date-helper.js    // Date manipulation
```

**Naming:**
- Descriptive, kebab-case
- Group related utilities in same file

---

## Routes Organization

### Option 1: By Resource

```
src/routes/
├── index.js           # Main router
├── user-routes.js     # User endpoints
├── order-routes.js    # Order endpoints
└── auth-routes.js     # Auth endpoints
```

### Option 2: By Version (Recommended for APIs)

```
src/routes/
├── index.js
├── v1/
│   ├── index.js
│   ├── user-routes.js
│   ├── order-routes.js
│   └── auth-routes.js
└── v2/
    └── ...
```

**Route File Structure:**

```javascript
// src/routes/v1/user-routes.js
const express = require('express');
const { UserController } = require('../../controllers/user-controller');
const { authenticateToken } = require('../../middlewares/auth');

const router = express.Router();
const userController = new UserController();

router.post('/', (req, res, next) => userController.createUser(req, res, next));
router.get('/:id', authenticateToken, (req, res, next) => userController.getUserById(req, res, next));
router.patch('/:id', authenticateToken, (req, res, next) => userController.updateUser(req, res, next));
router.delete('/:id', authenticateToken, (req, res, next) => userController.deleteUser(req, res, next));

module.exports = router;
```

---

## Migration Files

**Location:** `/migrations/`

**Naming:** `YYYYMMDDHHMMSS_descriptive_action.sql`

```
migrations/
├── 20250210103000_create_users_table.sql
├── 20250210104500_add_otp_columns_to_users.sql
├── 20250210110000_create_orders_table.sql
└── 20250211093000_add_indexes_to_users_email.sql
```

**Rules:**
- Timestamp ensures order
- Descriptive name explains what it does
- One migration = one logical change
- Never modify existing migrations

---

## Test Files

**Location:** `/tests/{unit|integration|e2e}/`

**Naming:** Mirror source structure with `.test.js` suffix

```
tests/
├── unit/
│   ├── services/
│   │   ├── user-service.test.js
│   │   └── order-service.test.js
│   └── utils/
│       └── crypto.test.js
├── integration/
│   └── api/
│       ├── users.test.js
│       └── orders.test.js
└── e2e/
    └── user-registration-flow.test.js
```

---

## Configuration Files

```
src/config/
├── database.js        # Database connection config
├── env.js            # Environment variable validation
├── logger.js         # Logger configuration
└── app.js            # Express app setup
```

---

## Examples

### Good Structure

```
src/
├── controllers/
│   └── user-controller.js       ✓ Clear, singular
├── services/
│   └── user-service.js          ✓ Matches controller
├── repositories/
│   └── user-repository.js       ✓ Data layer
└── validators/
    └── user-validator.js        ✓ Input validation
```

### Bad Structure

```
src/
├── controllers/
│   └── Users.js                 ✗ Wrong case
├── services/
│   └── userService.js           ✗ Inconsistent naming
├── db/
│   └── UserRepo.js              ✗ Should be 'repositories'
└── validation/
    └── user_validator.js        ✗ Snake case for file
```

---

## Module Exports

### Single Class Export

```javascript
// user-service.js
class UserService {
  // ...
}

module.exports = { UserService };  // Named export
```

### Multiple Exports

```javascript
// errors.js
class AppError extends Error { /* ... */ }
class NotFoundError extends AppError { /* ... */ }
class ValidationError extends AppError { /* ... */ }

module.exports = {
  AppError,
  NotFoundError,
  ValidationError
};
```

### Default Export (Avoid)

```javascript
// ✗ Avoid default exports for consistency
module.exports = UserService;

// ✓ Use named exports
module.exports = { UserService };
```

---

## Imports

```javascript
// ✓ Good: Destructured named imports
const { UserService } = require('../services/user-service');
const { NotFoundError } = require('../utils/errors');

// ✗ Bad: Default imports
const UserService = require('../services/user-service');
```

---

## Environment-Specific Files

```
.env                  # Not in git (actual secrets)
.env.example          # In git (template)
.env.development      # Development overrides
.env.test            # Test environment
.env.production      # Production (not in git)
```

**Loading:**

```javascript
// src/config/env.js
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});
```

---

## Summary

1. **Use kebab-case** for file names
2. **Use PascalCase** for class names
3. **Use camelCase** for functions/variables
4. **Use snake_case** for database entities
5. **Layer your code** (Controller → Service → Repository)
6. **Mirror test structure** to source structure
7. **One file, one responsibility**
8. **Exports should be named**, not default

---

**Related Guidelines:**
- [Code Organization](04_code_organization.md) - How to structure code within files
- [Database Guidelines](02_database_guidelines.md) - Table and column naming
- [Version Control](10_version_control.md) - Branch naming conventions
