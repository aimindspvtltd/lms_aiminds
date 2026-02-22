# 06a: Service Pattern

**File:** 06a_service_pattern.md  
**Lines:** ~300  
**For:** ARCHITECT, EXECUTOR

---

## Service Layer Pattern

**Purpose:** Separate API calls from components/hooks

**Benefits:**
- ✅ Centralized API logic
- ✅ Easy to test
- ✅ Reusable across hooks
- ✅ Clear separation of concerns

---

## Basic Service Structure

```typescript
// features/users/services/user.service.ts
import api from '@/lib/api/client';
import type { User, CreateUserDto, UpdateUserDto } from '../types/user.types';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

export const userService = {
  async getUsers(params?: UserListParams): Promise<PaginatedResponse<User>> {
    const { data } = await api.get<PaginatedResponse<User>>('/users', { params });
    return data;
  },

  async getUser(id: string): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
    return data.data;
  },

  async createUser(dto: CreateUserDto): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>('/users', dto);
    return data.data;
  },

  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const { data } = await api.patch<ApiResponse<User>>(`/users/${id}`, dto);
    return data.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
```

---

## Service Rules

### 1. One Service Per Feature

```
features/
├── users/
│   └── services/
│       └── user.service.ts      ← All user API calls
├── courses/
│   └── services/
│       └── course.service.ts    ← All course API calls
```

### 2. Export as Object

```typescript
// ✅ Good - object with methods
export const userService = {
  getUsers,
  getUser,
  createUser,
};

// ❌ Bad - individual exports
export async function getUsers() { }
export async function getUser() { }
```

**Why:** Easier to mock in tests, clear namespace

### 3. Type All Responses

```typescript
// ✅ Good - typed response
async getUser(id: string): Promise<User> {
  const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
  return data.data;
}

// ❌ Bad - untyped
async getUser(id: string) {
  const { data } = await api.get(`/users/${id}`);
  return data;  // What type is this?
}
```

---

## API Response Types

```typescript
// types/api.types.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_items: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

---

## CRUD Operations Pattern

**Standard CRUD for every resource:**

```typescript
export const resourceService = {
  // List (with optional filters/pagination)
  async getAll(params?: FilterParams): Promise<PaginatedResponse<Resource>> {
    const { data } = await api.get('/resources', { params });
    return data;
  },

  // Get single
  async getOne(id: string): Promise<Resource> {
    const { data } = await api.get<ApiResponse<Resource>>(`/resources/${id}`);
    return data.data;
  },

  // Create
  async create(dto: CreateResourceDto): Promise<Resource> {
    const { data } = await api.post<ApiResponse<Resource>>('/resources', dto);
    return data.data;
  },

  // Update
  async update(id: string, dto: UpdateResourceDto): Promise<Resource> {
    const { data } = await api.patch<ApiResponse<Resource>>(`/resources/${id}`, dto);
    return data.data;
  },

  // Delete
  async delete(id: string): Promise<void> {
    await api.delete(`/resources/${id}`);
  },
};
```

---

## Query Parameters

```typescript
interface UserListParams {
  page?: number;
  limit?: number;
  role?: 'admin' | 'faculty' | 'student';
  search?: string;
  sort?: 'name' | 'email' | 'created_at';
  order?: 'asc' | 'desc';
}

export const userService = {
  async getUsers(params?: UserListParams): Promise<PaginatedResponse<User>> {
    const { data } = await api.get<PaginatedResponse<User>>('/users', { 
      params  // Axios automatically converts to query string
    });
    return data;
  },
};

