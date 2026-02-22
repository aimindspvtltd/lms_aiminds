# Frontend Role-Based Guidelines Mapping

**Version:** 1.0  
**Purpose:** Define which guideline files each role should access for maximum efficiency

---

## Your Team's Workflow

```
TASK_101 Created
    ↓
ARCHITECT → Designs folder structure, plans component architecture, decides tech approach
    ↓
UX_DESIGNER → Reviews existing components, decides reusability, creates new component specs
    ↓
EXECUTOR → Implements code following ARCHITECT's plan and UX_DESIGNER's specs
    ↓
REVIEWER → Reviews code quality, checks standards, verifies patterns
    ↓
Merged ✅
```

---

## 🏗️ ARCHITECT (System Design & Planning)

**Purpose:** Design application structure, plan component architecture, make technical decisions

**Responsibilities:**
- Design folder structure (features, modules, components)
- Plan component hierarchy and composition
- Decide state management approach
- Design API integration strategy
- Plan routing structure
- Create technical specifications for EXECUTOR

**Access:**
- `core/01-structure/01a_folder_layout.md` ⭐ (PRIMARY - Folder organization)
- `core/02-components/02a_component_basics.md` ⭐ (PRIMARY - Component design)
- `core/03-state/03a_state_decision_tree.md` ⭐ (PRIMARY - State strategy)
- `core/05-routing/05a_router_setup.md` (Routing design)
- `core/06-api/06a_service_pattern.md` (API strategy)
- `quick-reference/architecture_decisions.md` (Decision trees)

**Focus Areas:**
- Application structure
- Component composition patterns
- State management strategy
- Module boundaries
- Scalability planning

**Example Usage:**
```
You are an ARCHITECT designing TASK_101_User_Management_Dashboard.

Requirements:
- User list with filters
- User detail view
- User creation/edit forms
- Role-based permissions

Design:
1. Folder structure (which features/modules)
2. Component hierarchy
3. State management approach
4. Routing structure
5. Technical specifications for EXECUTOR
```

**ARCHITECT Output Example:**
```markdown
# TASK_101 Technical Design

## Folder Structure
features/users/
├── components/
│   ├── UserList.tsx       # Main list with filters
│   ├── UserCard.tsx       # Individual user card
│   ├── UserDetail.tsx     # Detail view
│   ├── UserForm.tsx       # Create/edit form
│   └── UserFilters.tsx    # Filter component
├── hooks/
│   ├── useUsers.ts        # Fetch users list
│   ├── useUser.ts         # Fetch single user
│   └── useUserMutations.ts
├── services/
│   └── user.service.ts
└── types/
    └── user.types.ts

## Component Hierarchy
UserListPage
└── UserList
    ├── UserFilters
    └── UserCard (multiple)

UserDetailPage
└── UserDetail
    └── UserForm (for editing)

## State Management
- Server state: TanStack Query (user data from API)
- Client state: Zustand (filters, UI state)
- Component state: useState (form inputs)

## API Integration
- Service pattern with typed responses
- Custom hooks for queries/mutations
- Optimistic updates for edit/delete

## Routes
/admin/users         → UserListPage
/admin/users/:id     → UserDetailPage
/admin/users/new     → UserCreatePage
```

---

## 🎨 UX_DESIGNER (Component Reusability & Styling)

**Purpose:** Review existing components, decide reusability, ensure consistent design, create component specifications

**Responsibilities:**
- Check if existing components can be reused
- Design new components when needed
- Ensure design consistency
- Define component variants
- Specify styling and theme usage
- Create component specifications
- Ensure accessibility

**Access:**
- `components/COMPONENT_LIBRARY.md` ⭐ (PRIMARY - All existing components)
- `core/04-styling/04e_styling_patterns.md` ⭐ (PRIMARY - Tailwind, theme, styling)
- `core/02-components/02a_component_basics.md` (Component patterns)
- `quick-reference/component_catalog.md` (Quick component lookup)
- `quick-reference/styling_patterns.md` (Common styles)

**Focus Areas:**
- Component reusability
- Design system consistency
- Theming and variants
- Responsive design
- Accessibility
- Styling patterns

**Example Usage:**
```
You are a UX_DESIGNER working on TASK_101_User_Management_Dashboard.

ARCHITECT designed:
- UserList component
- UserCard component
- UserFilters component

Your job:
1. Check COMPONENT_LIBRARY.md - can we reuse existing components?
2. For new components needed, specify:
   - Props interface
   - Variants
   - Styling approach
   - Responsive behavior
3. Ensure consistency with existing design system
```

