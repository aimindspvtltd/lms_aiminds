# Quick Review Checklist (5 Minutes)

**File:** quick_review.md  
**Lines:** ~150  
**For:** REVIEWER - Fast initial review

---

## 🎯 Component Basics (2 min)

### Naming & Structure
- [ ] Component name is PascalCase
- [ ] File name matches component name
- [ ] Named export (not default export)
- [ ] Props interface defined
- [ ] Component < 200 lines

```typescript
// ✅ Good
interface UserCardProps { }
export function UserCard({ }: UserCardProps) { }

// ❌ Bad
export default function userCard(props: any) { }
```

---

## 🔷 TypeScript (1 min)

- [ ] No `any` types
- [ ] All props typed
- [ ] All function return types specified
- [ ] Proper null checks

```typescript
// ✅ Good
const user: User = data;
function getUser(): User { }

// ❌ Bad
const user: any = data;
function getUser() { }  // No return type
```

---

## 🎨 Styling (1 min)

- [ ] Uses Tailwind classes (no inline styles)
- [ ] Dark mode support (`dark:` classes or theme variables)
- [ ] Responsive (`md:`, `lg:` breakpoints)
- [ ] Uses theme variables (`bg-card`, not `bg-white`)

```typescript
// ✅ Good
<div className="bg-card dark:bg-card text-foreground">
<div className="w-full md:w-1/2 lg:w-1/3">

// ❌ Bad
<div style={{ background: 'white' }}>
<div className="w-1/3">  // Not responsive
```

---

## ⚡ Functionality (1 min)

- [ ] Loading states handled
- [ ] Error states handled
- [ ] No console.logs
- [ ] No commented code
- [ ] Keys on list items

```typescript
// ✅ Good
const { data, isLoading, error } = useUsers();
if (isLoading) return <Spinner />;
if (error) return <Error />;

// ❌ Bad
const { data } = useUsers();
return data.map(...)  // No loading/error handling
```

---

## 🔍 State Management

- [ ] Server state uses TanStack Query
- [ ] No useEffect for data fetching
- [ ] Proper query keys
- [ ] Cache invalidation after mutations

```typescript
// ✅ Good
const { data } = useQuery({ 
  queryKey: ['users'], 
  queryFn: getUsers 
});

// ❌ Bad
useEffect(() => {
  fetch('/users').then(setUsers);
}, []);
```

---

## Quick Scan Checklist

**Scan for these common issues (30 seconds):**

- [ ] No `any` types
- [ ] No `console.log`
- [ ] No commented code
- [ ] No inline `style={{ }}`
- [ ] No `useEffect` for fetching
- [ ] `key` prop on lists
- [ ] Loading/error handling
- [ ] Dark mode classes

---

## Verdict Decision

### ✅ APPROVE
If ALL of:
- No critical issues
- Minor issues acceptable
- Follows standards

### ⚠️ APPROVE WITH COMMENTS
If:
- No critical issues
- Has minor improvements
- Can fix later

### 🔄 REQUEST CHANGES
If ANY of:
- Missing tests
- No error handling
- No loading states
- Security issues

### ❌ REJECT
If ANY of:
- Breaking changes
- Major violations
- Complete rewrite needed

---

## Quick Feedback Template

```markdown
## Quick Review

**✅ Passed**
- Component structure
- TypeScript usage
- Naming conventions

**⚠️ Minor Issues**
- [ ] Add loading state (line 45)
- [ ] Add dark mode support (line 67)

**Verdict:** APPROVE WITH COMMENTS
```

---

**For detailed review, see:**
- component_review.md
- typescript_review.md
- styling_review.md
