import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Printer, Package, Truck, CheckCircle2,
  User, MapPin, CreditCard, Clock, XCircle, ChevronDown
} from 'lucide-react'
import api from '@/services/apiClient'
import { API_ENDPOINTS } from '@/constants/api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const ORDER_STATUSES = [
  'pending','confirmed','processing','shipped','out_for_delivery','delivered','cancelled','returned'
]

const STATUS_CONFIG = {
  pending:          { label: 'Pending',          color: 'bg-yellow-100 text-yellow-700',  dot: 'bg-yellow-500' },
  confirmed:        { label: 'Confirmed',         color: 'bg-blue-100 text-blue-700',      dot: 'bg-blue-500' },
  processing:       { label: 'Processing',        color: 'bg-indigo-100 text-indigo-700',  dot: 'bg-indigo-500' },
  shipped:          { label: 'Shipped',           color: 'bg-purple-100 text-purple-700',  dot: 'bg-purple-500' },
  out_for_delivery: { label: 'Out for Delivery',  color: 'bg-orange-100 text-orange-700',  dot: 'bg-orange-500' },
  delivered:        { label: 'Delivered',         color: 'bg-green-100 text-green-700',    dot: 'bg-green-500' },
  cancelled:        { label: 'Cancelled',         color: 'bg-red-100 text-red-700',        dot: 'bg-red-500' },
  returned:         { label: 'Returned',          color: 'bg-slate-100 text-slate-600',    dot: 'bg-slate-400' },
}

