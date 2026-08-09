import { Star } from 'lucide-react'
import { cn } from '@/utils/cn'

/**
 * Star rating display component.
 * Read-only by default.
 */
export default function Rating({
  value = 0,
  max = 5,
  count,
  size = 'sm',
  showCount = true,
  className = '',
}) {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
  }

  const starSize = sizes[size] || sizes.sm

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role="img"
      aria-label={`Rating: ${value} out of ${max} stars${count ? `, ${count} reviews` : ''}`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i + 1 <= Math.round(value)
          return (
            <Star
              key={i}
              className={cn(
                starSize,
                filled
                  ? 'fill-[#C9AD8B] text-[#C9AD8B]'
                  : 'fill-none text-[#E5E5E3]'
              )}
              aria-hidden="true"
            />
          )
        })}
      </div>

      {showCount && count !== undefined && (
        <span className="text-xs text-[#5F5F5F]">({count})</span>
      )}
    </div>
  )
}
