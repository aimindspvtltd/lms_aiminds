# Dark Mode

## Implementation
```typescript
// Using theme variables (automatic dark mode)
<div className="bg-card text-card-foreground">

// Using dark: prefix
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

## Theme Toggle
```typescript
export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

## Rules
- ALWAYS use `bg-card` not `bg-white`
- ALWAYS use `text-foreground` not `text-black`
- TEST in both light and dark modes
