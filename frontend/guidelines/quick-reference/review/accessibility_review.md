# Accessibility Review

**For:** REVIEWER  
**Purpose:** Review accessibility (a11y) compliance

---

## 📋 Accessibility Review

### ✅ 1. Semantic HTML

**Check:**
- [ ] Buttons are `<button>` (not `<div>`)
- [ ] Links are `<a>` (not `<span>`)
- [ ] Headings in correct order (h1, h2, h3)
- [ ] Lists use `<ul>`/`<ol>`

```typescript
// ✅ Good
<button onClick={handleClick}>Click</button>
<a href="/profile">Profile</a>
<h2>Section Title</h2>

// ❌ Bad
<div onClick={handleClick}>Click</div>
<span onClick={goToProfile}>Profile</span>
<div className="heading">Section Title</div>
```

---

### ✅ 2. Images

**Check:**
- [ ] All images have `alt` attribute
- [ ] Alt text is descriptive
- [ ] Decorative images have empty alt (`alt=""`)

```typescript
// ✅ Good
<img src={user.avatar} alt={`${user.name}'s avatar`} />
<img src={decorative} alt="" />

// ❌ Bad
<img src={user.avatar} />  // No alt
<img src={user.avatar} alt="image" />  // Not descriptive
```

---

### ✅ 3. Form Labels

**Check:**
- [ ] All inputs have associated labels
- [ ] Labels use `htmlFor` matching input `id`
- [ ] Error messages linked to inputs

```typescript
// ✅ Good
<Label htmlFor="email">Email</Label>
<Input 
  id="email" 
  name="email"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && <p id="email-error">{error}</p>}

// ❌ Bad
<label>Email</label>
<Input name="email" />  // No association
```

---

### ✅ 4. Keyboard Navigation

**Check:**
- [ ] All interactive elements focusable
- [ ] Focus visible (no `outline: none`)
- [ ] Tab order logical
- [ ] Keyboard shortcuts work

```typescript
// ✅ Good
<button className="focus:ring-2">

// ❌ Bad
<div onClick={handleClick}>  // Not keyboard accessible
<button className="focus:outline-none">  // Focus not visible
```

---

### ✅ 5. ARIA Attributes

**Check:**
- [ ] `aria-label` on icon-only buttons
- [ ] `aria-expanded` on toggles
- [ ] `aria-hidden` on decorative icons
- [ ] `role` when needed

```typescript
// ✅ Good
<button aria-label="Close dialog">
  <X aria-hidden="true" />
</button>

<button aria-expanded={isOpen}>
  Menu
</button>

// ❌ Bad
<button>
  <X />  // No text or aria-label
</button>
```

---

### ✅ 6. Color Contrast

**Check:**
- [ ] Text contrast ratio ≥ 4.5:1 (normal text)
- [ ] Text contrast ratio ≥ 3:1 (large text)
- [ ] Information not conveyed by color alone

```typescript
// ✅ Good
<span className="text-foreground">  // High contrast
<span className="text-destructive font-semibold">Error</span>  // Color + text

// ❌ Bad
<span className="text-gray-400">Important text</span>  // Low contrast
<span className="text-red-500">Error</span>  // Only color indicates error
```

---

### ✅ 7. Screen Readers

**Check:**
- [ ] Loading states announced
- [ ] Error messages announced
- [ ] Dynamic content updates announced
- [ ] Skip links for navigation

```typescript
// ✅ Good
<div role="status" aria-live="polite">
  {isLoading && 'Loading...'}
</div>

<div role="alert">
  {error && error.message}
</div>

// ❌ Bad
{isLoading && <div>Loading...</div>}  // Not announced
{error && <div>{error.message}</div>}  // Not announced
```

---

### ✅ 8. Focus Management

**Check:**
- [ ] Focus trapped in modals
- [ ] Focus returned after modal close
- [ ] Focus visible on all interactive elements

```typescript
// ✅ Good
<Dialog onOpenChange={(open) => {
  if (!open) previousFocusRef.current?.focus();
}}>

// ❌ Bad
<Dialog>  // Focus not managed
```

---

## 🚨 Red Flags

- ❌ Div onClick without keyboard support
- ❌ Images without alt
- ❌ Inputs without labels
- ❌ Icon-only buttons without aria-label
- ❌ Low contrast text
- ❌ Focus indicators removed

---

## ✅ Pass Criteria

- ✅ Semantic HTML
- ✅ All images have alt
- ✅ All inputs labeled
- ✅ Keyboard accessible
- ✅ ARIA used correctly
- ✅ Sufficient contrast
- ✅ Screen reader support

---

## 🧪 Test Commands

```bash
# Run axe-core tests
npm run test:a11y

# Check with screen reader
# Mac: VoiceOver (Cmd + F5)
# Windows: NVDA or JAWS

# Check keyboard navigation
# Tab through all interactive elements
# Press Enter/Space on buttons
```

---

**Verdict:** PASS / FAIL / NEEDS WORK
