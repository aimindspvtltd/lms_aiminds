# Styling Patterns - Quick Reference

**For:** UX_DESIGNER, EXECUTOR  
**Purpose:** Common Tailwind patterns and styling examples

---

## 🎨 Theme Variables (ALWAYS USE)

### Color Variables
```typescript
// ✅ ALWAYS use theme variables
bg-background        // Main background
bg-foreground        // Main text color
bg-card              // Card background
text-card-foreground // Card text

bg-primary           // Primary action color
text-primary-foreground

bg-secondary         // Secondary action
text-secondary-foreground

bg-muted             // Muted/disabled
text-muted-foreground

bg-accent            // Accent color
text-accent-foreground

bg-destructive       // Error/delete color
text-destructive-foreground

border               // Default border color
input                // Input border color
ring                 // Focus ring color
```

### ❌ DON'T use hard-coded colors
```typescript
// ❌ Bad - breaks dark mode
bg-white
bg-black
text-gray-900
bg-blue-500

// ✅ Good - adapts to theme
bg-background
text-foreground
bg-card
bg-primary
```

---

## 🌓 Dark Mode Pattern

### Always Include Dark Mode
```typescript
// ✅ Good - supports dark mode
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

// ✅ Better - uses theme variables (auto dark mode)
<div className="bg-card text-card-foreground">
```

### Common Dark Mode Patterns
```typescript
// Background
bg-white dark:bg-gray-900
bg-gray-50 dark:bg-gray-800
bg-gray-100 dark:bg-gray-700

// Text
text-gray-900 dark:text-white
text-gray-600 dark:text-gray-300
text-gray-500 dark:text-gray-400

// Border
border-gray-200 dark:border-gray-700
border-gray-300 dark:border-gray-600

// Hover states
hover:bg-gray-100 dark:hover:bg-gray-800
hover:text-gray-900 dark:hover:text-white
```

---

## 📱 Responsive Patterns

### Mobile-First Approach
```typescript
// ✅ Good - mobile first
<div className="w-full md:w-1/2 lg:w-1/3">

// ❌ Bad - desktop first
<div className="w-1/3 md:w-1/2 sm:w-full">
```

### Common Responsive Patterns
```typescript
// Width
w-full md:w-1/2 lg:w-1/3 xl:w-1/4

// Grid columns
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

// Padding
p-4 md:p-6 lg:p-8

// Text size
text-sm md:text-base lg:text-lg

// Hide/show
hidden md:block
block md:hidden

// Flex direction
flex-col md:flex-row
```

---

## 📦 Layout Patterns

### Flexbox Layouts
```typescript
// Center everything
<div className="flex items-center justify-center">

// Space between
<div className="flex items-center justify-between">

// Vertical stack with gap
<div className="flex flex-col gap-4">

// Horizontal with wrap
<div className="flex flex-wrap gap-2">

// Align start
<div className="flex items-start">

// Align end
<div className="flex items-end">
```

### Grid Layouts
```typescript
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Auto-fit grid
<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">

// Fixed sidebar + main
<div className="grid grid-cols-[240px_1fr] gap-6">

// Two columns
<div className="grid grid-cols-2 gap-4">
```

### Container Patterns
```typescript
// Max width container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Centered content
<div className="max-w-2xl mx-auto">

// Full width section
<div className="w-full px-4">
```

---

## 🎯 Component Spacing

### Spacing Scale
```typescript
// Use consistent spacing
gap-1    // 4px
gap-2    // 8px
gap-3    // 12px
gap-4    // 16px ← Most common
gap-6    // 24px
gap-8    // 32px
gap-12   // 48px
```

### Common Spacing Patterns
```typescript
// Card padding
<Card className="p-6">

// Section spacing
<div className="space-y-6">

// Form spacing
<div className="space-y-4">

// Button group
<div className="flex gap-2">

// List items
<div className="divide-y">
```

---

## 🔘 Button Patterns

### Basic Buttons
```typescript
// Primary button
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">

// Secondary button
<Button variant="outline">

// Danger button
<Button variant="destructive">

// Icon button
<Button size="icon">
  <Trash className="h-4 w-4" />
</Button>

// Loading button
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Submit
</Button>
```

