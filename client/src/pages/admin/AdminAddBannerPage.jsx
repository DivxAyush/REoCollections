import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '@/services/apiClient'
import { API_ENDPOINTS } from '@/constants/api'
import { PageLoader } from '@/components/ui/Loader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { ArrowLeft, UploadCloud, X, ImageIcon } from 'lucide-react'

const BANNER_TYPES = [
  { value: 'hero', label: 'Hero Banner' },
  { value: 'promotional', label: 'Promotional / Offer' },
  { value: 'offer', label: 'Offer' },
  { value: 'collection', label: 'Collection' },
]

export default function AdminAddBannerPage() {
  const { id } = useParams()
  const isEditing = !!id
  const navigate = useNavigate()

  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(null) // 'desktop' or 'mobile'
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    type: 'hero',
    title: '',
    subtitle: '',
    buttonText: '',
    redirectUrl: '/',
    displayOrder: 0,
    isActive: true,
    desktopImage: null, // { url, publicId }
    mobileImage: null, // { url, publicId }
  })

  useEffect(() => {
    if (isEditing) {
      fetchBanner()
    }
  }, [id])

  const fetchBanner = async () => {
    try {
      const data = await api.get(API_ENDPOINTS.ADMIN.BANNER_DETAIL(id))
      if (data.success) {
        const { _id, createdAt, updatedAt, ...rest } = data.banner
        setFormData(rest)
      }
    } catch (err) {
      setError('Failed to load banner details')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    const uploadData = new FormData()
    uploadData.append('image', file)

    try {
      setUploadingImage(type)
      const res = await api.post(API_ENDPOINTS.UPLOAD, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (res.success) {
        setFormData((prev) => ({
          ...prev,
          [type === 'desktop' ? 'desktopImage' : 'mobileImage']: {
            url: res.url,
            publicId: res.publicId,
          },
        }))
      }
    } catch (err) {
      alert('Failed to upload image')
    } finally {
      setUploadingImage(null)
    }
  }

  const handleRemoveImage = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type === 'desktop' ? 'desktopImage' : 'mobileImage']: null,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.desktopImage?.url) {
      return alert('Desktop image is required.')
    }

    try {
      setSubmitting(true)
      if (isEditing) {
        await api.put(API_ENDPOINTS.ADMIN.BANNER_DETAIL(id), formData)
      } else {
        await api.post(API_ENDPOINTS.ADMIN.BANNERS, formData)
      }
      navigate('/admin-ayush2133k/banners')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save banner')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <PageLoader />

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin-ayush2133k/banners" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isEditing ? 'Edit Banner' : 'Add New Banner'}
          </h1>
          <p className="text-slate-500 mt-1">
            {isEditing ? 'Update campaign details' : 'Create a new campaign'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6 bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-lg font-bold border-b pb-3 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Internal Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Summer Sale 2026"
                helperText="Only visible in admin"
              />
              <Select
                label="Banner Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={BANNER_TYPES}
              />
            </div>

            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Find Your Perfect Style"
              helperText="Main heading on the banner"
            />
            <Input
              label="Subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="e.g. New Arrivals are here"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Button Text"
                name="buttonText"
                value={formData.buttonText}
                onChange={handleChange}
                placeholder="e.g. Shop Now"
              />
              <Input
                label="Redirect URL"
                name="redirectUrl"
                value={formData.redirectUrl}
                onChange={handleChange}
                placeholder="e.g. /shop/new-arrivals"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Display Order"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                min="0"
                helperText="Lower numbers appear first"
              />
              <div className="flex items-center mt-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                  />
                  <span className="font-medium text-slate-700">Banner is Active</span>
                </label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-lg font-bold border-b pb-3 mb-4">Desktop Image *</h2>
              
              {!formData.desktopImage ? (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'desktop')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadingImage === 'desktop'}
                  />
                  {uploadingImage === 'desktop' ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                      <p className="text-sm text-slate-500">Uploading...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadCloud className="h-10 w-10 text-slate-400 mb-2" />
                      <p className="text-sm font-medium text-slate-700">Click or drag image to upload</p>
                      <p className="text-xs text-slate-500 mt-1">1920x1080 recommended</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden group">
                  <img src={formData.desktopImage.url} alt="Desktop preview" className="w-full aspect-video object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage('desktop')}
                      className="p-2 bg-white text-rose-600 rounded-full hover:bg-rose-50"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-lg font-bold border-b pb-3 mb-4">Mobile Image (Optional)</h2>
              
              {!formData.mobileImage ? (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'mobile')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadingImage === 'mobile'}
                  />
                  {uploadingImage === 'mobile' ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                      <p className="text-sm text-slate-500">Uploading...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadCloud className="h-10 w-10 text-slate-400 mb-2" />
                      <p className="text-sm font-medium text-slate-700">Click or drag image to upload</p>
                      <p className="text-xs text-slate-500 mt-1">1080x1920 recommended</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden group max-w-[200px] mx-auto">
                  <img src={formData.mobileImage.url} alt="Mobile preview" className="w-full aspect-[9/16] object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage('mobile')}
                      className="p-2 bg-white text-rose-600 rounded-full hover:bg-rose-50"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Link to="/admin-ayush2133k/banners">
            <Button type="button" variant="ghost">Cancel</Button>
          </Link>
          <Button type="submit" isLoading={submitting}>
            {isEditing ? 'Update Banner' : 'Create Banner'}
          </Button>
        </div>
      </form>
    </div>
  )
}
