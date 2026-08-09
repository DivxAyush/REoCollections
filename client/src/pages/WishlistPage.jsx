import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import Container from '@/components/ui/Container'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import { useWishlist } from '@/hooks/useWishlist'

export default function WishlistPage() {
  const { count } = useWishlist()

  useEffect(() => {
    document.title = `Wishlist — REo Collection`
  }, [])

  return (
    <Container className="py-20 min-h-[60vh]">
      {count === 0 ? (
        <EmptyState
          icon={<Heart className="h-12 w-12 text-[#C9AD8B]" />}
          title="Your wishlist is empty"
          description="Save items you love and buy them later."
          action={
            <Link to="/shop">
              <Button>Explore Products</Button>
            </Link>
          }
        />
      ) : (
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-[#111111] mb-2">Your Wishlist</h2>
          <p className="text-[#5F5F5F] mb-6">You have {count} items in your wishlist.</p>
          <Link to="/account/wishlist">
            <Button>View Full Wishlist</Button>
          </Link>
        </div>
      )}
    </Container>
  )
}
