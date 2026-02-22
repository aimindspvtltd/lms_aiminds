# Props Patterns

## Basic Props
```typescript
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  className?: string;
}
```

## Discriminated Union
```typescript
type ButtonProps = 
  | { variant: 'primary'; onClick: () => void }
  | { variant: 'link'; href: string };
```

## Generics
```typescript
interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
}
```

## Spread Props
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

<Input {...props} />
```

## Children Types
```typescript
children: React.ReactNode        // Anything
children: React.ReactElement     // Single element
children: JSX.Element[]          // Array of elements
children: (data: T) => JSX.Element  // Render prop
```
