import { forwardRef } from 'react'
import { ChevronDown, AlertCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

const Select = forwardRef(function Select(
  {
    label,
    error,
    helperText,
    options = [],
    placeholder = 'Select an option',
    id,
    required = false,
    disabled = false,
    className = '',
    wrapperClassName = '',
    ...props
  },
  ref
) {
  return (
    <div className={cn('flex flex-col gap-1', wrapperClassName)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#111111]">
          {label}
          {required && (
            <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>
          )}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          className={cn(
            'w-full appearance-none rounded-md border bg-white px-3 py-2.5 pr-9 text-sm text-[#111111]',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-[#C9AD8B] focus:border-transparent',
            'disabled:cursor-not-allowed disabled:bg-[#F7F7F6] disabled:opacity-60',
            error
              ? 'border-red-400 focus:ring-red-400'
              : 'border-[#E5E5E3] hover:border-[#111111]',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F5F5F]"
          aria-hidden="true"
        />
      </div>

      {error && (
        <p role="alert" className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-xs text-[#5F5F5F]">{helperText}</p>
      )}
    </div>
  )
})

export default Select
