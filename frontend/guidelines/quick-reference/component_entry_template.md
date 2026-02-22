# Component Library Entry Template

**For:** EXECUTOR adding component to library  
**Use:** When user confirms component should be added to common library

---

## Quick Template

Copy this template when adding a component to COMPONENT_LIBRARY.md:

```markdown
## [ComponentName]

**Status:** ✅ Stable  
**Location:** `components/common/[ComponentName].tsx`  
**Created:** [Date - Today's date]

**Props:**
```typescript
[Copy exact interface from component file]
```

**Usage:**
```tsx
[Simple example showing basic usage]
```

**When to use:**
- [Use case 1]
- [Use case 2]

**When NOT to use:**
- [Anti-pattern 1]

---
```

---

## Full Template (For Complex Components)

```markdown
## [ComponentName]

**Status:** ✅ Stable  
**Location:** `components/common/[ComponentName].tsx`  
**Created:** [Date]  
**Category:** [Layout / Form / Data Display / Feedback / Navigation]

**Purpose:**
[One sentence describing what this component does]

**Props:**
```typescript
interface [ComponentName]Props {
  // Required props
  [prop]: [type];
  
  // Optional props
  [prop]?: [type];
  
  // Callback props
  on[Event]?: (data: [type]) => void;
  
  // Style props
  className?: string;
  style?: React.CSSProperties;
}
```

**Variants:** (if applicable)
- `variant="default"`: [Description and when to use]
- `variant="[other]"`: [Description and when to use]

**Sizes:** (if applicable)
- `size="sm"`: [Dimensions - e.g., "32px height"]
- `size="md"`: [Dimensions - e.g., "40px height"] (default)
- `size="lg"`: [Dimensions - e.g., "48px height"]

**States:** (if applicable)
- Default state
- Loading state
- Error state
- Success state
- Disabled state

**Usage:**
```tsx
// Basic usage
<ComponentName 
  requiredProp="value"
/>

// With optional props
<ComponentName 
  requiredProp="value"
  optionalProp="value"
  onEvent={(data) => handleEvent(data)}
/>

// With variants
<ComponentName 
  variant="primary"
  size="lg"
/>
```

**Examples:**

```tsx
// Example 1: [Common use case description]
<ComponentName 
  prop1="value1"
  prop2="value2"
/>

// Example 2: [Another common use case]
<ComponentName 
  prop1="differentValue"
  prop3="value3"
/>

// Example 3: [Edge case or special usage]
<ComponentName 
  prop1="value"
  disabled
/>
```

**When to use:**
- [Scenario 1 - be specific]
- [Scenario 2 - be specific]
- [Scenario 3 - be specific]

**When NOT to use:**
- [Anti-pattern 1 - what to use instead]
- [Anti-pattern 2 - what to use instead]
- [Anti-pattern 3 - what to use instead]

**Accessibility:**
- [ARIA label requirements]
- [Keyboard navigation support]
- [Screen reader support]

**Styling:**
- Supports dark mode: [Yes/No]
- Responsive: [Yes/No]
- Customizable via: [className, style props, variants]

**Dependencies:** (if any)
- [External library 1]
- [External library 2]

**Related components:**
- [Similar component 1] - Use when [scenario]
- [Similar component 2] - Use when [scenario]

**Notes:**
- [Special consideration 1]
- [Special consideration 2]
- [Performance notes if relevant]
- [Breaking changes from previous versions if any]

**Migration:** (if replacing an old component)
```tsx
// Old way
<OldComponent ... />

// New way
<NewComponent ... />
```

---
```

---

## Real Example: FileUploadCard

```markdown
## FileUploadCard

**Status:** ✅ Stable  
**Location:** `components/common/FileUploadCard.tsx`  
**Created:** Feb 18, 2025  
**Category:** Form / File Upload

**Purpose:**
Handles file upload with drag-and-drop, preview, and validation.

**Props:**
```typescript
interface FileUploadCardProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  preview?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
}
```

**Usage:**
```tsx
<FileUploadCard 
  onFileSelect={(file) => handleUpload(file)}
  accept="image/*"
  maxSize={5}
  preview
/>
```

**Examples:**

```tsx
// Image upload with preview
<FileUploadCard 
  onFileSelect={handleImageUpload}
  accept="image/*"
  maxSize={5}
  preview
  helperText="Upload profile picture (max 5MB)"
/>

// Document upload
<FileUploadCard 
  onFileSelect={handleDocUpload}
  accept=".pdf,.doc,.docx"
  maxSize={10}
  helperText="Upload resume"
/>

// Disabled state
<FileUploadCard 
  onFileSelect={handleUpload}
  disabled
  helperText="Upload disabled until form is valid"
/>
```

**When to use:**
- User avatar uploads
- Document uploads
- Course material uploads
- Any file upload with preview

**When NOT to use:**
- Multiple file upload (use FileUploadMultiple instead)
- Image-only with crop (use ImageUploadCrop instead)

**Accessibility:**
- Keyboard accessible (Enter/Space to open file picker)
- Screen reader announces file selection
- Error messages announced to screen readers

**Styling:**
- Supports dark mode: Yes
- Responsive: Yes
- Shows drag-over state with highlight

**Related components:**
- FileUploadMultiple - For uploading multiple files
- ImageUploadCrop - For images with cropping

---
```

---

## Quick Reference for Common Categories

**Layout:**
- Header, Footer, Sidebar, Container, Grid, Flex

**Form:**
- Input, Select, Checkbox, Radio, DatePicker, FileUpload

**Data Display:**
- Table, List, Card, Badge, Avatar, Tag

**Feedback:**
- Alert, Toast, Modal, Dialog, Loading, Progress

**Navigation:**
- Menu, Breadcrumb, Pagination, Tabs, Stepper

**Button:**
- Button, IconButton, ButtonGroup, ToggleButton

---

## Checklist Before Submitting Entry

- [ ] Component name is clear and descriptive
- [ ] Status is set (✅ Stable, 🚧 Beta, 🔄 Deprecated)
- [ ] Location path is correct
- [ ] Props interface is copied exactly from code
- [ ] At least one usage example provided
- [ ] "When to use" has 2+ scenarios
- [ ] "When NOT to use" has at least 1 anti-pattern
- [ ] Variants documented (if any)
- [ ] Sizes documented (if any)
- [ ] Related components listed (if any)
- [ ] Dark mode support noted
- [ ] Component actually moved to components/common/
- [ ] All feature imports updated

---

## Where to Add Entry

**In COMPONENT_LIBRARY.md:**

1. Find the appropriate section (UI Components, Layout, Form, etc.)
2. Add in alphabetical order within section
3. Use the template above
4. Save file

**File location:**
```
components/COMPONENT_LIBRARY.md
```

---

## Tips for Good Documentation

### Props
- ✅ Include all props, even optional ones
- ✅ Add comments explaining non-obvious props
- ✅ Show default values
- ❌ Don't leave out any props

### Examples
- ✅ Show common use cases
- ✅ Show different variants/configurations
- ✅ Keep examples simple and clear
- ❌ Don't show overly complex examples

### When to use
- ✅ Be specific about scenarios
- ✅ Think from user's perspective
- ✅ Include 2-4 use cases
- ❌ Don't be vague ("use for stuff")

### When NOT to use
- ✅ Mention alternative components
- ✅ Explain why not to use
- ✅ Guide to better solution
- ❌ Don't just say "don't use"

---

**Quick Start:**

1. Copy template above
2. Fill in component details
3. Add to COMPONENT_LIBRARY.md
4. Done! ✅
