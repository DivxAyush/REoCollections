import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

// ============================================================
// DRAWER COMPONENT
// Supports: left | right | bottom placement
// ============================================================

const placements = {
  left: {
    wrapper: 'left-0 top-0 bottom-0',
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
    width: 'w-full max-w-sm',
  },
  right: {
    wrapper: 'right-0 top-0 bottom-0',
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    width: 'w-full max-w-sm',
  },
  bottom: {
    wrapper: 'bottom-0 left-0 right-0',
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    width: 'w-full',
  },
}

export default function Drawer({
  isOpen,
  onClose,
  placement = 'right',
  title,
  children,
  showCloseButton = true,
  className = '',
}) {
  const config = placements[placement] || placements.right

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleKeyDown])

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50"
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            initial={config.initial}
            animate={config.animate}
            exit={config.exit}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className={cn(
              'fixed z-50 flex flex-col bg-white shadow-xl',
              config.wrapper,
              config.width,
              placement === 'bottom' && 'max-h-[85vh] rounded-t-2xl',
              placement !== 'bottom' && 'h-full',
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between border-b border-[#E5E5E3] px-5 py-4 flex-shrink-0">
                {title && (
                  <h2 className="text-base font-semibold text-[#111111]">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className={cn(
                      'rounded-full p-1.5 text-[#5F5F5F] hover:text-[#111111]',
                      'hover:bg-[#F7F7F6] transition-colors',
                      !title && 'ml-auto'
                    )}
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                )}
              </div>
            )}

            {/* Content — scrollable */}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
