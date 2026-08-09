import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { CheckCircle2, Package, ArrowRight } from 'lucide-react'

export default function OrderSuccessPage() {
  const { id } = useParams()

  useEffect(() => {
    document.title = 'Order Placed — REo Collection'
  }, [])

  return (
    <div className="bg-[#F7F7F6] py-20 min-h-[80vh] flex items-center justify-center">
      <Container className="max-w-xl">
        <div className="rounded-2xl border border-[#E5E5E3] bg-white p-10 text-center shadow-lg">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-[#111111] mb-2">Order Confirmed!</h1>
          <p className="text-[#5F5F5F] mb-8">
            Thank you for shopping with REo Collection. Your order has been successfully placed.
          </p>

          <div className="bg-[#F7F7F6] rounded-xl p-6 mb-8 border border-[#E5E5E3] text-left">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-[#5F5F5F]">Order Number</span>
              <span className="font-bold text-[#111111]">{id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#5F5F5F]">Estimated Delivery</span>
              <span className="font-semibold text-[#111111]">Aug 12 - Aug 14</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Link to={`/account/orders/${id}`} className="flex-1">
              <Button variant="outline" className="w-full h-12" leftIcon={<Package className="w-5 h-5" />}>
                Track Order
              </Button>
            </Link>
            <Link to="/shop" className="flex-1">
              <Button className="w-full h-12" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
