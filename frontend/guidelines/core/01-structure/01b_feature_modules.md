# Feature Modules

## Structure

```
features/users/
├── components/     # Feature components
├── hooks/         # Custom hooks
├── services/      # API services
├── types/         # TypeScript types
├── utils/         # Utilities
└── index.ts       # Public API
```

## Creating a Feature

1. Create folder in `features/`
2. Add components, hooks, services
3. Export public API via `index.ts`

## Example

```typescript
// features/users/index.ts
export { UserList } from './components/UserList';
export { UserCard } from './components/UserCard';
export { useUsers, useUser } from './hooks/useUsers';
export { userService } from './services/user.service';
export type { User, CreateUserDto } from './types/user.types';
```
