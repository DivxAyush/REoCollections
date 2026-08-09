import { cn } from '@/utils/cn'

const variants = {
  default: 'bg-[#F7F7F6] text-[#111111]',
  new: 'bg-[#111111] text-white',
  sale: 'bg-[#D9E82B] text-[#111111]',
  bestseller: 'bg-[#C9AD8B] text-white',
  outofstock: 'bg-[#E5E5E3] text-[#5F5F5F]',
  featured: 'bg-[#111111] text-white',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-1.5 py-0.5',
        'text-[10px] font-semibold uppercase tracking-wider leading-none',
        variants[variant] || variants.default,
        className
      )}
    >
      {children}
    </span>
  )
}
