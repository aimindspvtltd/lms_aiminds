# Common Code Patterns

## Controller Pattern

```javascript
class UserController {
  async createUser(req, res, next) {
    try {
      const validatedData = CreateUserSchema.parse(req.body);
      const user = await this.userService.createUser(validatedData);
      return ApiResponse.created(res, user, 'User created');
    } catch (error) {
      next(error);
    }
  }
}
```

## Service Pattern

```javascript
class UserService {
  async createUser(userData) {
    // 1. Business validation
    const existing = await this.userRepo.findByEmail(userData.email);
    if (existing) throw new ConflictError('Email exists');
    
    // 2. Transform data
    const passwordHash = await hashPassword(userData.password);
    
    // 3. Database operation
    const user = await this.userRepo.create({
      ...userData,
      password_hash: passwordHash
    });
    
    // 4. Remove sensitive data
    delete user.password_hash;
    return user;
  }
}
```

## Repository Pattern

```javascript
class UserRepository {
  async findById(id) {
    return db('users')
      .where({ id })
      .whereNull('deleted_at')
      .first();
  }
  
  async create(userData, trx = null) {
    const query = db('users').insert(userData).returning('*');
    if (trx) return query.transacting(trx).then(rows => rows[0]);
    return query.then(rows => rows[0]);
  }
}
```

## Error Throwing

```javascript
// Not found
if (!user) throw new NotFoundError('User not found');

// Conflict
if (existing) throw new ConflictError('Email exists');

// Unauthorized
if (!valid) throw new UnauthorizedError('Invalid credentials');

// Validation
throw new ValidationError('Invalid input', [
  { field: 'email', message: 'Email required' }
]);
```

## Pagination

```javascript
const { page = 1, limit = 20 } = req.query;
const offset = (page - 1) * limit;

const data = await db('users')
  .limit(limit)
  .offset(offset);

const [{ count }] = await db('users').count();

return {
  data,
  pagination: {
    current_page: page,
    per_page: limit,
    total_pages: Math.ceil(count / limit),
    total_items: parseInt(count)
  }
};
```

## Transaction Pattern

```javascript
const result = await db.transaction(async (trx) => {
  const user = await userRepo.create(userData, trx);
  await orderRepo.create({ user_id: user.id }, trx);
  return user;
});
```
