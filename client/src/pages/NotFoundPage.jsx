import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'
import { Home } from 'lucide-react'

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page Not Found — REo Collection'
  }, [])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-['Outfit'] text-8xl font-bold text-[#E5E5E3] sm:text-9xl">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-[#111111] sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-sm text-[#5F5F5F]">
          We couldn&apos;t find the page you were looking for. It may have been moved, deleted, or never existed.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link to={ROUTES.HOME}>
            <Button leftIcon={<Home className="h-4 w-4" aria-hidden="true" />}>
              Back to Home
            </Button>
          </Link>
          <Link to={ROUTES.SHOP}>
            <Button variant="outline">Browse Shop</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