### Button Groups
```typescript
// Horizontal group
<div className="flex gap-2">
  <Button variant="outline">Cancel</Button>
  <Button>Save</Button>
</div>

// Full width on mobile
<div className="flex flex-col md:flex-row gap-2">
  <Button className="flex-1">Option 1</Button>
  <Button className="flex-1">Option 2</Button>
</div>
```

---

## 📝 Form Patterns

### Form Layout
```typescript
// Vertical form
<form className="space-y-4">
  <div>
    <Label>Email</Label>
    <Input type="email" className="mt-1" />
  </div>
  <div>
    <Label>Password</Label>
    <Input type="password" className="mt-1" />
  </div>
  <Button type="submit" className="w-full">
    Sign In
  </Button>
</form>
```

### Two-Column Form
```typescript
<form className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <Label>First Name</Label>
    <Input className="mt-1" />
  </div>
  <div>
    <Label>Last Name</Label>
    <Input className="mt-1" />
  </div>
  <div className="md:col-span-2">
    <Label>Email</Label>
    <Input type="email" className="mt-1" />
  </div>
</form>
```

### Input with Error
```typescript
<div>
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    className={cn(
      "mt-1",
      hasError && "border-destructive focus-visible:ring-destructive"
    )}
  />
  {hasError && (
    <p className="text-sm text-destructive mt-1">
      Email is required
    </p>
  )}
</div>
```

---

## 🎴 Card Patterns

### Basic Card
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

### Card with Image
```typescript
<Card>
  <img
    src={image}
    alt=""
    className="w-full h-48 object-cover rounded-t-lg"
  />
  <CardContent className="pt-4">
    <h3 className="font-semibold">Title</h3>
    <p className="text-sm text-muted-foreground">Description</p>
  </CardContent>
</Card>
```

### Clickable Card
```typescript
<Card
  className="cursor-pointer transition-colors hover:bg-accent"
  onClick={handleClick}
>
  <CardContent>Content</CardContent>
</Card>
```

---

## 📊 List & Table Patterns

### Simple List
```typescript
<div className="divide-y">
  {items.map(item => (
    <div
      key={item.id}
      className="py-4 flex items-center justify-between"
    >
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-muted-foreground">{item.email}</p>
      </div>
      <Button size="sm" variant="outline">Edit</Button>
    </div>
  ))}
</div>
```

### Grid List
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id}>
      <CardContent className="pt-6">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </CardContent>
    </Card>
  ))}
</div>
```

---

## 🏷️ Badge & Status Patterns

### Status Badges
```typescript
// Define status styles
const statusStyles = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
};

// Use
<Badge className={statusStyles[status]}>
  {status}
</Badge>
```

### Badge with Icon
```typescript
<Badge className="flex items-center gap-1">
  <Circle className="h-2 w-2 fill-current" />
  Online
</Badge>
```

---

## 👤 Avatar Patterns

### Basic Avatar
```typescript
<Avatar>
  <AvatarImage src={user.avatar} alt={user.name} />
  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
</Avatar>
```

### Avatar with Status
```typescript
<div className="relative">
  <Avatar>
    <AvatarImage src={user.avatar} alt={user.name} />
    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
  </Avatar>
  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
</div>
```

### Avatar Sizes
```typescript
// Small
<Avatar className="h-8 w-8" />

// Medium (default)
<Avatar className="h-10 w-10" />

// Large
<Avatar className="h-12 w-12" />

// Extra large
<Avatar className="h-16 w-16" />
```

---

## 🔔 Toast & Alert Patterns

### Toast
```typescript
// Success
toast({
  title: "Success",
  description: "User created successfully",
});

// Error
toast({
  title: "Error",
  description: error.message,
  variant: "destructive",
});
```

### Alert
```typescript
<Alert>
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the cli.
  </AlertDescription>
</Alert>

// Destructive variant
<Alert variant="destructive">
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your session has expired. Please log in again.
  </AlertDescription>
