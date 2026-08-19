import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '@/components/ui/EmptyState'
import { Package, Eye, Truck } from 'lucide-react'
import Button from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'
import api from '@/services/apiClient'
import { API_ENDPOINTS } from '@/constants/api'
import { cn } from '@/utils/cn'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'My Orders — REo Collection'
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const data = await api.get(API_ENDPOINTS.ORDERS.LIST)
      if (data.success) {
        setOrders(data.orders)
      }
    } catch (err) {
      console.error('Failed to fetch orders', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-10 text-center">Loading orders...</div>
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#111111] mb-6">My Orders</h2>
      
      {orders.length === 0 ? (
        <EmptyState 
          icon={Package} 
          title="No orders yet" 
          description="Your order history will appear here." 
          action={<Link to={ROUTES.SHOP}><Button>Start Shopping</Button></Link>} 
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-[#E5E5E3] rounded-xl p-5 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex gap-4 items-center">
                <div className="h-16 w-16 bg-[#F7F7F6] rounded-md flex items-center justify-center shrink-0">
                  <Package className="text-[#5F5F5F]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#111111]">Order #{order.orderNumber}</h3>
                  <div className="text-sm text-[#5F5F5F] mt-1 space-x-2">
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className={cn(
                      "font-semibold",
                      order.status === 'delivered' ? "text-green-600" :
                      order.status === 'cancelled' ? "text-red-600" : "text-blue-600"
                    )}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full border-t sm:border-0 pt-4 sm:pt-0">
                <div className="text-right">
                  <p className="text-xs text-[#5F5F5F]">Total</p>
                  <p className="font-bold text-[#111111]">₹{order.total.toLocaleString('en-IN')}</p>
                </div>
                <Link to={`/account/orders/${order._id}`}>
                  <Button variant="outline" size="sm" rightIcon={<Eye className="w-4 h-4" />}>
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
