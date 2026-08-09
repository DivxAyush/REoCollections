import { cn } from '@/utils/cn'

/**
 * Base skeleton block with shimmer animation.
 * Use this to build layout-specific skeletons.
 */
export default function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={cn('skeleton-shimmer rounded', className)}
      aria-hidden="true"
      {...props}
    />
  )
}

/**
 * Text skeleton — simulates a line of text.
 */
export function SkeletonText({ lines = 1, className = '' }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4 rounded', i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  )
}
