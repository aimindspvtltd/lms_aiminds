# Architecture Decisions - Quick Reference

**For:** ARCHITECT  
**Purpose:** Decision trees for common architectural choices

---

## 🎯 State Management Decision Tree

```
Need to store data?
│
├─ Is it from an API?
│  └─ YES → Use TanStack Query
│     ├─ Server data (users, posts, etc.)
│     ├─ Automatically cached
│     ├─ Automatic refetching
│     └─ Loading/error states included
│
├─ Is it global UI state?
│  └─ YES → Use Zustand
│     ├─ Theme (light/dark)
│     ├─ Sidebar open/close
│     ├─ Modal state
│     └─ User preferences
│
└─ Is it local component state?
   └─ YES → Use useState
      ├─ Form inputs
      ├─ Toggle states
      ├─ Component-specific UI
      └─ Temporary data
```

**Examples:**

```typescript
// ✅ TanStack Query - Server data
const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: userService.getUsers,
});

// ✅ Zustand - Global UI state
const { theme, setTheme } = useThemeStore();

// ✅ useState - Local state
const [isOpen, setIsOpen] = useState(false);
```

---

## 📁 Feature vs Component Decision

```
Creating new code?
│
├─ Used by 2+ features?
│  └─ YES → components/common/
│     Example: DataTable, SearchBar, LoadingSpinner
│
├─ Generic and reusable?
│  └─ YES → components/common/
│     Example: StatusBadge, FileUpload, EmptyState
│
└─ Feature-specific?
   └─ YES → features/[feature]/components/
      Example: UserOnboardingWizard, CourseEnrollmentButton
```

**Decision Matrix:**

| Scenario | Location |
|----------|----------|
| DataTable showing any data | `components/common/` |
| UserDashboardWidget | `features/dashboard/` |
| SearchBar used everywhere | `components/common/` |
| CourseSpecificForm | `features/courses/` |
| StatusBadge (active/inactive) | `components/common/` |

---

## 🗂️ When to Create a New Feature

```
Adding new functionality?
│
├─ Has its own routes?
│  └─ YES → Create new feature
│     Example: /courses → features/courses/
│
├─ Has its own domain logic?
│  └─ YES → Create new feature
│     Example: User management → features/users/
│
├─ Independent business logic?
│  └─ YES → Create new feature
│     Example: Enrollment system → features/enrollment/
│
└─ Just a few components?
   └─ NO → Add to existing feature or components/
      Example: Settings page → features/settings/ or pages/
```

**Feature Indicators:**
- ✅ Has 5+ components
- ✅ Has own data/API
- ✅ Has own routes
- ✅ Independent domain

**Not a Feature:**
- ❌ Single component
- ❌ Just UI with no logic
- ❌ Shared across features

---

## 🔌 API Layer Decision

```
Need to call API?
│
├─ CRUD operations?
│  └─ Create service in features/[feature]/services/
│     Example: userService.getUsers()
│
├─ Need to use in component?
│  └─ Create custom hook in features/[feature]/hooks/
│     Example: useUsers(), useCreateUser()
│
└─ Complex data transformations?
   └─ Add to service, not in hook
      Service transforms, hook just calls service
```

**Pattern:**

```typescript
// 1. Service (features/users/services/user.service.ts)
export const userService = {
  async getUsers(): Promise<User[]> {
    const { data } = await api.get('/users');
    return data.data;
  },
};

// 2. Hook (features/users/hooks/useUsers.ts)
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
  });
}

// 3. Component (features/users/components/UserList.tsx)
export function UserList() {
  const { data, isLoading } = useUsers();
  // ...
}
```

---

## 🎨 Styling Strategy Decision

```
Need to style component?
│
├─ Is it a Shadcn component?
│  └─ YES → Use Shadcn defaults, customize via variants
│     Example: Button, Input, Card
│
├─ Need custom styling?
│  └─ Use Tailwind utility classes
│     ├─ ALWAYS use theme variables (bg-card, text-foreground)
│     ├─ ALWAYS support dark mode (dark:)
│     └─ ALWAYS make responsive (md:, lg:)
│
└─ Need component variants?
   └─ Use CVA (class-variance-authority)
      Example: buttonVariants({ variant, size })
```

**Hierarchy:**
1. Shadcn component (if exists)
2. Tailwind utilities (primary method)
3. CVA for variants
4. NEVER inline styles

---

## 🔐 Authentication Architecture

```
Need authentication?
│
├─ Store tokens?
│  └─ localStorage + Zustand store
│     ├─ Store access token
│     ├─ Store refresh token
│     └─ Clear on logout
│
├─ Protect routes?
│  └─ Create ProtectedRoute component
│     ├─ Check auth state
│     ├─ Redirect to login if not authenticated
│     └─ Show loading while checking
│
└─ Role-based access?
   └─ Create RoleGuard component
      ├─ Check user role
      ├─ Show 403 if not authorized
      └─ Redirect to appropriate page
```

**Implementation:**

```typescript
// 1. Auth store
export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
}));

// 2. Protected route
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

// 3. Role guard
<RoleGuard allowedRoles={['admin']}>
  <AdminPanel />
</RoleGuard>
```

---

## 📦 Code Splitting Decision

```
Need to optimize bundle size?
│
├─ Route-level?
│  └─ Use lazy loading for routes
│     const Dashboard = lazy(() => import('./pages/Dashboard'));
│
├─ Component-level?
│  └─ Large components (>100kb)
│     const HeavyChart = lazy(() => import('./HeavyChart'));
│
└─ Library-level?
   └─ Heavy libraries
      import('date-fns').then(...)
```

