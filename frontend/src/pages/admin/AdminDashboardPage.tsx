import { useAuthStore } from '@/stores/auth.store';

export function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        Welcome back, {user?.name}
      </h1>
      <p className="text-muted-foreground">
        Use the sidebar to manage courses, questions, quizzes, and batches.
      </p>
    </div>
  );
}