**UX_DESIGNER Output Example:**
```markdown
# TASK_101 Component Specifications

## Component Reusability Analysis

### ✅ REUSE: DataTable
**From:** components/common/DataTable
**Usage:** Use for UserList instead of creating new list component
**Customization needed:** Add user-specific columns

### ✅ REUSE: Card
**From:** components/ui/Card
**Usage:** Wrap user info in existing Card component
**No customization needed**

### ✅ REUSE: Form components
**From:** components/form/*
**Usage:** FormInput, FormSelect for UserForm
**No customization needed**

### 🆕 CREATE: UserAvatar
**Why:** No existing avatar component with status indicator
**Specification below**

## New Component Specs

### UserAvatar Component

**Props:**
```typescript
interface UserAvatarProps {
  src?: string;           // Avatar image URL
  alt: string;            // Alt text
  size?: 'sm' | 'md' | 'lg'; // Size variant
  status?: 'online' | 'offline' | 'away'; // Status indicator
  className?: string;
}
```

**Variants:**
- size="sm": 32px circle
- size="md": 48px circle (default)
- size="lg": 64px circle

**Styling:**
- Use avatar component pattern from Shadcn
- Status indicator: absolute positioned dot
  - online: bg-green-500
  - offline: bg-gray-400
  - away: bg-yellow-500
- Dark mode: border color adjusts
- Fallback: Show initials on colored background

**Accessibility:**
- Alt text required
- Status communicated via aria-label

**Responsive:**
- Same size on all breakpoints (use size prop for control)

### UserStatusBadge Component

**Props:**
```typescript
interface UserStatusBadgeProps {
  status: 'active' | 'inactive' | 'suspended';
  size?: 'sm' | 'md';
}
```

**Variants:**
- active: bg-green-100 dark:bg-green-900, text-green-800 dark:text-green-100
- inactive: bg-gray-100 dark:bg-gray-800, text-gray-800 dark:text-gray-100
- suspended: bg-red-100 dark:bg-red-900, text-red-800 dark:text-red-100

**Usage Example:**
```tsx
<UserStatusBadge status="active" size="sm" />
```
```

---

## 👨‍💻 EXECUTOR (Implementation)

**Purpose:** Implement components and features according to ARCHITECT's design and UX_DESIGNER's specifications

**Responsibilities:**
- Implement components following specifications
- Write TypeScript types
- Integrate with APIs
- Implement forms with validation
- Handle loading and error states
- Write clean, maintainable code
- Follow coding patterns

**Access:**
- `core/02-components/02a_component_basics.md` ⭐ (PRIMARY - How to write components)
- `core/06-api/06a_service_pattern.md` ⭐ (PRIMARY - API integration)
- `core/07-forms/07a_react_hook_form.md` ⭐ (PRIMARY - Form implementation)
- `core/04-styling/04e_styling_patterns.md` (Styling patterns)
- `components/COMPONENT_LIBRARY.md` (Reference existing components)
- `quick-reference/code_snippets.md` (Common patterns)
- `quick-reference/naming_conventions.md` (Naming rules)

**Focus Areas:**
- Writing clean TypeScript code
- Implementing component logic
- API integration with hooks
- Form validation with Zod
- Error handling
- Loading states
- Following patterns

**Example Usage:**
```
You are an EXECUTOR implementing TASK_101_User_Management_Dashboard.

ARCHITECT provided:
- Folder structure
- Component list
- State management approach

UX_DESIGNER provided:
- Component specifications
- Reusable components list
- Styling requirements

Implement:
1. UserList component using DataTable
2. UserAvatar component (new)
3. UserForm with validation
4. API hooks (useUsers, useCreateUser, etc.)
```

**EXECUTOR Output Example:**
```typescript
// features/users/components/UserAvatar.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/cn';

interface UserAvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'away';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

const statusClasses = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
};

export function UserAvatar({
  src,
  alt,
  size = 'md',
  status,
  className,
}: UserAvatarProps) {
  const initials = alt
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn('relative', className)}>
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background',
            statusClasses[status]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}

// features/users/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { useToast } from '@/components/ui/use-toast';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: any) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: userKeys.list(filters || {}),
    queryFn: () => userService.getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast({
        title: 'Success',
        description: 'User created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
```

---

## 🔍 REVIEWER (Code Quality & Standards)

**Purpose:** Review code for quality, standards compliance, best practices

**Responsibilities:**
- Review code quality
- Check naming conventions
- Verify component patterns
- Check error handling
- Verify accessibility
- Check performance
- Ensure TypeScript usage
- Verify testing

**Access:**
- `quick-reference/review/quick_review.md` ⭐ (PRIMARY - What to check)
- `quick-reference/naming_conventions.md` ⭐ (PRIMARY - Naming rules)
- `quick-reference/common_mistakes.md` ⭐ (PRIMARY - What to avoid)
- `core/02-components/02a_component_basics.md` (Component standards)
- `core/04-styling/04e_styling_patterns.md` (Styling standards)
- `quick-reference/code_snippets.md` (Expected patterns)

**Focus Areas:**
- Code quality
- Standards compliance
- Best practices
- TypeScript correctness
- Accessibility
- Performance concerns

