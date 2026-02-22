import { EmptyState } from '@/components/common/EmptyState';

export function AdminCoursesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
        <p className="text-sm text-muted-foreground">Manage your training courses</p>
      </div>
      <EmptyState
        title="No courses yet"
        description="Courses will appear here once created."
      />
    </div>
  );
}
