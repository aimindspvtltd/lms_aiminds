# Common Mistakes - What to Avoid

**For:** EXECUTOR, REVIEWER  
**Purpose:** Common pitfalls and how to avoid them

---

## 🚫 React Mistakes

### ❌ Not Using Keys in Lists
```typescript
// ❌ Bad
{users.map((user, index) => (
  <UserCard key={index} user={user} />  // Using index as key
))}

{users.map(user => (
  <UserCard user={user} />  // No key at all
))}

// ✅ Good
{users.map(user => (
  <UserCard key={user.id} user={user} />  // Unique, stable ID
))}
```

**Why:** Keys help React identify which items have changed. Using index causes bugs when list order changes.

---

### ❌ Inline Functions in Render
```typescript
// ❌ Bad - creates new function on every render
<Button onClick={() => handleClick(id)}>Click</Button>
<Button onClick={function() { handleClick(id); }}>Click</Button>

// ✅ Good - use useCallback or event handler
const onClick = useCallback(() => handleClick(id), [id]);
<Button onClick={onClick}>Click</Button>

// ✅ Also good for simple cases
<Button onClick={() => handleClick(user.id)}>Click</Button>  // OK if no performance issue
```

**Why:** Inline functions cause child components to re-render unnecessarily.

---

### ❌ Not Handling Loading/Error States
```typescript
// ❌ Bad
function UserList() {
  const { data } = useUsers();
  return <div>{data.map(...)}</div>;  // What if loading? What if error?
}

// ✅ Good
function UserList() {
  const { data, isLoading, error } = useUsers();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data || data.length === 0) return <EmptyState />;
  
  return <div>{data.map(...)}</div>;
}
```

**Why:** Users need feedback during async operations.

---

### ❌ Using useEffect for Data Fetching
```typescript
// ❌ Bad
function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);
  
  return <div>{users.map(...)}</div>;
}

// ✅ Good - use TanStack Query
function UserList() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
  });
  
  return <div>{data.map(...)}</div>;
}
```

**Why:** TanStack Query handles caching, loading, errors, and refetching automatically.

---

### ❌ Not Cleaning Up Effects
```typescript
// ❌ Bad
useEffect(() => {
  const interval = setInterval(() => {
    console.log('Tick');
  }, 1000);
  // No cleanup!
}, []);

// ✅ Good
useEffect(() => {
  const interval = setInterval(() => {
    console.log('Tick');
  }, 1000);
  
  return () => clearInterval(interval);  // Cleanup
}, []);
```

**Why:** Memory leaks and unexpected behavior.

---

## 🎨 Styling Mistakes

### ❌ Using Inline Styles
```typescript
// ❌ Bad
<div style={{ padding: '16px', backgroundColor: 'white' }}>

// ✅ Good
<div className="p-4 bg-background">
```

**Why:** Inline styles don't support dark mode, pseudo-classes, or responsive design.

---

### ❌ Hard-Coded Colors
```typescript
// ❌ Bad
<div className="bg-white text-black">
<div className="bg-gray-900 text-white">
<div className="bg-blue-500">

// ✅ Good
<div className="bg-background text-foreground">
<div className="bg-card text-card-foreground">
<div className="bg-primary text-primary-foreground">
```

**Why:** Hard-coded colors break dark mode.

---

### ❌ Not Making Components Responsive
```typescript
// ❌ Bad
<div className="w-1/3">  // Fixed width, breaks on mobile

// ✅ Good
<div className="w-full md:w-1/2 lg:w-1/3">  // Responsive
```

**Why:** Mobile users can't use your app properly.

---

### ❌ Forgetting Dark Mode
```typescript
// ❌ Bad
<div className="bg-white text-gray-900">  // Only light mode

// ✅ Good
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

// ✅ Better - use theme variables
<div className="bg-card text-card-foreground">  // Auto dark mode
```

**Why:** Users expect dark mode support.

---

## 🔌 API & State Mistakes

### ❌ Not Using Service Layer
```typescript
// ❌ Bad - API calls directly in hooks
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      return res.json();
    },
  });
}

// ✅ Good - use service layer
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,  // Service handles API details
  });
}
```

**Why:** Centralized API logic, easier to test, reusable.

---

