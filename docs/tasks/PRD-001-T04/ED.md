# PRD-001-T04: Engineering Design — Admin Login Page

**Task:** PRD-001-T04
**ARCHITECT:** —
**Date:** 2026-02-21
**Scope:** Frontend only
**Depends on:** T02 (auth store + Axios client) + T03 (login API working)

---

## 1. Files to Create

```
src/
├── features/auth/
│   ├── services/
│   │   └── auth.service.ts        ← API calls
│   ├── hooks/
│   │   └── useLogin.ts            ← useMutation wrapper
│   ├── components/
│   │   └── LoginForm.tsx          ← Form component
│   └── types/
│       └── auth.types.ts          ← (already defined in T02 — extend if needed)
│
└── pages/auth/
    └── LoginPage.tsx              ← Thin page: center card + <LoginForm />
```

---

## 2. Auth Service (`src/features/auth/services/auth.service.ts`)

```typescript
import api from '@/lib/api/client';
import type { ApiResponse } from '@/types/api.types';
import type { LoginDto, AuthResponse, AuthUser } from '../types/auth.types';

export const authService = {
  async login(dto: LoginDto): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', dto);
    return data.data;
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get<ApiResponse<AuthUser>>('/auth/me');
    return data.data;
  },
};
```

**Rules (per 06a_service_pattern.md):**
- Export as object (not individual functions)
- Let errors bubble to the hook — no try/catch here
- Type all parameters and return values
- No logging in service

---

## 3. useLogin Hook (`src/features/auth/hooks/useLogin.ts`)

```typescript
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { authService } from '../services/auth.service';
import { ROUTES } from '@/lib/constants/routes';
import type { LoginDto } from '../types/auth.types';

export function useLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (dto: LoginDto) => authService.login(dto),
    onSuccess: (data) => {
      login(data.token, data.user);       // Store in Zustand (persisted)
      navigate(ROUTES.ADMIN.DASHBOARD, { replace: true });
    },
    // onError: TanStack passes error to the component — component handles message
  });
}
```

**State decision (per 03a_state_decision_tree.md):**
- Token + user = server state persisted globally → Zustand store
- Loading / error = TanStack Query `useMutation` state
- Form state = React Hook Form (not useState)

---

## 4. Zod Validation Schema

```typescript
// Define inside LoginForm.tsx or a separate schemas/ file
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
    .transform((v) => v.toLowerCase().trim()),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
```

---

## 5. LoginForm Component (`src/features/auth/components/LoginForm.tsx`)

### Props
```typescript
// No props — form is self-contained, reads store + navigates internally
```

### State
| State | Source |
|-------|--------|
| email, password field values | React Hook Form |
| isLoading | `mutation.isPending` (TanStack v5) |
| server error message | `mutation.error` (parsed from AxiosError) |
| field validation errors | React Hook Form (Zod resolver) |

### Form Behavior
```
onSubmit:
  1. RHF validates with Zod schema → shows inline errors if fail
  2. Calls mutation.mutate({ email, password })
  3. Button shows spinner + is disabled while isPending
  4. On success → useLogin.onSuccess navigates to /admin/dashboard
  5. On error:
     - 401 → show "Invalid email or password" below form
     - 403 → show "Your account is not active. Contact admin."
     - network/500 → show "Something went wrong. Please try again."
```

### Error Parsing Helper
```typescript
function parseLoginError(error: unknown): string {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 401) return 'Invalid email or password';
    if (status === 403) return 'Your account is not active. Contact admin.';
  }
  return 'Something went wrong. Please try again.';
}
```

### Component Structure
```tsx
<form onSubmit={handleSubmit(onSubmit)}>
  {/* Server error — shown above submit */}
  {mutation.isError && (
    <Alert variant="destructive" role="alert">
      <AlertDescription>{parseLoginError(mutation.error)}</AlertDescription>
    </Alert>
  )}

  {/* Email field */}
  <FormField name="email">
    <Label>Email</Label>
    <Input type="email" autoComplete="email" {...register('email')} />
    {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
  </FormField>

  {/* Password field with show/hide toggle */}
  <FormField name="password">
    <Label>Password</Label>
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        {...register('password')}
      />
      <button type="button" onClick={() => setShowPassword((v) => !v)}>
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
    {errors.password && <FormMessage>{errors.password.message}</FormMessage>}
  </FormField>

  {/* Submit */}
  <Button type="submit" className="w-full" disabled={mutation.isPending}>
    {mutation.isPending
      ? <><Loader2 className="animate-spin mr-2" size={16} /> Signing in...</>
      : 'Sign In'
    }
  </Button>
</form>
```

### Local state
```typescript
const [showPassword, setShowPassword] = useState(false);
```
Only one `useState` needed — everything else is managed by RHF or TanStack.

---

## 6. LoginPage (`src/pages/auth/LoginPage.tsx`)

```tsx
// Thin wrapper — just layout + card
export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">LMS Platform</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
```

**Page is thin** — no state, no hooks, just layout. All logic lives in `LoginForm`.

---

## 7. Accessibility Requirements

- `<label>` elements are linked to inputs via `htmlFor` / `id`
- Error messages have `role="alert"` (screen reader announces on change)
- Password toggle button has `aria-label="Show password"` / `"Hide password"`
- `autoComplete="email"` and `autoComplete="current-password"` set correctly
- Form submits on Enter key (native `<form>` behavior — no special handler needed)
- Loading state: button disabled + spinner (keyboard navigation still works)

---

## 8. Shadcn Components to Use

Check `COMPONENT_LIBRARY.md` first. Use these Shadcn primitives (no new components needed):

| Component | From |
|-----------|------|
| `<Card>`, `<CardHeader>`, `<CardContent>` | shadcn/card |
| `<Input>` | shadcn/input |
| `<Button>` | shadcn/button |
| `<Label>` | shadcn/label |
| `<Alert>`, `<AlertDescription>` | shadcn/alert |
| `<Loader2>`, `<Eye>`, `<EyeOff>` | lucide-react |

No new component to add to COMPONENT_LIBRARY.md — all are existing primitives.

---

## 9. What WORKER Must Deliver

| File | Description |
|------|-------------|
| `src/features/auth/services/auth.service.ts` | Login + me API calls |
| `src/features/auth/hooks/useLogin.ts` | useMutation hook |
| `src/features/auth/components/LoginForm.tsx` | Form with validation, loading, error |
| `src/pages/auth/LoginPage.tsx` | Thin layout wrapper |

**Manual test checklist:**
- [ ] Valid creds → JWT stored → redirected to `/admin/dashboard`
- [ ] Wrong password → "Invalid email or password" shown
- [ ] Empty email → inline validation before API call
- [ ] Button disabled + spinner during loading
- [ ] Password eye toggle works
- [ ] Enter key submits form
- [ ] Refresh on `/admin/dashboard` stays logged in (Zustand persist)
