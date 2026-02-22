import { EmptyState } from '@/components/common/EmptyState';

export function AdminQuizzesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Quizzes</h1>
        <p className="text-sm text-muted-foreground">Manage your quizzes and assessments</p>
      </div>
      <EmptyState
        title="No quizzes yet"
        description="Quizzes will appear here once created."
      />
    </div>
  );
}
