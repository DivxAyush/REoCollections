import { useEffect } from 'react'
import EmptyState from '@/components/ui/EmptyState'
import { Heart } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useWishlist } from '@/hooks/useWishlist'

export default function WishlistAccountPage() {
  const { count } = useWishlist()
  useEffect(() => { document.title = 'Wishlist — REo Collection' }, [])
  return (
    <div>
      <h2 className="text-xl font-semibold text-[#111111]">My Wishlist</h2>
      {count === 0 ? (
        <div className="mt-6">
          <EmptyState icon={Heart} title="Wishlist is empty" description="Save items you love to your wishlist." action={<Link to={ROUTES.SHOP}><Button>Browse Products</Button></Link>} />
        </div>
      ) : (
        <p className="mt-4 text-sm text-[#5F5F5F]">{count} saved items — full UI coming in Phase 4.</p>
      )}
    </div>
  )
}
