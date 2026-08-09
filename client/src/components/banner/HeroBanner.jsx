import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export default function HeroBanner({ banner, className = '' }) {
  if (!banner) return null

  return (
    <div
      className={cn('relative w-full overflow-hidden bg-[#111111]', className)}
      style={{ aspectRatio: '16/9', maxHeight: '80vh' }}
    >
      {/* Background Image */}
      <motion.img
        initial={{ scale: 1.05, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        src={banner.desktopImage?.url}
        alt={banner.title || 'Hero Banner'}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          {banner.subtitle && (
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/90 md:text-base">
              {banner.subtitle}
            </p>
          )}

          <h2 className="font-['Outfit'] text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {banner.title}
          </h2>

          {banner.buttonText && banner.redirectUrl && (
            <div className="mt-8">
              <Link
                to={banner.redirectUrl}
                className="inline-flex h-12 items-center justify-center bg-white px-8 text-sm font-semibold text-[#111111] transition-colors hover:bg-[#F7F7F6] sm:h-14 sm:px-10 sm:text-base"
              >
                {banner.buttonText}
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
