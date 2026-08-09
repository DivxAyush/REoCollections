import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

/**
 * Beautiful empty state component for cart, wishlist, search results, etc.
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-8 text-center',
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F7F6]">
          <Icon className="h-8 w-8 text-[#C9AD8B]" aria-hidden="true" />
        </div>
      )}

      <h3 className="text-base font-semibold text-[#111111] sm:text-lg">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-sm text-sm text-[#5F5F5F]">{description}</p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  )
}
