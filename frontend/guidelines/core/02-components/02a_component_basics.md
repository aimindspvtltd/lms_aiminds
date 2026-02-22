# 02a: Component Basics

**File:** 02a_component_basics.md  
**Lines:** ~300  
**For:** ARCHITECT, EXECUTOR, UX_DESIGNER

---

## Component Structure

### Basic Component Template

```typescript
// features/users/components/UserCard.tsx
import { User } from '../types/user.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  className?: string;
}

export function UserCard({ user, onEdit, onDelete, className }: UserCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{user.full_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{user.email}</p>
        {onEdit && (
          <Button onClick={() => onEdit(user)}>Edit</Button>
        )}
        {onDelete && (
          <Button variant="destructive" onClick={() => onDelete(user.id)}>
            Delete
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## Component Rules

### 1. Naming
- **PascalCase** for component names
- **Descriptive** names (UserCard, not Card)
- **Verb for actions** (CreateUserForm, not UserForm)

✅ Good:
```typescript
UserCard.tsx
CreateUserForm.tsx
UserProfileHeader.tsx
```

❌ Bad:
```typescript
userCard.tsx        // camelCase
UC.tsx             // Abbreviation
Component1.tsx     // Generic
```

---

### 2. File Naming

**Rule:** File name = Component name

```typescript
// ✅ Good
UserCard.tsx       → export function UserCard()
LoginForm.tsx      → export function LoginForm()

// ❌ Bad
userCard.tsx       → export function UserCard()  // Name mismatch
user.tsx           → export function UserCard()  // File name too generic
```

---

### 3. Exports

**Always use named exports:**

```typescript
// ✅ Good
export function UserCard() { }

// ❌ Bad
export default function UserCard() { }
```

**Why:**
- Better for refactoring
- Clear in imports
- Better IDE support

---

### 4. Props Interface

**Always define props interface:**

```typescript
// ✅ Good
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  className?: string;
}

export function UserCard({ user, onEdit, className }: UserCardProps) { }

// ❌ Bad
export function UserCard(props: any) { }  // No interface
export function UserCard(props) { }       // No types
```

---

### 5. Props Destructuring

**Destructure props in parameters:**

```typescript
// ✅ Good
export function UserCard({ user, onEdit, className }: UserCardProps) {
  return <div className={className}>{user.name}</div>;
}

// ❌ Bad
export function UserCard(props: UserCardProps) {
  return <div>{props.user.name}</div>;  // Accessing via props
}
```

---

### 6. Optional Props

**Use `?` for optional props:**

```typescript
interface UserCardProps {
  user: User;              // Required
  onEdit?: (user: User) => void;  // Optional
  className?: string;      // Optional
}
```

**Check before using:**
```typescript
{onEdit && (
  <Button onClick={() => onEdit(user)}>Edit</Button>
)}
```

---

### 7. Default Props

```typescript
interface UserCardProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

export function UserCard({ user, size = 'md' }: UserCardProps) {
  // size defaults to 'md' if not provided
}
```

---

## Component Size Limits

### Line Limits
- **< 200 lines** - Split if larger
- **< 100 lines** - Ideal for most components
- **< 50 lines** - Great for small components

### When to Split

**If component has:**
- Multiple responsibilities
- More than 200 lines
- More than 10 props
- Complex logic

**How to split:**
```typescript
// ❌ Bad - 250 lines, multiple responsibilities
function UserProfile() {
  return (
    <div>
      <Header /> {/* 50 lines */}
      <Stats />  {/* 60 lines */}
      <Posts />  {/* 100 lines */}
    </div>
  );
}

// ✅ Good - Split into separate components
function UserProfile() {
  return (
    <div>
      <UserHeader user={user} />
      <UserStats user={user} />
      <UserPosts posts={user.posts} />
    </div>
  );
}

function UserHeader({ user }: { user: User }) { /* 50 lines */ }
function UserStats({ user }: { user: User }) { /* 60 lines */ }
function UserPosts({ posts }: { posts: Post[] }) { /* 100 lines */ }
```

---

## Import Organization

**Order:**
1. React imports
2. External libraries
3. Internal imports (features, components)
4. Types
5. Styles

```typescript
// 1. React
import { useState, useEffect } from 'react';

// 2. External libraries
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 3. Internal - Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 4. Internal - Hooks/Services
import { useUser } from '../hooks/useUser';
import { userService } from '../services/user.service';

// 5. Types
import type { User } from '../types/user.types';
```

---

## TypeScript Patterns

### Type All Props

```typescript
// ✅ Good - All typed
interface Props {
  user: User;
  count: number;
  onSave: (data: FormData) => void;
  children?: React.ReactNode;
}

// ❌ Bad - Any types
interface Props {
  user: any;        // ❌
  onSave: any;      // ❌
}
```

### Event Handlers

```typescript
interface Props {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}
```

---

## Children Pattern

```typescript
interface Props {
  children: React.ReactNode;
}

export function Container({ children }: Props) {
  return <div className="container">{children}</div>;
}

// Usage
<Container>
  <UserCard user={user} />
</Container>
```

---

## Conditional Rendering

```typescript
// ✅ Good - Explicit
{isLoading && <LoadingSpinner />}
{error && <ErrorMessage error={error} />}
{data && <UserList users={data} />}

// ✅ Good - Ternary for either/or
{isLoading ? <LoadingSpinner /> : <UserList users={data} />}

// ❌ Bad - Nested ternaries
{isLoading ? <Spinner /> : error ? <Error /> : data ? <List /> : null}
```

---

## Key Prop in Lists

```typescript
// ✅ Good - Unique stable key
{users.map(user => (
  <UserCard key={user.id} user={user} />
))}

// ❌ Bad - Index as key (unstable)
{users.map((user, index) => (
  <UserCard key={index} user={user} />
))}
```

---

## Component Organization

**Within file:**
1. Imports
2. Types/Interfaces
3. Component function
4. Exported component

```typescript
// 1. Imports
import { User } from '../types/user.types';

// 2. Types
interface UserCardProps {
  user: User;
}

// 3. Component
export function UserCard({ user }: UserCardProps) {
  return <div>{user.name}</div>;
}
```

---

## Quick Checklist

Before committing component:
- [ ] Named export
- [ ] Props interface defined
- [ ] Props destructured
- [ ] All types explicit
- [ ] < 200 lines
- [ ] < 10 props
- [ ] Imports organized
- [ ] Keys on lists

---

**See also:**
- 02b_composition_patterns.md - Component composition
- 02d_props_patterns.md - Advanced props patterns
- 02e_component_rules.md - Size and complexity rules
