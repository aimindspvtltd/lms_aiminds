# Documentation Guidelines

**Focus:** Code comments, API docs, module documentation

---

## Code Comments

### Function Documentation

```javascript
/**
 * Create a new user account
 * 
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email address
 * @param {string} userData.password - Plain text password (will be hashed)
 * @param {string} userData.full_name - User's full name
 * @param {string} [userData.phone_number] - Optional phone number
 * 
 * @returns {Promise<Object>} Created user object (without password_hash)
 * 
 * @throws {ConflictError} If email already exists
 * @throws {ValidationError} If input data is invalid
 * 
 * @example
 * const user = await userService.createUser({
 *   email: 'john@example.com',
 *   password: 'SecurePass123!',
 *   full_name: 'John Doe'
 * });
 */
async createUser(userData) {
  // Implementation
}
```

### Inline Comments

```javascript
// ✓ Good: Explain WHY, not WHAT
// Soft delete to preserve order history
await this.userRepo.softDelete(userId);

// ✗ Bad: Explains obvious code
// Delete the user
await this.userRepo.softDelete(userId);
```

---

## API Documentation

### OpenAPI/Swagger

```yaml
openapi: 3.0.0
info:
  title: User Management API
  version: 1.0.0
  
paths:
  /api/v1/users:
    post:
      summary: Create a new user
      tags:
        - Users
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - password
                - full_name
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  minLength: 8
                full_name:
                  type: string
      responses:
        '201':
          description: User created successfully
        '400':
          description: Invalid input
        '409':
          description: Email already exists
```

---

## Module README

```markdown
# User Management Module

## Overview
Handles user registration, authentication, and profile management.

## Components
- `UserController`: HTTP request handling
- `UserService`: Business logic
- `UserRepository`: Database operations

## API Endpoints
- `POST /api/v1/users` - Create user
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id` - Update user

## Database Tables
- `users` - Main user table

## Related Tasks
- TASK_101: Add OTP verification
- TASK_105: Add social login
```

---

**Related Guidelines:**
- [API Design](03_api_design.md) - API documentation format
- [Code Organization](04_code_organization.md) - What to document
