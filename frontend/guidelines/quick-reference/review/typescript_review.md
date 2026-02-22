# TypeScript Review Checklist

**For:** REVIEWER  
**Purpose:** Review TypeScript usage and type safety

---

## 📋 TypeScript Review

### ✅ 1. No `any` Type

**Check:**
- [ ] No `any` types in code
- [ ] All parameters typed
- [ ] All return types explicit
- [ ] Unknown types properly handled

```typescript
// ❌ Bad
function handleData(data: any) {
  return data.map((item: any) => item.id);
}

// ✅ Good
function handleData(data: User[]): string[] {
  return data.map((item: User) => item.id);
}
```

---

### ✅ 2. Proper Interface/Type Usage

**Check:**
- [ ] Interfaces for objects
- [ ] Types for unions/primitives
- [ ] Props interfaces named `ComponentNameProps`
- [ ] No duplicate type definitions

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
}

type Status = 'active' | 'inactive';

interface UserCardProps {
  user: User;
  status: Status;
}

// ❌ Bad
type User = {  // Should be interface
  id: string;
  name: string;
}

interface Status {  // Should be type
  value: 'active' | 'inactive';
}
```

---

### ✅ 3. Function Types

**Check:**
- [ ] All parameters typed
- [ ] Return type explicit
- [ ] Async functions return Promise<T>
- [ ] Event handlers properly typed

```typescript
// ✅ Good
function getUser(id: string): Promise<User> {
  return api.get(`/users/${id}`);
}

const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
  console.log(e.currentTarget);
};

// ❌ Bad
function getUser(id) {  // No types
  return api.get(`/users/${id}`);
}

const handleClick = (e) => {  // No type
  console.log(e);
};
```

---

### ✅ 4. Generic Types

**Check:**
- [ ] Generics used appropriately
- [ ] Generic constraints when needed
- [ ] No over-engineering with generics

```typescript
// ✅ Good
interface ApiResponse<T> {
  data: T;
  success: boolean;
}

function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  return api.get(url);
}

// ❌ Bad
interface ApiResponse<T, U, V, W> {  // Too many generics
  data: T;
}
```

---

### ✅ 5. Null/Undefined Handling

**Check:**
- [ ] Proper null checks
- [ ] Optional chaining used correctly
- [ ] Nullish coalescing for defaults
- [ ] Non-null assertion (!) used sparingly

```typescript
// ✅ Good
const name = user?.name ?? 'Anonymous';

if (user) {
  console.log(user.name);
}

// ❌ Bad
const name = user!.name;  // Forcing non-null
const name = user?.name?.toString()?.toUpperCase();  // Too much chaining
```

---

### ✅ 6. Type Assertions

**Check:**
- [ ] Type assertions minimal
- [ ] `as` used correctly (not `<Type>`)
- [ ] No `as any`

```typescript
// ✅ Good
const button = document.querySelector('button') as HTMLButtonElement;

// ❌ Bad
const button = <HTMLButtonElement>document.querySelector('button');  // Old syntax
const data = response as any;  // Defeating TypeScript
```

---

### ✅ 7. React Types

**Check:**
- [ ] Props typed with interface
- [ ] Event handlers typed
- [ ] Refs typed
- [ ] Children typed

```typescript
// ✅ Good
interface Props {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

// ❌ Bad
interface Props {
  children: any;
  onClick: Function;
}
```

---

### ✅ 8. Import/Export Types

**Check:**
- [ ] Types exported from correct files
- [ ] Type imports use `import type`
- [ ] No circular type dependencies

```typescript
// ✅ Good
import type { User } from '@/types';
export type { UserProps };

// ❌ Bad
import { User } from '@/types';  // Importing type as value
```

---

## 🚨 Red Flags

- ❌ `any` used more than once
- ❌ No return types on functions
- ❌ `!` (non-null assertion) used frequently
- ❌ Type assertions everywhere
- ❌ Props not typed

---

## ✅ Pass Criteria

- ✅ No `any` types
- ✅ All functions typed
- ✅ Props properly typed
- ✅ Null handling correct
- ✅ Appropriate use of generics

---

**Verdict:** PASS / FAIL / NEEDS WORK
