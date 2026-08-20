import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Search, ChevronDown, X } from 'lucide-react'
import api from '@/services/apiClient'
import { API_ENDPOINTS } from '@/constants/api'

const STATUS_TABS = [
  { key: 'all', label: 'All Orders' },
  { key: 'pending', label: 'Pending' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
]

const STATUS_CONFIG = {
  pending:          { label: 'Pending',          color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  confirmed:        { label: 'Confirmed',         color: 'bg-blue-100 text-blue-700 border-blue-200' },
  processing:       { label: 'Processing',        color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  shipped:          { label: 'Shipped',           color: 'bg-purple-100 text-purple-700 border-purple-200' },
  out_for_delivery: { label: 'Out for Delivery',  color: 'bg-orange-100 text-orange-700 border-orange-200' },
  delivered:        { label: 'Delivered',         color: 'bg-green-100 text-green-700 border-green-200' },
  cancelled:        { label: 'Cancelled',         color: 'bg-red-100 text-red-700 border-red-200' },
  returned:         { label: 'Returned',          color: 'bg-slate-100 text-slate-600 border-slate-200' },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: 'bg-slate-100 text-slate-600' }
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
      {cfg.label}
    </span>
  )
}

function PaymentBadge({ payment }) {
  const isPaid = payment?.status === 'paid'
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium uppercase text-slate-700">{payment?.method || 'COD'}</span>
      <span className={`text-[10px] font-semibold ${isPaid ? 'text-green-600' : 'text-orange-500'}`}>
        {isPaid ? 'Paid' : 'Pending'}
      </span>
    </div>
  )
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    document.title = 'Orders — REo Admin'
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const data = await api.get(API_ENDPOINTS.ADMIN.ORDERS)
      if (data.success) setOrders(data.orders)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = orders.filter((o) => {
    const matchTab = activeTab === 'all' || o.status === activeTab
    const q = search.toLowerCase()
    const matchSearch = !q ||
      o.orderNumber?.toLowerCase().includes(q) ||
      o.shippingAddress?.name?.toLowerCase().includes(q) ||
      o.shippingAddress?.phone?.includes(q)
    return matchTab && matchSearch
  })

  const tabCount = (key) =>
    key === 'all' ? orders.length : orders.filter((o) => o.status === key).length

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-500 text-sm mt-0.5">{orders.length} total orders</p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Tabs */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-slate-200 px-4 pt-4 gap-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {tabCount(tab.key)}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, customer name..."
              className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wide bg-slate-50 border-b">
                <th className="text-left px-5 py-3">Order ID</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3">Items</th>
                <th className="text-left px-5 py-3">Total</th>
                <th className="text-left px-5 py-3">Payment</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-3 bg-slate-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-slate-400">
                    <Search className="mx-auto mb-3 text-slate-300" size={36} />
                    <p>No orders found</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filtered.map((order, i) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono text-xs font-bold text-slate-800">
                        {order.orderNumber}
                      </td>
                      <td className="px-5 py-4 text-slate-500 whitespace-nowrap text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-800">
                          {order.shippingAddress?.name || order.user?.name || 'Guest'}
                        </p>
                        {order.shippingAddress?.phone && (
                          <p className="text-slate-400 text-xs mt-0.5">{order.shippingAddress.phone}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-900">
                        ₹{order.total?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4">
                        <PaymentBadge payment={order.payment} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/admin-ayush2133k/orders/${order._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Eye size={13} />
                          View
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t bg-slate-50 text-xs text-slate-500">
            Showing {filtered.length} of {orders.length} orders
          </div>
        )}
      </div>
    </div>
  )
}
