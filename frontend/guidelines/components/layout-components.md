# Layout Components Reference

**For:** EXECUTOR  
**Purpose:** Layout component patterns

---

## Header

```typescript
// components/layout/Header.tsx
interface HeaderProps {
  user?: User;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          <Navigation />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserMenu user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}
```

## Sidebar

```typescript
// components/layout/Sidebar.tsx
interface SidebarProps {
  items: SidebarItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ items, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden" 
          onClick={onClose} 
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r bg-background",
        "transform transition-transform lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <nav className="p-4 space-y-2">
          {items.map(item => (
            <SidebarItem key={item.href} {...item} />
          ))}
        </nav>
      </aside>
    </>
  );
}
```

## MainLayout

```typescript
// components/layout/MainLayout.tsx
interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  action?: React.ReactNode;
}

export function MainLayout({ children, title, action }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">
          <div className="container py-6">
            {title && (
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">{title}</h1>
                {action}
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
```

## Container

```typescript
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
```

## Section

```typescript
export function Section({ title, children, className }: SectionProps) {
  return (
    <section className={cn("py-12", className)}>
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      {children}
    </section>
  );
}
```
