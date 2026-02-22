# Component Library Documentation

**Purpose:** Complete catalog of all existing components with props, usage, and examples  
**For:** UX_DESIGNER to check reusability, EXECUTOR for implementation reference

**Last Updated:** February 2025

---

## 📋 How to Use This Library

### For UX_DESIGNER:
Before creating a new component, search this document for existing components that can be reused.

### For EXECUTOR:
Reference component props and usage examples when implementing.

### Component Status:
- ✅ **Stable** - Production-ready, safe to use
- 🚧 **Beta** - Usable but may change
- 🔄 **Deprecated** - Being replaced, don't use

---

## Table of Contents

1. [UI Components (Shadcn)](#ui-components)
2. [Layout Components](#layout-components)
3. [Form Components](#form-components)
4. [Common Business Components](#common-components)
5. [Feature-Specific Components](#feature-components)

---

# UI Components

## Button

**Status:** ✅ Stable  
**Location:** `components/ui/button.tsx`  
**From:** Shadcn/UI

**Props:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}
```

**Variants:**
- `default`: Primary button (blue background)
- `destructive`: Danger actions (red background)
- `outline`: Secondary actions (border only)
- `secondary`: Muted actions (gray background)
- `ghost`: Minimal style (transparent)
- `link`: Looks like a link

**Sizes:**
- `sm`: Small (32px height)
- `default`: Medium (40px height)
- `lg`: Large (44px height)
- `icon`: Square icon button (40x40px)

**Usage:**
```tsx
<Button variant="default" size="lg">
  Submit
</Button>

<Button variant="destructive" size="sm">
  Delete
</Button>

<Button variant="ghost" size="icon">
  <Settings />
</Button>
```

**When to use:**
- Any clickable action
- Forms submissions
- Navigation actions

---

## Input

**Status:** ✅ Stable  
**Location:** `components/ui/input.tsx`  
**From:** Shadcn/UI

**Props:**
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Extends all native input props
}
```

**Usage:**
```tsx
<Input 
  type="text" 
  placeholder="Enter your name" 
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

<Input 
  type="email" 
  placeholder="email@example.com"
  disabled
/>
```

**Styling:**
- Auto dark mode support
- Focus ring
- Disabled state
- Error state (use with Form component)

**When to use:**
- Text input
- Email input
- Password input
- Number input
- Any standard HTML input type

---

## Card

**Status:** ✅ Stable  
**Location:** `components/ui/card.tsx`  
**From:** Shadcn/UI

**Components:**
```typescript
Card              // Container
CardHeader        // Header section
CardTitle         // Title
CardDescription   // Subtitle
CardContent       // Main content
CardFooter        // Footer section
```

**Props:**
```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  // Extends div props
}
```

**Usage:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>User Profile</CardTitle>
    <CardDescription>View and edit your profile</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

**When to use:**
- Grouping related content
- User cards
- Information panels
- Dashboard widgets

---

## Dialog (Modal)

**Status:** ✅ Stable  
**Location:** `components/ui/dialog.tsx`  
**From:** Shadcn/UI

**Components:**
```typescript
Dialog              // Root component
DialogTrigger       // Button to open
DialogContent       // Modal content
DialogHeader        // Header section
DialogTitle         // Title
DialogDescription   // Description
DialogFooter        // Footer with actions
DialogClose         // Close button
```

**Props:**
```typescript
interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  modal?: boolean;
}
```

**Usage:**
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**When to use:**
- Confirmations
- Forms in modal
- Detail views
- Any overlay content

---

## Table

**Status:** ✅ Stable  
**Location:** `components/ui/table.tsx`  
**From:** Shadcn/UI

**Components:**
```typescript
Table           // Table container
TableHeader     // <thead>
TableBody       // <tbody>
TableFooter     // <tfoot>
TableRow        // <tr>
TableHead       // <th>
TableCell       // <td>
TableCaption    // Table caption
```

**Props:**
```typescript
// All components extend their native HTML table element props
```

**Usage:**
```tsx
<Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**When to use:**
- Data tables
- Lists with columns
- Tabular data

**Note:** For complex tables with sorting/filtering, use DataTable component instead.

---

## Form

**Status:** ✅ Stable  
**Location:** `components/ui/form.tsx`  
**From:** Shadcn/UI (with React Hook Form)

**Components:**
```typescript
Form            // Form wrapper
FormField       // Individual field
FormItem        // Field container
FormLabel       // Label
FormControl     // Input wrapper
FormDescription // Help text
FormMessage     // Error message
```

**Props:**
```typescript
// Used with React Hook Form
interface FormFieldProps {
  control: Control<any>;
  name: string;
  render: ({ field }) => React.ReactElement;
}
```

**Usage:**
```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="email@example.com" {...field} />
          </FormControl>
          <FormDescription>Your email address</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

**When to use:**
- ALL forms with validation
- Login/register forms
- Settings forms
- Any user input form

---

## Select

**Status:** ✅ Stable  
**Location:** `components/ui/select.tsx`  
**From:** Shadcn/UI

**Components:**
```typescript
Select              // Root
SelectTrigger       // Clickable trigger
SelectValue         // Selected value display
SelectContent       // Dropdown content
SelectItem          // Individual option
SelectGroup         // Group options
SelectLabel         // Group label
```

**Props:**
```typescript
interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
}
```

**Usage:**
```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select a role" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="admin">Admin</SelectItem>
    <SelectItem value="faculty">Faculty</SelectItem>
    <SelectItem value="student">Student</SelectItem>
  </SelectContent>
</Select>
```

**When to use:**
- Dropdown selections
- Role selection
- Category selection
- Any single-choice dropdown

---

## Badge

**Status:** ✅ Stable  
**Location:** `components/ui/badge.tsx`  
**From:** Shadcn/UI

**Props:**
```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}
```

**Variants:**
- `default`: Primary (blue)
- `secondary`: Muted (gray)
- `destructive`: Danger (red)
- `outline`: Border only

**Usage:**
```tsx
<Badge variant="default">Active</Badge>
<Badge variant="destructive">Suspended</Badge>
<Badge variant="secondary">Inactive</Badge>
```

**When to use:**
- Status indicators
- Tags
- Labels
- Counts

---

## Avatar

**Status:** ✅ Stable  
**Location:** `components/ui/avatar.tsx`  
**From:** Shadcn/UI

**Components:**
```typescript
Avatar          // Container
AvatarImage     // Image
AvatarFallback  // Fallback (initials/icon)
```

**Props:**
```typescript
interface AvatarProps {
  // Extends div props
}

interface AvatarImageProps {
  src?: string;
  alt?: string;
}
```

**Usage:**
```tsx
<Avatar>
  <AvatarImage src="/avatar.jpg" alt="John Doe" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

**When to use:**
- User avatars
- Profile pictures
- User representations

---

# Layout Components

## Header

**Status:** ✅ Stable  
**Location:** `components/layout/Header.tsx`  
**Custom Component**

**Props:**
```typescript
interface HeaderProps {
  user?: User | null;
  onLogout?: () => void;
}
```

**Features:**
- Logo
- Navigation menu
- User dropdown
- Theme toggle
- Responsive (hamburger on mobile)

**Usage:**
```tsx
<Header user={user} onLogout={handleLogout} />
```

**When to use:**
- Every authenticated page
- Top navigation

---

## Sidebar

**Status:** ✅ Stable  
**Location:** `components/layout/Sidebar.tsx`  
**Custom Component**

**Props:**
```typescript
interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  items: SidebarItem[];
}

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
}
```

**Features:**
- Collapsible
- Icon + label
- Active state highlighting
- Badge support
- Responsive (overlay on mobile)

**Usage:**
```tsx
const items = [
  { label: 'Dashboard', icon: <Home />, href: '/dashboard' },
  { label: 'Users', icon: <Users />, href: '/users', badge: '5' },
];

<Sidebar items={items} isOpen={isSidebarOpen} onClose={closeSidebar} />
```

**When to use:**
- Dashboard layouts
- Admin panels
- Multi-section apps

---

## MainLayout

**Status:** ✅ Stable  
**Location:** `components/layout/MainLayout.tsx`  
**Custom Component**

**Props:**
```typescript
interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}
```

**Features:**
- Page title
- Breadcrumbs
- Action buttons area
- Main content area
- Consistent padding

**Usage:**
```tsx
<MainLayout 
  title="Users" 
  subtitle="Manage system users"
  actions={<Button>Add User</Button>}
>
  <UserList />
</MainLayout>
```

**When to use:**
- Standard page layout
- Most dashboard pages

---

# Form Components

## FormInput

**Status:** ✅ Stable  
**Location:** `components/form/FormInput.tsx`  
**Custom Component (wraps Input)**

**Props:**
```typescript
interface FormInputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  // ... extends Input props
}
```

**Features:**
- Integrated label
- Error message display
- Helper text
- Required indicator
- Disabled state

**Usage:**
```tsx
<FormInput
  label="Email"
  name="email"
  type="email"
  placeholder="user@example.com"
  required
  helperText="We'll never share your email"
