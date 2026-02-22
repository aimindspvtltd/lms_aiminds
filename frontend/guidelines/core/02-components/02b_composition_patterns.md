# Composition Patterns

## Children Pattern
```typescript
function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}
```

## Compound Components
```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

## Render Props
```typescript
<DataProvider>
  {({ data, loading }) => loading ? <Spinner /> : <List data={data} />}
</DataProvider>
```

## HOC Pattern
```typescript
export const withAuth = (Component) => {
  return (props) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Component {...props} /> : <Navigate to="/login" />;
  };
};
```