**When to split:**
- ✅ Routes (always)
- ✅ Heavy components (charts, editors)
- ✅ Admin-only features
- ❌ Small components
- ❌ Frequently used components

---

## 🧪 Testing Strategy

```
What to test?
│
├─ Business logic?
│  └─ Unit tests (Vitest)
│     ├─ Services
│     ├─ Hooks
│     └─ Utilities
│
├─ UI components?
│  └─ Component tests (React Testing Library)
│     ├─ Rendering
│     ├─ User interactions
│     └─ Accessibility
│
└─ User flows?
   └─ E2E tests (Playwright/Cypress)
      ├─ Login flow
      ├─ Critical paths
      └─ Complete workflows
```

**Coverage targets:**
- Business logic: 80%+
- UI components: 60%+
- E2E: Critical paths only

---

## 🗄️ Data Fetching Pattern

```
Need to fetch data?
│
├─ List data?
│  └─ useQuery with pagination
│     queryKey: ['users', { page, limit }]
│
├─ Single item?
│  └─ useQuery with ID
│     queryKey: ['user', id]
│
├─ Create/Update/Delete?
│  └─ useMutation
│     onSuccess: invalidate queries
│
└─ Dependent queries?
   └─ Use enabled option
      enabled: !!userId
```

**Pattern:**

```typescript
// List
const { data } = useQuery({
  queryKey: ['users', filters],
  queryFn: () => userService.getUsers(filters),
});

// Single
const { data } = useQuery({
  queryKey: ['user', id],
  queryFn: () => userService.getUser(id),
  enabled: !!id,
});

// Mutation
const createUser = useMutation({
  mutationFn: userService.createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});
```

---

## 🔄 Form Handling Decision

```
Need a form?
│
├─ Simple form (1-3 fields)?
│  └─ useState + manual validation
│     Quick and simple
│
├─ Complex form (4+ fields)?
│  └─ React Hook Form + Zod
│     ├─ Automatic validation
│     ├─ Better performance
│     └─ Less boilerplate
│
└─ Multi-step form?
   └─ React Hook Form + Zustand
      Store form state between steps
```

**When to use what:**

| Form Type | Solution | Why |
|-----------|----------|-----|
| Newsletter signup | useState | Simple, 1 field |
| Login | React Hook Form | Multiple fields, validation |
| User profile | React Hook Form + Zod | Complex validation |
| Multi-step wizard | RHF + Zustand | Persist between steps |

---

## 📱 Responsive Design Strategy

```
Need responsive design?
│
├─ Mobile-first approach
│  └─ Start with mobile (base)
│     Then add md:, lg:, xl:
│
├─ Breakpoints
│  ├─ sm: 640px (mobile landscape)
│  ├─ md: 768px (tablet)
│  ├─ lg: 1024px (desktop)
│  └─ xl: 1280px (large desktop)
│
└─ Common patterns
   ├─ Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
   ├─ Hide: hidden md:block
   └─ Size: text-sm md:text-base lg:text-lg
```

**Example:**

```typescript
<div className="
  w-full                    // Mobile: full width
  md:w-1/2                  // Tablet: half width
  lg:w-1/3                  // Desktop: third width
  p-4 md:p-6 lg:p-8        // Increasing padding
">
```

---

## 🎯 Performance Optimization

```
Performance issues?
│
├─ Large lists?
│  └─ Virtualization (react-virtual)
│     Only render visible items
│
├─ Heavy computations?
│  └─ useMemo
│     Cache expensive calculations
│
├─ Expensive components?
│  └─ React.memo
│     Prevent unnecessary re-renders
│
├─ Callback functions?
│  └─ useCallback
│     Stable function references
│
└─ Large bundles?
   └─ Code splitting
      Lazy load heavy components
```

**Optimization checklist:**
- [ ] Lists have keys
- [ ] No inline functions in props
- [ ] Heavy computations memoized
- [ ] Components memoized if needed
- [ ] Routes lazy loaded

---

## 📊 Quick Decision Matrix

| Need | Solution | Example |
|------|----------|---------|
| Server data | TanStack Query | User lists, posts |
| Global UI state | Zustand | Theme, sidebar |
| Local state | useState | Form inputs |
| Reusable component | components/common/ | DataTable |
| Feature-specific | features/[feature]/ | UserOnboarding |
| API calls | Service + Hook | userService + useUsers |
| Forms (simple) | useState | Newsletter |
| Forms (complex) | RHF + Zod | Registration |
| Styling | Tailwind | All components |
| Variants | CVA | Button variants |
| Auth | Zustand + localStorage | Token management |
| Routes | Lazy load | All routes |
| Performance | Memoization | Heavy components |

---

## 🎯 Decision Framework

**Before coding, ask:**

1. **Where does this go?**
   - Feature-specific → features/
   - Reusable → components/common/

2. **What state management?**
   - API data → TanStack Query
   - Global UI → Zustand
   - Local → useState

3. **How to fetch?**
   - Create service first
   - Then create custom hook
   - Then use in component

4. **How to style?**
   - Use Shadcn if available
   - Use Tailwind utilities
   - Use theme variables
   - Support dark mode

5. **Need tests?**
   - Business logic → Unit tests
   - UI → Component tests
   - Critical flows → E2E tests

**Follow this framework for consistent, scalable architecture!** ✅
