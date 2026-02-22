# Authentication Flow

## Login Flow
```typescript
export function useLogin() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      setToken(response.token);
      setUser(response.user);
      navigate('/dashboard');
    },
  });
}
```

## Logout
```typescript
export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
    navigate('/login');
  };
}
```

## Check Auth
```typescript
export function useAuthCheck() {
  const { token, setUser } = useAuthStore();

  return useQuery({
    queryKey: ['auth', 'check'],
    queryFn: authService.checkAuth,
    enabled: !!token,
    onSuccess: (user) => setUser(user),
    onError: () => {
      useAuthStore.getState().logout();
    },
  });
}
```
