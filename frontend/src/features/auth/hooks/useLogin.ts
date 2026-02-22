import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { authService } from '../services/auth.service';
import { ROUTES } from '@/lib/constants/routes';
import type { LoginDto } from '../types/auth.types';

export function useLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (dto: LoginDto) => authService.login(dto),
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate(ROUTES.ADMIN.DASHBOARD, { replace: true });
    },
  });
}
