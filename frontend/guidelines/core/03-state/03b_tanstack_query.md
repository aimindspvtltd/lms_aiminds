# 03b: TanStack Query Patterns

**File:** 03b_tanstack_query.md  
**Lines:** ~400  
**For:** EXECUTOR implementing data fetching

---

## When to Use TanStack Query

**Use for:** Server state (data from API you don't own)

✅ **Use TanStack Query for:**
- Fetching users, courses, posts
- Any data from API
- Data that can become stale
- Data that needs caching

❌ **Don't use TanStack Query for:**
- Form input state (use useState)
- Theme preference (use Zustand)
- Modal open/close (use useState or Zustand)

---

## Basic Query Pattern

### useQuery - Fetching Data

```typescript
// features/users/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user.service';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
  });
}

// Usage in component
function UserList() {
  const { data, isLoading, error } = useUsers();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
}
```

---

## Query Keys Pattern

**Organize query keys hierarchically:**

```typescript
// features/users/hooks/useUsers.ts
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Usage
export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: userKeys.list(filters || {}),
    queryFn: () => userService.getUsers(filters),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUser(id),
    enabled: !!id,  // Only run if id exists
  });
}
```

**Why hierarchical?**
- Easy to invalidate all users: `userKeys.all`
- Easy to invalidate all lists: `userKeys.lists()`
- Easy to invalidate specific user: `userKeys.detail(id)`

---

## useMutation - Updating Data

### Basic Mutation

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { useToast } from '@/components/ui/use-toast';

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      
      toast({
        title: 'Success',
        description: 'User created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Usage in component
function CreateUserButton() {
  const createUser = useCreateUser();

  const handleClick = () => {
    createUser.mutate({
      email: 'user@example.com',
      full_name: 'John Doe',
      role: 'student',
    });
  };

  return (
    <Button 
      onClick={handleClick} 
      disabled={createUser.isPending}
    >
      {createUser.isPending ? 'Creating...' : 'Create User'}
    </Button>
  );
}
```

---

## Query Configuration

### Stale Time

**How long data is considered fresh:**

```typescript
useQuery({
  queryKey: ['users'],
  queryFn: getUsers,
  staleTime: 5 * 60 * 1000,  // 5 minutes
});
```

**Guidelines:**
- Static data: `Infinity` (never refetch)
- Frequently updated: `0` (always stale)
- Normal data: `5 * 60 * 1000` (5 minutes)

---

### Cache Time (gcTime)

**How long inactive data stays in cache:**

```typescript
useQuery({
  queryKey: ['users'],
  queryFn: getUsers,
  gcTime: 30 * 60 * 1000,  // 30 minutes
});
```

---

### Enabled

**Conditionally run query:**

```typescript
function UserDetail({ userId }: { userId?: string }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId!),
    enabled: !!userId,  // Only run if userId exists
  });
}
```

---

## Cache Invalidation

### Invalidate Specific Keys

```typescript
// Invalidate all users
queryClient.invalidateQueries({ queryKey: userKeys.all });

// Invalidate all user lists
queryClient.invalidateQueries({ queryKey: userKeys.lists() });

// Invalidate specific user
queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
```

---

### Update After Mutation

```typescript
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      userService.updateUser(id, data),
    
    onSuccess: (_, variables) => {
      // Invalidate specific user detail
      queryClient.invalidateQueries({ 
        queryKey: userKeys.detail(variables.id) 
      });
      
      // Invalidate all lists (user might appear in lists)
      queryClient.invalidateQueries({ 
        queryKey: userKeys.lists() 
      });
    },
  });
}
```

---

## Optimistic Updates

**Update UI immediately, rollback on error:**

```typescript
export function useOptimisticUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      userService.updateUser(id, data),

    // Before mutation
    onMutate: async ({ id, data }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ 
        queryKey: userKeys.detail(id) 
      });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(userKeys.detail(id));

      // Optimistically update
      queryClient.setQueryData(userKeys.detail(id), (old: any) => ({
        ...old,
        ...data,
      }));

      // Return context for rollback
      return { previousUser };
    },

    // On error, rollback
    onError: (err, variables, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(
          userKeys.detail(variables.id),
          context.previousUser
        );
      }
    },

    // Always refetch after mutation
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: userKeys.detail(variables.id) 
      });
    },
  });
}
```

---

## Error Handling

### In Query

```typescript
function UserList() {
  const { data, error, isError } = useUsers();

  if (isError) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded">
        <p>Error loading users: {error.message}</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }
}
```

### In Mutation

```typescript
export function useCreateUser() {
  return useMutation({
    mutationFn: userService.createUser,
    onError: (error: Error) => {
      if (error.message.includes('email')) {
        toast({
          title: 'Email already exists',
          description: 'Please use a different email',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    },
  });
}
```

---

## Loading States

```typescript
function UserList() {
  const { data, isLoading, isFetching } = useUsers();

  // Initial load
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* Background refetch indicator */}
      {isFetching && <div className="loading-bar" />}
      
      {data.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
}
```

---

## Pagination Pattern

```typescript
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export function useUsers(params: { page: number; limit: number }) {
  return useQuery({
    queryKey: ['users', 'list', params],
    queryFn: () => userService.getUsers(params),
    placeholderData: keepPreviousData,  // Keep old data while fetching new page (v5 API)
  });
}

// Usage
function UserList() {
  const [page, setPage] = useState(1);
  const { data, isPlaceholderData } = useUsers({ page, limit: 10 });

  return (
    <div>
      {data.users.map(user => <UserCard key={user.id} user={user} />)}

      <div>
        <Button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>

        <Button
          onClick={() => setPage(p => p + 1)}
          disabled={isPlaceholderData || !data.hasMore}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
```

---

## Dependent Queries

**Query B depends on Query A:**

```typescript
function UserPosts({ userId }: { userId: string }) {
  // First get user
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
  });

  // Then get posts (only if user exists)
  const { data: posts } = useQuery({
    queryKey: ['posts', user?.id],
    queryFn: () => getPosts(user!.id),
    enabled: !!user,  // Only run if user is loaded
  });
}
```

---

## Parallel Queries

**Multiple queries at once:**

```typescript
function Dashboard() {
  const users = useQuery({ queryKey: ['users'], queryFn: getUsers });
  const courses = useQuery({ queryKey: ['courses'], queryFn: getCourses });
  const stats = useQuery({ queryKey: ['stats'], queryFn: getStats });

  if (users.isLoading || courses.isLoading || stats.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <UserStats users={users.data} />
      <CourseList courses={courses.data} />
      <StatsPanel stats={stats.data} />
    </div>
  );
}
```

---

## Query Client Setup

```typescript
// lib/api/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      gcTime: 30 * 60 * 1000,         // 30 minutes
      retry: 1,                        // Retry failed requests once
      refetchOnWindowFocus: false,     // Don't refetch on window focus
    },
    mutations: {
      retry: 0,  // Don't retry mutations
    },
  },
});

// app/providers.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/api/queryClient';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

---

## Best Practices

1. **Always use query keys factory** (userKeys pattern)
2. **Invalidate after mutations** (keep data fresh)
3. **Handle loading and error states** (good UX)
4. **Use enabled for conditional queries** (avoid unnecessary requests)
5. **Set appropriate staleTime** (reduce unnecessary refetches)
6. **Toast on mutation errors** (user feedback)

---

**See also:**
- 03c_zustand_patterns.md - For client state
- 03d_query_keys.md - Advanced query key patterns
- 06b_custom_hooks.md - Creating reusable hooks
