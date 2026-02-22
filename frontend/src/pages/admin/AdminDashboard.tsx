import { useAuth } from '@/contexts/AuthContext'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">Welcome, {user?.name}</p>
          </div>
          <button onClick={logout} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border rounded-md hover:bg-gray-50">
            Sign Out
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-gray-500">Admin panel will be built in Phase 2. For now, use Postman to manage courses, questions, and batches via the API.</p>
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <p className="text-sm font-medium text-blue-800">Quick Reference — Admin API Base URL</p>
            <code className="text-sm text-blue-700">POST /api/admin/courses</code><br/>
            <code className="text-sm text-blue-700">POST /api/admin/questions/bulk-upload</code><br/>
            <code className="text-sm text-blue-700">POST /api/admin/batches</code>
          </div>
        </div>
      </div>
    </div>
  )
}
