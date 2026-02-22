# Code Organization Guidelines

**Focus:** Layered architecture - Controller, Service, Repository, Validator

---

## Layered Architecture

```
Request Flow:
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────┐
│ Controller  │ ← HTTP handling, validation
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Service    │ ← Business logic
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Repository  │ ← Database queries
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Database   │
└─────────────┘
```

**Separation of Concerns:**
- **Controller**: Handle HTTP, validate input, format responses
- **Service**: Business logic, orchestration, transactions
- **Repository**: Database operations only
- **Validator**: Input validation schemas

---

## Controller Layer

### Responsibilities

✓ **What Controllers DO:**
- Handle HTTP requests/responses
- Validate input using schemas
- Call service methods
- Format API responses
- Handle authentication/authorization checks

✗ **What Controllers DON'T DO:**
- Business logic
- Database queries
- Data transformation (beyond formatting)
- Complex calculations

### Structure

```javascript
// controllers/user-controller.js

const { UserService } = require('../services/user-service');
const { CreateUserSchema, UpdateUserSchema } = require('../validators/user-validator');
const { ApiResponse } = require('../utils/api-response');

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  /**
   * Create a new user
   * @route POST /api/v1/users
   */
  async createUser(req, res, next) {
    try {
      // 1. Validate input
      const validatedData = CreateUserSchema.parse(req.body);
      
      // 2. Call service
      const user = await this.userService.createUser(validatedData);
      
      // 3. Format response
      return ApiResponse.created(res, user, 'User created successfully');
    } catch (error) {
      next(error);  // Pass to error handler middleware
    }
  }

  /**
   * Get user by ID
   * @route GET /api/v1/users/:id
   */
  async getUserById(req, res, next) {
    try {
      const userId = parseInt(req.params.id);
      const user = await this.userService.getUserById(userId);
      
      return ApiResponse.success(res, user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user
   * @route PATCH /api/v1/users/:id
   */
  async updateUser(req, res, next) {
    try {
      const userId = parseInt(req.params.id);
      const validatedData = UpdateUserSchema.parse(req.body);
      
      const user = await this.userService.updateUser(userId, validatedData);
      
      return ApiResponse.success(res, user, { message: 'User updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user
   * @route DELETE /api/v1/users/:id
   */
  async deleteUser(req, res, next) {
    try {
      const userId = parseInt(req.params.id);
      await this.userService.deleteUser(userId);
      
      return ApiResponse.success(res, null, { message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * List users with pagination
   * @route GET /api/v1/users
   */
  async listUsers(req, res, next) {
    try {
      const { page, limit, status, sort, search } = req.query;
      
      const result = await this.userService.listUsers({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        filters: { status },
        sort: sort || '-created_at',
        search
      });
      
      return ApiResponse.success(res, result.data, { pagination: result.pagination });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { UserController };
```

### Controller Best Practices

1. **Keep methods thin** - Delegate to services
2. **One route per method** - Don't handle multiple routes in one method
3. **Always use try-catch** - Error handling middleware needs this
4. **Validate early** - Use schemas before calling services
5. **Don't expose sensitive data** - Service should handle this, but double-check

---

## Service Layer

### Responsibilities

✓ **What Services DO:**
- Implement business logic
- Coordinate between repositories
- Handle transactions
- Validate business rules
- Transform data
- Orchestrate external service calls

✗ **What Services DON'T DO:**
- HTTP handling
- Database queries (use repositories)
- Input validation (use validators)

### Structure

