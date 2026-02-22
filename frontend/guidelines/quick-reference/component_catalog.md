# Component Catalog - Quick Lookup

**For:** UX_DESIGNER, EXECUTOR  
**Purpose:** Fast component lookup (see COMPONENT_LIBRARY.md for full details)

---

## 🎯 Quick Component List

### UI Components (Shadcn)
```
✅ Button          - All button variants
✅ Input           - Text/number/email inputs
✅ Select          - Dropdown selection
✅ Checkbox        - Boolean selection
✅ Radio           - Single choice from options
✅ Switch          - Toggle on/off
✅ Textarea        - Multi-line text
✅ Label           - Form labels
✅ Card            - Container with header/content/footer
✅ Dialog          - Modal dialogs
✅ Alert           - Inline alerts
✅ Badge           - Status indicators
✅ Avatar          - User avatars with fallback
✅ Tabs            - Tabbed content
✅ Accordion       - Collapsible sections
✅ Tooltip         - Hover information
✅ Popover         - Popup content
✅ Toast           - Notifications
```

### Layout Components
```
✅ Header          - Top navigation
✅ Sidebar         - Side navigation
✅ MainLayout      - Page layout with title/actions
✅ Footer          - Bottom content
```

### Form Components
```
✅ FormInput       - Input with label/error
✅ FormSelect      - Select with label/error
✅ FileUpload      - Drag-and-drop file upload
```

### Common Components
```
✅ DataTable       - Sortable/filterable table
✅ SearchBar       - Search with debounce
✅ LoadingSpinner  - Loading indicators
✅ EmptyState      - Empty list state
✅ ErrorBoundary   - Error handling
✅ ConfirmDialog   - Confirmation prompts
```

---

## 📋 Component Quick Reference

### Button
**Location:** `components/ui/button.tsx`  
**Props:** `variant`, `size`, `disabled`, `onClick`  
**Variants:** default, destructive, outline, secondary, ghost, link  
**Sizes:** default, sm, lg, icon  
**Use for:** Any clickable action  

---

### Input
**Location:** `components/ui/input.tsx`  
**Props:** `type`, `placeholder`, `value`, `onChange`, `disabled`  
**Use for:** Text, email, password, number inputs  
**Dark mode:** ✅ Automatic  

---

### Card
**Location:** `components/ui/card.tsx`  
**Parts:** CardHeader, CardTitle, CardDescription, CardContent, CardFooter  
**Use for:** Grouped content, panels, sections  

```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

---

### Dialog
**Location:** `components/ui/dialog.tsx`  
**Parts:** Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter  
**Use for:** Modals, confirmations, forms  

```typescript
<Dialog>
  <DialogTrigger>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    <div>Content</div>
  </DialogContent>
</Dialog>
```

---

### DataTable
**Location:** `components/common/DataTable.tsx`  
**Props:** `data`, `columns`, `searchKey`, `pagination`, `onRowClick`  
**Features:** Sorting, filtering, pagination, row selection  
**Use for:** Any list of items  

```typescript
<DataTable
  data={users}
  columns={userColumns}
  searchKey="name"
  pagination
/>
```

---

### SearchBar
**Location:** `components/common/SearchBar.tsx`  
**Props:** `value`, `onChange`, `placeholder`, `debounce`  
**Features:** Debounced search, clear button, keyboard shortcuts  
**Use for:** Search inputs, filter inputs  

```typescript
<SearchBar
  value={search}
  onChange={setSearch}
  placeholder="Search users..."
  debounce={300}
/>
```

---

### LoadingSpinner
**Location:** `components/common/LoadingSpinner.tsx`  
**Props:** `size`, `fullScreen`, `text`  
**Sizes:** sm, md, lg  
**Use for:** Loading states, async operations  

```typescript
<LoadingSpinner size="md" text="Loading..." />
```

---

### EmptyState
**Location:** `components/common/EmptyState.tsx`  
**Props:** `icon`, `title`, `description`, `action`  
**Use for:** Empty lists, no results, no data  

```typescript
<EmptyState
  icon={<Users />}
  title="No users found"
  description="Get started by creating your first user"
  action={<Button>Add User</Button>}
/>
```

---

### Header
**Location:** `components/layout/Header.tsx`  
**Props:** `user`, `onLogout`  
**Features:** Logo, nav menu, user dropdown, theme toggle  
**Responsive:** ✅ Collapsible on mobile  

---

### Sidebar
**Location:** `components/layout/Sidebar.tsx`  
**Props:** `isOpen`, `onClose`, `items`  
**Features:** Icons, labels, active state, badges  
**Responsive:** ✅ Drawer on mobile  

---

### FileUpload
**Location:** `components/form/FileUpload.tsx`  
**Props:** `onFileSelect`, `accept`, `maxSize`, `preview`, `multiple`  
**Features:** Drag-and-drop, validation, image preview  
**Use for:** File uploads, image uploads, document uploads  

---

### ConfirmDialog
**Location:** `components/common/ConfirmDialog.tsx`  
**Props:** `open`, `title`, `description`, `confirmText`, `onConfirm`, `variant`  
**Variants:** default, destructive  
**Use for:** Delete confirmation, dangerous actions  

```typescript
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  title="Delete user?"
  description="This action cannot be undone."
  confirmText="Delete"
  variant="destructive"
  onConfirm={handleDelete}
