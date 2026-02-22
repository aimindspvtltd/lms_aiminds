import { EmptyState } from '@/components/common/EmptyState';

export function AdminQuestionsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Question Bank</h1>
        <p className="text-sm text-muted-foreground">Manage your question library</p>
      </div>
      <EmptyState
        title="No questions yet"
        description="Questions will appear here once added."
      />
    </div>
  );
}
