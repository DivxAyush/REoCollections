import { useEffect } from 'react'
import EmptyState from '@/components/ui/EmptyState'
import { Package } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export default function OrdersPage() {
  useEffect(() => { document.title = 'My Orders — REo Collection' }, [])
  return (
    <div>
      <h2 className="text-xl font-semibold text-[#111111]">My Orders</h2>
      <div className="mt-6">
        <EmptyState icon={Package} title="No orders yet" description="Your order history will appear here." action={<Link to={ROUTES.SHOP}><Button>Start Shopping</Button></Link>} />
      </div>
    </div>
  )
}
