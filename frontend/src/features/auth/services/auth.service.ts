import api from '@/lib/api/client';
import type { ApiResponse } from '@/types/api.types';
import type { LoginDto, AuthResponse, AuthUser } from '../types/auth.types';

export const authService = {
  async login(dto: LoginDto): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', dto);
    return data.data;
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get<ApiResponse<AuthUser>>('/auth/me');
    return data.data;
  },
};
