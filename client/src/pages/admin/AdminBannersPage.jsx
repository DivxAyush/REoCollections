import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '@/services/apiClient'
import { API_ENDPOINTS } from '@/constants/api'
import { PageLoader } from '@/components/ui/Loader'
import Button from '@/components/ui/Button'
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react'

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const data = await api.get(API_ENDPOINTS.ADMIN.BANNERS)
      if (data.success) {
        setBanners(data.banners)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load banners')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return

    try {
      await api.delete(API_ENDPOINTS.ADMIN.BANNER_DETAIL(id))
      await fetchBanners()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete banner')
    }
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Banners & Promotions</h1>
          <p className="text-slate-500 mt-1">Manage hero and promotional banners</p>
        </div>
        <Link to="/admin-ayush2133k/banners/add">
          <Button leftIcon={<Plus size={16} />}>Add Banner</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 flex justify-between">
          <p>{error}</p>
          <button onClick={fetchBanners} className="text-sm font-medium hover:underline">Retry</button>
        </div>
      )}

      {/* Banners Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b">
                <th className="px-4 py-3 font-medium">Preview</th>
                <th className="px-4 py-3 font-medium">Title/Name</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {banners.map((banner) => (
                <tr key={banner._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    {banner.desktopImage?.url ? (
                      <img
                        src={banner.desktopImage.url}
                        alt={banner.name || banner.title}
                        className="h-12 w-24 object-cover rounded bg-slate-100"
                      />
                    ) : (
                      <div className="h-12 w-24 bg-slate-100 rounded flex items-center justify-center text-slate-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-900 font-medium">
                    {banner.name || banner.title || 'Untitled'}
                    {banner.subtitle && (
                      <p className="text-xs text-slate-500 font-normal">{banner.subtitle}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                      {banner.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${banner.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {banner.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link to={`/admin-ayush2133k/banners/edit/${banner._id}`}>
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Edit2 size={16} />
                      </button>
                    </Link>
                    <button onClick={() => handleDelete(banner._id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {banners.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                    No banners found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
