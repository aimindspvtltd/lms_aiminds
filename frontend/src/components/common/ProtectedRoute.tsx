import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import type { UserRole } from '@/features/auth/types/auth.types';
import { ROUTES } from '@/lib/constants/routes';

interface ProtectedRouteProps {
  allowedRole: UserRole;
}

function getRoleHome(role: UserRole): string {
  switch (role) {
    case 'ADMIN':   return ROUTES.ADMIN.DASHBOARD;
    case 'FACULTY': return ROUTES.FACULTY.DASHBOARD;
    case 'STUDENT': return ROUTES.STUDENT.DASHBOARD;
  }
}

export function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const { token, user } = useAuthStore();

  if (!token || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return <Outlet />;
}
