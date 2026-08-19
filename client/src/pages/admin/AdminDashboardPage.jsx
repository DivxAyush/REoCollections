import { useState, useEffect } from 'react'
import api from '@/services/apiClient'
import { API_ENDPOINTS } from '@/constants/api'
import { PageLoader } from '@/components/ui/Loader'
import { Users, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react'

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await api.get(API_ENDPOINTS.ADMIN.USERS)
      if (data.success) {
        setUsers(data.users)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <PageLoader />

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 flex items-center justify-between">
        <p>{error}</p>
        <button onClick={fetchUsers} className="text-sm font-medium hover:underline">
          Retry
        </button>
      </div>
    )
  }

  const admins = users.filter((u) => u.role === 'admin')
  const customers = users.filter((u) => u.role === 'user')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Users Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage all registered accounts</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-slate-500 font-medium">Total Users</p>
            <h3 className="text-2xl font-bold text-slate-900">{users.length}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-slate-500 font-medium">Customers</p>
            <h3 className="text-2xl font-bold text-slate-900">{customers.length}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-slate-500 font-medium">Admins</p>
            <h3 className="text-2xl font-bold text-slate-900">{admins.length}</h3>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold uppercase shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 truncate">{user.name}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-0.5">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Mail size={12} /> {user.email}
                          </span>
                          {user.phone && (
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Phone size={12} /> {user.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
