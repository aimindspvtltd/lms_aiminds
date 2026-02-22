# API Design Guidelines

**Focus:** RESTful conventions, request/response formats, HTTP standards

---

## RESTful Conventions

### Resource Naming

| Rule | Example |
|------|---------|
| Use plural nouns | `/users` not `/user` |
| Use kebab-case | `/order-items` not `/orderItems` |
| No verbs | `/users` not `/getUsers` |
| Nesting max 2 levels | `/users/:id/orders` (good) |

### Standard Endpoints

```javascript
// Users resource
GET    /api/v1/users              // List users (with pagination)
GET    /api/v1/users/:id          // Get single user
POST   /api/v1/users              // Create user
PUT    /api/v1/users/:id          // Full update (replace entire resource)
PATCH  /api/v1/users/:id          // Partial update (update specific fields)
DELETE /api/v1/users/:id          // Delete user
```

### Nested Resources

```javascript
// User's orders (max 2 levels)
GET    /api/v1/users/:id/orders
POST   /api/v1/users/:id/orders
GET    /api/v1/users/:id/orders/:orderId

// ✗ Avoid deep nesting (3+ levels)
GET    /api/v1/users/:id/orders/:orderId/items/:itemId  // Too deep!

// ✓ Better: Flatten with query params
GET    /api/v1/order-items?order_id=:orderId
```

### Actions on Resources

When RESTful verbs aren't enough:

```javascript
// Use POST with descriptive action
POST   /api/v1/users/:id/verify-email
POST   /api/v1/users/:id/reset-password
POST   /api/v1/orders/:id/cancel
POST   /api/v1/orders/:id/refund

// ✗ Avoid
GET    /api/v1/verifyEmail/:id
POST   /api/v1/cancelOrder
```

---

## Versioning

### URL Versioning (Recommended)

```javascript
/api/v1/users
/api/v2/users

// Major version only (v1, v2, v3)
// Don't use v1.2, v1.3
```

**Why URL versioning?**
- Clear and visible
- Easy to route
- Simple to maintain multiple versions

---

## Request Format

### Headers

```http
POST /api/v1/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Request Body (POST/PUT/PATCH)

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "phone_number": "+1234567890"
}
```

**Rules:**
- Use `snake_case` for JSON keys
- Keep consistent with database column names
- No nested objects unless truly necessary

### Query Parameters (GET)

```javascript
// Filtering
GET /api/v1/users?status=active&role=admin

// Pagination
GET /api/v1/users?page=2&limit=20

// Sorting
GET /api/v1/users?sort=-created_at  // DESC (prefix with -)
GET /api/v1/users?sort=full_name    // ASC

// Searching
GET /api/v1/users?search=john

// Multiple filters
GET /api/v1/users?status=active&created_after=2025-01-01&sort=-created_at&page=1&limit=20
```

---

## Response Format

### Success Response Structure

```javascript
{
  "success": true,
  "data": {
    // Resource data or array of resources
  },
  "message": "Optional success message",
  "pagination": {  // Only for list endpoints
    // Pagination metadata
  }
}
```

### Single Resource (GET /users/:id)

```json
{
  "success": true,
  "data": {
    "id": 123,
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_active": true,
    "created_at": "2025-02-10T10:30:00Z",
    "updated_at": "2025-02-10T10:30:00Z"
  }
}
```

### Resource List (GET /users)

```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "email": "user1@example.com",
      "full_name": "John Doe"
    },
    {
      "id": 124,
      "email": "user2@example.com",
      "full_name": "Jane Smith"
    }
  ],
  "pagination": {
    "current_page": 2,
    "per_page": 20,
    "total_pages": 10,
    "total_items": 200,
    "has_next": true,
    "has_previous": true
  },
  "links": {
    "first": "/api/v1/users?page=1&limit=20",
    "prev": "/api/v1/users?page=1&limit=20",
    "next": "/api/v1/users?page=3&limit=20",
    "last": "/api/v1/users?page=10&limit=20"
  }
}
```

### Create Response (POST /users)

```json
{
  "success": true,
  "data": {
    "id": 123,
    "email": "user@example.com",
    "full_name": "John Doe",
    "created_at": "2025-02-10T10:30:00Z"
  },
  "message": "User created successfully"
}
```

