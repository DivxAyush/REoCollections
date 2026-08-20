import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '@/services/apiClient'
import { API_ENDPOINTS } from '@/constants/api'
import {
  Users, ShoppingBag, Package, TrendingUp, AlertTriangle,
  ArrowUpRight, Eye, Clock, CheckCircle, Truck, XCircle
} from 'lucide-react'

// ── Animated counter
function AnimatedNumber({ value, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!value) return
    let start = 0
    const end = parseInt(value)
    const duration = 1000
    const step = Math.ceil(end / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setDisplay(end); clearInterval(timer) }
      else setDisplay(start)
    }, 16)
    return () => clearInterval(timer)
  }, [value])
  return <>{prefix}{display.toLocaleString('en-IN')}{suffix}</>
}

const STATUS_CONFIG = {
  pending:          { label: 'Pending',          color: 'bg-yellow-100 text-yellow-700',  icon: Clock },
  confirmed:        { label: 'Confirmed',         color: 'bg-blue-100 text-blue-700',      icon: CheckCircle },
  processing:       { label: 'Processing',        color: 'bg-indigo-100 text-indigo-700',  icon: Package },
  shipped:          { label: 'Shipped',           color: 'bg-purple-100 text-purple-700',  icon: Truck },
  out_for_delivery: { label: 'Out for Delivery',  color: 'bg-orange-100 text-orange-700',  icon: Truck },
  delivered:        { label: 'Delivered',         color: 'bg-green-100 text-green-700',    icon: CheckCircle },
  cancelled:        { label: 'Cancelled',         color: 'bg-red-100 text-red-700',        icon: XCircle },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: 'bg-slate-100 text-slate-600', icon: Clock }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>
      {cfg.label}
    </span>
  )
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Dashboard — REo Admin'
    Promise.all([
      api.get(API_ENDPOINTS.ADMIN.USERS),
      api.get(API_ENDPOINTS.ADMIN.ORDERS),
    ]).then(([usersData, ordersData]) => {
      if (usersData.success) setUsers(usersData.users)
      if (ordersData.success) setOrders(ordersData.orders)
    }).finally(() => setLoading(false))
  }, [])

  // Computed stats
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0)
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString())
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing')
  const customers = users.filter(u => u.role === 'user')
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8)

  const STAT_CARDS = [
    {
      label: 'Total Revenue',
      value: totalRevenue,
      prefix: '₹',
      icon: TrendingUp,
      color: 'from-blue-600 to-blue-700',
      light: 'bg-blue-50 text-blue-600',
      change: '+12% this month',
    },
    {
      label: 'Total Orders',
      value: orders.length,
      icon: ShoppingBag,
      color: 'from-violet-600 to-violet-700',
      light: 'bg-violet-50 text-violet-600',
      change: `${todayOrders.length} today`,
    },
    {
      label: 'Customers',
      value: customers.length,
      icon: Users,
      color: 'from-emerald-600 to-emerald-700',
      light: 'bg-emerald-50 text-emerald-600',
      change: 'Registered users',
    },
    {
      label: 'Pending Action',
      value: pendingOrders.length,
      icon: AlertTriangle,
      color: 'from-orange-500 to-orange-600',
      light: 'bg-orange-50 text-orange-500',
      change: 'Need attention',
      alert: pendingOrders.length > 0,
    },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link
          to="/admin-ayush2133k/orders"
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          View all orders <ArrowUpRight size={16} />
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.light}`}>
                <card.icon size={20} />
              </div>
              {card.alert && (
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              )}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                {loading ? '—' : <AnimatedNumber value={card.value} prefix={card.prefix} />}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">{card.change}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Orders + Users Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="font-semibold text-slate-900">Recent Orders</h2>
            <Link to="/admin-ayush2133k/orders" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              See all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs font-medium border-b bg-slate-50">
                  <th className="text-left px-5 py-3">Order</th>
                  <th className="text-left px-5 py-3 hidden sm:table-cell">Customer</th>
                  <th className="text-left px-5 py-3">Total</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-right px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-5 py-3">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-400">No orders yet</td>
                  </tr>
                ) : recentOrders.map((order) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-slate-700 font-medium">
                      #{order.orderNumber?.split('-').pop()}
                    </td>
                    <td className="px-5 py-3 text-slate-600 hidden sm:table-cell">
                      {order.shippingAddress?.name || order.user?.name || 'Guest'}
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-800">
                      ₹{order.total?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        to={`/admin-ayush2133k/orders/${order._id}`}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye size={16} />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats + Order Status Breakdown */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Order Breakdown</h2>
            <div className="space-y-3">
              {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
                const count = orders.filter(o => o.status === status).length
                const pct = orders.length ? Math.round((count / orders.length) * 100) : 0
                return (
                  <div key={status}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">{cfg.label}</span>
                      <span className="text-slate-500">{count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-full bg-blue-500 rounded-full"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-semibold text-slate-900 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: 'Add New Product', to: '/admin-ayush2133k/add-product', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                { label: 'Manage Inventory', to: '/admin-ayush2133k/inventory', color: 'bg-violet-50 text-violet-700 hover:bg-violet-100' },
                { label: 'View Pending Orders', to: '/admin-ayush2133k/orders', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
                { label: 'Add Banner', to: '/admin-ayush2133k/banners/add', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
              ].map(({ label, to, color }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${color}`}
                >
                  {label}
                  <ArrowUpRight size={14} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
