# Query Keys

## Hierarchical Structure
```typescript
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: any) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};
```

## Usage
```typescript
// List query
const { data } = useQuery({
  queryKey: userKeys.list({ page: 1, limit: 10 }),
  queryFn: () => userService.getUsers({ page: 1, limit: 10 }),
});

// Detail query
const { data } = useQuery({
  queryKey: userKeys.detail(id),
  queryFn: () => userService.getUser(id),
});

// Invalidation
queryClient.invalidateQueries({ queryKey: userKeys.lists() });
```
