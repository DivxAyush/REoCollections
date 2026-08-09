import { cn } from '@/utils/cn'

/**
 * Max-width container with consistent horizontal padding.
 */
export default function Container({ children, className = '', as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
