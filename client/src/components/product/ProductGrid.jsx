import { cn } from '@/utils/cn'
import ProductCard from './ProductCard'

/**
 * Responsive product grid wrapper.
 * cols: number of columns on different breakpoints (auto-configured by default)
 */
export default function ProductGrid({
  products = [],
  columns = 'default',
  className = '',
}) {
  const colClasses = {
    default: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    two: 'grid-cols-2',
    three: 'grid-cols-2 sm:grid-cols-3',
    four: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    five: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  }

  return (
    <div
      className={cn(
        'grid gap-x-4 gap-y-6 sm:gap-x-5 sm:gap-y-8',
        colClasses[columns] || colClasses.default,
        className
      )}
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}
