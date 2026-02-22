# Route Constants

## Define Routes
```typescript
// constants/routes.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    CREATE: '/users/create',
    EDIT: (id: string) => `/users/${id}/edit`,
  },
} as const;
```

## Usage
```typescript
// In router
<Route path={ROUTES.USERS.LIST} element={<UserList />} />
<Route path={ROUTES.USERS.DETAIL(':id')} element={<UserDetail />} />

// In navigation
navigate(ROUTES.USERS.DETAIL(user.id));
navigate(ROUTES.DASHBOARD);

// In Link
<Link to={ROUTES.USERS.LIST}>Users</Link>
<Link to={ROUTES.USERS.DETAIL(user.id)}>View</Link>
```
