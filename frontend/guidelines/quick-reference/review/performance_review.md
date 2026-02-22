# Performance Review

**For:** REVIEWER  
**Purpose:** Review performance optimizations

---

## 📋 Performance Review

### ✅ 1. Heavy Computations

**Check:**
- [ ] Expensive calculations memoized with `useMemo`
- [ ] Dependencies array correct

```typescript
// ✅ Good
const sortedUsers = useMemo(
  () => users.sort((a, b) => a.name.localeCompare(b.name)),
  [users]
);

// ❌ Bad
const sortedUsers = users.sort(...);  // Runs every render
```

---

### ✅ 2. Callback Memoization

**Check:**
- [ ] Callbacks memoized with `useCallback` if needed
- [ ] Only when causing performance issues

```typescript
// ✅ Good - passed to memoized child
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// ✅ Also OK - simple case, no perf issue
const handleClick = () => doSomething(id);
```

---

### ✅ 3. Component Memoization

**Check:**
- [ ] Pure components wrapped with `React.memo`
- [ ] Only when re-rendering is expensive

```typescript
// ✅ Good
export const UserCard = React.memo(function UserCard({ user }) {
  return <div>{user.name}</div>;
});

// ❌ Don't overuse
export const Button = React.memo(function Button() {
  return <button>Click</button>;  // Too simple to memo
});
```

---

### ✅ 4. List Rendering

**Check:**
- [ ] Keys are unique and stable
- [ ] Large lists virtualized (>100 items)
- [ ] No unnecessary re-renders

```typescript
// ✅ Good
{users.map(user => (
  <UserCard key={user.id} user={user} />
))}

// For 1000+ items
import { useVirtualizer } from '@tanstack/react-virtual';

// ❌ Bad
{users.map((user, index) => (
  <UserCard key={index} user={user} />  // Index as key
))}
```

---

### ✅ 5. Image Optimization

**Check:**
- [ ] Images lazy loaded
- [ ] Proper image sizes
- [ ] WebP format when possible

```typescript
// ✅ Good
<img 
  src={user.avatar} 
  alt={user.name}
  loading="lazy"
  width={48}
  height={48}
/>

// ❌ Bad
<img src={user.avatar} />  // No loading, no size
```

---

### ✅ 6. Code Splitting

**Check:**
- [ ] Routes lazy loaded
- [ ] Heavy components lazy loaded
- [ ] Suspense boundaries present

```typescript
// ✅ Good
const Dashboard = lazy(() => import('./pages/Dashboard'));

<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>

// ❌ Bad
import Dashboard from './pages/Dashboard';  // Eager load
```

---

### ✅ 7. API Calls

**Check:**
- [ ] No unnecessary API calls
- [ ] Proper caching (TanStack Query)
- [ ] Debounced search inputs
- [ ] Pagination for large lists

```typescript
// ✅ Good
const debouncedSearch = useDebounce(search, 300);

const { data } = useQuery({
  queryKey: ['users', debouncedSearch],
  queryFn: () => userService.search(debouncedSearch),
  staleTime: 5 * 60 * 1000,  // Cache 5 min
});

// ❌ Bad
useEffect(() => {
  fetchUsers(search);  // Calls on every keystroke
}, [search]);
```

---

### ✅ 8. Bundle Size

**Check:**
- [ ] No large libraries imported if not needed
- [ ] Tree shaking enabled
- [ ] Moment.js replaced with date-fns or day.js

```typescript
// ✅ Good
import { format } from 'date-fns';  // Tree-shakeable

// ❌ Bad
import moment from 'moment';  // Large bundle
```

---

### ✅ 9. Re-render Prevention

**Check:**
- [ ] No inline object/array creation
- [ ] Context not causing unnecessary re-renders
- [ ] State not lifted too high

```typescript
// ✅ Good
const config = useMemo(() => ({ setting: value }), [value]);
<Component config={config} />

// ❌ Bad
<Component config={{ setting: value }} />  // New object every render
```

---

### ✅ 10. useEffect Cleanup

**Check:**
- [ ] All subscriptions cleaned up
- [ ] Timers/intervals cleared
- [ ] Event listeners removed

```typescript
// ✅ Good
useEffect(() => {
  const timer = setTimeout(() => {}, 1000);
  return () => clearTimeout(timer);
}, []);

// ❌ Bad
useEffect(() => {
  setTimeout(() => {}, 1000);  // No cleanup
}, []);
```

---

## 🚨 Red Flags

- ❌ Heavy computation in render
- ❌ No memoization on expensive operations
- ❌ Index as key in lists
- ❌ No lazy loading for routes
- ❌ Large images not optimized
- ❌ Unbounded API calls
- ❌ No pagination on large lists

---

## ✅ Pass Criteria

- ✅ Expensive computations memoized
- ✅ Lists properly keyed
- ✅ Images optimized
- ✅ Routes lazy loaded
- ✅ API calls optimized
- ✅ No unnecessary re-renders

---

## 🧪 Performance Testing

```bash
# Lighthouse audit
npm run lighthouse

# Bundle analysis
npm run build -- --report

# React DevTools Profiler
# Record render performance
```

---

**Verdict:** PASS / FAIL / NEEDS WORK
