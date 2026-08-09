import Skeleton from '@/components/ui/Skeleton'
import { cn } from '@/utils/cn'

export default function BannerSkeleton({ type = 'hero', className = '' }) {
  const isHero = type === 'hero'

  return (
    <div
      className={cn(
        'w-full bg-[#E5E5E3]',
        isHero ? 'h-[60vh] md:h-[80vh]' : 'aspect-[21/9] rounded-xl',
        className
      )}
      aria-hidden="true"
    >
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
        {isHero && (
          <>
            <Skeleton className="mb-6 h-6 w-32 bg-white/20" />
            <Skeleton className="mb-4 h-12 w-3/4 max-w-2xl bg-white/20" />
            <Skeleton className="h-12 w-2/4 max-w-lg bg-white/20" />
            <Skeleton className="mt-10 h-14 w-40 bg-white/20" />
          </>
        )}
      </div>
    </div>
  )
}
