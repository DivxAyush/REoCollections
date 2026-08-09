import { forwardRef, useState } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

// ============================================================
// INPUT COMPONENT
// ============================================================

const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    prefixIcon: PrefixIcon,
    suffixIcon: SuffixIcon,
    type = 'text',
    id,
    required = false,
    disabled = false,
    className = '',
    wrapperClassName = '',
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={cn('flex flex-col gap-1', wrapperClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-[#111111]"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        {PrefixIcon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5F5F5F]">
            <PrefixIcon className="h-4 w-4" aria-hidden="true" />
          </div>
        )}

        <input
          ref={ref}
          id={id}
          type={inputType}
          disabled={disabled}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          aria-invalid={error ? 'true' : 'false'}
          className={cn(
            'w-full rounded-md border bg-white px-3 py-2.5 text-sm text-[#111111]',
            'placeholder:text-[#5F5F5F] placeholder:text-sm',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-[#C9AD8B] focus:border-transparent',
            'disabled:cursor-not-allowed disabled:bg-[#F7F7F6] disabled:opacity-60',
            error
              ? 'border-red-400 focus:ring-red-400'
              : 'border-[#E5E5E3] hover:border-[#111111]',
            PrefixIcon && 'pl-9',
            (SuffixIcon || isPassword) && 'pr-9',
            className
          )}
          {...props}
        />

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F5F5F] hover:text-[#111111] transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}

        {/* Suffix icon (not for password fields) */}
        {SuffixIcon && !isPassword && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#5F5F5F]">
            <SuffixIcon className="h-4 w-4" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-center gap-1 text-xs text-red-500"
        >
          <AlertCircle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p id={`${id}-helper`} className="text-xs text-[#5F5F5F]">
          {helperText}
        </p>
      )}
    </div>
  )
})

export default Input