### ❌ Not Invalidating Cache After Mutations
```typescript
// ❌ Bad
export function useCreateUser() {
  return useMutation({
    mutationFn: userService.createUser,
    // No cache invalidation!
  });
}

// ✅ Good
export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

**Why:** Users won't see updated data without cache invalidation.

---

### ❌ Using Wrong State Management
```typescript
// ❌ Bad - using Zustand for server data
const useUserStore = create((set) => ({
  users: [],
  fetchUsers: async () => {
    const users = await fetchUsers();
    set({ users });
  },
}));

// ✅ Good - use TanStack Query for server data
const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: userService.getUsers,
});
```

**Why:** TanStack Query is designed for server state, Zustand for client state.

---

## 📝 Form Mistakes

### ❌ Not Using Form Libraries
```typescript
// ❌ Bad - manual form handling
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errors, setErrors] = useState({});

const handleSubmit = (e) => {
  e.preventDefault();
  // Manual validation
  if (!email) setErrors({ email: 'Required' });
  if (password.length < 8) setErrors({ password: 'Too short' });
  // ...
};

// ✅ Good - use React Hook Form + Zod
const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: { email: '', password: '' },
});
```

**Why:** Form libraries handle validation, errors, and submission better.

---

### ❌ Not Disabling Submit During Submission
```typescript
// ❌ Bad
<Button type="submit">Submit</Button>

// ✅ Good
<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</Button>
```

**Why:** Prevents duplicate submissions.

---

## 🎯 TypeScript Mistakes

### ❌ Using `any`
```typescript
// ❌ Bad
const user: any = fetchUser();
function handleClick(data: any) { }

// ✅ Good
const user: User = fetchUser();
function handleClick(data: ClickData) { }
```

**Why:** Loses type safety, defeats purpose of TypeScript.

---

### ❌ Not Typing Props
```typescript
// ❌ Bad
export function UserCard({ user, onEdit }) {
  return <div>...</div>;
}

// ✅ Good
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return <div>...</div>;
}
```

**Why:** No autocomplete, no type checking, runtime errors.

---

### ❌ Optional Chaining Everywhere
```typescript
// ❌ Bad - overusing optional chaining
<div>{user?.name?.first?.toUpperCase()?.substring(0, 1)}</div>

// ✅ Good - handle null properly
<div>
  {user?.name?.first ? user.name.first[0].toUpperCase() : '?'}
</div>

// ✅ Better - validate data structure
interface User {
  name: {
    first: string;
    last: string;
  };
}
<div>{user.name.first[0].toUpperCase()}</div>
```

**Why:** Optional chaining hides data structure problems.

---

## 🗂️ Organization Mistakes

### ❌ Wrong Folder Structure
```typescript
// ❌ Bad - grouping by type
src/
├── components/
│   ├── UserCard.tsx
│   ├── UserList.tsx
│   ├── CourseCard.tsx
│   └── CourseList.tsx
├── hooks/
│   ├── useUsers.ts
│   └── useCourses.ts

// ✅ Good - grouping by feature
src/features/
├── users/
│   ├── components/
│   │   ├── UserCard.tsx
│   │   └── UserList.tsx
│   └── hooks/
│       └── useUsers.ts
└── courses/
    ├── components/
    │   ├── CourseCard.tsx
    │   └── CourseList.tsx
    └── hooks/
        └── useCourses.ts
```

**Why:** Feature-based organization scales better.

---

### ❌ Creating Feature-Specific Components in Common
```typescript
// ❌ Bad
components/common/
├── UserDashboardWidget.tsx  // Feature-specific!
├── CourseEnrollmentButton.tsx  // Feature-specific!

// ✅ Good
features/users/components/
└── UserDashboardWidget.tsx

features/courses/components/
└── CourseEnrollmentButton.tsx
```

**Why:** Common components should be truly reusable.

---

## 🔒 Security Mistakes

### ❌ Storing Sensitive Data in LocalStorage
```typescript
// ❌ Bad
localStorage.setItem('password', password);
localStorage.setItem('creditCard', cardNumber);

// ✅ Good - never store sensitive data in localStorage
// Store only tokens, and clear on logout
localStorage.setItem('token', token);
```

**Why:** localStorage is accessible to JavaScript, vulnerable to XSS.

---

### ❌ Not Validating User Input
```typescript
// ❌ Bad - no validation
<Input value={search} onChange={(e) => setSearch(e.target.value)} />
// Then directly sending to API