</Alert>
```

---

## 🎭 State-Based Styling

### Loading State
```typescript
<Button disabled={isLoading} className="relative">
  {isLoading && (
    <span className="absolute inset-0 flex items-center justify-center">
      <Loader2 className="h-4 w-4 animate-spin" />
    </span>
  )}
  <span className={isLoading ? "invisible" : ""}>
    Submit
  </span>
</Button>
```

### Active State
```typescript
<button
  className={cn(
    "p-4 rounded transition-colors",
    isActive && "bg-accent text-accent-foreground"
  )}
>
  Tab
</button>
```

### Disabled State
```typescript
<Button
  disabled={isDisabled}
  className="disabled:opacity-50 disabled:cursor-not-allowed"
>
  Action
</Button>
```

---

## 🎨 Animation & Transitions

### Hover Effects
```typescript
// Background change
<div className="transition-colors hover:bg-accent">

// Scale
<div className="transition-transform hover:scale-105">

// Shadow
<div className="transition-shadow hover:shadow-lg">

// Border
<div className="transition-colors border-2 border-transparent hover:border-primary">
```

### Loading Animation
```typescript
// Spin
<Loader2 className="animate-spin" />

// Pulse
<div className="animate-pulse bg-gray-200 h-4 rounded" />

// Bounce
<div className="animate-bounce">↓</div>
```

### Transitions
```typescript
// All properties
<div className="transition-all duration-200">

// Specific property
<div className="transition-colors duration-200">
<div className="transition-transform duration-300">

// Ease functions
<div className="transition ease-in-out">
<div className="transition ease-in">
<div className="transition ease-out">
```

---

## 📐 Border & Shadow Patterns

### Borders
```typescript
// All sides
border

// Specific sides
border-t border-b
border-l border-r

// Width
border-2 border-4

// Color
border-gray-200 dark:border-gray-700
border-primary

// Rounded
rounded     // 4px
rounded-md  // 6px
rounded-lg  // 8px
rounded-full // circle
```

### Shadows
```typescript
// Elevation
shadow-sm   // Subtle
shadow      // Normal
shadow-md   // Medium
shadow-lg   // Large
shadow-xl   // Extra large

// No shadow
shadow-none

// Dark mode
shadow dark:shadow-gray-800
```

---

## 🎯 Common Patterns Library

### Empty State
```typescript
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="rounded-full bg-muted p-3 mb-4">
    <Icon className="h-8 w-8 text-muted-foreground" />
  </div>
  <h3 className="text-lg font-semibold">No items found</h3>
  <p className="text-sm text-muted-foreground mt-2">
    Get started by creating your first item
  </p>
  <Button className="mt-4">Add Item</Button>
</div>
```

### Loading Skeleton
```typescript
<div className="space-y-4">
  <div className="animate-pulse bg-muted h-10 rounded" />
  <div className="animate-pulse bg-muted h-10 rounded" />
  <div className="animate-pulse bg-muted h-10 rounded" />
</div>
```

### Stat Card
```typescript
<Card>
  <CardContent className="pt-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Total Users</p>
        <p className="text-3xl font-bold">1,234</p>
      </div>
      <Users className="h-8 w-8 text-muted-foreground" />
    </div>
    <p className="text-sm text-muted-foreground mt-4">
      <span className="text-green-600">+12%</span> from last month
    </p>
  </CardContent>
</Card>
```

---

## ✅ Styling Checklist

**For every component:**

- [ ] Uses theme variables (bg-card, text-foreground)
- [ ] Supports dark mode (dark: classes or theme vars)
- [ ] Responsive (md:, lg: breakpoints)
- [ ] Has hover/focus states
- [ ] Uses consistent spacing (gap-4, p-6, etc.)
- [ ] Proper transitions (transition-colors)
- [ ] No inline styles
- [ ] Uses cn() for conditional classes

---

## 🎯 Quick Reference

**Colors:** Use theme variables, not hard-coded  
**Dark Mode:** Always include dark: classes or use theme vars  
**Responsive:** Mobile-first (base → md: → lg:)  
**Spacing:** Use consistent scale (4, 6, 8, 12)  
**Animations:** Use transition-* utilities  
**States:** Handle hover, focus, active, disabled  
**Layout:** Flexbox or Grid, not floats  

**For full patterns, see:** `core/04-styling/04e_styling_patterns.md`
