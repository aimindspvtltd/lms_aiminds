# Component Library - Dynamic Update Workflow

**File:** component_library_workflow.md  
**Purpose:** How EXECUTOR adds new components to the library during implementation  
**For:** EXECUTOR

---

## 🎯 Core Principle

**The library is LIVING, not static.**

Components are added to `COMPONENT_LIBRARY.md` **during implementation**, not after the fact.

---

## 🔄 EXECUTOR Workflow

### Step 1: Create Component

EXECUTOR implements the component following guidelines.

```typescript
// features/users/components/UserAvatar.tsx
export function UserAvatar({ src, alt, size, status }: UserAvatarProps) {
  // Implementation
}
```

---

### Step 2: Ask Reusability Question

**EXECUTOR must ask user:**

```
I've created the UserAvatar component.

Reusability Assessment:
- Specific to users feature? → Keep in features/users/
- Could be used by other features? → Move to components/common/

Should I add this to the common components library?
```

---

### Step 3A: If YES - Add to Common Library

**EXECUTOR does 3 things:**

**1. Move file to components/common/**
```
Move: features/users/components/UserAvatar.tsx
  To: components/common/UserAvatar.tsx
```

**2. Update COMPONENT_LIBRARY.md**
```markdown
## UserAvatar

**Status:** ✅ Stable  
**Location:** `components/common/UserAvatar.tsx`  
**Created:** [Date]

**Props:**
```typescript
interface UserAvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'away';
  className?: string;
}
```

**Variants:**
- `size="sm"`: 32px circle
- `size="md"`: 48px circle (default)
- `size="lg"`: 64px circle

**Usage:**
```tsx
<UserAvatar 
  src={user.avatar} 
  alt={user.name} 
  size="md"
  status="online"
/>
```

**When to use:**
- User avatars across the app
- Profile pictures
- Any circular avatar with status indicator

**When NOT to use:**
- Square images (use Image component)
- Avatars without status (use Shadcn Avatar)
```

**3. Update feature imports**
```typescript
// features/users/components/UserCard.tsx
// Before
import { UserAvatar } from './UserAvatar';

// After
import { UserAvatar } from '@/components/common/UserAvatar';
```

---

### Step 3B: If NO - Keep in Feature

**EXECUTOR keeps component in feature folder:**

```
Keep: features/users/components/UserSpecificComponent.tsx
```

**No library update needed.**

---

## 🤔 Decision Criteria

### Add to Common Library IF:

✅ **Will be used by 2+ features**
```
Example: UserAvatar used in:
- features/users/
- features/courses/ (show instructor avatar)
- features/dashboard/ (show activity avatars)
→ Add to common library
```

✅ **Generic enough to be reusable**
```
Example: StatusBadge
Can show: active, inactive, pending, approved, etc.
→ Add to common library
```

✅ **Not tied to specific feature logic**
```
Example: DataTable
Works with any data type
→ Add to common library
```

---

### Keep in Feature IF:

❌ **Only used in one feature**
```
Example: UserOnboardingWizard
Only used in users feature
→ Keep in features/users/
```

❌ **Has feature-specific business logic**
```
Example: CourseEnrollmentButton
Contains course enrollment logic
→ Keep in features/courses/
```

❌ **Unlikely to be reused**
```
Example: UserDashboardWidget
Very specific to user dashboard
→ Keep in features/dashboard/
```

---

## 📝 Component Library Entry Template

When adding to library, use this template:

```markdown
## [ComponentName]

**Status:** ✅ Stable / 🚧 Beta / 🔄 Deprecated  
**Location:** `components/common/[ComponentName].tsx`  
**Created:** [Date]  
**Category:** [Layout / Form / Data Display / Feedback / etc.]

**Purpose:**
[One sentence describing what this component does]

**Props:**
```typescript
interface [ComponentName]Props {
  // Copy exact interface from component
}
```

**Variants:** (if applicable)
- `variant="default"`: [Description]
- `variant="other"`: [Description]

**Sizes:** (if applicable)
- `size="sm"`: [Dimensions/Description]
- `size="md"`: [Dimensions/Description]
- `size="lg"`: [Dimensions/Description]

**Usage:**
```tsx
<ComponentName 
  prop1="value"
  prop2="value"
/>
```

**Examples:**
```tsx
// Common use case 1
<ComponentName config1 />

// Common use case 2
<ComponentName config2 />
```

**When to use:**
- [Scenario 1]
- [Scenario 2]
- [Scenario 3]

**When NOT to use:**
- [Anti-pattern 1]
- [Anti-pattern 2]

**Related components:**
- [Similar component 1]
- [Similar component 2]

**Notes:** (optional)
- [Special consideration 1]
- [Special consideration 2]
```

---

## 🎯 Real Examples

### Example 1: StatusBadge

**EXECUTOR asks:**
```
I created a StatusBadge component for user status.

Reusability Assessment:
- Shows status with colored badge
- Could be used for: user status, course status, enrollment status
- Generic enough to be reusable

Should I add this to the common components library?
```

**User says YES:**

**EXECUTOR does:**
1. ✅ Move to `components/common/StatusBadge.tsx`
2. ✅ Add full entry to COMPONENT_LIBRARY.md
3. ✅ Update imports in users feature

---

### Example 2: UserOnboardingWizard

**EXECUTOR asks:**
```
I created a UserOnboardingWizard component.

Reusability Assessment:
- Very specific to user onboarding flow
- Contains user-specific business logic
- Unlikely to be reused elsewhere

Should I add this to the common components library?
```

**User says NO:**

**EXECUTOR does:**
1. ✅ Keep in `features/users/components/UserOnboardingWizard.tsx`
2. ✅ No library update

---

## 🔄 Library Maintenance

### When Component Changes

**If common component is updated:**

```
EXECUTOR must:
1. Update the component code
2. Update COMPONENT_LIBRARY.md entry
3. Note breaking changes if any
4. Update version/status if needed
```

---

### Component Status

**✅ Stable**
- Production-ready
- Safe to use
- No breaking changes expected

**🚧 Beta**
- Usable but may change
- Use with caution
- Breaking changes possible

**🔄 Deprecated**
- Being replaced
- Don't use in new code
- Migration path provided

---

## 📋 EXECUTOR Checklist

When creating ANY component:

- [ ] Component implemented and working
- [ ] **Ask: Should this be in common library?**
- [ ] If YES:
  - [ ] Move to components/common/
  - [ ] Add entry to COMPONENT_LIBRARY.md
  - [ ] Update all imports
  - [ ] Test still works
- [ ] If NO:
  - [ ] Keep in features/[feature]/
  - [ ] No library update needed

---

## 🎯 Benefits of This Workflow

### 1. Library Always Up-to-Date
✅ Components added as they're created  
✅ No outdated documentation  
✅ No missing components  

### 2. Forces Reusability Thinking
✅ EXECUTOR considers reusability upfront  
✅ Better component design  
✅ Less duplication  

### 3. Clear Process
✅ Every component goes through decision  
✅ Consistent approach  
✅ No ambiguity  

### 4. Living Documentation
✅ Library grows with codebase  
✅ Always reflects current state  
✅ Easy to find components  

---

## 🤖 EXECUTOR Prompt Template

**Use this when asking about library addition:**

```
I've created the [ComponentName] component.

Reusability Assessment:
- [What it does]
- [Where it could be used]
- [Why it might/might not be reusable]

Recommendation: [Add to common / Keep in feature]

Should I add this to the common components library?

If YES, I will:
1. Move to components/common/
2. Add full entry to COMPONENT_LIBRARY.md with:
   - Props interface
   - Usage examples
   - When to use / when not to use
3. Update imports in [feature]
```

---

## 📊 Decision Flow

```
Component Created
    ↓
Used by 2+ features?
    ├─ YES → Add to common library ✅
    └─ NO ↓
    
Generic/reusable logic?
    ├─ YES → Add to common library ✅
    └─ NO ↓
    
Feature-specific?
    ├─ YES → Keep in feature ✅
    └─ UNCERTAIN → Ask user
```

---

## 🎯 Example Interaction

**EXECUTOR:**
```
I've created a FileUploadCard component.

Reusability Assessment:
- Handles file upload with drag-and-drop
- Shows preview and validation
- Could be used for: user avatars, course materials, document uploads
- Generic - accepts any file type
- No feature-specific logic

Recommendation: Add to common library

Should I add this to the common components library?

If YES, I will:
1. Move to components/common/FileUploadCard.tsx
2. Add entry to COMPONENT_LIBRARY.md with complete documentation
3. Update imports in features/users/
```

**User:**
```
Yes, add it to common library
```

**EXECUTOR:**
```
✅ Done!

1. Moved to components/common/FileUploadCard.tsx
2. Added full entry to COMPONENT_LIBRARY.md including:
   - Props interface (file types, max size, preview options)
   - Usage examples
   - When to use (any file upload scenario)
   - When NOT to use (for images only, use ImageUpload)
3. Updated import in features/users/components/UserProfileForm.tsx

The component is now available for all features to use!
```

---

## 🚫 Common Mistakes to Avoid

### ❌ Don't Create Duplicate Components

**Before creating new component:**
```
EXECUTOR should check COMPONENT_LIBRARY.md first!
```

**If similar exists:**
```
Ask: Can I extend existing component instead of creating new one?
```

---

### ❌ Don't Add Everything to Common

**Not every component needs to be common:**
```
UserDashboardSpecificWidget → Keep in features/dashboard/
```

---

### ❌ Don't Forget to Update Library

**When component added to common:**
```
Must update COMPONENT_LIBRARY.md immediately
Not "I'll do it later"
```

---

## 📝 Summary

**This workflow ensures:**

1. ✅ **EXECUTOR asks** about every new component
2. ✅ **User decides** if it goes to common library
3. ✅ **Library stays current** - updated during implementation
4. ✅ **No duplication** - reusable components centralized
5. ✅ **Clear documentation** - every common component documented

**Result:** Living, up-to-date component library that grows with your app!

---

**See also:**
- COMPONENT_LIBRARY.md - The library itself
- 02a_component_basics.md - Component implementation
- component_catalog.md - Quick component lookup
