import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { cn } from '@/utils/cn'
import { buildRoute, ROUTES } from '@/constants/routes'
import { useWishlist } from '@/hooks/useWishlist'
import { useCart } from '@/hooks/useCart'
import Badge from '@/components/ui/Badge'
import PriceDisplay from '@/components/ui/PriceDisplay'
import Rating from '@/components/ui/Rating'

// ============================================================
// PRODUCT CARD
// ============================================================

export default function ProductCard({ product, className = '' }) {
  const { isWishlisted, toggle: toggleWishlist } = useWishlist()
  const { add: addToCart } = useCart()

  const [hovered, setHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [sparking, setSparking] = useState(false)

  const wishlisted = isWishlisted(product._id)

  // Swap image on hover if multiple images exist
  const primaryImage = product.images?.[0]?.url || product.image || ''
  const hoverImage = product.images?.[1]?.url || primaryImage

  const handleWishlistToggle = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      
      if (!wishlisted) {
        setSparking(true)
        setTimeout(() => setSparking(false), 800)
      }
      
      toggleWishlist(product._id)
    },
    [product._id, toggleWishlist, wishlisted]
  )

  const handleQuickAdd = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      addToCart(product, null, 1)
    },
    [addToCart, product]
  )

  const productUrl = buildRoute(ROUTES.PRODUCT, { slug: product.slug })

  // Determine badge
  const badge = product.newArrival
    ? { label: 'New', variant: 'new' }
    : product.bestSeller
    ? { label: 'Best Seller', variant: 'bestseller' }
    : product.discount > 0
    ? { label: `${product.discount}% off`, variant: 'sale' }
    : null

  const isOutOfStock = product.stock === 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35 }}
      className={cn('group relative flex flex-col', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        to={productUrl}
        className="flex flex-col h-full"
        aria-label={`View ${product.name}`}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-lg bg-[#F7F7F6] aspect-[3/4]">
          {/* Product Image */}
          <img
            src={imageError ? '/placeholder-product.jpg' : (hovered && hoverImage !== primaryImage ? hoverImage : primaryImage)}
            alt={product.name}
            className={cn(
              'h-full w-full object-cover object-top transition-transform duration-500',
              hovered && !isOutOfStock && 'scale-105'
            )}
            onError={() => setImageError(true)}
            loading="lazy"
          />

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5F5F5F]">
                Out of Stock
              </span>
            </div>
          )}

          {/* Badge */}
          {badge && (
            <div className="absolute top-2 left-2">
              <Badge variant={badge.variant}>{badge.label}</Badge>
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlistToggle}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={wishlisted}
            className={cn(
              'absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full',
              'bg-white shadow-sm transition-all duration-150',
              'opacity-0 group-hover:opacity-100 focus:opacity-100',
              'hover:scale-110 active:scale-95',
              wishlisted && 'opacity-100'
            )}
          >
            <AnimatePresence>
              {sparking && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-red-500 rounded-full"
                      initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                      animate={{
                        scale: [0, 1.2, 0],
                        x: Math.cos((i * 60 * Math.PI) / 180) * 24,
                        y: Math.sin((i * 60 * Math.PI) / 180) * 24,
                        opacity: [1, 1, 0]
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
            <Heart
              className={cn(
                'h-4 w-4 transition-colors z-10',
                wishlisted
                  ? 'fill-red-500 text-red-500'
                  : 'fill-none text-[#111111]'
              )}
              aria-hidden="true"
            />
          </button>

          {/* Quick add button — appears on hover */}
          {!isOutOfStock && (
            <motion.button
              initial={{ y: 16, opacity: 0 }}
              animate={hovered ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleQuickAdd}
              aria-label={`Quick add ${product.name} to cart`}
              className={cn(
                'absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2',
                'bg-[#111111] py-2.5 text-xs font-semibold uppercase tracking-wide text-white',
                'hover:bg-[#333333] transition-colors'
              )}
            >
              <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
              Quick Add
            </motion.button>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-3 flex flex-col gap-1 flex-1">
          {/* Name */}
          <h3 className="line-clamp-2 text-sm font-medium text-[#111111] leading-snug">
            {product.name}
          </h3>

          {/* Color */}
          {product.colors?.length > 0 && (
            <p className="text-xs text-[#5F5F5F]">
              {product.colors.join(' / ')}
            </p>
          )}

          {/* Rating */}
          {product.rating > 0 && (
            <Rating
              value={product.rating}
              count={product.reviewCount}
              size="xs"
            />
          )}

          {/* Price */}
          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            size="sm"
            className="mt-0.5"
          />
        </div>
      </Link>
    </motion.article>
  )
}
