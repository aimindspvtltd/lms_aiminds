# Testing Standards

**Focus:** Unit tests, integration tests, coverage requirements

---

## Test Structure

```
tests/
├── unit/               # Unit tests (isolated)
│   ├── services/
│   │   └── user-service.test.js
│   ├── utils/
│   │   └── crypto.test.js
│   └── validators/
│       └── user-validator.test.js
├── integration/        # Integration tests (with DB)
│   └── api/
│       ├── users.test.js
│       └── orders.test.js
└── e2e/               # End-to-end tests
    └── user-registration-flow.test.js
```

---

## Unit Tests

### Service Layer Testing

```javascript
// tests/unit/services/user-service.test.js

const { UserService } = require('../../../src/services/user-service');
const { UserRepository } = require('../../../src/repositories/user-repository');
const { ConflictError, NotFoundError } = require('../../../src/utils/errors');

// Mock dependencies
jest.mock('../../../src/repositories/user-repository');
jest.mock('../../../src/services/email-service');

describe('UserService', () => {
  let userService;
  let mockUserRepo;

  beforeEach(() => {
    mockUserRepo = new UserRepository();
    userService = new UserService();
    userService.userRepo = mockUserRepo;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    const userData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      full_name: 'Test User'
    };

    it('should create user successfully', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.create.mockResolvedValue({
        id: 1,
        email: userData.email,
        full_name: userData.full_name,
        password_hash: 'hashed'
      });

      const user = await userService.createUser(userData);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.password_hash).toBeUndefined();
      expect(mockUserRepo.create).toHaveBeenCalled();
    });

    it('should throw ConflictError if email exists', async () => {
      mockUserRepo.findByEmail.mockResolvedValue({
        id: 1,
        email: userData.email
      });

      await expect(userService.createUser(userData))
        .rejects.toThrow(ConflictError);
    });
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      mockUserRepo.findById.mockResolvedValue(mockUser);

      const user = await userService.getUserById(1);

      expect(user).toEqual(mockUser);
    });

    it('should throw NotFoundError if user not found', async () => {
      mockUserRepo.findById.mockResolvedValue(null);

      await expect(userService.getUserById(999))
        .rejects.toThrow(NotFoundError);
    });
  });
});
```

---

## Integration Tests

### API Testing

```javascript
// tests/integration/api/users.test.js

const request = require('supertest');
const app = require('../../../src/app');
const db = require('../../../src/config/database');

describe('Users API', () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.migrate.rollback();
    await db.destroy();
  });

  beforeEach(async () => {
    await db('users').del();
  });

  describe('POST /api/v1/users', () => {
    it('should create user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        full_name: 'Test User'
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.password_hash).toBeUndefined();
    });

    it('should return 400 with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'SecurePass123!',
        full_name: 'Test User'
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 409 for duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        full_name: 'Test User'
      };

      await request(app).post('/api/v1/users').send(userData);

      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(409);

      expect(response.body.error.code).toBe('CONFLICT');
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should get user by id', async () => {
      const user = await db('users').insert({
        email: 'test@example.com',
        password_hash: 'hashed',
        full_name: 'Test User'
      }).returning('*');

      const response = await request(app)
        .get(`/api/v1/users/${user[0].id}`)
        .expect(200);

      expect(response.body.data.email).toBe('test@example.com');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/v1/users/999')
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });
});
```

---

## Coverage Requirements

- **Unit Tests**: Minimum 80% coverage
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user flows

---

## Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Coverage report
npm run test:coverage

# Watch mode
npm run test:watch
```

---

**Related Guidelines:**
- [Code Organization](04_code_organization.md) - Layers to test
- [Error Handling](06_error_handling.md) - Testing errors
