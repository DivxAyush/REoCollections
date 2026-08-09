import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { updateQuantity, removeFromCart, syncCartFromServer } from '@/redux/slices/cartSlice'
import Container from '@/components/ui/Container'
import { PageLoader } from '@/components/ui/Loader'
import Button from '@/components/ui/Button'
import PriceDisplay from '@/components/ui/PriceDisplay'
import SectionHeading from '@/components/ui/SectionHeading'
import EmptyState from '@/components/ui/EmptyState'
import { Trash2, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const dispatch = useDispatch()
  const { items, isLoading } = useSelector((state) => state.cart)
  
  useEffect(() => {
    document.title = 'Shopping Cart — REo Collection'
    // Optional: sync with server if logged in
    // dispatch(syncCartFromServer())
  }, [dispatch])

  if (isLoading && !items?.length) return <PageLoader />

  if (!items?.length) {
    return (
      <div className="min-h-screen bg-white">
        <Container className="py-20">
          <EmptyState 
            icon={<ShoppingBag className="h-12 w-12 text-[#C9AD8B]" />}
            title="Your cart is empty"
            description="Looks like you haven't added anything to your cart yet."
            action={
              <Link to="/shop">
                <Button>Start Shopping</Button>
              </Link>
            }
          />
        </Container>
      </div>
    )
  }

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <div className="bg-[#F7F7F6] py-10 min-h-screen">
      <Container>
        <SectionHeading title="Shopping Cart" className="mb-8" />
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Cart Items List */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.itemId} className="flex flex-col sm:flex-row gap-6 rounded-xl bg-white p-4 shadow-sm border border-[#E5E5E3]">
                {/* Image */}
                <Link to={`/product/${item.slug}`} className="h-32 w-24 shrink-0 overflow-hidden rounded-md bg-[#F7F7F6] sm:h-40 sm:w-32">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link to={`/product/${item.slug}`} className="font-bold text-[#111111] hover:underline">
                        {item.name}
                      </Link>
                      {item.variant && (
                        <div className="mt-1 text-sm text-[#5F5F5F]">
                          {item.variant.color && <span>Color: {item.variant.color}</span>}
                          {item.variant.color && item.variant.size && <span className="mx-2">|</span>}
                          {item.variant.size && <span>Size: {item.variant.size}</span>}
                        </div>
                      )}
                    </div>
                    <PriceDisplay price={item.price} className="font-semibold" />
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-between sm:mt-0">
                    <div className="flex h-10 items-center justify-between rounded-md border border-[#E5E5E3] bg-[#F7F7F6] px-3 w-28">
                      <button 
                        onClick={() => dispatch(updateQuantity({ itemId: item.itemId, quantity: Math.max(1, item.quantity - 1) }))}
                        className="text-lg font-light text-[#5F5F5F] hover:text-[#111111]"
                      >−</button>
                      <span className="text-sm font-semibold">{item.quantity}</span>
                      <button 
                        onClick={() => dispatch(updateQuantity({ itemId: item.itemId, quantity: item.quantity + 1 }))}
                        className="text-lg font-light text-[#5F5F5F] hover:text-[#111111]"
                      >+</button>
                    </div>

                    <button 
                      onClick={() => dispatch(removeFromCart(item.itemId))}
                      className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="rounded-xl border border-[#E5E5E3] bg-white p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-[#111111] mb-4">Order Summary</h2>
              
              <div className="flex flex-col gap-3 text-sm text-[#5F5F5F]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Estimate</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                
                <div className="my-3 h-px w-full bg-[#E5E5E3]" />
                
                <div className="flex justify-between text-base font-bold text-[#111111]">
                  <span>Total</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Link to="/checkout" className="mt-6 block">
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
