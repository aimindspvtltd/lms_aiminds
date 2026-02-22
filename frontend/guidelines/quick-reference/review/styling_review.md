# Styling Review

**For:** REVIEWER  
**Purpose:** Review styling implementation

---

## 📋 Styling Review

### ✅ 1. No Inline Styles

**Check:**
- [ ] No `style={{}}` usage
- [ ] All styling via Tailwind classes

```typescript
// ✅ Good
<div className="p-4 bg-card">

// ❌ Bad
<div style={{ padding: '16px', backgroundColor: 'white' }}>
```

---

### ✅ 2. Theme Variables

**Check:**
- [ ] Uses `bg-card`, `text-foreground`, etc.
- [ ] No hard-coded colors (`bg-white`, `bg-blue-500`)

```typescript
// ✅ Good
<div className="bg-card text-card-foreground">

// ❌ Bad
<div className="bg-white text-black">
<div className="bg-blue-500">
```

---

### ✅ 3. Dark Mode

**Check:**
- [ ] Dark mode supported (`dark:` classes OR theme vars)
- [ ] All backgrounds have dark variants
- [ ] All text has dark variants

```typescript
// ✅ Good
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
// Better - uses theme vars (auto dark mode)
<div className="bg-card text-card-foreground">

// ❌ Bad
<div className="bg-white text-black">  // No dark mode
```

---

### ✅ 4. Responsive Design

**Check:**
- [ ] Mobile-first approach
- [ ] Breakpoints used (`md:`, `lg:`)
- [ ] Works on all screen sizes

```typescript
// ✅ Good
<div className="w-full md:w-1/2 lg:w-1/3">
<div className="text-sm md:text-base lg:text-lg">

// ❌ Bad
<div className="w-1/3">  // Not responsive
```

---

### ✅ 5. Consistent Spacing

**Check:**
- [ ] Uses spacing scale (4, 6, 8, 12)
- [ ] Consistent gaps/padding
- [ ] No random values

```typescript
// ✅ Good
<div className="p-6 space-y-4">
<div className="gap-4">

// ❌ Bad
<div className="p-5 space-y-3">  // Off scale
```

---

### ✅ 6. Conditional Classes

**Check:**
- [ ] Uses `cn()` utility
- [ ] No template literals with classes

```typescript
// ✅ Good
<div className={cn(
  "base-classes",
  isActive && "bg-accent",
  className
)}>

// ❌ Bad
<div className={`base-classes ${isActive ? 'bg-accent' : ''}`}>
```

---

### ✅ 7. Hover/Focus States

**Check:**
- [ ] Interactive elements have hover states
- [ ] Focus states visible
- [ ] Transitions smooth

```typescript
// ✅ Good
<button className="hover:bg-accent focus:ring-2 transition-colors">

// ❌ Bad
<button>  // No hover state
```

---

## 🚨 Red Flags

- ❌ Inline styles everywhere
- ❌ Hard-coded colors (`bg-white`, `bg-blue-500`)
- ❌ No dark mode support
- ❌ Not responsive
- ❌ Random spacing values

---

## ✅ Pass Criteria

- ✅ No inline styles
- ✅ Uses theme variables
- ✅ Dark mode supported
- ✅ Responsive design
- ✅ Consistent spacing
- ✅ Hover/focus states

---

**Verdict:** PASS / FAIL / NEEDS WORK
