import { useState, useEffect } from 'react'
import api from '@/services/apiClient'
import { API_ENDPOINTS } from '@/constants/api'
import { PageLoader } from '@/components/ui/Loader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Plus, Edit2, Trash2, Tag, UploadCloud, X, Image as ImageIcon } from 'lucide-react'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', isActive: true })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await api.get(API_ENDPOINTS.CATEGORIES.LIST)
      if (data.success) {
        setCategories(data.categories)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingId(category._id)
      setFormData({ 
        name: category.name, 
        slug: category.slug, 
        description: category.description || '',
        isActive: category.isActive 
      })
      setImagePreview(category.image?.url || '')
      setImageFile(null)
    } else {
      setEditingId(null)
      setFormData({ name: '', slug: '', description: '', isActive: true })
      setImagePreview('')
      setImageFile(null)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setFormData({ name: '', slug: '', description: '', isActive: true })
    setImagePreview('')
    setImageFile(null)
  }

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const uploadImage = async () => {
    const fd = new FormData()
    fd.append('image', imageFile)
    setUploadingImage(true)
    try {
      const data = await api.post(API_ENDPOINTS.UPLOAD, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      return { url: data.url, publicId: data.publicId }
    } finally { setUploadingImage(false) }
  }

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  }

  const handleNameChange = (e) => {
    const newName = e.target.value
    if (!editingId) {
      setFormData({ ...formData, name: newName, slug: generateSlug(newName) })
    } else {
      setFormData({ ...formData, name: newName })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      
      let payload = { ...formData }
      if (imageFile) {
        const imageObj = await uploadImage()
        payload.image = imageObj
      }

      if (editingId) {
        await api.put(API_ENDPOINTS.ADMIN.UPDATE_CATEGORY(editingId), payload)
      } else {
        await api.post(API_ENDPOINTS.ADMIN.CREATE_CATEGORY, payload)
      }
      await fetchCategories()
      handleCloseModal()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return

    try {
      await api.delete(API_ENDPOINTS.ADMIN.DELETE_CATEGORY(id))
      await fetchCategories()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category')
    }
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Categories</h1>
          <p className="text-slate-500 mt-1">Manage product categories</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus size={16} />}>
          Add Category
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 flex justify-between">
          <p>{error}</p>
          <button onClick={fetchCategories} className="text-sm font-medium hover:underline">Retry</button>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b">
                <th className="px-4 py-3 font-medium">Category Name</th>
                <th className="px-4 py-3 font-medium">Slug (Sync ID)</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      {cat.image?.url ? (
                        <img src={cat.image.url} alt={cat.name} className="w-10 h-10 rounded object-cover border border-slate-200" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                      <div>
                        <div>{cat.name}</div>
                        {cat.description && <div className="text-xs font-normal text-slate-500 mt-0.5 max-w-[200px] truncate">{cat.description}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-sm">{cat.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${cat.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {cat.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => handleOpenModal(cat)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(cat._id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-slate-500">
                    No categories found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">{editingId ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button>
            </div>
            <div className="max-h-[80vh] overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Category Image</label>
                  <div className="flex gap-4 items-start">
                    <div className="relative w-24 h-32 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => { setImageFile(null); setImagePreview('') }}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/80"
                          >
                            <X size={10} />
                          </button>
                        </>
                      ) : (
                        <UploadCloud size={24} className="text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file" accept="image/*"
                        onChange={(e) => handleFile(e.target.files[0])}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-slate-500 mt-2">Recommended: 800×1000px (Portrait).</p>
                    </div>
                  </div>
                </div>

                <Input
                  label="Category Name"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                  placeholder="e.g. T-Shirts"
                />
                
                <Input
                  label="Subtitle / Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Premium cotton tees"
                  helperText="Displayed under the category name on the home page."
                />

                <Input
                  label="Slug (Sync ID)"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  placeholder="e.g. t-shirts"
                  helperText="URL-friendly unique identifier"
                />
                
                <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Category is Active</span>
                </label>

                <div className="pt-4 flex justify-end gap-3 mt-6 border-t pt-4">
                  <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
                  <Button type="submit" isLoading={isSubmitting || uploadingImage}>
                    {uploadingImage ? 'Uploading...' : 'Save Category'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