```javascript
// services/user-service.js

const { UserRepository } = require('../repositories/user-repository');
const { EmailService } = require('./email-service');
const { hashPassword, comparePassword } = require('../utils/crypto');
const { ConflictError, NotFoundError, UnauthorizedError } = require('../utils/errors');
const db = require('../config/database');

class UserService {
  constructor() {
    this.userRepo = new UserRepository();
    this.emailService = new EmailService();
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    // 1. Business logic: Check if user exists
    const existingUser = await this.userRepo.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // 2. Transform data: Hash password
    const passwordHash = await hashPassword(userData.password);

    // 3. Use transaction for data integrity
    const user = await db.transaction(async (trx) => {
      // Create user
      const newUser = await this.userRepo.create({
        email: userData.email,
        password_hash: passwordHash,
        full_name: userData.full_name,
        phone_number: userData.phone_number
      }, trx);

      // 4. Orchestrate: Send verification email (async, don't block)
      this.emailService.sendVerificationEmail(newUser.email).catch(err => {
        console.error('Failed to send verification email:', err);
        // Log but don't fail the request
      });

      return newUser;
    });

    // 5. Security: Remove sensitive data
    delete user.password_hash;
    return user;
  }

  /**
   * Get user by ID
   * @param {number} userId
   * @returns {Promise<Object>} User object
   */
  async getUserById(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    // Remove sensitive data
    delete user.password_hash;
    return user;
  }

  /**
   * Update user
   * @param {number} userId
   * @param {Object} updates
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(userId, updates) {
    // Check if user exists
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Business rule: Can't change email to existing email
    if (updates.email && updates.email !== user.email) {
      const existingUser = await this.userRepo.findByEmail(updates.email);
      if (existingUser) {
        throw new ConflictError('Email already in use');
      }
    }

    const updatedUser = await this.userRepo.update(userId, updates);
    delete updatedUser.password_hash;
    return updatedUser;
  }

  /**
   * Delete user (soft delete)
   * @param {number} userId
   * @returns {Promise<boolean>}
   */
  async deleteUser(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.userRepo.softDelete(userId);
  }

  /**
   * List users with filters and pagination
   * @param {Object} options
   * @returns {Promise<Object>} { data, pagination }
   */
  async listUsers(options) {
    const result = await this.userRepo.findAll(options);
    
    // Remove sensitive data from all users
    result.data = result.data.map(user => {
      delete user.password_hash;
      return user;
    });
    
    return result;
  }

  /**
   * Authenticate user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} User with token
   */
  async authenticate(email, password) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!user.is_active) {
      throw new UnauthorizedError('Account is deactivated');
    }

    // Update last login
    await this.userRepo.update(user.id, { 
      last_login_at: new Date() 
    });

    delete user.password_hash;
    return user;
  }
}

module.exports = { UserService };
```

### Service Best Practices

1. **Single Responsibility** - One service per domain entity
2. **Use Transactions** - For multi-step operations
3. **Throw Errors** - Don't return error objects, throw exceptions
4. **Remove Sensitive Data** - Before returning to controller
5. **Async Operations** - Use promises/async-await
6. **Don't Query Directly** - Always use repositories

---

## Repository Layer

### Responsibilities

✓ **What Repositories DO:**
- Execute database queries
- Map database results to objects
- Handle database-specific logic (pagination, sorting)

✗ **What Repositories DON'T DO:**
- Business logic
- Data validation
- Transactions (initiated by services)
- Data transformation (beyond DB mapping)

### Structure

