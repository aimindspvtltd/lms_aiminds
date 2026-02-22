# Token Management

## Store Token
```typescript
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    { name: 'auth-storage' }
  )
);
```

## Axios Interceptor
```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Refresh Token
```typescript
let refreshTokenPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      if (!refreshTokenPromise) {
        refreshTokenPromise = authService.refreshToken()
          .then(token => {
            useAuthStore.getState().setToken(token);
            refreshTokenPromise = null;
            return token;
          });
      }
      
      const token = await refreshTokenPromise;
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return api(originalRequest);
    }
    
    return Promise.reject(error);
  }
);
```
