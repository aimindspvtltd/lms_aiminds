# Lazy Loading

## Setup
```typescript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserList = lazy(() => import('./pages/UserList'));
const UserDetail = lazy(() => import('./pages/UserDetail'));
```

## Usage
```typescript
<Routes>
  <Route
    path="/dashboard"
    element={
      <Suspense fallback={<LoadingSpinner />}>
        <Dashboard />
      </Suspense>
    }
  />
  <Route
    path="/users"
    element={
      <Suspense fallback={<LoadingSpinner />}>
        <UserList />
      </Suspense>
    }
  />
</Routes>
```

## With Layout Suspense
```typescript
<BrowserRouter>
  <Suspense fallback={<LoadingSpinner fullScreen />}>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </Suspense>
</BrowserRouter>
```