```javascript
// repositories/user-repository.js

const db = require('../config/database');

class UserRepository {
  constructor() {
    this.tableName = 'users';
  }

  /**
   * Find user by ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    return db(this.tableName)
      .where({ id })
      .whereNull('deleted_at')  // Exclude soft-deleted
      .first();
  }

  /**
   * Find user by email
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    return db(this.tableName)
      .where({ email })
      .whereNull('deleted_at')
      .first();
  }

  /**
   * Create new user
   * @param {Object} userData
   * @param {Object} trx - Optional transaction
   * @returns {Promise<Object>}
   */
  async create(userData, trx = null) {
    const query = db(this.tableName)
      .insert(userData)
      .returning('*');
    
    if (trx) {
      return query.transacting(trx).then(rows => rows[0]);
    }
    
    return query.then(rows => rows[0]);
  }

  /**
   * Update user
   * @param {number} id
   * @param {Object} updates
   * @returns {Promise<Object>}
   */
  async update(id, updates) {
    // Auto-update timestamp
    updates.updated_at = new Date();
    
    return db(this.tableName)
      .where({ id })
      .whereNull('deleted_at')
      .update(updates)
      .returning('*')
      .then(rows => rows[0]);
  }

  /**
   * Soft delete user
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async softDelete(id) {
    const deleted = await db(this.tableName)
      .where({ id })
      .update({ 
        deleted_at: new Date(),
        updated_at: new Date()
      });
    
    return deleted > 0;
  }

  /**
   * Hard delete user
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async hardDelete(id) {
    const deleted = await db(this.tableName)
      .where({ id })
      .del();
    
    return deleted > 0;
  }

  /**
   * Find users with pagination and filters
   * @param {Object} options - { page, limit, filters, sort }
   * @returns {Promise<Object>} { data, pagination }
   */
  async findAll({ page = 1, limit = 20, filters = {}, sort = '-created_at', search = null }) {
    const offset = (page - 1) * limit;
    
    let query = db(this.tableName).whereNull('deleted_at');
    
    // Apply filters
    if (filters.is_active !== undefined) {
      query = query.where({ is_active: filters.is_active });
    }
    if (filters.status) {
      query = query.where({ status: filters.status });
    }
    
    // Apply search
    if (search) {
      query = query.where(function() {
        this.where('full_name', 'ilike', `%${search}%`)
            .orWhere('email', 'ilike', `%${search}%`);
      });
    }
    
    // Apply sorting
    const [sortField, sortOrder] = sort.startsWith('-') 
      ? [sort.slice(1), 'desc'] 
      : [sort, 'asc'];
    query = query.orderBy(sortField, sortOrder);
    
    // Get total count (before pagination)
    const countQuery = query.clone().count('* as count');
    const [{ count }] = await countQuery;
    
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

  /**
   * Count users by filter
   * @param {Object} filters
   * @returns {Promise<number>}
   */
  async count(filters = {}) {
    let query = db(this.tableName).whereNull('deleted_at');
    
    Object.entries(filters).forEach(([key, value]) => {
      query = query.where(key, value);
    });
    
    const [{ count }] = await query.count('* as count');
    return parseInt(count);
  }

  /**
   * Check if user exists
   * @param {Object} criteria
   * @returns {Promise<boolean>}
   */
  async exists(criteria) {
    const result = await db(this.tableName)
      .where(criteria)
      .whereNull('deleted_at')
      .first();
    
    return !!result;
  }
}

module.exports = { UserRepository };
```

### Repository Best Practices

1. **One Repository per Table** - UserRepository for users table
2. **Return Raw Data** - No business logic or data hiding
3. **Support Transactions** - Accept trx parameter
4. **Reusable Queries** - Create helper methods
5. **Consistent Naming** - find*, create, update, delete
6. **Always Filter Soft Deletes** - Exclude deleted_at IS NOT NULL

---

## Validator Layer

### Responsibilities

✓ **What Validators DO:**
- Define input schemas
- Validate data types
- Validate formats (email, phone)
- Validate constraints (min, max, required)

✗ **What Validators DON'T DO:**
- Business logic validation
- Database checks
- Data transformation

### Structure (Using Zod)

```javascript
// validators/user-validator.js

const { z } = require('zod');

/**
 * Schema for creating a user
 */
const CreateUserSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email too long')
    .transform(val => val.toLowerCase()),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain special character'),
  
  full_name: z.string()
    .min(2, 'Name too short')
    .max(255, 'Name too long')
    .trim(),
  
  phone_number: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .optional()
});

/**
 * Schema for updating a user
 */
const UpdateUserSchema = z.object({
  full_name: z.string()
    .min(2, 'Name too short')
    .max(255, 'Name too long')
    .trim()
    .optional(),
  
  phone_number: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .optional(),
  
  bio: z.string()
    .max(1000, 'Bio too long')
    .optional()
});

/**
 * Schema for login
 */
const LoginSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .transform(val => val.toLowerCase()),
  
  password: z.string()
    .min(1, 'Password is required')
});

module.exports = {
  CreateUserSchema,
  UpdateUserSchema,
  LoginSchema
};
```