// ✅ Good - validate and sanitize
const schema = z.string().max(100).trim();
const validatedSearch = schema.parse(search);
```

**Why:** Prevents injection attacks and bad data.

---

## ⚡ Performance Mistakes

### ❌ Not Memoizing Expensive Calculations
```typescript
// ❌ Bad - recalculates on every render
function UserList({ users }) {
  const sortedUsers = users.sort(...);  // Expensive!
  return <div>{sortedUsers.map(...)}</div>;
}

// ✅ Good - memoize
function UserList({ users }) {
  const sortedUsers = useMemo(
    () => users.sort(...),
    [users]
  );
  return <div>{sortedUsers.map(...)}</div>;
}
```

**Why:** Performance issues with large lists.

---

### ❌ Not Using React.memo for Pure Components
```typescript
// ❌ Bad - re-renders even when props haven't changed
export function UserCard({ user }) {
  return <div>{user.name}</div>;
}

// ✅ Good - memoize pure component
export const UserCard = React.memo(function UserCard({ user }) {
  return <div>{user.name}</div>;
});
```

**Why:** Unnecessary re-renders hurt performance.

---

## 🧪 Testing Mistakes

### ❌ Not Testing at All
```typescript
// ❌ Bad - no tests

// ✅ Good - at least basic tests
describe('UserCard', () => {
  it('renders user name', () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
  });
  
  it('calls onEdit when edit button clicked', () => {
    const onEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={onEdit} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

**Why:** Catch bugs early, refactor with confidence.

---

## 📦 Import Mistakes

### ❌ Circular Dependencies
```typescript
// ❌ Bad
// userService.ts
import { formatUser } from './userUtils';

// userUtils.ts
import { userService } from './userService';  // Circular!

// ✅ Good - break the cycle
// userService.ts
import { formatUser } from './userUtils';

// userUtils.ts
// Don't import userService
```

**Why:** Causes build errors and runtime issues.

---

### ❌ Not Using Barrel Exports
```typescript
// ❌ Bad - importing from deep paths
import { UserCard } from '../../features/users/components/UserCard';
import { UserList } from '../../features/users/components/UserList';
import { useUsers } from '../../features/users/hooks/useUsers';

// ✅ Good - use barrel exports
import { UserCard, UserList, useUsers } from '@/features/users';
```

**Why:** Cleaner imports, easier refactoring.

---

## 🎯 Component Mistakes

### ❌ Components Too Large
```typescript
// ❌ Bad - 300+ lines, multiple responsibilities
function UserDashboard() {
  // 50 lines of state
  // 100 lines of effects
  // 150 lines of JSX
  return <div>...</div>;
}

// ✅ Good - split into smaller components
function UserDashboard() {
  return (
    <div>
      <UserHeader user={user} />
      <UserStats stats={stats} />
      <UserActivity activity={activity} />
    </div>
  );
}
```

**Why:** Easier to understand, test, and maintain.

---

### ❌ Too Many Props
```typescript
// ❌ Bad - 15+ props
<UserCard
  user={user}
  showAvatar
  showEmail
  showPhone
  showAddress
  showRole
  showStatus
  showCreatedAt
  showUpdatedAt
  onEdit={onEdit}
  onDelete={onDelete}
  onView={onView}
  onShare={onShare}
  isEditable
  isDeletable
/>

// ✅ Good - use composition or config object
<UserCard
  user={user}
  config={{ showAvatar: true, showEmail: true }}
  actions={{ onEdit, onDelete, onView }}
/>

// ✅ Better - multiple specialized components
<UserCard user={user}>
  <UserAvatar user={user} />
  <UserInfo user={user} />
  <UserActions onEdit={onEdit} onDelete={onDelete} />
</UserCard>
```

**Why:** Components with 10+ props are hard to use and maintain.

---

## ✅ Quick Checklist

**Before committing, check:**

- [ ] No `any` types
- [ ] No inline styles
- [ ] Dark mode supported
- [ ] Responsive design
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Keys on lists
- [ ] No console.logs
- [ ] No commented code
- [ ] Proper naming conventions
- [ ] Tests added
- [ ] No useEffect for data fetching
- [ ] Cache invalidated after mutations
- [ ] Form validation added
- [ ] Components < 200 lines
- [ ] Props < 10

---

## 🎯 Remember

**The most common mistakes are:**
1. Not handling loading/error states
2. Using inline styles
3. Forgetting dark mode
4. Not using TanStack Query for API data
5. Using `any` type
6. Not testing
7. Components too large
8. Hard-coded colors
9. No cache invalidation
10. Wrong state management choice

**Avoid these and your code quality will improve dramatically!**