### Update Response (PATCH /users/:id)

```json
{
  "success": true,
  "data": {
    "id": 123,
    "email": "user@example.com",
    "full_name": "John Updated",
    "updated_at": "2025-02-10T11:45:00Z"
  },
  "message": "User updated successfully"
}
```

### Delete Response (DELETE /users/:id)

```json
{
  "success": true,
  "message": "User deleted successfully"
}

// Or with 204 No Content (no body)
```

---

## Error Response Format

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": []  // Optional array of specific errors
  },
  "request_id": "req_xyz123"  // For debugging/logging
}
```

### Validation Error (400)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  },
  "request_id": "req_abc456"
}
```

### Not Found Error (404)

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  },
  "request_id": "req_def789"
}
```

### Authentication Error (401)

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  },
  "request_id": "req_ghi012"
}
```

### Forbidden Error (403)

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to access this resource"
  },
  "request_id": "req_jkl345"
}
```

### Conflict Error (409)

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Email already exists"
  },
  "request_id": "req_mno678"
}
```

### Server Error (500)

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  },
  "request_id": "req_pqr901"
}
```

---

## HTTP Status Codes

### Success Codes (2xx)

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 OK | Success | GET, PUT, PATCH, DELETE (with body) |
| 201 Created | Resource created | POST |
| 204 No Content | Success, no body | DELETE (without body) |

### Client Error Codes (4xx)

| Code | Meaning | Use Case |
|------|---------|----------|
| 400 Bad Request | Invalid input | Validation errors |
| 401 Unauthorized | Not authenticated | Missing/invalid token |
| 403 Forbidden | Authenticated but not authorized | Permission denied |
| 404 Not Found | Resource doesn't exist | User not found |
| 409 Conflict | Resource conflict | Duplicate email |
| 422 Unprocessable Entity | Validation failed | Business logic validation |
| 429 Too Many Requests | Rate limit exceeded | Too many attempts |

### Server Error Codes (5xx)

| Code | Meaning | Use Case |
|------|---------|----------|
| 500 Internal Server Error | Unexpected error | Unhandled exceptions |
| 503 Service Unavailable | Service temporarily down | Maintenance |

---

## Pagination

### Query Parameters

```javascript
?page=2&limit=20

// Defaults
page = 1
limit = 20 (max 100)
```

### Response Format

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "current_page": 2,
    "per_page": 20,
    "total_pages": 10,
    "total_items": 200,
    "has_next": true,
    "has_previous": true
  },
  "links": {
    "first": "/api/v1/users?page=1&limit=20",
    "prev": "/api/v1/users?page=1&limit=20",
    "next": "/api/v1/users?page=3&limit=20",
    "last": "/api/v1/users?page=10&limit=20"
  }
}
```

### Implementation

```javascript
// Repository method
async findAll({ page = 1, limit = 20, filters = {}, sort = '-created_at' }) {
  const offset = (page - 1) * limit;
  
  let query = db(this.tableName).whereNull('deleted_at');
  
  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    query = query.where(key, value);
  });
  
  // Apply sorting
  const [sortField, sortOrder] = sort.startsWith('-') 
    ? [sort.slice(1), 'desc'] 
    : [sort, 'asc'];
  query = query.orderBy(sortField, sortOrder);
  
  // Get total count
  const [{ count }] = await query.clone().count('* as count');
  
  // Get paginated data
  const data = await query.limit(limit).offset(offset);
  
  return {
    data,
    pagination: {
      current_page: page,
      per_page: limit,
      total_items: parseInt(count),
      total_pages: Math.ceil(count / limit),
      has_next: page < Math.ceil(count / limit),
      has_previous: page > 1
    }
  };
}
```

---

## Filtering

### Query Parameters

```javascript
// Single filter
?status=active

// Multiple filters (AND)
?status=active&role=admin

// Date range
?created_after=2025-01-01&created_before=2025-12-31

// Nested filters (use bracket notation)
?filter[status]=active&filter[is_verified]=true
```

### Implementation

```javascript
// Example controller
async getUsers(req, res, next) {
  try {
    const { status, role, created_after, created_before, page, limit } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (role) filters.role = role;
    
    const result = await this.userService.getUsers({
      filters,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20
    });
    
    return ApiResponse.success(res, result.data, { pagination: result.pagination });
  } catch (error) {
    next(error);
  }
}
```

