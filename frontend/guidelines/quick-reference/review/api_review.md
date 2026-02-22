# API Integration Review

**For:** REVIEWER  
**Purpose:** Review API integration patterns

---

## 📋 API Review

### ✅ 1. Service Layer

**Check:**
- [ ] API calls in service files (not components)
- [ ] Service named `resource.service.ts`
- [ ] Methods follow CRUD pattern

```typescript
// ✅ Good
// features/users/services/user.service.ts
export const userService = {
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.patch(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// ❌ Bad - API calls in component
function UserList() {
  useEffect(() => {
    fetch('/api/users').then(...);
  }, []);
}
```

---

### ✅ 2. Custom Hooks

**Check:**
- [ ] TanStack Query hooks for data fetching
- [ ] Hooks in `hooks/` folder
- [ ] Named `use + Resource`

```typescript
// ✅ Good
// features/users/hooks/useUsers.ts
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
  });
}

// ❌ Bad
export function getUsers() {  // Not a hook
  return useQuery(...);
}
```

---

### ✅ 3. Query Keys

**Check:**
- [ ] Hierarchical query key structure
- [ ] Consistent naming
- [ ] Proper invalidation

```typescript
// ✅ Good
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters) => [...userKeys.lists(), filters] as const,
  detail: (id) => [...userKeys.all, 'detail', id] as const,
};

// ❌ Bad
queryKey: ['users']
queryKey: ['all-users']
queryKey: ['userList']  // Inconsistent
```

---

### ✅ 4. Error Handling

**Check:**
- [ ] Errors displayed to user
- [ ] Toast notifications for mutations
- [ ] Proper error types

```typescript
// ✅ Good
const { data, error } = useUsers();

if (error) {
  return <Alert variant="destructive">{error.message}</Alert>;
}

const mutation = useMutation({
  mutationFn: userService.createUser,
  onError: (error) => {
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    });
  },
});

// ❌ Bad
const { data } = useUsers();  // Error ignored
```

---

### ✅ 5. Loading States

**Check:**
- [ ] Loading spinners shown
- [ ] Skeleton loaders for content
- [ ] Button disabled during submission

```typescript
// ✅ Good
const { data, isLoading } = useUsers();

if (isLoading) return <LoadingSpinner />;

<Button disabled={mutation.isPending}>
  {mutation.isPending ? 'Saving...' : 'Save'}
</Button>

// ❌ Bad
const { data } = useUsers();
return <div>{data.map(...)}</div>;  // No loading state
```

---

### ✅ 6. Cache Invalidation

**Check:**
- [ ] Cache invalidated after create/update/delete
- [ ] Specific queries invalidated (not all)
- [ ] Optimistic updates used when appropriate

```typescript
// ✅ Good
const mutation = useMutation({
  mutationFn: userService.createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: userKeys.lists() });
  },
});

// ❌ Bad
const mutation = useMutation({
  mutationFn: userService.createUser,
  // No invalidation!
});
```

---

### ✅ 7. Type Safety

**Check:**
- [ ] Response types defined
- [ ] Request DTOs typed
- [ ] API errors typed

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
}

interface CreateUserDto {
  name: string;
  email: string;
}

async createUser(dto: CreateUserDto): Promise<User> {
  const { data } = await api.post<ApiResponse<User>>('/users', dto);
  return data.data;
}

// ❌ Bad
async createUser(dto: any): Promise<any> {
  return api.post('/users', dto);
}
```

---

### ✅ 8. Request Configuration

**Check:**
- [ ] Axios instance configured
- [ ] Base URL set
- [ ] Auth token interceptor
- [ ] Error interceptor

```typescript
// ✅ Good
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ❌ Bad
// No configuration, using fetch directly
```

---

## 🚨 Red Flags

- ❌ API calls directly in components
- ❌ No error handling
- ❌ No loading states
- ❌ No cache invalidation
- ❌ Using fetch instead of axios
- ❌ No service layer
- ❌ Types using `any`

---

## ✅ Pass Criteria

- ✅ Service layer present
- ✅ TanStack Query used
- ✅ Query keys structured
- ✅ Error handling complete
- ✅ Loading states shown
- ✅ Cache invalidation works
- ✅ Fully typed

---

**Verdict:** PASS / FAIL / NEEDS WORK
