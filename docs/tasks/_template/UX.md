# UX Design Spec — PRD-XXX-T##

**Written by:** UX
**Task:** [docs/tasks/PRD-XXX-T##/index.md](index.md)
**Date:** YYYY-MM-DD
**Checked COMPONENT_LIBRARY.md:** ✅ Yes

---

## Component Reusability Analysis

_Check COMPONENT_LIBRARY.md before creating any new component._

### ✅ REUSE

| Component      | From Library          | Usage in This Task                   |
|----------------|-----------------------|--------------------------------------|
| Button         | components/ui/Button  | Submit and cancel actions            |
| FormInput      | components/form/*     | All text input fields                |

### 🆕 CREATE

_For each new component that must be built:_

---

#### [ComponentName]

**Why new:** _Not available in COMPONENT_LIBRARY.md, explain why_

**Props:**
```typescript
interface [ComponentName]Props {
  prop1: string;
  prop2?: 'variant-a' | 'variant-b';
  onAction: () => void;
  className?: string;
}
```

**Variants:**
- `variant-a`: _description_
- `variant-b`: _description_

**Styling:**
- Layout: _flex/grid, spacing_
- Colours: _use theme tokens only, e.g. `bg-primary`, `text-destructive`_
- Dark mode: _border-border, bg-input — specify any dark: overrides needed_

**Responsive:**
- Mobile: _behaviour_
- Desktop: _behaviour_

**Accessibility:**
- `aria-label`: _specify_
- Keyboard: _Tab order, Enter/Space handlers_

**Should this go in COMPONENT_LIBRARY.md?** YES / NO

---

## Screen / User Flow

_Describe the screens and transitions involved in this task._

```
[Screen 1] → (user clicks X) → [Screen 2] → (success) → [Screen 3]
```

---

## API Dependencies

_List which endpoints from ED.md this UI depends on._

| Endpoint                    | Used For                        |
|-----------------------------|---------------------------------|
| POST /api/v1/auth/otp/enable | Fetch QR code on page load     |
| POST /api/v1/auth/otp/verify | On form submit                 |

---

## Notes

_Edge cases, loading states, error message wording, empty states_