// Usage
const users = await userService.getUsers({
  page: 1,
  limit: 10,
  role: 'student',
  search: 'john',
});
// GET /users?page=1&limit=10&role=student&search=john
```

---

## File Upload

```typescript
export const userService = {
  async uploadAvatar(userId: string, file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const { data } = await api.post<ApiResponse<{ url: string }>>(
      `/users/${userId}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data.data;
  },
};
```

---

## Error Handling in Services

**Let errors bubble up to hooks:**

```typescript
// ✅ Good - let error propagate
async getUser(id: string): Promise<User> {
  const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
  return data.data;
}

// ❌ Bad - catching in service
async getUser(id: string): Promise<User | null> {
  try {
    const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
    return data.data;
  } catch (error) {
    console.error(error);  // ❌ Don't log in service
    return null;  // ❌ Don't handle in service
  }
}
```

**Why:** Hooks and components should handle errors (UI feedback)

---

## Service Organization

### Simple Feature (1 Service)
```
features/users/
└── services/
    └── user.service.ts     ← All user operations
```

### Complex Feature (Multiple Services)
```
features/courses/
└── services/
    ├── course.service.ts           ← Course CRUD
    ├── course-enrollment.service.ts ← Enrollment operations
    └── course-content.service.ts    ← Content operations
```

---

## Using Services in Custom Hooks

**Services are called from hooks, not components:**

```typescript
// features/users/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user.service';

export function useUsers(params?: UserListParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getUsers(params),  ← Service call
  });
}

// Component
function UserList() {
  const { data } = useUsers({ role: 'student' });  ← Use hook, not service
  // ...
}
```

---

## Auth Service Example

```typescript
// features/auth/services/auth.service.ts
export const authService = {
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      '/auth/login', 
      credentials
    );
    return data.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async register(userData: RegisterDto): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      '/auth/register', 
      userData
    );
    return data.data;
  },

  async refreshToken(): Promise<{ token: string }> {
    const { data } = await api.post<ApiResponse<{ token: string }>>(
      '/auth/refresh'
    );
    return data.data;
  },

  async me(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>('/auth/me');
    return data.data;
  },

  async resetPassword(email: string): Promise<void> {
    await api.post('/auth/reset-password', { email });
  },
};
```

---

## Axios Instance Setup

```typescript
// lib/api/client.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,  // 30 seconds
});

export default api;
```

---

## Service Testing

```typescript
// user.service.test.ts
import { userService } from './user.service';
import api from '@/lib/api/client';

jest.mock('@/lib/api/client');

describe('userService', () => {
  it('should get users', async () => {
    const mockUsers = [{ id: '1', name: 'John' }];
    (api.get as jest.Mock).mockResolvedValue({ data: { data: mockUsers } });

    const result = await userService.getUsers();

    expect(api.get).toHaveBeenCalledWith('/users', { params: undefined });
    expect(result.data).toEqual(mockUsers);
  });
});
```

---

## Advanced Patterns

### Bulk Operations
```typescript
export const userService = {
  async bulkDelete(ids: string[]): Promise<void> {
    await api.post('/users/bulk-delete', { ids });
  },

  async bulkUpdate(updates: Array<{ id: string; data: UpdateUserDto }>): Promise<void> {
    await api.post('/users/bulk-update', { updates });
  },
};
```

### Conditional Requests
```typescript
export const userService = {
  async getUser(id: string, includeDeleted = false): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>(`/users/${id}`, {
      params: { include_deleted: includeDeleted },
    });
    return data.data;
  },
};
```

---

## Common Patterns

### Export Pattern
```typescript
// ✅ Preferred - named export
export const userService = { };

// Import
import { userService } from '../services/user.service';
```

### Method Naming
```typescript
// ✅ Good - clear verb
getUsers()
createUser()
updateUser()
deleteUser()

// ❌ Bad - unclear
users()
add()
modify()
remove()
```

### Return Types
```typescript
// ✅ Good - return data directly
async getUser(id: string): Promise<User> {
  const { data } = await api.get(`/users/${id}`);
  return data.data;  // Return User object
}

// ❌ Bad - return whole response
async getUser(id: string): Promise<AxiosResponse> {
  return await api.get(`/users/${id}`);  // Return axios response
}
```

---

## Checklist

- [ ] One service per feature
- [ ] Export as object
- [ ] Type all parameters
- [ ] Type all return values
- [ ] Use consistent CRUD naming
- [ ] Let errors bubble to hooks
- [ ] Don't log in services
- [ ] Services call API, hooks call services
- [ ] File named `[feature].service.ts`

---

**See also:**
- 06b_custom_hooks.md - Using services in hooks
- 06c_error_handling.md - Error handling patterns
- 06d_axios_setup.md - Axios configuration
