import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductBySlug } from '@/redux/slices/productSlice'
import { addToCart } from '@/redux/slices/cartSlice'
import { toggleWishlistItem } from '@/redux/slices/wishlistSlice'
import Container from '@/components/ui/Container'
import { PageLoader } from '@/components/ui/Loader'
import Button from '@/components/ui/Button'
import PriceDisplay from '@/components/ui/PriceDisplay'
import Rating from '@/components/ui/Rating'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { Heart, ShoppingBag, Truck, RefreshCw, ShieldCheck } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const { currentProduct: product, isLoading } = useSelector((state) => state.product)
  const { products: wishlistItems } = useSelector((state) => state.wishlist)
  const isWishlisted = wishlistItems?.some(p => p._id === product?._id)

  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug))
    }
  }, [dispatch, slug])

  useEffect(() => {
    if (product) {
      document.title = `${product.name} — REo Collection`
      if (product.colors?.length > 0) setSelectedColor(product.colors[0])
      if (product.sizes?.length > 0) setSelectedSize(product.sizes[0])
    }
  }, [product])

  const handleAddToCart = () => {
    if (!product) return
    dispatch(addToCart({
      product,
      variant: { color: selectedColor, size: selectedSize },
      quantity
    }))
  }

  const handleWishlist = () => {
    if (!product) return
    dispatch(toggleWishlistItem(product._id))
  }

  if (isLoading || !product) return <PageLoader />

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    ...(product.category ? [{ label: product.category.name, href: `/shop/${product.category.slug}` }] : []),
    { label: product.name }
  ]

  return (
    <div className="bg-white pb-16 pt-8">
      <Container>
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Product Image */}
          <div className="flex flex-col gap-4">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#F7F7F6]">
              {product.images?.[0] ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#5F5F5F]">No Image Available</div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-[#111111] sm:text-4xl">{product.name}</h1>
            
            <div className="mt-4 flex items-center gap-4">
              <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} className="text-2xl" />
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Rating value={product.rating || 0} readonly />
              <span className="text-sm text-[#5F5F5F]">({product.reviewCount || 0} reviews)</span>
            </div>

            <p className="mt-6 text-base text-[#5F5F5F] leading-relaxed">
              {product.description || 'Premium quality apparel designed for comfort and style. Ethically sourced and crafted to perfection.'}
            </p>

            <div className="my-8 h-px w-full bg-[#E5E5E3]" />

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-bold text-[#111111] uppercase tracking-wider">
                  Color: <span className="font-normal text-[#5F5F5F]">{selectedColor}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "h-10 px-4 rounded-md border text-sm font-medium transition-colors",
                        selectedColor === color
                          ? "border-[#111111] bg-[#111111] text-white"
                          : "border-[#E5E5E3] bg-white text-[#111111] hover:border-[#111111]"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-8">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">
                    Size: <span className="font-normal text-[#5F5F5F]">{selectedSize}</span>
                  </h3>
                  <button className="text-sm text-[#C9AD8B] underline underline-offset-4 hover:text-[#111111]">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "flex h-12 items-center justify-center rounded-md border text-sm font-medium transition-colors",
                        selectedSize === size
                          ? "border-[#111111] bg-[#111111] text-white"
                          : "border-[#E5E5E3] bg-white text-[#111111] hover:border-[#111111]"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex h-14 items-center justify-between rounded-md border border-[#E5E5E3] bg-white px-4 sm:w-32">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="text-2xl font-light text-[#5F5F5F] hover:text-[#111111]"
                >−</button>
                <span className="text-base font-semibold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="text-2xl font-light text-[#5F5F5F] hover:text-[#111111]"
                >+</button>
              </div>

              <Button 
                className="h-14 flex-1 text-base uppercase tracking-wider" 
                onClick={handleAddToCart}
                leftIcon={<ShoppingBag className="h-5 w-5" />}
              >
                Add to Cart
              </Button>

              <Button
                variant="outline"
                className={cn(
                  "h-14 w-full sm:w-14 px-0", 
                  isWishlisted && "border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                )}
                onClick={handleWishlist}
              >
                <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
              </Button>
            </div>

            {/* Features */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F7F6]">
                  <Truck className="h-5 w-5 text-[#111111]" />
                </div>
                <span className="text-sm font-medium text-[#111111]">Free Shipping</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F7F6]">
                  <RefreshCw className="h-5 w-5 text-[#111111]" />
                </div>
                <span className="text-sm font-medium text-[#111111]">30-Day Returns</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F7F6]">
                  <ShieldCheck className="h-5 w-5 text-[#111111]" />
                </div>
                <span className="text-sm font-medium text-[#111111]">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
