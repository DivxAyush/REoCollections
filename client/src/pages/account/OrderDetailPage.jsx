import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Package, Truck, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import PriceDisplay from '@/components/ui/PriceDisplay'
import { cn } from '@/utils/cn'
import api from '@/services/apiClient'
import { API_ENDPOINTS } from '@/constants/api'

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  
  useEffect(() => {
    document.title = `Order Details — REo Collection`
    fetchOrderDetails()
  }, [id])

  const fetchOrderDetails = async () => {
    try {
      const data = await api.get(API_ENDPOINTS.ORDERS.DETAIL(id))
      if (data.success) {
        setOrder(data.order)
      }
    } catch (err) {
      console.error('Failed to fetch order', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      setCancelling(true)
      try {
        const data = await api.post(API_ENDPOINTS.ORDERS.CANCEL(id))
        if (data.success) {
          alert('Order cancelled successfully')
          fetchOrderDetails()
        }
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to cancel order')
      } finally {
        setCancelling(false)
      }
    }
  }

  if (loading) {
    return <div className="p-10 text-center">Loading order details...</div>
  }

  if (!order) {
    return <div className="p-10 text-center">Order not found</div>
  }

  const orderStatus = order.status
  const isCancelled = orderStatus === 'cancelled'

  // Timeline UI Data
  const timelineSteps = [
    { title: 'Order Placed', date: new Date(order.createdAt).toLocaleDateString(), completed: true, icon: Package },
    { title: 'Processing', date: '', completed: !isCancelled && orderStatus !== 'pending', icon: AlertCircle },
    { title: 'Shipped', date: order.trackingNumber ? `Track: ${order.trackingNumber}` : '', completed: !isCancelled && (orderStatus === 'shipped' || orderStatus === 'out_for_delivery' || orderStatus === 'delivered'), icon: Truck },
    { title: 'Delivered', date: order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : '', completed: orderStatus === 'delivered', icon: CheckCircle2 }
  ]

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5E5E3] pb-4">
        <div className="flex items-center gap-4">
          <Link to="/account/orders" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F7F6] text-[#111111] hover:bg-[#E5E5E3] transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#111111]">Order #{order.orderNumber}</h1>
            <p className="text-sm text-[#5F5F5F]">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className={cn(
          "px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider",
          isCancelled ? "bg-red-100 text-red-600" :
          orderStatus === 'delivered' ? "bg-green-100 text-green-600" :
          "bg-blue-100 text-blue-600"
        )}>
          {orderStatus.replace('_', ' ')}
        </div>
      </div>

      {isCancelled && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200 flex items-start gap-3">
          <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Order Cancelled</h3>
            <p className="text-sm text-red-600 mt-1">This order was cancelled. If you paid online, your refund will be processed according to our policy.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Tracking Timeline */}
          {!isCancelled && (
            <div className="rounded-xl border border-[#E5E5E3] bg-white p-6 shadow-sm overflow-hidden overflow-x-auto">
              <h2 className="text-lg font-bold text-[#111111] mb-6">Delivery Status</h2>
              <div className="relative flex justify-between min-w-[500px]">
                {/* Connecting Line */}
                <div className="absolute top-5 left-0 w-full h-1 bg-[#F7F7F6] -z-10" />
                <div 
                  className="absolute top-5 left-0 h-1 bg-green-500 -z-10 transition-all duration-500" 
                  style={{ 
                    width: orderStatus === 'delivered' ? '100%' : 
                           (orderStatus === 'shipped' || orderStatus === 'out_for_delivery') ? '66%' : 
                           (orderStatus === 'processing' || orderStatus === 'confirmed') ? '33%' : '0%' 
                  }} 
                />

                {timelineSteps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={step.title} className="flex flex-col items-center gap-2 w-24">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-4 border-white transition-colors",
                        step.completed ? "bg-green-500 text-white" : "bg-[#E5E5E3] text-[#5F5F5F]"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="text-center">
                        <div className={cn("text-xs font-bold", step.completed ? "text-[#111111]" : "text-[#5F5F5F]")}>{step.title}</div>
                        {step.date && <div className="text-[10px] text-[#5F5F5F] mt-1 break-words px-2">{step.date}</div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Ordered Items */}
          <div className="rounded-xl border border-[#E5E5E3] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#111111] mb-4">Items Ordered ({order.items.length})</h2>
            <div className="flex flex-col gap-4">
              {order.items.map(item => (
                <div key={item._id || item.product} className="flex gap-4 items-center">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-md bg-[#F7F7F6] border">
                    {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="font-semibold text-sm text-[#111111]">{item.name}</span>
                    <span className="text-xs text-[#5F5F5F] mt-1">
                      {item.size && `Size: ${item.size} `}
                      {item.color && `| Color: ${item.color}`}
                    </span>
                  </div>
                  <div className="text-right">
                    <PriceDisplay price={item.price} className="text-sm font-semibold" />
                    <div className="text-xs text-[#5F5F5F] mt-1">Qty: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-[#E5E5E3] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#111111] mb-4">Order Summary</h2>
            <div className="flex flex-col gap-3 text-sm text-[#5F5F5F]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal?.toLocaleString('en-IN') || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={order.deliveryCharge === 0 ? "text-green-600" : ""}>
                  {order.deliveryCharge === 0 ? 'Free' : `₹${order.deliveryCharge}`}
                </span>
              </div>
              <div className="my-2 h-px w-full bg-[#E5E5E3]" />
              <div className="flex justify-between text-base font-bold text-[#111111]">
                <span>Total</span>
                <span>₹{order.total?.toLocaleString('en-IN') || 0}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E5E3] bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold text-[#111111] mb-2 uppercase tracking-wider">Shipping Address</h2>
            <div className="text-sm text-[#5F5F5F] leading-relaxed">
              <p className="font-semibold text-[#111111] mb-1">{order.shippingAddress?.name || 'Guest'}</p>
              <p>{order.shippingAddress?.line1}</p>
              {order.shippingAddress?.line2 && <p>{order.shippingAddress?.line2}</p>}
              <p>{order.shippingAddress?.city} - {order.shippingAddress?.pincode}</p>
              <p>{order.shippingAddress?.state}</p>
              <p className="mt-2">Phone: {order.shippingAddress?.phone}</p>
            </div>

            <div className="my-4 h-px w-full bg-[#E5E5E3]" />

            <h2 className="text-sm font-bold text-[#111111] mb-2 uppercase tracking-wider">Payment Method</h2>
            <div className="text-sm text-[#5F5F5F]">
              <p className="uppercase">{order.payment?.method || 'cod'}</p>
              <p>Status: <span className={order.payment?.status === 'paid' ? "text-green-600 font-medium" : "text-orange-600 font-medium"}>{order.payment?.status}</span></p>
              {order.payment?.transactionId && <p className="text-xs text-gray-400 truncate mt-1">ID: {order.payment.transactionId}</p>}
            </div>
          </div>

          {(orderStatus === 'pending' || orderStatus === 'processing') && (
            <Button 
              variant="outline" 
              className="w-full text-red-600 border-red-200 hover:bg-red-50" 
              onClick={handleCancelOrder}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
