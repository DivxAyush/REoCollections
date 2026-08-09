import { useEffect } from 'react'
import Container from '@/components/ui/Container'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWishlist } from '@/hooks/useWishlist'
import { ROUTES } from '@/constants/routes'

export default function WishlistPage() {
  const { count } = useWishlist()

  useEffect(() => {
    document.title = `Wishlist — REo Collection`
  }, [])

  if (count === 0) {
    return (
      <Container className="py-16">
      <Container className="py-20">
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
      </Container>
    )
  }

  return (
    <div className="bg-[#F7F7F6] py-10 min-h-screen">
      <Container>
        <SectionHeading 
          title="Your Wishlist" 
          subtitle={`${products.length} item${products.length !== 1 ? 's' : ''} saved`}
          className="mb-8" 
        />
        
        <ProductGrid products={products} columns="four" />
      </Container>
    </div>
  )
}
