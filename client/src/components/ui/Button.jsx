import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

// ============================================================
// BUTTON VARIANTS
// ============================================================

const variants = {
  primary:
    'bg-[#111111] text-white hover:bg-[#333333] active:bg-[#111111] focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2',
  secondary:
    'bg-[#C9AD8B] text-[#111111] hover:bg-[#A98C6C] active:bg-[#C9AD8B] focus-visible:ring-2 focus-visible:ring-[#C9AD8B] focus-visible:ring-offset-2',
  outline:
    'border border-[#111111] text-[#111111] bg-transparent hover:bg-[#111111] hover:text-white focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2',
  ghost:
    'text-[#111111] bg-transparent hover:bg-[#F7F7F6] focus-visible:ring-2 focus-visible:ring-[#E5E5E3] focus-visible:ring-offset-2',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-600 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2',
  lime:
    'bg-[#D9E82B] text-[#111111] hover:bg-[#c4d322] active:bg-[#D9E82B] font-semibold focus-visible:ring-2 focus-visible:ring-[#D9E82B] focus-visible:ring-offset-2',
}

const sizes = {
  xs: 'h-7 px-3 text-xs gap-1',
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-6 text-sm gap-2',
  lg: 'h-12 px-8 text-base gap-2',
  xl: 'h-14 px-10 text-base gap-2',
}

// ============================================================
// BUTTON COMPONENT
// ============================================================

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    fullWidth = false,
    leftIcon = null,
    rightIcon = null,
    className = '',
    ...props
  },
  ref
) {
  const isDisabled = disabled || isLoading

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={cn(
        // Base
        'inline-flex items-center justify-center rounded-md font-medium',
        'transition-all duration-150 ease-in-out',
        'select-none whitespace-nowrap',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        // Variant
        variants[variant] || variants.primary,
        // Size
        sizes[size] || sizes.md,
        // Full width
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  )
})

export default Button
