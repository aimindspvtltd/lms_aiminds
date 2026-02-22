# Role-Based Access Control

## RoleGuard Component
```typescript
interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback || (
      <Alert variant="destructive">
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You don't have permission to access this resource.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}
```

## Usage
```typescript
<RoleGuard allowedRoles={['admin']}>
  <AdminPanel />
</RoleGuard>

<RoleGuard allowedRoles={['admin', 'moderator']}>
  <ModeratorTools />
</RoleGuard>
```

## Hook
```typescript
export function useHasRole(roles: string[]) {
  const { user } = useAuthStore();
  return user ? roles.includes(user.role) : false;
}

// Usage
const isAdmin = useHasRole(['admin']);
```

## Conditional Rendering
```typescript
function UserList() {
  const isAdmin = useHasRole(['admin']);

  return (
    <div>
      <h1>Users</h1>
      {isAdmin && (
        <Button onClick={handleCreate}>Add User</Button>
      )}
    </div>
  );
}
```
