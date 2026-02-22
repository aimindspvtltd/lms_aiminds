# Custom API Hooks

## Query Hook
```typescript
// features/users/hooks/useUsers.ts
export function useUsers(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: userKeys.list(params || {}),
    queryFn: () => userService.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

## Mutation Hook
```typescript
// features/users/hooks/useCreateUser.ts
export function useCreateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast({ title: 'User created successfully' });
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
```

## Usage
```typescript
function UserList() {
  const { data, isLoading, error } = useUsers();
  const createUser = useCreateUser();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data.map(user => <UserCard key={user.id} user={user} />)}
      <Button onClick={() => createUser.mutate(newUser)}>
        Add User
      </Button>
    </div>
  );
}
```
