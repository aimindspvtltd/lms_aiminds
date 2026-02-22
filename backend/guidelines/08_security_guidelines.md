# Security Guidelines

**Focus:** Authentication, authorization, input validation, encryption

---

## Authentication

### JWT Implementation

```javascript
// utils/jwt.js

const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN || '24h'
  });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
```

### Auth Middleware

```javascript
// middlewares/auth.js

const { verifyToken } = require('../utils/jwt');
const { UnauthorizedError } = require('../utils/errors');

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}

module.exports = { authenticateToken };
```

---

## Password Security

### Hashing

```javascript
// utils/crypto.js

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = { hashPassword, comparePassword };
```

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

## Input Validation

### SQL Injection Prevention

```javascript
// ✓ Good: Use query builder (Knex)
db('users').where({ id: userId }).first();

// ✓ Good: Named parameters
db.raw('SELECT * FROM users WHERE id = :id', { id: userId });

// ✗ Bad: String concatenation
db.raw(`SELECT * FROM users WHERE id = ${userId}`);
```

### XSS Prevention

```javascript
// Sanitize HTML input
const sanitizeHtml = require('sanitize-html');

function sanitizeInput(input) {
  if (typeof input === 'string') {
    return sanitizeHtml(input.trim(), {
      allowedTags: [],
      allowedAttributes: {}
    });
  }
  return input;
}
```

---

## Environment Variables

```javascript
// config/env.js

require('dotenv').config();

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'NODE_ENV'
];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
}

module.exports = {
  database: { url: process.env.DATABASE_URL },
  jwt: { secret: process.env.JWT_SECRET },
  nodeEnv: process.env.NODE_ENV
};
```

---

## Security Checklist

- [ ] Passwords are hashed (bcrypt)
- [ ] JWT tokens are used for authentication
- [ ] Input is validated (Zod/Joi)
- [ ] SQL injection prevented (query builders)
- [ ] XSS prevented (sanitize inputs)
- [ ] Sensitive data not logged
- [ ] Environment variables secured
- [ ] HTTPS enforced in production
- [ ] Rate limiting implemented
- [ ] CORS configured properly

---

**Related Guidelines:**
- [API Design](03_api_design.md) - Authentication headers
- [Error Handling](06_error_handling.md) - Security error handling
