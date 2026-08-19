import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import Container from '@/components/ui/Container'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import { useWishlist } from '@/hooks/useWishlist'
import api from '@/services/apiClient'
import { API_ENDPOINTS } from '@/constants/api'
import ProductCard from '@/components/product/ProductCard'
import { PageLoader } from '@/components/ui/Loader'

export default function WishlistPage() {
  const { count, productIds } = useWishlist()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = `Wishlist — REo Collection`
  }, [])

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (productIds.length === 0) {
        setProducts([])
        return
      }
      
      setLoading(true)
      try {
        const data = await api.post(API_ENDPOINTS.PRODUCTS.BATCH, { productIds })
        if (data.success) {
          setProducts(data.products)
        }
      } catch (error) {
        console.error('Failed to fetch wishlist products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlistProducts()
  }, [productIds])

  return (
    <Container className="py-12 md:py-20 min-h-[60vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#111111]">Your Wishlist</h1>
        <p className="text-[#5F5F5F] mt-2">
          {count} {count === 1 ? 'item' : 'items'} saved for later
        </p>
      </div>

      {count === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save items you love and buy them later."
          action={
            <Link to="/shop">
              <Button>Explore Products</Button>
            </Link>
          }
        />
      ) : loading ? (
        <div className="py-20"><PageLoader /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </Container>
  )
}
