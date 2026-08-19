import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Truck, Package, CheckCircle2, User, MapPin, CreditCard } from 'lucide-react'
import api from '@/services/apiClient'
import { API_ENDPOINTS } from '@/constants/api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function AdminOrderDetailsPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [status, setStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('')

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      const data = await api.get(API_ENDPOINTS.ORDERS.DETAIL(id))
      if (data.success) {
        setOrder(data.order)
        setStatus(data.order.status)
        setTrackingNumber(data.order.trackingNumber || '')
        setCarrier(data.order.carrier || '')
      }
    } catch (err) {
      console.error('Failed to fetch order details:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      const data = await api.put(API_ENDPOINTS.ADMIN.UPDATE_ORDER_STATUS(id), {
        status,
        trackingNumber,
        carrier
      })
      if (data.success) {
        alert('Order updated successfully')
        setOrder(data.order)
      }
    } catch (err) {
      alert('Failed to update order: ' + (err.response?.data?.message || err.message))
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <div className="p-10 text-center">Loading...</div>
  if (!order) return <div className="p-10 text-center">Order not found</div>

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link to="/admin-ayush2133k/orders" className="p-2 rounded-full hover:bg-slate-200">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Order {order.orderNumber}</h1>
          <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Package size={20} /> Items ({order.items.length})</h3>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4 p-4 border rounded-lg bg-slate-50/50">
                  <div className="h-20 w-16 shrink-0 rounded bg-white border">
                    {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded" /> : <div className="h-full w-full bg-slate-200"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{item.name}</div>
                    <div className="text-xs text-slate-500 mt-1">Size: {item.size || 'N/A'} | Color: {item.color || 'N/A'}</div>
                    <div className="text-sm font-medium mt-2">₹{item.price} x {item.quantity}</div>
                  </div>
                  <div className="font-bold text-slate-900">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Shipping</span>
                <span>₹{order.deliveryCharge}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Order Update */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><CheckCircle2 size={20} /> Update Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Order Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              {(status === 'shipped' || status === 'out_for_delivery' || status === 'delivered' || trackingNumber) && (
                <>
                  <Input 
                    label="Tracking Number" 
                    value={trackingNumber} 
                    onChange={(e) => setTrackingNumber(e.target.value)} 
                    placeholder="e.g. BLUDART12345"
                  />
                  <Input 
                    label="Courier Partner" 
                    value={carrier} 
                    onChange={(e) => setCarrier(e.target.value)} 
                    placeholder="e.g. BlueDart"
                  />
                </>
              )}
              
              <Button onClick={handleUpdate} disabled={updating} className="w-full">
                {updating ? 'Saving...' : 'Update Order'}
              </Button>
            </div>
          </div>

          {/* Customer & Shipping */}
          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2 text-slate-800"><User size={16} /> Customer</h3>
              <div className="text-sm text-slate-600">
                <p>{order.shippingAddress?.name || 'Guest'}</p>
                <p>{order.shippingAddress?.phone}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2 text-slate-800"><MapPin size={16} /> Shipping Address</h3>
              <div className="text-sm text-slate-600">
                <p>{order.shippingAddress?.line1}</p>
                {order.shippingAddress?.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                <p>{order.shippingAddress?.pincode}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2 text-slate-800"><CreditCard size={16} /> Payment</h3>
              <div className="text-sm text-slate-600">
                <p>Method: <span className="uppercase font-medium">{order.payment?.method || 'cod'}</span></p>
                <p>Status: <span className={`font-medium ${order.payment?.status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>{order.payment?.status}</span></p>
                {order.payment?.transactionId && <p className="text-xs mt-1 text-slate-400">ID: {order.payment.transactionId}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
