import { useState } from 'react'
import { PackageSearch, ArrowRight, Package } from 'lucide-react'
import Container from '@/components/ui/Container'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Link } from 'react-router-dom'

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const handleTrack = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call to track order
    setTimeout(() => {
      setIsSubmitting(false)
      // Mocking a successful tracking result for demonstration
      setResult({
        status: 'In Transit',
        expectedDelivery: 'Aug 24, 2026',
        courier: 'Delhivery',
        trackingId: 'DLV' + Math.floor(Math.random() * 10000000)
      })
    }, 1500)
  }

  return (
    <div className="bg-[#F7F7F6] py-12 lg:py-20 min-h-[calc(100vh-200px)]">
      <Container className="max-w-xl">
        <div className="rounded-2xl border border-[#E5E5E3] bg-white p-6 shadow-sm sm:p-10">
          <div className="text-center mb-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F7F6] mb-6">
              <PackageSearch className="h-8 w-8 text-[#111111]" />
            </div>
            <h1 className="font-['Outfit'] text-3xl font-bold tracking-tight text-[#111111]">
              Track Your Order
            </h1>
            <p className="mt-3 text-[#5F5F5F]">
              Enter your Order ID and Email Address below to check the current status of your shipment.
            </p>
          </div>

          {!result ? (
            <form onSubmit={handleTrack} className="space-y-6">
              <Input
                label="Order ID"
                id="orderId"
                required
                placeholder="e.g. REO12345678"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                helperText="You can find this in your confirmation email."
              />
              <Input
                label="Email Address"
                type="email"
                id="email"
                required
                placeholder="The email you used during checkout"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Track Now
              </Button>
            </form>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="rounded-xl border border-[#E5E5E3] p-6 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#C9AD8B]/10 mb-4">
                  <Package className="h-6 w-6 text-[#C9AD8B]" />
                </div>
                <h3 className="text-xl font-semibold text-[#111111]">Order {orderId}</h3>
                <div className="mt-6 grid grid-cols-2 gap-4 text-left">
                  <div className="rounded-lg bg-[#F7F7F6] p-4">
                    <p className="text-xs text-[#5F5F5F] uppercase tracking-wider font-semibold">Status</p>
                    <p className="mt-1 font-medium text-[#111111]">{result.status}</p>
                  </div>
                  <div className="rounded-lg bg-[#F7F7F6] p-4">
                    <p className="text-xs text-[#5F5F5F] uppercase tracking-wider font-semibold">Expected By</p>
                    <p className="mt-1 font-medium text-[#111111]">{result.expectedDelivery}</p>
                  </div>
                  <div className="rounded-lg bg-[#F7F7F6] p-4">
                    <p className="text-xs text-[#5F5F5F] uppercase tracking-wider font-semibold">Courier</p>
                    <p className="mt-1 font-medium text-[#111111]">{result.courier}</p>
                  </div>
                  <div className="rounded-lg bg-[#F7F7F6] p-4">
                    <p className="text-xs text-[#5F5F5F] uppercase tracking-wider font-semibold">Tracking AWB</p>
                    <p className="mt-1 font-medium text-[#111111]">{result.trackingId}</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button variant="outline" fullWidth onClick={() => setResult(null)}>
                    Track Another Order
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 border-t border-[#E5E5E3] pt-6 text-center text-sm text-[#5F5F5F]">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[#111111] hover:text-[#C9AD8B] transition-colors">
                Sign in
              </Link>
              {' '}to view all your orders.
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}
