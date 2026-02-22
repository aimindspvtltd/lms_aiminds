# API Error Handling

## Service Layer
```typescript
export const userService = {
  async getUsers(): Promise<User[]> {
    try {
      const { data } = await api.get<ApiResponse<User[]>>('/users');
      return data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch users');
      }
      throw error;
    }
  },
};
```

## Axios Interceptor
```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## In Components
```typescript
const { data, error } = useUsers();

if (error) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
```
