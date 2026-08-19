import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '@/services/apiClient'
import { API_ENDPOINTS } from '@/constants/api'
import { PageLoader } from '@/components/ui/Loader'
import { Edit2, Trash2, PackageSearch, Tag, Plus } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await api.get(API_ENDPOINTS.PRODUCTS.LIST)
      if (data.success) {
        setProducts(data.products)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await api.delete(API_ENDPOINTS.ADMIN.DELETE_PRODUCT(id))
      await fetchProducts()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product')
    }
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Products</h1>
          <p className="text-slate-500 mt-1">Manage your store catalog</p>
        </div>
        <Link to="/admin-ayush2133k/add-product">
          <Button leftIcon={<Plus size={16} />}>Add Product</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 flex justify-between">
          <p>{error}</p>
          <button onClick={fetchProducts} className="text-sm font-medium hover:underline">Retry</button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0].url} alt={product.name} className="w-10 h-10 object-cover rounded-md border" />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 rounded-md border flex items-center justify-center">
                          <PackageSearch size={16} className="text-slate-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-slate-500 font-mono">{product.sku || 'No SKU'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                      <Tag size={10} />
                      {product.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${product.stock <= 5 ? 'text-rose-600 font-medium' : 'text-slate-600'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${product.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {product.isActive ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link to={`/admin-ayush2133k/products/edit/${product._id}`} className="inline-block p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Edit2 size={16} />
                    </Link>
                    <button onClick={() => handleDelete(product._id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                    No products found. Create one to get started.
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
