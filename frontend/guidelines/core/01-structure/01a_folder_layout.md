# 01a: Folder Layout - Complete Structure

**File:** 01a_folder_layout.md  
**Lines:** ~300  
**For:** ARCHITECT planning project structure

---

## Complete Folder Tree

```
my-app/
├── src/
│   ├── app/                     # App initialization
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers.tsx
│   │
│   ├── features/                # Feature modules ⭐
│   │   ├── auth/
│   │   ├── users/
│   │   ├── courses/
│   │   └── dashboard/
│   │
│   ├── components/              # Shared components ONLY
│   │   ├── ui/                  # Shadcn components
│   │   ├── layout/              # Layouts
│   │   ├── common/              # Business components
│   │   └── form/                # Form components
│   │
│   ├── pages/                   # Route pages (thin)
│   │   ├── auth/
│   │   ├── admin/
│   │   └── student/
│   │
│   ├── lib/                     # Shared utilities
│   │   ├── api/
│   │   ├── utils/
│   │   └── constants/
│   │
│   ├── hooks/                   # Shared hooks ONLY
│   ├── stores/                  # Global Zustand stores
│   ├── types/                   # Global types
│   └── styles/                  # Global styles
```

---

## features/ - Feature Modules (PRIMARY) ⭐

**Structure:**
```
features/[feature]/
├── components/      # Feature UI
├── hooks/          # Feature hooks
├── services/       # Feature API
├── types/          # Feature types
└── index.ts        # Public API
```

**Example:**
```
features/users/
├── components/
│   ├── UserList.tsx
│   ├── UserCard.tsx
│   └── UserForm.tsx
├── hooks/
│   ├── useUsers.ts
│   └── useCreateUser.ts
├── services/
│   └── user.service.ts
├── types/
│   └── user.types.ts
└── index.ts
```

---

## components/ - Shared Only

### ui/ - Shadcn Components
- button.tsx
- input.tsx
- card.tsx
**Rule:** Use Shadcn, don't create primitives

### layout/ - Page Structure
- Header.tsx
- Sidebar.tsx
- MainLayout.tsx

### common/ - Business Components
- DataTable.tsx
- SearchBar.tsx
- LoadingSpinner.tsx
**Rule:** Used by 2+ features

---

## pages/ - Thin Wrappers

**Good:**
```typescript
export function UsersPage() {
  return <UserList />;
}
```

**Bad:**
```typescript
export function UsersPage() {
  const [users, setUsers] = useState([]);
  // 200 lines of logic ❌
}
```

---

## Decision Tree

```
Is it feature-specific?
├─ YES → features/[feature]/
│  ├─ Component? → components/
│  ├─ Hook? → hooks/
│  └─ API? → services/
│
└─ NO → Shared
   ├─ UI? → components/ui/
   ├─ Layout? → components/layout/
   ├─ Common? → components/common/
   └─ Hook? → hooks/
```

---

**See also:**
- 01b_feature_modules.md - Feature structure details
- 01c_when_to_create_feature.md - Decision guide