/>
```

**When to use:**
- Quick forms
- Simple input fields
- When not using React Hook Form

**Note:** For complex forms with validation, use Form + FormField from Shadcn instead.

---

## FileUpload

**Status:** ✅ Stable  
**Location:** `components/form/FileUpload.tsx`  
**Custom Component**

**Props:**
```typescript
interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  preview?: boolean;
  multiple?: boolean;
}
```

**Features:**
- Drag and drop
- File validation
- Size limit
- Image preview
- Multiple file support
- Error messages

**Usage:**
```tsx
<FileUpload
  onFileSelect={(file) => handleFile(file)}
  accept="image/*"
  maxSize={5}
  preview
/>
```

**When to use:**
- Avatar uploads
- Document uploads
- Image uploads
- Any file input

---

# Common Business Components

## DataTable

**Status:** ✅ Stable  
**Location:** `components/common/DataTable/DataTable.tsx`  
**Custom Component (Complex)**

**Props:**
```typescript
interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  searchKey?: string;
  searchPlaceholder?: string;
  pagination?: boolean;
  onRowClick?: (row: TData) => void;
}
```

**Features:**
- Sorting
- Search/filtering
- Pagination
- Row selection
- Custom columns
- Loading state
- Empty state
- Responsive

**Usage:**
```tsx
const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Button variant="ghost" onClick={() => handleEdit(row.original)}>
        Edit
      </Button>
    ),
  },
];

