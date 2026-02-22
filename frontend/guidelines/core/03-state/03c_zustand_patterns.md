# Zustand Patterns

## Basic Store
```typescript
import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));
```

## With Persist
```typescript
import { persist } from 'zustand/middleware';

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'theme-storage' }
  )
);
```

## Usage
```typescript
function Component() {
  const { theme, setTheme } = useThemeStore();
  return <button onClick={() => setTheme('dark')}>Dark</button>;
}
```