**Example Usage:**
```
You are a REVIEWER checking TASK_101_User_Management_Dashboard PR.

Files changed:
- features/users/components/UserAvatar.tsx
- features/users/components/UserList.tsx
- features/users/hooks/useUsers.ts
- features/users/services/user.service.ts

Review for:
- Component patterns
- TypeScript usage
- Naming conventions
- Error handling
- Accessibility
- Common mistakes
```

**REVIEWER Output Example:**
```
PR Review: TASK_101_User_Management_Dashboard

## ✅ PASSED

**Component Architecture:**
- ✓ Components properly split (UserAvatar, UserList, UserCard)
- ✓ Single responsibility principle followed
- ✓ Props interfaces defined
- ✓ Named exports used

**TypeScript:**
- ✓ All props typed
- ✓ No 'any' types
- ✓ Proper type inference
- ✓ Service responses typed

**Naming Conventions:**
- ✓ Components: PascalCase (UserAvatar)
- ✓ Hooks: camelCase with 'use' prefix (useUsers)
- ✓ Files: PascalCase for components
- ✓ Props: camelCase

**API Integration:**
- ✓ Service pattern used correctly
- ✓ Query keys organized
- ✓ Error handling with toast
- ✓ Cache invalidation on mutations

**Styling:**
- ✓ Tailwind utility classes used
- ✓ Dark mode support (dark: classes)
- ✓ Responsive design considered
- ✓ cn() utility for conditional classes

## ⚠️ WARNINGS

**Accessibility:**
- ⚠️ UserList missing ARIA labels for filter buttons
- ⚠️ Missing keyboard navigation for user cards

**Performance:**
- ⚠️ UserList not memoized (could re-render unnecessarily)
- ⚠️ Consider virtualization for large lists

## ❌ ISSUES

**Missing Tests:**
- ❌ No unit tests for UserAvatar component
- ❌ No integration tests for useUsers hook

**Error Handling:**
- ❌ UserForm doesn't handle network errors properly
- ❌ Missing error boundary around UserList

## Recommendations

1. Add aria-label to filter buttons
2. Add onKeyDown handlers for keyboard navigation
3. Memoize UserList component
4. Add unit tests (required before merge)
5. Wrap UserList in ErrorBoundary
6. Add network error handling in UserForm

**Verdict:** REQUEST CHANGES
- Fix critical issues (tests, error handling)
- Address warnings
- Then ready to merge
```

---

## Quick Reference Matrix

| Role | Primary Files | Secondary Files | Quick Refs |
|------|--------------|-----------------|------------|
| **ARCHITECT** | 01, 02, 03, 05, 06 | - | architecture_decisions |
| **UX_DESIGNER** | COMPONENT_LIBRARY, 04 | 02 | component_catalog, styling_patterns |
| **EXECUTOR** | 02, 06, 07 | 04, COMPONENT_LIBRARY | code_snippets, naming |
| **REVIEWER** | quick_review, naming, mistakes | 02, 04 | code_snippets |

**File Number Reference:**
- 01 = Project Structure
- 02 = Component Architecture
- 03 = State Management
- 04 = Styling System
- 05 = Routing Architecture
- 06 = API Architecture
- 07 = Forms

---

## Token Efficiency

| Role | Files | Est. Lines | Tokens | Savings |
|------|-------|-----------|--------|---------|
| ARCHITECT | 6 files | ~2,000 | ~5,000 | 73% ✅ |
| UX_DESIGNER | 5 files | ~1,500 | ~3,750 | 80% ✅ |
| EXECUTOR | 7 files | ~2,500 | ~6,250 | 66% ✅ |
| REVIEWER | 6 files | ~1,200 | ~3,000 | 84% ✅ |

**Baseline:** Loading all files = ~4,800 lines ≈ 18,000 tokens

---

## Usage Instructions

### For Claude

When user assigns a role:

```
User: "You are a UX_DESIGNER. Review existing components for user management."

Claude's Process:
1. Identify role: UX_DESIGNER
2. Load files:
   - components/COMPONENT_LIBRARY.md
   - core/04-styling/04e_styling_patterns.md
   - quick-reference/component_catalog.md
3. Check existing components for reusability
4. Provide recommendations
```

### For Developers

Assign role based on current phase:

**Planning/Design:**
```
You are an ARCHITECT. Design the structure for [feature].
```

**Component Review:**
```
You are a UX_DESIGNER. Check if we can reuse existing components for [feature].
```

**Implementation:**
```
You are an EXECUTOR. Implement [component] according to the specs.
```

**Code Review:**
```
You are a REVIEWER. Check this PR for [feature].
```

---

## Combined Roles

You can combine roles when needed:

```
You are an ARCHITECT and UX_DESIGNER. Design the component architecture 
and specify reusable components.
→ Loads: ARCHITECT files + UX_DESIGNER files (deduplicated)
```

---

## Notes

- ⭐ = Primary file (most critical for this role)
- Each role focuses on specific phase of development
- Roles work sequentially: ARCHITECT → UX_DESIGNER → EXECUTOR → REVIEWER
- Component library is updated after each new component is created
- UX_DESIGNER prevents component duplication by checking library first