// ─────────────────────────────────────────────
//  INVOICE COMPONENT (rendered only for print)
// ─────────────────────────────────────────────
function InvoiceView({ order }) {
  if (!order) return null
  return (
    <div id="reo-invoice" className="hidden print:block font-['Inter'] text-gray-900 p-8 max-w-[794px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-200">
        <div>
          <h1 className="text-3xl font-black tracking-tight">REo.</h1>
          <p className="text-sm text-gray-500 mt-1">REo Collection — Fashion & Style</p>
          <p className="text-sm text-gray-500">support@reocollection.in</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">INVOICE</p>
          <p className="text-sm text-gray-500 mt-1">#{order.orderNumber}</p>
          <p className="text-sm text-gray-500">
            Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
          <div className={`inline-block mt-2 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide
            ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'}`}
          >
            {STATUS_CONFIG[order.status]?.label || order.status}
          </div>
        </div>
      </div>

      {/* Bill To / Ship To */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Bill To</p>
          <p className="font-bold text-gray-900">{order.shippingAddress?.name}</p>
          <p className="text-sm text-gray-600">{order.shippingAddress?.line1}</p>
          {order.shippingAddress?.line2 && <p className="text-sm text-gray-600">{order.shippingAddress.line2}</p>}
          <p className="text-sm text-gray-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}</p>
          <p className="text-sm text-gray-600 mt-1">Ph: {order.shippingAddress?.phone}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Payment Details</p>
          <p className="text-sm"><span className="text-gray-500">Method:</span> <span className="font-semibold uppercase">{order.payment?.method || 'COD'}</span></p>
          <p className="text-sm mt-1"><span className="text-gray-500">Status:</span> <span className={`font-bold ${order.payment?.status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>{order.payment?.status || 'Pending'}</span></p>
          {order.trackingNumber && <p className="text-sm mt-1"><span className="text-gray-500">Tracking:</span> <span className="font-mono">{order.trackingNumber}</span></p>}
          {order.carrier && <p className="text-sm"><span className="text-gray-500">Carrier:</span> {order.carrier}</p>}
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-6 text-sm">
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="text-left px-4 py-3 rounded-tl-lg">Item</th>
            <th className="text-center px-4 py-3">Size</th>
            <th className="text-center px-4 py-3">Color</th>
            <th className="text-center px-4 py-3">Qty</th>
            <th className="text-right px-4 py-3">Price</th>
            <th className="text-right px-4 py-3 rounded-tr-lg">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-3 font-medium">{item.name}</td>
              <td className="px-4 py-3 text-center text-gray-600">{item.size || '—'}</td>
              <td className="px-4 py-3 text-center text-gray-600">{item.color || '—'}</td>
              <td className="px-4 py-3 text-center">{item.quantity}</td>
              <td className="px-4 py-3 text-right">₹{item.price?.toLocaleString('en-IN')}</td>
              <td className="px-4 py-3 text-right font-semibold">₹{(item.price * item.quantity)?.toLocaleString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{order.subtotal?.toLocaleString('en-IN')}</span></div>
          {order.couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{order.couponDiscount?.toLocaleString('en-IN')}</span></div>}
          <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{order.deliveryCharge === 0 ? 'Free' : `₹${order.deliveryCharge}`}</span></div>
          <div className="flex justify-between border-t-2 border-gray-900 pt-2 mt-2 font-black text-base">
            <span>TOTAL</span><span>₹{order.total?.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t pt-4 text-center text-xs text-gray-400">
        <p>Thank you for shopping with REo Collection! For queries: support@reocollection.in</p>
        <p className="mt-1">This is a computer-generated invoice and does not require a signature.</p>
      </div>
    </div>
  )
}

export default function AdminOrderDetailsPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [status, setStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState(false)

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
      const data = await api.put(API_ENDPOINTS.ADMIN.UPDATE_ORDER_STATUS(id), { status, trackingNumber, carrier })
      if (data.success) {
        setOrder(data.order)
        setUpdateSuccess(true)
        setTimeout(() => setUpdateSuccess(false), 3000)
      }
    } catch (err) {
      alert('Failed to update: ' + (err.response?.data?.message || err.message))
    } finally {
      setUpdating(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) return <div className="p-10 text-center text-slate-500">Loading order...</div>
  if (!order) return <div className="p-10 text-center text-slate-500">Order not found</div>

  const cfg = STATUS_CONFIG[status] || {}

  return (
    <>
      {/* Print Invoice (hidden on screen, shown on print) */}
      <InvoiceView order={order} />

      {/* Screen View */}
      <div className="print:hidden p-4 md:p-6 lg:p-8 space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/admin-ayush2133k/orders" className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Order #{order.orderNumber}</h1>
              <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${cfg.color}`}>
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Printer size={15} />
              Print Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Items */}
          <div className="lg:col-span-2 space-y-5">

            {/* Items Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b">
                <Package size={18} className="text-slate-500" />
                <h2 className="font-semibold text-slate-900">Items ({order.items?.length})</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 hover:bg-slate-50 transition-colors">
                    <div className="h-16 w-14 shrink-0 rounded-lg overflow-hidden bg-slate-100 border">
                      {item.image
                        ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        : <div className="h-full w-full bg-slate-200" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900 truncate">{item.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.size && `Size: ${item.size}`}{item.size && item.color && ' · '}{item.color && `Color: ${item.color}`}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">₹{item.price?.toLocaleString('en-IN')} × {item.quantity}</p>
                    </div>
                    <div className="font-bold text-slate-900 shrink-0">
                      ₹{(item.price * item.quantity)?.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
              {/* Totals */}
              <div className="px-5 py-4 border-t bg-slate-50 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString('en-IN')}</span></div>
                {order.couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>Coupon Discount</span><span>-₹{order.couponDiscount?.toLocaleString('en-IN')}</span></div>}
                <div className="flex justify-between text-slate-600"><span>Shipping</span><span>{order.deliveryCharge === 0 ? 'Free 🎉' : `₹${order.deliveryCharge}`}</span></div>
                <div className="flex justify-between font-bold text-base text-slate-900 pt-2 border-t">
                  <span>Total</span><span>₹{order.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right — Sidebar */}
          <div className="space-y-5">

            {/* Update Status */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 size={17} className="text-blue-500" /> Update Order
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Status</label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {['shipped','out_for_delivery','delivered'].includes(status) && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Tracking Number</label>
                      <input
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="e.g. BLDRT12345678"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Courier Partner</label>
                      <input
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
                        placeholder="e.g. BlueDart, Delhivery"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>

                {updateSuccess && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-green-600 text-center font-medium"
                  >
                    ✓ Order updated successfully
                  </motion.p>
                )}
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2 text-slate-700">
                  <User size={14} /> <span className="text-xs font-bold uppercase tracking-wide">Customer</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">{order.shippingAddress?.name || 'Guest'}</p>
                <p className="text-xs text-slate-500 mt-0.5">{order.shippingAddress?.phone}</p>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-2 text-slate-700">
                  <MapPin size={14} /> <span className="text-xs font-bold uppercase tracking-wide">Shipping Address</span>
                </div>
                <div className="text-sm text-slate-600 leading-relaxed">
                  <p>{order.shippingAddress?.line1}</p>
                  {order.shippingAddress?.line2 && <p>{order.shippingAddress.line2}</p>}
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                  <p className="font-mono text-xs">{order.shippingAddress?.pincode}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-2 text-slate-700">
                  <CreditCard size={14} /> <span className="text-xs font-bold uppercase tracking-wide">Payment</span>
                </div>
                <div className="text-sm text-slate-600">
                  <p>Method: <span className="font-bold uppercase">{order.payment?.method || 'COD'}</span></p>
                  <p>Status: <span className={`font-bold ${order.payment?.status === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>{order.payment?.status || 'pending'}</span></p>
                  {order.payment?.transactionId && <p className="text-xs text-slate-400 font-mono mt-1 break-all">{order.payment.transactionId}</p>}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
