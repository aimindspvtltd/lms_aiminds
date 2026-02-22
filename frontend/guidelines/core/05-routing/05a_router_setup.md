# Router Setup

## Installation
```bash
npm install react-router-dom
```

## Basic Setup
```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## With Layout
```typescript
<Routes>
  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/users" element={<UserList />} />
  </Route>
  <Route element={<AuthLayout />}>
    <Route path="/login" element={<Login />} />
  </Route>
</Routes>
```
