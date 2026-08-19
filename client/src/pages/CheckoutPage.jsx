import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '@/redux/slices/cartSlice'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import PriceDisplay from '@/components/ui/PriceDisplay'
import { CheckCircle2, CreditCard, Truck, MapPin } from 'lucide-react'
import api from '@/services/apiClient'
import { API_ENDPOINTS } from '@/constants/api'
import { loadRazorpayScript } from '@/utils/razorpay'

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items } = useSelector((state) => state.cart)
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const deliveryCharge = subtotal > 999 ? 0 : 50
  const total = subtotal + deliveryCharge

  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    line1: '',
    city: '',
    state: '',
    pincode: '',
  })

  useEffect(() => {
    document.title = 'Secure Checkout — REo Collection'
  }, [])

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setShippingAddress(prev => ({ ...prev, [name]: value }))
  }

  const validateAddress = () => {
    return shippingAddress.name && shippingAddress.phone && shippingAddress.line1 && shippingAddress.city && shippingAddress.state && shippingAddress.pincode
  }

  const handlePlaceOrder = async () => {
    if (!validateAddress()) {
      alert('Please fill out all shipping address fields.')
      return
    }

    setLoading(true)

    try {
      // Ensure backend cart is synced with frontend cart before creating order
      await api.post('/cart', { items })

      if (paymentMethod === 'cod') {
        const data = await api.post(API_ENDPOINTS.ORDERS.CREATE, {
          shippingAddress,
          paymentMethod: 'cod'
        })
        if (data.success) {
          dispatch(clearCart())
          navigate(`/order-success/${data.order.orderNumber}`)
        }
      } else {
        // Razorpay flow
        const isLoaded = await loadRazorpayScript()
        if (!isLoaded) {
          alert('Razorpay SDK failed to load. Are you online?')
          setLoading(false)
          return
        }

        const orderData = await api.post(API_ENDPOINTS.PAYMENT.CREATE_ORDER)
        if (!orderData.success) {
          alert('Failed to initialize payment')
          setLoading(false)
          return
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_change_me', 
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'REo Collection',
          description: 'Secure Checkout',
          order_id: orderData.order_id,
          handler: async function (response) {
            try {
              const verifyData = await api.post(API_ENDPOINTS.PAYMENT.VERIFY, {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                shippingAddress,
                paymentMethod,
              })
              if (verifyData.success) {
                dispatch(clearCart())
                navigate(`/order-success/${verifyData.order.orderNumber}`)
              }
            } catch (err) {
              alert(err.response?.data?.message || 'Payment verification failed')
              setLoading(false)
            }
          },
          prefill: {
            name: shippingAddress.name,
            contact: shippingAddress.phone,
          },
          theme: { color: '#111111' },
          modal: {
            ondismiss: function() { setLoading(false) }
          }
        }
        
        const rzp = new window.Razorpay(options)
        rzp.on('payment.failed', function (response){
          alert('Payment failed: ' + response.error.description)
          setLoading(false)
        })
        rzp.open()
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#F7F7F6] py-10 min-h-screen">
      <Container>
        <div className="mb-8 flex items-center justify-between border-b border-[#E5E5E3] pb-4">
          <h1 className="text-2xl font-bold text-[#111111]">Secure Checkout</h1>
          <div className="flex items-center gap-2 text-sm font-medium text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            256-bit SSL Encryption
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            {/* Shipping Address */}
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-white">
                  <MapPin className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-[#111111]">Shipping Address</h2>
              </div>
              <div className="rounded-xl border border-[#E5E5E3] bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input name="name" value={shippingAddress.name} onChange={handleAddressChange} label="Full Name" placeholder="Ayush Kumar" />
                  </div>
                  <div className="sm:col-span-2">
                    <Input name="line1" value={shippingAddress.line1} onChange={handleAddressChange} label="Address" placeholder="123 Fashion Street" />
                  </div>
                  <Input name="city" value={shippingAddress.city} onChange={handleAddressChange} label="City" placeholder="Kanpur" />
                  <Input name="state" value={shippingAddress.state} onChange={handleAddressChange} label="State" placeholder="Uttar Pradesh" />
                  <Input name="pincode" value={shippingAddress.pincode} onChange={handleAddressChange} label="Postal Code" placeholder="208001" />
                  <Input name="phone" value={shippingAddress.phone} onChange={handleAddressChange} label="Phone Number" placeholder="+91 98765 43210" />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-white">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-[#111111]">Payment Method</h2>
              </div>
              <div className="rounded-xl border border-[#E5E5E3] bg-white p-6 shadow-sm">
                <div className="space-y-4">
                  {/* Card Option */}
                  <label className="flex cursor-pointer items-start gap-4 rounded-lg border border-[#E5E5E3] p-4 hover:bg-gray-50 data-[active=true]:border-[#111111] data-[active=true]:bg-gray-50" data-active={paymentMethod === 'card'}>
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1 h-4 w-4 text-[#111111]" />
                    <div className="flex-1">
                      <div className="font-semibold text-[#111111]">Credit/Debit Card (via Razorpay)</div>
                    </div>
                  </label>

                  {/* UPI Option */}
                  <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-[#E5E5E3] p-4 hover:bg-gray-50 data-[active=true]:border-[#111111] data-[active=true]:bg-gray-50" data-active={paymentMethod === 'upi'}>
                    <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4" />
                    <div className="font-semibold text-[#111111]">UPI (Google Pay, PhonePe, Paytm)</div>
                  </label>
                  
                  {/* COD Option */}
                  <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-[#E5E5E3] p-4 hover:bg-gray-50 data-[active=true]:border-[#111111] data-[active=true]:bg-gray-50" data-active={paymentMethod === 'cod'}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4" />
                    <div className="font-semibold text-[#111111]">Cash on Delivery</div>
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-[#E5E5E3] bg-white p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-[#111111] mb-6">Order Summary</h2>
              
              <div className="flex flex-col gap-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.itemId} className="flex gap-4">
                    <div className="h-20 w-16 shrink-0 overflow-hidden rounded-md bg-[#F7F7F6]">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <div className="font-semibold text-sm text-[#111111] line-clamp-1">{item.name}</div>
                      <div className="text-xs text-[#5F5F5F] mt-1">Qty: {item.quantity} {item.variant?.size && `| Size: ${item.variant.size}`}</div>
                      <PriceDisplay price={item.price} className="text-sm font-semibold mt-1" />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="my-6 h-px w-full bg-[#E5E5E3]" />

              <div className="flex flex-col gap-3 text-sm text-[#5F5F5F]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Estimate</span>
                  <span className="text-green-600 font-medium">{deliveryCharge === 0 ? 'Free Express Shipping' : `₹${deliveryCharge}`}</span>
                </div>
                
                <div className="my-4 h-px w-full bg-[#E5E5E3]" />
                
                <div className="flex justify-between text-lg font-bold text-[#111111]">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Button 
                className="w-full mt-8 h-12 text-base shadow-md hover:shadow-lg transition-shadow"
                onClick={handlePlaceOrder}
                disabled={loading || items.length === 0}
              >
                {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay & Place Order'}
              </Button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#5F5F5F]">
                <Truck className="h-4 w-4" />
                Dispatch within 24 hours
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
