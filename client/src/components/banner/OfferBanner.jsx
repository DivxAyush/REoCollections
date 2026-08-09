import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export default function OfferBanner({ banner, className = '' }) {
  if (!banner) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className={cn('relative w-full overflow-hidden rounded-xl bg-[#F7F7F6]', className)}
      style={{ aspectRatio: '21/9' }}
    >
      <img
        src={banner.desktopImage?.url}
        alt={banner.title || 'Offer Banner'}
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent p-8 sm:p-12 md:p-16 flex flex-col justify-center">
        <div className="max-w-md">
          {banner.subtitle && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#C9AD8B]">
              {banner.subtitle}
            </p>
          )}

          <h3 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            {banner.title}
          </h3>

          {banner.buttonText && banner.redirectUrl && (
            <Link
              to={banner.redirectUrl}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-[#111111] px-6 text-sm font-medium text-white transition-colors hover:bg-[#333333]"
            >
              {banner.buttonText}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
