# Error Handling Guidelines

**Focus:** Custom errors, global handlers, consistent error responses

---

## Custom Error Classes

```javascript
// utils/errors.js

/**
 * Base application error
 */
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;  // Expected error
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request - Validation errors
 */
class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

/**
 * 401 Unauthorized - Authentication failed
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

/**
 * 403 Forbidden - No permission
 */
class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

/**
 * 404 Not Found - Resource doesn't exist
 */
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

/**
 * 409 Conflict - Resource conflict (duplicate)
 */
class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409, 'CONFLICT');
  }
}

/**
 * 422 Unprocessable Entity - Business logic validation
 */
class UnprocessableError extends AppError {
  constructor(message, details = []) {
    super(message, 422, 'UNPROCESSABLE');
    this.details = details;
  }
}

module.exports = {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnprocessableError
};
```

---

## Global Error Handler

```javascript
// middlewares/error-handler.js

const { AppError } = require('../utils/errors');
const { logger } = require('../utils/logger');

/**
 * Global error handling middleware
 */
function errorHandler(err, req, res, next) {
  // Generate request ID for tracking
  const requestId = req.id || `req_${Date.now()}`;

  // Log error
  logger.error({
    requestId,
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    user: req.user?.id
  });

  // Operational errors (expected, safe to show to client)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details || []
      },
      request_id: requestId
    });
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      },
      request_id: requestId
    });
  }

  // Database errors
  if (err.code === '23505') {  // Unique violation
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_ERROR',
        message: 'Resource already exists',
        details: [{ constraint: err.constraint }]
      },
      request_id: requestId
    });
  }

  if (err.code === '23503') {  // Foreign key violation
    return res.status(400).json({
      success: false,
      error: {
        code: 'FOREIGN_KEY_ERROR',
        message: 'Referenced resource does not exist',
        details: [{ constraint: err.constraint }]
      },
      request_id: requestId
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid authentication token'
      },
      request_id: requestId
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Authentication token has expired'
      },
      request_id: requestId
    });
  }

  // Unknown errors (programming errors)
  // Don't expose details to client in production
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    },
    request_id: requestId
  });
}

module.exports = { errorHandler };
```

---

## Usage in Code

### Service Layer

```javascript
// services/user-service.js

const { NotFoundError, ConflictError } = require('../utils/errors');

class UserService {
  async getUserById(userId) {
    const user = await this.userRepo.findById(userId);
    
    // Throw error if not found
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    return user;
  }

  async createUser(userData) {
    // Check for duplicate
    const existing = await this.userRepo.findByEmail(userData.email);
    if (existing) {
      throw new ConflictError('Email already registered');
    }
    
    // ... create user
  }
}
```

### Controller Layer

```javascript
// controllers/user-controller.js

class UserController {
  async getUserById(req, res, next) {
    try {
      const userId = parseInt(req.params.id);
      const user = await this.userService.getUserById(userId);
      
      return ApiResponse.success(res, user);
    } catch (error) {
      next(error);  // Pass to error handler middleware
    }
  }
}
```

---

## Async Error Handling

### Wrap Async Routes

```javascript
// utils/async-handler.js

/**
 * Wraps async route handlers to catch errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return res.json(user);
}));
```

---

**Related Guidelines:**
- [API Design](03_api_design.md) - Error response formats
- [Testing Standards](07_testing_standards.md) - Testing error cases
