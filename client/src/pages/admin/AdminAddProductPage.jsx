import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/services/apiClient'
import { API_ENDPOINTS } from '@/constants/api'
import { UploadCloud, CheckCircle2, AlertCircle, X, ArrowLeft } from 'lucide-react'

const FIELD = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
)

const INPUT_CLS = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 transition-all"
const SELECT_CLS = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"

export default function AdminAddProductPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const [formData, setFormData] = useState({
    name: '', description: '', shortDescription: '',
    price: '', compareAtPrice: '', category: '',
    sku: '', stock: '', featured: false, newArrival: false, bestSeller: false,
    sizes: '', colors: '',
  })

  useEffect(() => {
    api.get(API_ENDPOINTS.CATEGORIES.LIST).then((data) => {
      if (data.success) setCategories(data.categories.filter((c) => c.isActive))
    })
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    handleFile(e.dataTransfer.files[0])
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!imageFile) { setError('Please select a product image'); return }
    setLoading(true); setError(null); setSuccess(false)
    try {
      const imageObj = await uploadImage()
      const payload = {
        ...formData,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        stock: Number(formData.stock),
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
        images: [imageObj],
      }
      const data = await api.post(API_ENDPOINTS.ADMIN.CREATE_PRODUCT, payload)
      if (data.success) { setSuccess(true); setTimeout(() => navigate('/admin-ayush2133k/products'), 1500) }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create product')
    } finally { setLoading(false) }
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Add New Product</h1>
          <p className="text-xs text-slate-500 mt-0.5">Fill in the details to create a new product listing</p>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          <CheckCircle2 size={16} /> Product created! Redirecting...
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center justify-between px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          <span className="flex items-center gap-2"><AlertCircle size={16} />{error}</span>
          <button onClick={() => setError(null)}><X size={14} /></button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Row 1 — Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Left — Image Upload */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-full">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Product Image *</p>
              
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-colors ${
                  dragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'
                }`}
                style={{ aspectRatio: '3/4' }}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview('') }}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/80"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
                    <UploadCloud size={32} className={dragOver ? 'text-blue-500' : ''} />
                    <p className="text-xs font-medium text-center px-4">
                      Drop image here or<br />
                      <span className="text-blue-500">click to upload</span>
                    </p>
                    <p className="text-[10px] text-slate-400">JPG, PNG, WEBP • max 2MB</p>
                  </div>
                )}
                <input
                  type="file" accept="image/*"
                  onChange={(e) => handleFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              <p className="text-[10px] text-slate-400 mt-2 text-center">Recommended: 800×1000px (portrait)</p>
            </div>
          </div>

          {/* Right — Details */}
          <div className="lg:col-span-2 space-y-4">

            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-widest border-b pb-2">Basic Info</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FIELD label="Product Name" required>
                  <input name="name" required value={formData.name} onChange={handleChange}
                    placeholder="e.g. Classic White T-Shirt" className={INPUT_CLS} />
                </FIELD>
                <FIELD label="Category" required>
                  <div className="relative">
                    <select name="category" required value={formData.category} onChange={handleChange} className={SELECT_CLS}>
                      <option value="">Select category...</option>
                      {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</div>
                  </div>
                </FIELD>
              </div>

              <FIELD label="Short Description" required>
                <textarea name="shortDescription" rows={2} required value={formData.shortDescription}
                  onChange={handleChange} placeholder="Brief product tagline..."
                  className={INPUT_CLS + ' resize-none'} />
              </FIELD>

              <FIELD label="Full Description" required>
                <textarea name="description" rows={3} required value={formData.description}
                  onChange={handleChange} placeholder="Detailed description, features, material..."
                  className={INPUT_CLS + ' resize-none'} />
              </FIELD>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-widest border-b pb-2">Pricing & Inventory</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <FIELD label="Price (₹)" required>
                  <input type="number" name="price" min="0" required value={formData.price}
                    onChange={handleChange} placeholder="0" className={INPUT_CLS} />
                </FIELD>
                <FIELD label="Compare Price (₹)">
                  <input type="number" name="compareAtPrice" min="0" value={formData.compareAtPrice}
                    onChange={handleChange} placeholder="0" className={INPUT_CLS} />
                </FIELD>
                <FIELD label="SKU" required>
                  <input name="sku" required value={formData.sku}
                    onChange={handleChange} placeholder="REO-001" className={INPUT_CLS} />
                </FIELD>
                <FIELD label="Stock Qty" required>
                  <input type="number" name="stock" min="0" required value={formData.stock}
                    onChange={handleChange} placeholder="0" className={INPUT_CLS} />
                </FIELD>
              </div>
            </div>

            {/* Options (Sizes & Colors) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-widest border-b pb-2">Options (Variants)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FIELD label="Sizes (Comma separated)">
                  <input name="sizes" value={formData.sizes}
                    onChange={handleChange} placeholder="e.g. S, M, L, XL" className={INPUT_CLS} />
                </FIELD>
                <FIELD label="Colors (Comma separated)">
                  <input name="colors" value={formData.colors}
                    onChange={handleChange} placeholder="e.g. Red, Blue, Black" className={INPUT_CLS} />
                </FIELD>
              </div>
            </div>

            {/* Visibility */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-widest border-b pb-2 mb-3">Visibility Flags</p>
              <div className="flex flex-wrap gap-4">
                {[
                  { name: 'featured', label: '⭐ Featured' },
                  { name: 'newArrival', label: '🆕 New Arrival' },
                  { name: 'bestSeller', label: '🔥 Best Seller' },
                ].map(({ name, label }) => (
                  <label key={name} className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)}
            className="px-5 py-2 text-sm font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading || uploadingImage || !imageFile}
            className="px-6 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
            {(loading || uploadingImage) && (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {loading ? 'Creating...' : uploadingImage ? 'Uploading...' : 'Create Product'}
          </button>
        </div>

      </form>
    </div>
  )
}
