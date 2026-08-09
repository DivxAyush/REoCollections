import { cn } from '@/utils/cn'
import ProductCardSkeleton from './ProductCardSkeleton'

export default function ProductGridSkeleton({ count = 8, columns = 'default', className = '' }) {
  const colClasses = {
    default: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    four: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  }

  return (
    <div
      aria-label="Loading products"
      aria-busy="true"
      className={cn(
        'grid gap-x-4 gap-y-6 sm:gap-x-5 sm:gap-y-8',
        colClasses[columns] || colClasses.default,
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