### Validator Best Practices

1. **One File per Resource** - user-validator.js for user schemas
2. **Export Named Schemas** - CreateUserSchema, UpdateUserSchema
3. **Descriptive Error Messages** - User-friendly messages
4. **Use Transforms** - Normalize data (lowercase emails, trim strings)
5. **Optional vs Required** - Be explicit

---

## Dependency Injection

### Manual Injection (Recommended for simplicity)

```javascript
// services/user-service.js
class UserService {
  constructor(userRepo = null, emailService = null) {
    this.userRepo = userRepo || new UserRepository();
    this.emailService = emailService || new EmailService();
  }
}

// Easy to test
const mockRepo = new MockUserRepository();
const service = new UserService(mockRepo);
```

---

## Complete Example: Order Creation

### Controller

```javascript
// controllers/order-controller.js
class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  async createOrder(req, res, next) {
    try {
      const validatedData = CreateOrderSchema.parse(req.body);
      const userId = req.user.id;  // From auth middleware
      
      const order = await this.orderService.createOrder(userId, validatedData);
      
      return ApiResponse.created(res, order, 'Order created successfully');
    } catch (error) {
      next(error);
    }
  }
}
```

### Service

```javascript
// services/order-service.js
class OrderService {
  constructor() {
    this.orderRepo = new OrderRepository();
    this.productRepo = new ProductRepository();
    this.userRepo = new UserRepository();
  }

  async createOrder(userId, orderData) {
    // 1. Validate user exists
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // 2. Validate products and calculate total
    let totalAmount = 0;
    for (const item of orderData.items) {
      const product = await this.productRepo.findById(item.product_id);
      if (!product) {
        throw new NotFoundError(`Product ${item.product_id} not found`);
      }
      if (product.stock < item.quantity) {
        throw new ValidationError(`Insufficient stock for ${product.name}`);
      }
      totalAmount += product.price * item.quantity;
    }

    // 3. Create order in transaction
    const order = await db.transaction(async (trx) => {
      // Create order
      const newOrder = await this.orderRepo.create({
        user_id: userId,
        total_amount: totalAmount,
        status: 'pending'
      }, trx);

      // Create order items
      for (const item of orderData.items) {
        await this.orderRepo.createOrderItem({
          order_id: newOrder.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        }, trx);

        // Update product stock
        await this.productRepo.decrementStock(
          item.product_id, 
          item.quantity, 
          trx
        );
      }

      return newOrder;
    });

    return order;
  }
}
```

### Repository

```javascript
// repositories/order-repository.js
class OrderRepository {
  async create(orderData, trx = null) {
    const query = db('orders').insert(orderData).returning('*');
    if (trx) return query.transacting(trx).then(rows => rows[0]);
    return query.then(rows => rows[0]);
  }

  async createOrderItem(itemData, trx = null) {
    const query = db('order_items').insert(itemData).returning('*');
    if (trx) return query.transacting(trx).then(rows => rows[0]);
    return query.then(rows => rows[0]);
  }
}
```

---

## Summary

**Layering Rules:**
1. **Controller** → Calls Service only
2. **Service** → Calls Repositories only
3. **Repository** → Calls Database only
4. **Never skip layers** - No Controller → Repository direct calls

**Checklist:**
- [ ] Controllers are thin (just HTTP handling)
- [ ] Business logic is in Services
- [ ] Database queries are in Repositories
- [ ] Validation uses schemas
- [ ] Services use transactions for multi-step operations
- [ ] Sensitive data is removed before returning
- [ ] Each layer has single responsibility

---

**Related Guidelines:**
- [Project Structure](01_project_structure.md) - Where to put files
- [API Design](03_api_design.md) - Request/response formats
- [Testing Standards](07_testing_standards.md) - How to test each layer
