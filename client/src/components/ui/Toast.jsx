import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { removeToast } from '@/redux/slices/uiSlice'
import { cn } from '@/utils/cn'

// ============================================================
// INDIVIDUAL TOAST
// ============================================================

const typeConfig = {
  success: {
    icon: CheckCircle,
    className: 'bg-white border-l-4 border-green-500',
    iconClass: 'text-green-500',
  },
  error: {
    icon: AlertCircle,
    className: 'bg-white border-l-4 border-red-500',
    iconClass: 'text-red-500',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-white border-l-4 border-yellow-400',
    iconClass: 'text-yellow-500',
  },
  info: {
    icon: Info,
    className: 'bg-white border-l-4 border-blue-500',
    iconClass: 'text-blue-500',
  },
}

function ToastItem({ toast }) {
  const dispatch = useDispatch()
  const config = typeConfig[toast.type] || typeConfig.info
  const Icon = config.icon

  const dismiss = useCallback(() => {
    dispatch(removeToast(toast.id))
  }, [dispatch, toast.id])

  // Auto-dismiss
  useEffect(() => {
    const timer = setTimeout(dismiss, toast.duration || 3000)
    return () => clearTimeout(timer)
  }, [dismiss, toast.duration])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      className={cn(
        'flex items-start gap-3 rounded-lg px-4 py-3 shadow-lg',
        'w-full max-w-sm pointer-events-auto',
        config.className
      )}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', config.iconClass)} aria-hidden="true" />
      <p className="flex-1 text-sm text-[#111111]">{toast.message}</p>
      <button
        onClick={dismiss}
        aria-label="Dismiss notification"
        className="flex-shrink-0 text-[#5F5F5F] hover:text-[#111111] transition-colors"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </motion.div>
  )
}

// ============================================================
// TOAST CONTAINER
// ============================================================

export default function ToastContainer() {
  const toasts = useSelector((state) => state.ui.toasts)

  return createPortal(
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  )
}
