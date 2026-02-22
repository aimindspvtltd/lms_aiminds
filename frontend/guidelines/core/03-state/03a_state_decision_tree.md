# State Decision Tree

## Decision Flow

```
Is it from an API?
├─ YES → TanStack Query
│
Is it global UI state?
├─ YES → Zustand
│
Is it local component state?
└─ YES → useState
```

## Examples

### TanStack Query (Server Data)
```typescript
const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: userService.getUsers,
});
```

### Zustand (Global UI)
```typescript
const { theme, setTheme } = useThemeStore();
```

### useState (Local)
```typescript
const [isOpen, setIsOpen] = useState(false);
```
