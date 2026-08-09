import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

/**
 * Full-page and inline loader components.
 */

export function PageLoader() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      role="status"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#C9AD8B]" aria-hidden="true" />
        <span className="text-sm text-[#5F5F5F]">Loading…</span>
      </div>
    </div>
  )
}

export function InlineLoader({ className = '' }) {
  return (
    <div
      className={cn('flex items-center justify-center py-12', className)}
      role="status"
      aria-label="Loading"
    >
      <Loader2 className="h-6 w-6 animate-spin text-[#C9AD8B]" aria-hidden="true" />
    </div>
  )
}

export default PageLoader
