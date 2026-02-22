# Component Review Checklist

**For:** REVIEWER  
**Purpose:** Detailed component code review

---

## 📋 Component Review Checklist

### ✅ 1. File & Naming

**Check:**
- [ ] File name matches component name (PascalCase)
- [ ] File is in correct folder (features/ or components/common/)
- [ ] File is `.tsx` (not `.ts` or `.jsx`)
- [ ] Named export (not default export)

**Example:**
```typescript
// ✅ Good
// File: UserCard.tsx
export function UserCard({ user }: UserCardProps) { }

// ❌ Bad
// File: userCard.tsx or user-card.tsx
export default function UserCard() { }
```

---

### ✅ 2. Props Interface

**Check:**
- [ ] Props interface exists and is properly named (`ComponentNameProps`)
- [ ] All props are typed (no `any`)
- [ ] Optional props marked with `?`
- [ ] Event handlers use `on` prefix
- [ ] Boolean props use `is/has/should/can` prefix
- [ ] Props count < 10 (if more, consider refactoring)

**Example:**
```typescript
// ✅ Good
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  isCompact?: boolean;
  className?: string;
}

// ❌ Bad
interface Props {  // Not specific
  user: any;  // Using any
  edit: Function;  // Wrong naming, not typed
  compact: boolean;  // Should be isCompact
}
```

---

### ✅ 3. Component Structure

**Check:**
- [ ] Component is a function (not class)
- [ ] Props destructured in parameters
- [ ] Return statement is clear
- [ ] Component size < 200 lines
- [ ] Single responsibility (does one thing)

**Example:**
```typescript
// ✅ Good
export function UserCard({ user, onEdit, className }: UserCardProps) {
  return (
    <Card className={className}>
      {/* Component UI */}
    </Card>
  );
}

// ❌ Bad
export function UserCard(props) {  // Props not destructured
  // 300 lines of code  // Too large
  // Multiple responsibilities  // Does too much
}
```

---

### ✅ 4. Styling

**Check:**
- [ ] Uses Tailwind utilities (not inline styles)
- [ ] Uses theme variables (`bg-card`, `text-foreground`)
- [ ] Supports dark mode (`dark:` classes or theme vars)
- [ ] Responsive (`md:`, `lg:` breakpoints)
- [ ] Uses `cn()` for conditional classes
- [ ] No hard-coded colors (`bg-white`, `text-black`)

**Example:**
```typescript
// ✅ Good
<div className={cn(
  "p-4 rounded-lg bg-card text-card-foreground",
  "hover:bg-accent transition-colors",
  "w-full md:w-1/2 lg:w-1/3",
  className
)}>

// ❌ Bad
<div style={{ padding: '16px', backgroundColor: 'white' }}>  // Inline style
<div className="bg-white text-black">  // Hard-coded colors
<div className="w-1/3">  // Not responsive
```

---

### ✅ 5. State Management

**Check:**
- [ ] No server data in `useState` (use TanStack Query)
- [ ] Local UI state uses `useState`
- [ ] No unnecessary state (derived values computed)
- [ ] State updates are immutable
- [ ] Initial state is typed

**Example:**
```typescript
// ✅ Good
const { data: users } = useUsers();  // Server data
const [isOpen, setIsOpen] = useState(false);  // Local UI
const userCount = users.length;  // Derived, not state

// ❌ Bad
const [users, setUsers] = useState([]);  // Server data in useState
useEffect(() => {
  fetch('/users').then(res => setUsers(res.data));
}, []);
```

---

### ✅ 6. Event Handlers

**Check:**
- [ ] Handlers named with `handle` prefix
- [ ] Callbacks passed via props named with `on` prefix
- [ ] No inline functions in JSX (if causing performance issues)
- [ ] Event types are correct
- [ ] Handlers prevent default if needed

**Example:**
```typescript
// ✅ Good
const handleEdit = (user: User) => {
  onEdit?.(user);
};

<Button onClick={handleEdit}>Edit</Button>

// ❌ Bad
<Button onClick={onEdit}>Edit</Button>  // Should be handleEdit
<Button onClick={() => onEdit(user)}>Edit</Button>  // Inline function
```

---

### ✅ 7. Conditional Rendering

**Check:**
- [ ] Loading state handled
- [ ] Error state handled
- [ ] Empty state handled
- [ ] Null/undefined checks present
- [ ] Uses proper conditional operators

**Example:**
```typescript
// ✅ Good
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data || data.length === 0) return <EmptyState />;

return <div>{data.map(...)}</div>;

// ❌ Bad
return <div>{data.map(...)}</div>;  // No loading/error/empty checks
```

---

### ✅ 8. Lists & Keys

**Check:**
- [ ] All list items have `key` prop
- [ ] Keys are unique and stable (IDs, not indexes)
- [ ] Keys don't change between renders

**Example:**
```typescript
// ✅ Good
{users.map(user => (
  <UserCard key={user.id} user={user} />
))}

// ❌ Bad
{users.map((user, index) => (
  <UserCard key={index} user={user} />  // Using index
))}
{users.map(user => (
  <UserCard user={user} />  // No key
))}
```

---

### ✅ 9. Accessibility

**Check:**
- [ ] Buttons are `<button>` elements (not `<div>`)
- [ ] Images have `alt` attributes
- [ ] Form inputs have labels
- [ ] Interactive elements are keyboard accessible
- [ ] ARIA attributes used when needed
- [ ] Color contrast is sufficient