<DataTable
  data={users}
  columns={columns}
  searchKey="name"
  searchPlaceholder="Search users..."
  pagination
  onRowClick={(user) => navigate(`/users/${user.id}`)}
/>
```

**When to use:**
- User lists
- Any tabular data with sorting/filtering
- Complex tables

**Don't use when:**
- Simple lists (use regular Table instead)
- < 10 rows (too much overhead)

---

## SearchBar

**Status:** ✅ Stable  
**Location:** `components/common/SearchBar.tsx`  
**Custom Component**

**Props:**
```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounce?: number;
  onSearch?: (value: string) => void;
}
```

**Features:**
- Debounced input
- Search icon
- Clear button
- Loading indicator
- Keyboard shortcuts (Cmd+K)

**Usage:**
```tsx
<SearchBar
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Search users..."
  debounce={500}
  onSearch={handleSearch}
/>
```

**When to use:**
- Global search
- List filtering
- Any search input

---

## LoadingSpinner

**Status:** ✅ Stable  
**Location:** `components/common/LoadingSpinner.tsx`  
**Custom Component**

**Props:**
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
}
```

**Sizes:**
- `sm`: 16px
- `md`: 24px (default)
- `lg`: 32px

**Usage:**
```tsx
<LoadingSpinner size="lg" text="Loading users..." />

<LoadingSpinner fullScreen />
```

**When to use:**
- Data loading
- Form submission
- Any async operation

---

## EmptyState

**Status:** ✅ Stable  
**Location:** `components/common/EmptyState.tsx`  
**Custom Component**

**Props:**
```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}
```

**Usage:**
```tsx
<EmptyState
  icon={<Users size={48} />}
  title="No users found"
  description="Get started by creating your first user"
  action={
    <Button onClick={() => navigate('/users/new')}>
      Add User
    </Button>
  }
/>
```

**When to use:**
- Empty lists
- No search results
- Empty states

---

## ErrorBoundary

**Status:** ✅ Stable  
**Location:** `components/common/ErrorBoundary.tsx`  
**Custom Component**

**Props:**
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
```

**Usage:**
```tsx
<ErrorBoundary
  fallback={<ErrorMessage />}
  onError={(error) => logError(error)}
>
  <UserList />
</ErrorBoundary>
```

**When to use:**
- Wrap entire features
- Wrap complex components
- Production error handling

---

## ConfirmDialog

**Status:** ✅ Stable  
**Location:** `components/common/ConfirmDialog.tsx`  
**Custom Component**

**Props:**
```typescript
interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void;
  isLoading?: boolean;
}
```

**Usage:**
```tsx
<ConfirmDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Delete user"
  description="Are you sure? This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  variant="destructive"
  onConfirm={handleDelete}
  isLoading={isDeleting}
/>
```

**When to use:**
- Delete confirmations
- Dangerous actions
- Any confirmation needed

---

# Feature-Specific Components

These are examples - actual feature components vary by project.

## UserCard (Example)

**Status:** ✅ Stable  
**Location:** `features/users/components/UserCard.tsx`  
**Feature Component**

**Props:**
```typescript
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  className?: string;
}
```

**Usage:**
```tsx
<UserCard
  user={user}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

**When to use:**
- Displaying individual user
- User lists
- User grids

---

## Summary

### Component Count by Category

- **UI Components (Shadcn):** 10 components
- **Layout Components:** 3 components
- **Form Components:** 2 components
- **Common Business Components:** 6 components
- **Total Reusable Components:** 21 components

### Before Creating New Component - Checklist

- [ ] Searched COMPONENT_LIBRARY.md
- [ ] Checked if existing component can be extended/composed
- [ ] Verified no similar component exists
- [ ] Confirmed component is reusable (not feature-specific one-off)
- [ ] Defined clear props interface
- [ ] Planned variants if needed

### After Creating New Component - Update This File

Add your component to this library with:
- Component name and status
- Location
- Complete props interface
- Usage examples
- When to use / when not to use

---

**Last Updated:** February 2025  
**Maintained By:** Frontend Team  
**Questions?** Ask in #frontend channel
