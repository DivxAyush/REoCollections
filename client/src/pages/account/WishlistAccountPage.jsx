import { useEffect, useState } from 'react'
import EmptyState from '@/components/ui/EmptyState'
import { Heart } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useWishlist } from '@/hooks/useWishlist'
import api from '@/services/apiClient'
import { API_ENDPOINTS } from '@/constants/api'
import ProductCard from '@/components/product/ProductCard'
import { PageLoader } from '@/components/ui/Loader'

export default function WishlistAccountPage() {
  const { count, productIds } = useWishlist()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = 'Wishlist — REo Collection'
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
    <div>
      <h2 className="text-xl font-semibold text-[#111111]">My Wishlist</h2>
      {count === 0 ? (
        <div className="mt-6">
          <EmptyState icon={Heart} title="Wishlist is empty" description="Save items you love to your wishlist." action={<Link to={ROUTES.SHOP}><Button>Browse Products</Button></Link>} />
        </div>
      ) : loading ? (
        <div className="py-20"><PageLoader /></div>
      ) : (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