**Example:**
```typescript
// ✅ Good
<button onClick={handleClick}>Click</button>
<img src={url} alt="User avatar" />
<Label htmlFor="email">Email</Label>
<Input id="email" />

// ❌ Bad
<div onClick={handleClick}>Click</div>  // Not a button
<img src={url} />  // No alt
<input />  // No label
```

---

### ✅ 10. Performance

**Check:**
- [ ] Heavy computations memoized (`useMemo`)
- [ ] Callbacks memoized if needed (`useCallback`)
- [ ] Large lists virtualized if needed
- [ ] Images lazy loaded if appropriate
- [ ] No unnecessary re-renders

**Example:**
```typescript
// ✅ Good
const sortedUsers = useMemo(
  () => users.sort((a, b) => a.name.localeCompare(b.name)),
  [users]
);

const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// ❌ Bad
const sortedUsers = users.sort(...);  // Runs every render
const handleClick = () => doSomething(id);  // New function every render
```

---

### ✅ 11. TypeScript

**Check:**
- [ ] No `any` types
- [ ] All function parameters typed
- [ ] All function return types explicit
- [ ] Interfaces over types where appropriate
- [ ] Generic types used correctly

**Example:**
```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
}

function UserCard({ user }: { user: User }): JSX.Element {
  return <div>{user.name}</div>;
}

// ❌ Bad
function UserCard({ user }: any) {  // Using any
  return <div>{user.name}</div>;
}
```

---

### ✅ 12. Component Library Check

**CRITICAL CHECK:**
- [ ] If new component: Was it added to library? (Ask EXECUTOR)
- [ ] If in `components/common/`: Is it in COMPONENT_LIBRARY.md?
- [ ] If should be reusable: Why is it in features/?

**Questions to ask:**
1. Is this component in the right location?
2. Should it be in common library?
3. Is it documented in COMPONENT_LIBRARY.md?

---

### ✅ 13. Imports

**Check:**
- [ ] Imports organized (React, libraries, internal)
- [ ] No unused imports
- [ ] Using path aliases (`@/`)
- [ ] No circular dependencies

**Example:**
```typescript
// ✅ Good
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { UserCard } from './UserCard';

// ❌ Bad
import { Button } from '../../../components/ui/button';  // No alias
import { useState } from 'react';  // Out of order
import { SomeUnusedThing } from './utils';  // Unused
```

---

### ✅ 14. Error Handling

**Check:**
- [ ] API errors handled
- [ ] User feedback on errors
- [ ] Error boundaries used for crashes
- [ ] Validation errors shown

**Example:**
```typescript
// ✅ Good
const { data, error } = useUsers();

if (error) {
  return <Alert variant="destructive">{error.message}</Alert>;
}

// ❌ Bad
const { data } = useUsers();  // Error ignored
```

---

### ✅ 15. Testing

**Check:**
- [ ] Component has tests
- [ ] Tests cover main functionality
- [ ] Tests check user interactions
- [ ] Edge cases tested

**Example:**
```typescript
// ✅ Good
describe('UserCard', () => {
  it('renders user name', () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
  });

  it('calls onEdit when button clicked', () => {
    const onEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={onEdit} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalled();
  });
});
```

---

## 🚨 Red Flags

**Immediate rejection if:**
- ❌ Using `any` type extensively
- ❌ No loading/error states for API data
- ❌ Hard-coded colors everywhere
- ❌ Component > 500 lines
- ❌ No TypeScript types
- ❌ Inline styles everywhere
- ❌ No keys on lists
- ❌ Using index as key

---

## ✅ Approval Criteria

**Approve if:**
- ✅ All critical checks pass
- ✅ Follows naming conventions
- ✅ Properly typed
- ✅ Handles loading/error states
- ✅ Responsive and dark mode
- ✅ Accessible
- ✅ Component library updated (if applicable)

**Approve with comments if:**
- ⚠️ Minor issues that can be fixed later
- ⚠️ Performance improvements possible
- ⚠️ Missing tests but functionality works

**Request changes if:**
- ⛔ Critical issues present
- ⛔ Doesn't follow standards
- ⛔ Missing essential functionality
- ⛔ Component library not updated

---

## 📝 Review Template

```markdown
## Component Review: [ComponentName]

### ✅ Passes
- Proper naming and structure
- TypeScript properly used
- Responsive and dark mode support

### ⚠️ Minor Issues
- Consider memoizing the sortedUsers computation
- Could add more descriptive ARIA labels

### ⛔ Issues to Fix
- Missing error handling for API call
- Component not added to library (should it be?)
- Hard-coded color values (use theme variables)

### 📋 Checklist Results
- [x] Naming: PASS
- [x] Props: PASS
- [x] Styling: PASS (with comments)
- [ ] Error Handling: FAIL
- [ ] Component Library: NEEDS VERIFICATION

### 🎯 Recommendation
**REQUEST CHANGES** - Fix error handling and verify library status

### Next Steps
1. Add error handling for useUsers hook
2. Decide if component should be in common library
3. Replace hard-coded colors with theme variables
```

---

## 🎯 Quick Decision Matrix

| Scenario | Action |
|----------|--------|
| All critical checks pass | ✅ APPROVE |
| Minor improvements needed | ⚠️ APPROVE WITH COMMENTS |
| 1-2 critical issues | ⛔ REQUEST CHANGES |
| 3+ critical issues | ⛔ REJECT - needs major refactor |
| No tests | ⚠️ APPROVE but request tests |
| Using `any` extensively | ⛔ REQUEST CHANGES |
| Not in library (should be) | ⛔ REQUEST CHANGES |

---

**Use this checklist for every component review!**
