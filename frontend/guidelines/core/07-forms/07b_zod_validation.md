# Zod Validation

## Basic Schema
```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  name: z.string().min(2, 'Name is required'),
  age: z.number().min(18, 'Must be 18+').optional(),
});
```

## Complex Validations
```typescript
const formSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, 'Too short')
    .regex(/[A-Z]/, 'Must have uppercase')
    .regex(/[0-9]/, 'Must have number'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept terms',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});
```

## Custom Validation
```typescript
const schema = z.object({
  username: z.string().refine(
    async (username) => {
      const exists = await checkUsername(username);
      return !exists;
    },
    { message: 'Username taken' }
  ),
});
```
