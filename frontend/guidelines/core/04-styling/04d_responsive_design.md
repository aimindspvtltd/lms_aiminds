# Responsive Design

## Mobile-First
```typescript
// ✅ Good - mobile first
<div className="w-full md:w-1/2 lg:w-1/3">

// ❌ Bad - desktop first
<div className="w-1/3 md:w-1/2 sm:w-full">
```

## Breakpoints
```
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large
```

## Common Patterns
```typescript
// Grid columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Hide/show
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>

// Text sizes
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Padding
<div className="p-4 md:p-6 lg:p-8">
```