/>
```

---

## 🎯 Decision Tree: Which Component?

### Need a button?
```
Action button → Button (variant="default")
Delete button → Button (variant="destructive")
Cancel button → Button (variant="outline")
Link button → Button (variant="link")
Icon only → Button (size="icon")
```

### Need an input?
```
Text input → Input (type="text")
Email → Input (type="email")
Password → Input (type="password")
Number → Input (type="number")
Multi-line → Textarea
File upload → FileUpload
```

### Need to show data?
```
List of items → DataTable
Single item → Card
Empty list → EmptyState
Loading data → LoadingSpinner
Error → Alert (variant="destructive")
```

### Need user interaction?
```
Confirm action → ConfirmDialog
Show details → Dialog
Temporary message → Toast
Hint text → Tooltip
Additional info → Popover
```

### Need form inputs?
```
Simple input → Input
With label/error → FormInput
Dropdown → Select or FormSelect
Toggle → Switch
Choice → Radio or Checkbox
```

### Need layout?
```
Page structure → MainLayout
Navigation → Header + Sidebar
Content container → Card
Multiple sections → Tabs or Accordion
```

---

## 🔍 Search by Use Case

### Authentication
- Login form: `Card` + `FormInput` + `Button`
- User menu: `Avatar` + `Popover`
- Protected content: Custom wrapper

### Lists & Tables
- User list: `DataTable`
- Search: `SearchBar`
- Empty: `EmptyState`
- Loading: `LoadingSpinner`

### Forms
- Simple form: `Input` + `Button`
- Complex form: `FormInput` + `FormSelect`
- File upload: `FileUpload`
- Multi-step: `Tabs` + forms

### Modals & Dialogs
- Confirmation: `ConfirmDialog`
- Form modal: `Dialog` + form
- Info modal: `Dialog` + content

### Navigation
- Top nav: `Header`
- Side nav: `Sidebar`
- Breadcrumbs: Custom component
- Tabs: `Tabs`

### Feedback
- Success: `Toast` (variant="default")
- Error: `Toast` (variant="destructive") or `Alert`
- Warning: `Alert` (variant="warning")
- Loading: `LoadingSpinner`

### Status & Indicators
- Status badge: `Badge`
- Active/inactive: `Badge` (variant by status)
- Progress: Custom with progress bar
- Avatar: `Avatar`

---

## 📊 Component Comparison

### Card vs Dialog
```
Card:
- Inline on page
- Always visible
- Non-blocking

Dialog:
- Overlay on page
- Shown on demand
- Blocks interaction
```

### Alert vs Toast
```
Alert:
- Persistent
- Inline in content
- Use for contextual feedback

Toast:
- Temporary (auto-dismiss)
- Floating notification
- Use for action feedback
```

### Button vs Link
```
Button:
- Performs action
- onClick handler
- Use for: Submit, Delete, Save

Link (Button variant="link"):
- Navigation
- href attribute
- Use for: Navigation, External links
```

### Select vs Radio
```
Select:
- Dropdown
- Many options (5+)
- Less space

Radio:
- All visible
- Few options (2-5)
- More space
```

---

## 🎨 Variant Quick Reference

### Button Variants
```
default     - Primary action (blue)
destructive - Delete/remove (red)
outline     - Secondary action (border)
secondary   - Tertiary action (gray)
ghost       - Minimal style
link        - Looks like link
```

### Badge Variants
```
default     - Neutral (gray)
secondary   - Subtle (light gray)
destructive - Error/warning (red)
outline     - Bordered
success     - (custom) Green
warning     - (custom) Yellow
```

### Alert Variants
```
default     - Info (blue)
destructive - Error (red)
```

---

## 📝 Common Patterns

### Form with validation
```typescript
<form onSubmit={handleSubmit}>
  <FormInput
    label="Email"
    name="email"
    type="email"
    error={errors.email}
  />
  <FormInput
    label="Password"
    name="password"
    type="password"
    error={errors.password}
  />
  <Button type="submit">Sign In</Button>
</form>
```

### Modal with form
```typescript
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create User</DialogTitle>
    </DialogHeader>
    <form>
      <FormInput label="Name" name="name" />
      <FormInput label="Email" name="email" />
    </form>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleSubmit}>Create</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### List with search and empty state
```typescript
<div>
  <SearchBar
    value={search}
    onChange={setSearch}
    placeholder="Search..."
  />
  {isLoading && <LoadingSpinner />}
  {!isLoading && data.length === 0 && (
    <EmptyState
      title="No results"
      description="Try adjusting your search"
    />
  )}
  {!isLoading && data.length > 0 && (
    <DataTable data={data} columns={columns} />
  )}
</div>
```

---

## ✅ Quick Checklist

**Before creating a new component:**

- [ ] Check this catalog
- [ ] Check COMPONENT_LIBRARY.md
- [ ] Can I reuse existing component?
- [ ] Can I extend existing component?
- [ ] Do I really need a new component?

**If creating new component:**

- [ ] Is it reusable enough for common/?
- [ ] Ask: "Should I add to common library?"
- [ ] Document in COMPONENT_LIBRARY.md

---

## 📚 Full Documentation

For complete details including:
- Full props interfaces
- All variants
- Usage examples
- When to use / when NOT to use

**See:** `components/COMPONENT_LIBRARY.md`

---

**This is a quick reference. Always check COMPONENT_LIBRARY.md for full details!**
