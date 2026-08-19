import { useState, useEffect } from 'react'
import EmptyState from '@/components/ui/EmptyState'
import { MapPin, Plus, Trash2, Edit2, Star } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import api from '@/services/apiClient'
import { API_ENDPOINTS } from '@/constants/api'
import { PageLoader } from '@/components/ui/Loader'

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    line1: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  })

  useEffect(() => {
    document.title = 'Addresses — REo Collection'
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    setLoading(true)
    try {
      const data = await api.get(API_ENDPOINTS.ADDRESSES.LIST)
      if (data.success) {
        setAddresses(data.addresses)
      }
    } catch (error) {
      console.error('Failed to fetch addresses', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingId(address._id)
      setFormData({
        name: address.name || '',
        phone: address.phone || '',
        line1: address.line1 || '',
        city: address.city || '',
        state: address.state || '',
        pincode: address.pincode || '',
        isDefault: address.isDefault || false
      })
    } else {
      setEditingId(null)
      setFormData({ name: '', phone: '', line1: '', city: '', state: '', pincode: '', isDefault: addresses.length === 0 })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(API_ENDPOINTS.ADDRESSES.UPDATE(editingId), formData)
      } else {
        await api.post(API_ENDPOINTS.ADDRESSES.CREATE, formData)
      }
      await fetchAddresses()
      handleCloseModal()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save address')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return
    try {
      await api.delete(API_ENDPOINTS.ADDRESSES.DELETE(id))
      await fetchAddresses()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete address')
    }
  }

  const handleSetDefault = async (id) => {
    try {
      await api.patch(API_ENDPOINTS.ADDRESSES.SET_DEFAULT(id))
      await fetchAddresses()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to set default address')
    }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#111111]">Saved Addresses</h2>
        {addresses.length > 0 && (
          <Button onClick={() => handleOpenModal()} leftIcon={<Plus size={16} />}>Add New</Button>
        )}
      </div>

      {addresses.length === 0 ? (
        <div className="mt-6">
          <EmptyState 
            icon={MapPin} 
            title="No addresses saved" 
            description="Add a delivery address to speed up checkout." 
            action={<Button onClick={() => handleOpenModal()}>Add Address</Button>} 
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(addr => (
            <div key={addr._id} className={`p-4 border rounded-xl relative ${addr.isDefault ? 'border-blue-500 bg-blue-50/30' : 'border-[#E5E5E3] bg-white'}`}>
              {addr.isDefault && (
                <span className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1">
                  <Star size={12} fill="currentColor" /> Default
                </span>
              )}
              <div className="mt-1 space-y-1 text-sm text-[#5F5F5F] pr-20">
                <p className="font-medium text-[#111111]">{addr.name}</p>
                <p>{addr.line1}</p>
                <p>{addr.city}, {addr.state} {addr.pincode}</p>
                <p>Phone: {addr.phone}</p>
              </div>
              <div className="mt-4 pt-4 border-t flex gap-3">
                <button onClick={() => handleOpenModal(addr)} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Edit2 size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(addr._id)} className="text-sm font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1">
                  <Trash2 size={14} /> Delete
                </button>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr._id)} className="text-sm font-medium text-slate-600 hover:text-slate-800 ml-auto">
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <Input label="Street Address" name="line1" value={formData.line1} onChange={handleChange} required placeholder="123 Main St" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
                <Input label="State" name="state" value={formData.state} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} required />
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Set as default shipping address</span>
              </label>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
                <Button type="submit">Save Address</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
