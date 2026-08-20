import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, X, Package, AlertTriangle, CheckCircle,
  XCircle, Save, RefreshCw, Download, Edit3, ChevronDown
} from 'lucide-react'
import api from '@/services/apiClient'
import { API_ENDPOINTS } from '@/constants/api'

// ── Stock level helpers
const stockLevel = (stock) => {
  if (stock === 0) return 'out'
  if (stock <= 10) return 'low'
  return 'in'
}

const STOCK_BADGE = {
  out: { label: 'Out of Stock', color: 'bg-red-100 text-red-700 border-red-200',    dot: 'bg-red-500',    icon: XCircle },
  low: { label: 'Low Stock',    color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500', icon: AlertTriangle },
  in:  { label: 'In Stock',     color: 'bg-green-100 text-green-700 border-green-200',  dot: 'bg-green-500', icon: CheckCircle },
}

function StockBadge({ stock }) {
  const level = stockLevel(stock)
  const cfg = STOCK_BADGE[level]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

// ── Inline editable stock cell
function StockCell({ productId, initialStock, onSave }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(initialStock)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (parseInt(value) === initialStock) { setEditing(false); return }
    setSaving(true)
    try {
      await onSave(productId, parseInt(value))
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') { setValue(initialStock); setEditing(false) } }}
          autoFocus
          className="w-20 border-2 border-blue-500 rounded px-2 py-1 text-sm font-mono font-bold focus:outline-none"
        />
        <button onClick={handleSave} disabled={saving} className="text-green-600 hover:text-green-700 disabled:opacity-50">
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
        </button>
        <button onClick={() => { setValue(initialStock); setEditing(false) }} className="text-slate-400 hover:text-slate-600">
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="group flex items-center gap-2 hover:text-blue-600 transition-colors"
    >
      <span className={`font-mono font-bold text-sm ${value === 0 ? 'text-red-600' : value <= 10 ? 'text-yellow-600' : 'text-slate-900'}`}>
        {value}
      </span>
      <Edit3 size={12} className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
    </button>
  )
}

// ── CSV Export
function exportCSV(products) {
  const headers = ['Name', 'SKU', 'Stock', 'Price', 'Category', 'Status']
  const rows = products.map((p) => [
    `"${p.name}"`,
    p.sku || '',
    p.stock,
    p.price,
    p.category?.name || '',
    p.isActive ? 'Active' : 'Inactive',
  ])
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminInventoryPage() {
  const [products, setProducts] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState('all')
  const [pendingChanges, setPendingChanges] = useState({}) // { productId: newStock }
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    document.title = 'Inventory — REo Admin'
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    setLoading(true)
    try {
      const data = await api.get(API_ENDPOINTS.ADMIN.INVENTORY)
      if (data.success) {
        setProducts(data.products)
        setSummary(data.summary)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Inline single save
  const handleSingleSave = async (productId, newStock) => {
    await api.patch(API_ENDPOINTS.ADMIN.BULK_STOCK_UPDATE, {
      updates: [{ productId, stock: newStock }],
    })
    setProducts((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, stock: newStock } : p))
    )
    // Recalculate summary
    setSummary((prev) => ({ ...prev }))
  }

  // Filtered products
  const filtered = products.filter((p) => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q)
    const matchFilter =
      stockFilter === 'all' ||
      (stockFilter === 'out' && p.stock === 0) ||
      (stockFilter === 'low' && p.stock > 0 && p.stock <= 10) ||
      (stockFilter === 'in' && p.stock > 10)
    return matchSearch && matchFilter
  })

  const FILTER_TABS = [
    { key: 'all', label: 'All Products', count: summary?.total },
    { key: 'out', label: 'Out of Stock', count: summary?.outOfStock },
    { key: 'low', label: 'Low Stock',    count: summary?.lowStock },
    { key: 'in',  label: 'In Stock',     count: summary?.inStock },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Manager</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {summary ? `Total inventory value: ₹${summary.totalValue?.toLocaleString('en-IN')}` : 'Loading...'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download size={15} />
            Export CSV
          </button>
          <button
            onClick={fetchInventory}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: summary?.total ?? '—', icon: Package,       color: 'text-slate-600 bg-slate-50' },
          { label: 'Out of Stock',   value: summary?.outOfStock ?? '—', icon: XCircle,  color: 'text-red-600 bg-red-50' },
          { label: 'Low Stock',      value: summary?.lowStock ?? '—',   icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'In Stock',       value: summary?.inStock ?? '—',    icon: CheckCircle,   color: 'text-green-600 bg-green-50' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
              <card.icon size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{card.label}</p>
              <p className="text-xl font-bold text-slate-900">{loading ? '—' : card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto no-scrollbar border-b px-4 pt-4 gap-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStockFilter(tab.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                stockFilter === tab.key
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                stockFilter === tab.key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {tab.count ?? '—'}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or SKU..."
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
                <th className="text-left px-5 py-3">Product</th>
                <th className="text-left px-5 py-3">SKU</th>
                <th className="text-left px-5 py-3">Category</th>
                <th className="text-left px-5 py-3">Price</th>
                <th className="text-left px-5 py-3">Stock (click to edit)</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-3 bg-slate-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-slate-400">
                    <Package className="mx-auto mb-3 text-slate-300" size={36} />
                    <p>No products found</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filtered.map((product, i) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.015 }}
                      className={`hover:bg-slate-50/70 transition-colors ${product.stock === 0 ? 'bg-red-50/30' : product.stock <= 10 ? 'bg-yellow-50/30' : ''}`}
                    >
                      {/* Product */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                            {product.images?.[0]?.url
                              ? <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
                              : <Package size={16} className="m-auto mt-3 text-slate-400" />
                            }
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm line-clamp-1">{product.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">ID: {product._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="px-5 py-3 font-mono text-xs text-slate-600">
                        {product.sku || <span className="text-slate-300">—</span>}
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3 text-slate-600 text-xs">
                        {product.category?.name || '—'}
                      </td>

                      {/* Price */}
                      <td className="px-5 py-3 font-semibold text-slate-800">
                        ₹{product.price?.toLocaleString('en-IN')}
                      </td>

                      {/* Stock — inline editable */}
                      <td className="px-5 py-3">
                        <StockCell
                          productId={product._id}
                          initialStock={product.stock}
                          onSave={handleSingleSave}
                        />
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3">
                        <StockBadge stock={product.stock} />
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3 text-right">
                        <Link
                          to={`/admin-ayush2133k/products/edit/${product._id}`}
                          className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium"
                        >
                          Edit Product
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filtered.length} of {products.length} products</span>
            {summary?.outOfStock > 0 && (
              <span className="text-red-600 font-semibold flex items-center gap-1">
                <AlertTriangle size={12} />
                {summary.outOfStock} products out of stock — restock needed!
              </span>
            )}
          </div>
        )}
      </div>

      {/* Help Text */}
      <p className="text-xs text-slate-400 text-center">
        💡 Click on any stock number to edit it inline. Changes are saved immediately.
      </p>
    </div>
  )
}
