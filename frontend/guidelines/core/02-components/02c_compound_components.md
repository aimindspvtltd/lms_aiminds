# Compound Components

## Pattern
```typescript
// Parent component
export function Tabs({ children, value, onValueChange }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

// Child components
export function TabsList({ children }: TabsListProps) {
  return <div role="tablist">{children}</div>;
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
  const { value: selectedValue, onValueChange } = useTabsContext();
  return (
    <button 
      role="tab"
      aria-selected={value === selectedValue}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  );
}
```

## Usage
```typescript
<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="1">Tab 1</TabsTrigger>
    <TabsTrigger value="2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="1">Content 1</TabsContent>
  <TabsContent value="2">Content 2</TabsContent>
</Tabs>
```
