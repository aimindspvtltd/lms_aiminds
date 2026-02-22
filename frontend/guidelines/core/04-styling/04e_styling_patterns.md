# 04e: Styling Patterns

**File:** 04e_styling_patterns.md  
**Lines:** ~300  
**For:** UX_DESIGNER, EXECUTOR

---

## Tailwind Utility Classes

### Basic Patterns

```typescript
// Flexbox layout
<div className="flex items-center justify-between gap-4">

// Grid layout
<div className="grid grid-cols-3 gap-6">

// Spacing
<div className="p-4 m-2">        // padding-4, margin-2
<div className="px-6 py-3">      // padding-x-6, padding-y-3

// Typography
<h1 className="text-2xl font-bold text-gray-900">

// Colors
<div className="bg-white text-gray-900">
<div className="bg-card text-card-foreground">  // Use theme variables
```

---

## Theme Variables (ALWAYS USE)

**❌ Don't use:**
```typescript
<div className="bg-white text-black">
<div className="bg-gray-900 text-white">
```

**✅ Do use:**
```typescript
<div className="bg-background text-foreground">
<div className="bg-card text-card-foreground">
<div className="bg-primary text-primary-foreground">
```

**Available theme variables:**
- `background` / `foreground`
- `card` / `card-foreground`
- `primary` / `primary-foreground`
- `secondary` / `secondary-foreground`
- `muted` / `muted-foreground`
- `accent` / `accent-foreground`
- `destructive` / `destructive-foreground`

---

## Dark Mode

**Always add dark mode classes:**

```typescript
// ✅ Good - dark mode supported
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

// ✅ Better - use theme variables (auto dark mode)
<div className="bg-card text-card-foreground">

// ❌ Bad - no dark mode
<div className="bg-white text-black">
```

---

## Responsive Design

**Mobile-first approach:**

```typescript
// ✅ Good - mobile first, then tablet, desktop
<div className="w-full md:w-1/2 lg:w-1/3">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
<div className="text-sm md:text-base lg:text-lg">

// ❌ Bad - desktop first
<div className="w-1/3 md:w-1/2 sm:w-full">  // Backwards
```

**Breakpoints:**
- (no prefix) - mobile (default)
- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+
- `xl:` - 1280px+
- `2xl:` - 1536px+

---

## Conditional Styling with cn()

**Use cn() utility for conditional classes:**

```typescript
import { cn } from '@/lib/utils/cn';

// ✅ Good - clean conditional styling
<div className={cn(
  "base-classes p-4 rounded",
  isActive && "bg-primary text-primary-foreground",
  isDisabled && "opacity-50 cursor-not-allowed",
  className  // Allow external className override
)}>

// ❌ Bad - messy string concatenation
<div className={`p-4 rounded ${isActive ? 'bg-primary' : ''} ${isDisabled ? 'opacity-50' : ''}`}>
```

---

## Component Variants Pattern

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base classes
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export function Button({ variant, size, children }: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size })}>
      {children}
    </button>
  );
}

// Usage
<Button variant="destructive" size="sm">Delete</Button>
```

---

## Common Layout Patterns

### Card Layout
```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Flex Layouts
```typescript
// Horizontal center
<div className="flex items-center justify-center">

// Space between
<div className="flex items-center justify-between">

// Vertical stack
<div className="flex flex-col gap-4">

// Horizontal wrap
<div className="flex flex-wrap gap-2">
```

### Grid Layouts
```typescript
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Auto-fit grid
<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">

// Fixed sidebar + main
<div className="grid grid-cols-[240px_1fr] gap-6">
```

---

## Form Styling

```typescript
<div className="space-y-4">
  <div>
    <Label htmlFor="email">Email</Label>
    <Input 
      id="email" 
      type="email" 
      placeholder="email@example.com"
      className="mt-1"
    />
  </div>
  
  <div>
    <Label htmlFor="password">Password</Label>
    <Input 
      id="password" 
      type="password"
      className="mt-1"
    />
  </div>
  
  <Button type="submit" className="w-full">
    Sign In
  </Button>
</div>
```

---

## State-Based Styling

```typescript
// Loading state
<Button disabled={isLoading} className="relative">
  {isLoading && (
    <span className="absolute inset-0 flex items-center justify-center">
      <Loader2 className="h-4 w-4 animate-spin" />
    </span>
  )}
  <span className={isLoading ? "invisible" : ""}>Submit</span>
</Button>

// Error state
<Input 
  className={cn(
    "border-input",
    hasError && "border-destructive focus-visible:ring-destructive"
  )}
/>

// Active state
<div className={cn(
  "p-4 rounded cursor-pointer transition-colors",
  isActive && "bg-accent text-accent-foreground"
)}>
```

---

## Hover & Focus States

```typescript
// Hover
<Button className="hover:bg-primary/90">

// Focus
<Input className="focus:ring-2 focus:ring-primary">

// Active
<div className="active:scale-95 transition-transform">

// Group hover
<div className="group">
  <div className="group-hover:text-primary">Hover parent to change me</div>
</div>
```

---

## Transitions & Animations

```typescript
// Transition
<div className="transition-all duration-200">

// Hover scale
<div className="hover:scale-105 transition-transform">

// Fade in
<div className="opacity-0 animate-in fade-in duration-500">

// Slide in
<div className="animate-in slide-in-from-bottom-4 duration-500">
```

---

## Spacing System

**Use consistent spacing scale:**

```
0   - 0px
1   - 0.25rem (4px)
2   - 0.5rem (8px)
3   - 0.75rem (12px)
4   - 1rem (16px)
6   - 1.5rem (24px)
8   - 2rem (32px)
12  - 3rem (48px)
16  - 4rem (64px)
```

**Usage:**
```typescript
<div className="p-4">      // 16px padding
<div className="gap-6">    // 24px gap
<div className="space-y-8"> // 32px vertical spacing
```

---

## Avoid Inline Styles

**❌ Don't use:**
```typescript
<div style={{ padding: '16px', color: '#000' }}>
```

**✅ Do use:**
```typescript
<div className="p-4 text-foreground">
```

**Only exception:** Dynamic values
```typescript
<div style={{ width: `${progress}%` }}>  // OK - dynamic value
```

---

## Common Patterns

### Status Badge
```typescript
const statusStyles = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
};

<Badge className={statusStyles[status]}>{status}</Badge>
```

### Avatar
```typescript
<div className="relative">
  <Avatar className="h-10 w-10">
    <AvatarImage src={user.avatar} alt={user.name} />
    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
  </Avatar>
  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
</div>
```

### Empty State
```typescript
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="rounded-full bg-muted p-3 mb-4">
    <Users className="h-8 w-8 text-muted-foreground" />
  </div>
  <h3 className="text-lg font-semibold">No users found</h3>
  <p className="text-sm text-muted-foreground mt-2">
    Get started by creating your first user
  </p>
  <Button className="mt-4">Add User</Button>
</div>
```

---

## Quick Reference

**Layout:**
- `flex items-center justify-between`
- `grid grid-cols-3 gap-4`
- `space-y-4` (vertical spacing)

**Colors:**
- Use theme variables: `bg-card`, `text-foreground`
- Dark mode: `dark:bg-gray-900`

**Responsive:**
- Mobile first: `w-full md:w-1/2 lg:w-1/3`

**States:**
- `hover:bg-primary/90`
- `focus:ring-2`
- `disabled:opacity-50`

**Conditional:**
- Use `cn()` utility
- Combine base + variant classes

---

**See also:**
- 04c_dark_mode.md - Dark mode implementation
- 04d_responsive_design.md - Responsive patterns
- 04f_component_variants.md - CVA patterns
