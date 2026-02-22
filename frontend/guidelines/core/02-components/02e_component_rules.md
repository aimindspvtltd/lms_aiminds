# Component Rules

## Size Limits
- Component < 200 lines
- Props < 10
- Split if larger

## Single Responsibility
Each component does ONE thing well

## Named Exports
```typescript
// ✅ Good
export function UserCard() { }

// ❌ Bad
export default function UserCard() { }
```

## File = Component
UserCard.tsx contains only UserCard component

## Avoid
- ❌ Multiple components in one file
- ❌ Business logic in components
- ❌ Direct API calls
- ❌ Complex calculations
