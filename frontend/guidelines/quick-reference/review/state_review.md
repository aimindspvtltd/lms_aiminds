# State Management Review

**For:** REVIEWER  
**Purpose:** Review state management decisions

---

## 📋 State Review

### ✅ 1. Correct State Tool

**Check:**
- [ ] Server data uses TanStack Query (not useState)
- [ ] Global UI state uses Zustand
- [ ] Local UI state uses useState
- [ ] No useEffect for data fetching

```typescript
// ✅ Good - Server data
const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: userService.getUsers,
});

// ✅ Good - Global UI
const { theme } = useThemeStore();

// ✅ Good - Local UI
const [isOpen, setIsOpen] = useState(false);

// ❌ Bad - Server data in useState
const [users, setUsers] = useState([]);
useEffect(() => {
  fetchUsers().then(setUsers);
}, []);
```

---

### ✅ 2. TanStack Query Usage

**Check:**
- [ ] Query keys properly structured
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Cache invalidation after mutations
- [ ] Stale time configured

```typescript
// ✅ Good
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: any) => [...userKeys.lists(), filters] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};

const { data, isLoading, error } = useQuery({
  queryKey: userKeys.list(filters),
  queryFn: () => userService.getUsers(filters),
  staleTime: 5 * 60 * 1000,
});

const mutation = useMutation({
  mutationFn: userService.createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: userKeys.lists() });
  },
});
```

---

### ✅ 3. useState Patterns

**Check:**
- [ ] Initial state typed
- [ ] Boolean states named is/has/should
- [ ] Immutable updates
- [ ] No derived state (compute instead)

```typescript
// ✅ Good
const [isOpen, setIsOpen] = useState(false);
const [users, setUsers] = useState<User[]>([]);
const userCount = users.length;  // Computed

// ❌ Bad
const [open, setOpen] = useState(false);  // Not descriptive
const [count, setCount] = useState(users.length);  // Derived state
```

---

### ✅ 4. Zustand Store

**Check:**
- [ ] Store is small and focused
- [ ] Actions included in store
- [ ] Persist configured if needed
- [ ] No server data in store

```typescript
// ✅ Good
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'theme-storage' }
  )
);

// ❌ Bad - server data
export const useUserStore = create((set) => ({
  users: [],  // Should use TanStack Query!
  fetchUsers: async () => { },
}));
```

---

### ✅ 5. State Updates

**Check:**
- [ ] Updates are immutable
- [ ] No direct mutations
- [ ] Batch updates when needed

```typescript
// ✅ Good
setUsers(prev => [...prev, newUser]);
setUser(prev => ({ ...prev, name: newName }));

// ❌ Bad
users.push(newUser);  // Direct mutation
setUsers(users);

user.name = newName;  // Direct mutation
setUser(user);
```

---

## 🚨 Red Flags

- ❌ Server data in useState
- ❌ useEffect for fetching
- ❌ No cache invalidation
- ❌ Direct state mutations
- ❌ Server data in Zustand

---

## ✅ Pass Criteria

- ✅ Correct tool for state type
- ✅ TanStack Query for server data
- ✅ Cache invalidation present
- ✅ Immutable updates
- ✅ Loading/error handling

---

**Verdict:** PASS / FAIL / NEEDS WORK
