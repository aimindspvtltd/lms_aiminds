# Optimistic Updates

## Pattern
```typescript
const mutation = useMutation({
  mutationFn: userService.updateUser,
  onMutate: async (updatedUser) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: userKeys.detail(updatedUser.id) });
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(userKeys.detail(updatedUser.id));
    
    // Optimistically update
    queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
    
    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    if (context?.previous) {
      queryClient.setQueryData(
        userKeys.detail(variables.id), 
        context.previous
      );
    }
  },
  onSettled: (data, error, variables) => {
    // Refetch to ensure data is correct
    queryClient.invalidateQueries({ 
      queryKey: userKeys.detail(variables.id) 
    });
  },
});
```
