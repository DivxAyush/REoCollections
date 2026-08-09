import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '@/redux/slices/cartSlice'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import PriceDisplay from '@/components/ui/PriceDisplay'
import { CheckCircle2, CreditCard, Truck, MapPin } from 'lucide-react'

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items } = useSelector((state) => state.cart)
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  useEffect(() => {
    document.title = 'Secure Checkout — REo Collection'
  }, [])

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
                  <Input label="First Name" placeholder="Ayush" />
                  <Input label="Last Name" placeholder="Kumar" />
                  <div className="sm:col-span-2">
                    <Input label="Address" placeholder="123 Fashion Street" />
                  </div>
                  <Input label="City" placeholder="Mumbai" />
                  <Input label="Postal Code" placeholder="400001" />
                  <div className="sm:col-span-2">
                    <Input label="Phone Number" placeholder="+91 98765 43210" />
                  </div>
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
                  <label className="flex cursor-pointer items-start gap-4 rounded-lg border border-[#111111] bg-gray-50 p-4">
                    <input type="radio" name="payment" className="mt-1 h-4 w-4 text-[#111111]" defaultChecked />
                    <div className="flex-1">
                      <div className="font-semibold text-[#111111]">Credit/Debit Card</div>
                      <div className="mt-4 grid gap-4">
                        <Input placeholder="Card Number" />
                        <div className="grid grid-cols-2 gap-4">
                          <Input placeholder="MM/YY" />
                          <Input placeholder="CVV" />
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* UPI Option */}
                  <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-[#E5E5E3] p-4 hover:bg-gray-50">
                    <input type="radio" name="payment" className="h-4 w-4" />
                    <div className="font-semibold text-[#111111]">UPI (Google Pay, PhonePe, Paytm)</div>
                  </label>
                  
                  {/* COD Option */}
                  <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-[#E5E5E3] p-4 hover:bg-gray-50">
                    <input type="radio" name="payment" className="h-4 w-4" />
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
                  <span className="text-green-600 font-medium">Free Express Shipping</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18% GST incl.)</span>
                  <span>₹{(subtotal * 0.18).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                
                <div className="my-4 h-px w-full bg-[#E5E5E3]" />
                
                <div className="flex justify-between text-lg font-bold text-[#111111]">
                  <span>Total</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Button 
                className="w-full mt-8 h-12 text-base shadow-md hover:shadow-lg transition-shadow"
                onClick={() => {
                  // Simulate order placement
                  dispatch(clearCart())
                  navigate('/order-success/ORD-892374')
                }}
              >
                Place Order Securely
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
