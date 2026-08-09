import { formatCurrency } from '@/utils/formatCurrency'
import { calculateDiscount } from '@/utils/calculateDiscount'
import { cn } from '@/utils/cn'

/**
 * Displays current price, optional original price, and discount badge.
 */
export default function PriceDisplay({
  price,
  compareAtPrice,
  size = 'md',
  className = '',
  showDiscountBadge = true,
}) {
  const discount = compareAtPrice ? calculateDiscount(compareAtPrice, price) : 0
  const hasDiscount = discount > 0

  const sizes = {
    sm: { price: 'text-sm font-semibold', compare: 'text-xs', badge: 'text-[10px]' },
    md: { price: 'text-base font-semibold', compare: 'text-sm', badge: 'text-xs' },
    lg: { price: 'text-xl font-bold', compare: 'text-base', badge: 'text-sm' },
    xl: { price: 'text-2xl font-bold', compare: 'text-lg', badge: 'text-sm' },
  }

  const s = sizes[size] || sizes.md

  return (
    <div className={cn('flex items-center flex-wrap gap-1.5', className)}>
      <span className={cn('text-[#111111]', s.price)}>
        {formatCurrency(price)}
      </span>

      {hasDiscount && compareAtPrice && (
        <>
          <span className={cn('text-[#5F5F5F] line-through', s.compare)}>
            {formatCurrency(compareAtPrice)}
          </span>
          {showDiscountBadge && (
            <span
              className={cn(
                'rounded bg-[#D9E82B] px-1.5 py-0.5 font-semibold text-[#111111]',
                s.badge
              )}
            >
              {discount}% off
            </span>
          )}
        </>
      )}
    </div>
  )
}
