import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Package, Truck, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import PriceDisplay from '@/components/ui/PriceDisplay'
import { cn } from '@/utils/cn'

export default function OrderDetailPage() {
  const { id } = useParams()
  const [orderStatus, setOrderStatus] = useState('Processing') // Processing, Shipped, Delivered, Cancelled
  
  useEffect(() => {
    document.title = `Order #${id} — REo Collection`
  }, [id])

  // Mock order data
  const mockOrder = {
    id: id,
    date: 'Aug 9, 2026',
    total: 3499,
    items: [
      {
        id: 'p1',
        name: 'Premium Leather Loafers',
        price: 3499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1499013819532-e4ff41b00669?q=80&w=500&auto=format&fit=crop',
        size: 'UK 9'
      }
    ],
    address: {
      name: 'Ayush Kumar',
      street: '123 Fashion Street',
      city: 'Mumbai, Maharashtra',
      pincode: '400001',
      phone: '+91 98765 43210'
    },
    payment: 'Credit Card ending in 4242'
  }

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      setOrderStatus('Cancelled')
    }
  }

  // Timeline UI Data
  const timelineSteps = [
    { title: 'Order Placed', date: 'Aug 9, 10:00 AM', completed: true, icon: Package },
    { title: 'Processing', date: 'Aug 9, 11:30 AM', completed: orderStatus !== 'Cancelled', icon: AlertCircle },
    { title: 'Shipped', date: 'Est. Aug 10', completed: orderStatus === 'Shipped' || orderStatus === 'Delivered', icon: Truck },
    { title: 'Delivered', date: 'Est. Aug 12', completed: orderStatus === 'Delivered', icon: CheckCircle2 }
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
            <h1 className="text-2xl font-bold text-[#111111]">Order #{id}</h1>
            <p className="text-sm text-[#5F5F5F]">Placed on {mockOrder.date}</p>
          </div>
        </div>
        
        <div className={cn(
          "px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider",
          orderStatus === 'Cancelled' ? "bg-red-100 text-red-600" :
          orderStatus === 'Delivered' ? "bg-green-100 text-green-600" :
          "bg-blue-100 text-blue-600"
        )}>
          {orderStatus}
        </div>
      </div>

      {orderStatus === 'Cancelled' && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200 flex items-start gap-3">
          <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Order Cancelled</h3>
            <p className="text-sm text-red-600 mt-1">This order was cancelled by you. If you paid online, your refund will be processed within 5-7 business days.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Tracking Timeline */}
          {orderStatus !== 'Cancelled' && (
            <div className="rounded-xl border border-[#E5E5E3] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#111111] mb-6">Delivery Status</h2>
              <div className="relative flex justify-between">
                {/* Connecting Line */}
                <div className="absolute top-5 left-0 w-full h-1 bg-[#F7F7F6] -z-10" />
                <div 
                  className="absolute top-5 left-0 h-1 bg-green-500 -z-10 transition-all duration-500" 
                  style={{ width: '33%' }} 
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
                        <div className="text-[10px] text-[#5F5F5F] mt-1">{step.date}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Ordered Items */}
          <div className="rounded-xl border border-[#E5E5E3] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#111111] mb-4">Items Ordered</h2>
            <div className="flex flex-col gap-4">
              {mockOrder.items.map(item => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-md bg-[#F7F7F6]">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="font-semibold text-sm text-[#111111]">{item.name}</span>
                    <span className="text-xs text-[#5F5F5F] mt-1">Size: {item.size}</span>
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
                <span>₹{mockOrder.total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="my-2 h-px w-full bg-[#E5E5E3]" />
              <div className="flex justify-between text-base font-bold text-[#111111]">
                <span>Total</span>
                <span>₹{mockOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E5E3] bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold text-[#111111] mb-2 uppercase tracking-wider">Shipping Address</h2>
            <div className="text-sm text-[#5F5F5F] leading-relaxed">
              <p className="font-semibold text-[#111111] mb-1">{mockOrder.address.name}</p>
              <p>{mockOrder.address.street}</p>
              <p>{mockOrder.address.city} - {mockOrder.address.pincode}</p>
              <p className="mt-2">Phone: {mockOrder.address.phone}</p>
            </div>

            <div className="my-4 h-px w-full bg-[#E5E5E3]" />

            <h2 className="text-sm font-bold text-[#111111] mb-2 uppercase tracking-wider">Payment Method</h2>
            <div className="text-sm text-[#5F5F5F]">
              <p>{mockOrder.payment}</p>
            </div>
          </div>

          {orderStatus === 'Processing' && (
            <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50" onClick={handleCancelOrder}>
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
