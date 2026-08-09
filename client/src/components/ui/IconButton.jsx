import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const IconButton = forwardRef(function IconButton(
  {
    children,
    label,
    size = 'md',
    variant = 'ghost',
    className = '',
    badge = null,
    ...props
  },
  ref
) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  const variants = {
    ghost: 'hover:bg-[#F7F7F6] text-[#111111]',
    outline: 'border border-[#E5E5E3] hover:border-[#111111] text-[#111111]',
    filled: 'bg-[#111111] text-white hover:bg-[#333333]',
  }

  return (
    <button
      ref={ref}
      aria-label={label}
      className={cn(
        'relative inline-flex items-center justify-center rounded-full',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9AD8B] focus-visible:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
      {badge !== null && badge > 0 && (
        <span
          aria-label={`${badge} items`}
          className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#111111] text-white text-[10px] font-bold leading-none"
        >
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  )
})

export default IconButton
