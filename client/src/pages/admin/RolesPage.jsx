import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import apiClient from '@/services/apiClient'
import { UserPlus, ShieldAlert, Check, X, ShieldCheck } from 'lucide-react'

export default function RolesPage() {
  const { user } = useAuth()
  const [staffList, setStaffList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'helper' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  
  const fetchStaff = async () => {
    try {
      setIsLoading(true)
      const res = await apiClient.get('/admin/staff')
      setStaffList(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const handleRoleChange = async (id, newRole) => {
    try {
      await apiClient.patch(`/admin/staff/${id}/role`, { role: newRole })
      fetchStaff() // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role')
    }
  }

  const handleCreateStaff = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      await apiClient.post('/admin/staff', formData)
      setIsModalOpen(false)
      setFormData({ name: '', email: '', password: '', role: 'helper' })
      fetchStaff()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create staff')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (user?.role !== 'super_admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Access Restricted</h2>
        <p className="text-slate-500 mt-2">Only Super Admins can access this page.</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="text-blue-600" />
            Roles & Permissions
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage staff access levels and create new accounts.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <UserPlus size={18} />
          Create Staff
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Current Role</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-400">Loading staff...</td>
                </tr>
              ) : staffList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-400">No staff found.</td>
                </tr>
              ) : (
                staffList.map((staff) => (
                  <tr key={staff._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{staff.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600">{staff.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        staff.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                        staff.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {staff.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={staff.role}
                        onChange={(e) => handleRoleChange(staff._id, e.target.value)}
                        disabled={staff._id === user._id}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 disabled:opacity-50"
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="helper">Helper</option>
                        <option value="customer">Demote to Customer</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="font-semibold text-lg text-slate-900">Create New Staff</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateStaff} className="p-5 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Temporary Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assign Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="super_admin">Super Admin (Full Access + Roles)</option>
                  <option value="admin">Admin (Full Access)</option>
                  <option value="helper">Helper (Products & Banners Only)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