---

## Sorting

### Query Parameter

```javascript
// Ascending
?sort=created_at
?sort=full_name

// Descending (prefix with -)
?sort=-created_at
?sort=-total_amount

// Multiple sorts
?sort=-created_at,full_name
```

---

## Searching

### Simple Search

```javascript
// Search across multiple fields
?search=john

// Backend implementation
if (req.query.search) {
  query = query.where(function() {
    this.where('full_name', 'ilike', `%${search}%`)
        .orWhere('email', 'ilike', `%${search}%`)
  });
}
```

### Field-Specific Search

```javascript
?email=john@example.com
?full_name=john
```

---

## Authentication

### Header Format

```http
Authorization: Bearer <token>
```

### Response for Missing Token (401)

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "No token provided"
  }
}
```

### Response for Invalid Token (401)

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

---

## Rate Limiting

### Response Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1644512400
```

### Response When Limited (429)

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retry_after": 900
  }
}
```

---

## CORS Headers

```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

---

## Content Negotiation

### Request Headers

```http
Accept: application/json
Content-Type: application/json
```

### Response Headers

```http
Content-Type: application/json; charset=utf-8
```

---

## Idempotency

### Safe Methods (No Side Effects)

- GET
- HEAD
- OPTIONS

### Idempotent Methods (Same Result)

- GET
- PUT
- DELETE
- HEAD
- OPTIONS

### Non-Idempotent Methods

- POST (creates new resource each time)

### Idempotency Keys

For POST requests that should be idempotent:

```http
POST /api/v1/payments
Idempotency-Key: unique-key-123

// Same key returns same response (doesn't recreate)
```

---

## API Response Helper

```javascript
// utils/api-response.js

class ApiResponse {
  static success(res, data, { pagination = null, message = null } = {}) {
    const response = {
      success: true,
      data
    };
    
    if (message) response.message = message;
    if (pagination) response.pagination = pagination;
    
    return res.status(200).json(response);
  }
  
  static created(res, data, message = 'Resource created successfully') {
    return res.status(201).json({
      success: true,
      data,
      message
    });
  }
  
  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = { ApiResponse };
```

---

## Complete Endpoint Example

```javascript
// GET /api/v1/users?status=active&page=2&limit=10&sort=-created_at

// Request
GET /api/v1/users?status=active&page=2&limit=10&sort=-created_at HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "success": true,
  "data": [
    {
      "id": 123,
      "email": "user1@example.com",
      "full_name": "John Doe",
      "status": "active",
      "created_at": "2025-02-10T10:30:00Z"
    },
    {
      "id": 124,
      "email": "user2@example.com",
      "full_name": "Jane Smith",
      "status": "active",
      "created_at": "2025-02-09T15:20:00Z"
    }
  ],
  "pagination": {
    "current_page": 2,
    "per_page": 10,
    "total_pages": 5,
    "total_items": 50,
    "has_next": true,
    "has_previous": true
  },
  "links": {
    "first": "/api/v1/users?status=active&page=1&limit=10&sort=-created_at",
    "prev": "/api/v1/users?status=active&page=1&limit=10&sort=-created_at",
    "next": "/api/v1/users?status=active&page=3&limit=10&sort=-created_at",
    "last": "/api/v1/users?status=active&page=5&limit=10&sort=-created_at"
  }
}
```

---

## Summary Checklist

- [ ] Use plural resource names
- [ ] Version API with /v1, /v2 in URL
- [ ] Use proper HTTP verbs (GET, POST, PUT, PATCH, DELETE)
- [ ] Use correct HTTP status codes
- [ ] Consistent response format (success/error)
- [ ] Include pagination for list endpoints
- [ ] Support filtering, sorting, searching
- [ ] Use snake_case for JSON keys
- [ ] Include request_id in error responses
- [ ] Set appropriate headers (CORS, Content-Type)

---

**Related Guidelines:**
- [Error Handling](06_error_handling.md) - Error response details
- [Code Organization](04_code_organization.md) - Controller layer
- [Security Guidelines](08_security_guidelines.md) - Authentication
