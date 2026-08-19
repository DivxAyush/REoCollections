import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/services/apiClient'
import { API_ENDPOINTS } from '@/constants/api'
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function AdminAddProductPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    compareAtPrice: '',
    category: '',
    sku: '',
    stock: '',
    featured: false,
    newArrival: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleUploadImage = async () => {
    if (!imageFile) return null
    
    const formData = new FormData()
    formData.append('image', imageFile)
    
    try {
      setUploadingImage(true)
      const { data } = await api.post(API_ENDPOINTS.UPLOAD, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data.url
    } catch (err) {
      throw new Error('Image upload failed')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      let imageUrls = []
      
      // Upload image if selected
      if (imageFile) {
        const url = await handleUploadImage()
        if (url) imageUrls.push(url)
      } else {
        throw new Error('Please select at least one image')
      }

      // Convert numeric fields
      const payload = {
        ...formData,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        stock: Number(formData.stock),
        images: imageUrls,
      }

      const { data } = await api.post(API_ENDPOINTS.ADMIN.CREATE_PRODUCT, payload)
      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/admin-ayush2133k')
        }, 2000)
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Add New Product</h1>
        <p className="text-slate-500 mt-1">Create a new product listing in the store</p>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-3">
          <CheckCircle2 size={20} />
          <p>Product created successfully! Redirecting...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
        
        {/* Main Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 border-b pb-2">Basic Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Classic White T-Shirt"
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Category (ID or Slug)</label>
              <input
                type="text"
                name="category"
                required
                className="w-full h-11 px-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. category-id"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Short Description</label>
            <textarea
              name="shortDescription"
              required
              rows={2}
              className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.shortDescription}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Full Description</label>
            <textarea
              name="description"
              required
              rows={4}
              className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="space-y-4 pt-4">
          <h3 className="font-semibold text-slate-900 border-b pb-2">Pricing & Inventory</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="Price (₹)"
              name="price"
              type="number"
              min="0"
              required
              value={formData.price}
              onChange={handleChange}
            />
            <Input
              label="Compare At Price (₹)"
              name="compareAtPrice"
              type="number"
              min="0"
              value={formData.compareAtPrice}
              onChange={handleChange}
            />
            <Input
              label="SKU"
              name="sku"
              required
              value={formData.sku}
              onChange={handleChange}
            />
            <Input
              label="Stock Quantity"
              name="stock"
              type="number"
              min="0"
              required
              value={formData.stock}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Product Image */}
        <div className="space-y-4 pt-4">
          <h3 className="font-semibold text-slate-900 border-b pb-2">Product Image</h3>
          
          <div className="flex items-center gap-6">
            <div className="shrink-0 w-32 h-40 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <UploadCloud className="text-slate-400 mb-2" size={24} />
                  <span className="text-xs text-slate-500 font-medium">Upload Image</span>
                </>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="text-sm text-slate-500">
              <p className="font-medium text-slate-700 mb-1">Upload primary product image</p>
              <p>Recommended size: 800x1000px</p>
              <p>Max file size: 2MB</p>
              <p>Formats: JPG, PNG, WEBP</p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4 pt-4">
          <h3 className="font-semibold text-slate-900 border-b pb-2">Visibility Options</h3>
          
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">Featured Product</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="newArrival"
                checked={formData.newArrival}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">New Arrival</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin-ayush2133k')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || uploadingImage || !imageFile}
          >
            {loading || uploadingImage ? 'Creating...' : 'Create Product'}
          </Button>
        </div>

      </form>
    </div>
  )
}
