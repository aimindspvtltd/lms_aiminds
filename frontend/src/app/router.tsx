import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { AdminLayout } from '@/components/layout/admin/AdminLayout';

import { LoginPage } from '@/pages/auth/LoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminCoursesPage } from '@/pages/admin/AdminCoursesPage';
import { AdminQuestionsPage } from '@/pages/admin/AdminQuestionsPage';
import { AdminQuizzesPage } from '@/pages/admin/AdminQuizzesPage';
import { AdminBatchesPage } from '@/pages/admin/AdminBatchesPage';
import { FacultyDashboardPage } from '@/pages/faculty/FacultyDashboard';
import { StudentDashboardPage } from '@/pages/student/StudentDashboard';

export function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin (role-guarded) */}
      <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/courses"   element={<AdminCoursesPage />} />
          <Route path="/admin/questions" element={<AdminQuestionsPage />} />
          <Route path="/admin/quizzes"   element={<AdminQuizzesPage />} />
          <Route path="/admin/batches"   element={<AdminBatchesPage />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Route>

      {/* Faculty */}
      <Route element={<ProtectedRoute allowedRole="FACULTY" />}>
        <Route path="/faculty/dashboard" element={<FacultyDashboardPage />} />
      </Route>

      {/* Student */}
      <Route element={<ProtectedRoute allowedRole="STUDENT" />}>
        <Route path="/student/dashboard" element={<StudentDashboardPage />} />
      </Route>

      {/* Defaults */}
      <Route path="/"  element={<Navigate to="/login" replace />} />
      <Route path="*"  element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
