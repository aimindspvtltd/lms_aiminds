import { EmptyState } from '@/components/common/EmptyState';

export function AdminBatchesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Batches</h1>
        <p className="text-sm text-muted-foreground">Manage training batches and groups</p>
      </div>
      <EmptyState
        title="No batches yet"
        description="Batches will appear here once created."
      />
    </div>
  );
}
