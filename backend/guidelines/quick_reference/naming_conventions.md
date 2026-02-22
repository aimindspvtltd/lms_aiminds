# Naming Conventions Quick Reference

## Files

| Type | Convention | Example |
|------|-----------|---------|
| JavaScript | `kebab-case.js` | `user-service.js` |
| Test files | `{name}.test.js` | `user-service.test.js` |
| Migrations | `timestamp_action.sql` | `20250210103000_create_users.sql` |

## Code

| Type | Convention | Example |
|------|-----------|---------|
| Classes | `PascalCase` | `UserService`, `OrderController` |
| Functions | `camelCase` | `getUserById`, `createOrder` |
| Variables | `camelCase` | `userId`, `orderTotal` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRY`, `API_URL` |
| Private | `_camelCase` | `_validateEmail` |

## Database

| Type | Convention | Example |
|------|-----------|---------|
| Tables | `snake_case` (plural) | `users`, `order_items` |
| Columns | `snake_case` | `created_at`, `user_id` |
| Booleans | `is_` or `has_` prefix | `is_active`, `has_verified` |
| Timestamps | `_at` suffix | `created_at`, `verified_at` |
| Foreign keys | `{table}_id` | `user_id`, `order_id` |
| Indexes | `idx_{table}_{column}` | `idx_users_email` |
| Constraints | `{table}_{column}_{type}` | `users_email_unique` |

## API

| Type | Convention | Example |
|------|-----------|---------|
| Endpoints | `kebab-case`, plural | `/api/v1/users`, `/order-items` |
| JSON keys | `snake_case` | `{ "user_id": 123 }` |
| Query params | `snake_case` | `?status=active&page=1` |

## Git

| Type | Convention | Example |
|------|-----------|---------|
| Branches | `type/TASK_ID_description` | `feature/TASK_101_add_otp` |
| Commits | `type(scope): description` | `feat(auth): add OTP` |
