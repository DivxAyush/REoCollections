import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

/**
 * Consistent section title + optional subtitle with reveal animation.
 */
export default function SectionHeading({
  title,
  subtitle,
  align = 'left',
  action = null,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className={cn(
        'flex items-end justify-between gap-4',
        align === 'center' && 'flex-col items-center text-center',
        className
      )}
    >
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-[#111111] sm:text-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-[#5F5F5F]">{subtitle}</p>
        )}
      </div>

      {action && align !== 'center' && (
        <div className="flex-shrink-0">{action}</div>
      )}
    </motion.div>
  )
}
