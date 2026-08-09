import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Heart, ShoppingBag, User, Home } from 'lucide-react'
import { useState } from 'react'
import { closeMobileMenu } from '@/redux/slices/uiSlice'
import { selectIsAuthenticated } from '@/redux/selectors/authSelectors'
import { NAV_ITEMS } from '@/constants/navigation'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'
import Drawer from '@/components/ui/Drawer'

function AccordionNavItem({ item, onClose }) {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const isActive = location.pathname.startsWith(item.href)

  if (!item.subCategories?.length) {
    return (
      <Link
        to={item.href}
        onClick={onClose}
        className={cn(
          'flex items-center justify-between px-5 py-3.5 text-sm font-medium',
          'border-b border-[#F7F7F6] transition-colors',
          isActive ? 'text-[#C9AD8B]' : 'text-[#111111]',
          item.highlight && 'text-[#A98C6C] font-semibold'
        )}
      >
        {item.label}
        {item.badge && (
          <span className="rounded bg-[#D9E82B] px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#111111]">
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <div className="border-b border-[#F7F7F6]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={cn(
          'flex w-full items-center justify-between px-5 py-3.5 text-sm font-medium text-left',
          'transition-colors',
          isActive ? 'text-[#C9AD8B]' : 'text-[#111111]'
        )}
      >
        {item.label}
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200 text-[#5F5F5F]',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-[#F7F7F6] pb-1">
              {item.subCategories.map((sub) => (
                <Link
                  key={sub.href}
                  to={sub.href}
                  onClick={onClose}
                  className="block px-8 py-2.5 text-sm text-[#5F5F5F] hover:text-[#111111] transition-colors"
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function MobileMenu() {
  const dispatch = useDispatch()
  const isOpen = useSelector((state) => state.ui.isMobileMenuOpen)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const cartCount = useSelector((state) => state.cart.items.reduce((s, i) => s + i.quantity, 0))
  const wishlistCount = useSelector((state) => state.wishlist.productIds.length)

  const handleClose = () => dispatch(closeMobileMenu())

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      placement="left"
      title="REo Collection"
    >
      {/* Navigation items */}
      <nav aria-label="Mobile navigation">
        {NAV_ITEMS.map((item) => (
          <AccordionNavItem key={item.href} item={item} onClose={handleClose} />
        ))}
      </nav>

      {/* Footer links */}
      <div className="mt-4 border-t border-[#E5E5E3] pt-4">
        <Link
          to={ROUTES.HOME}
          onClick={handleClose}
          className="flex items-center gap-3 px-5 py-3 text-sm text-[#5F5F5F] hover:text-[#111111]"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Home
        </Link>
        <Link
          to={isAuthenticated ? ROUTES.ACCOUNT : ROUTES.LOGIN}
          onClick={handleClose}
          className="flex items-center gap-3 px-5 py-3 text-sm text-[#5F5F5F] hover:text-[#111111]"
        >
          <User className="h-4 w-4" aria-hidden="true" />
          {isAuthenticated ? 'My Account' : 'Sign In'}
        </Link>
        <Link
          to={ROUTES.WISHLIST}
          onClick={handleClose}
          className="flex items-center gap-3 px-5 py-3 text-sm text-[#5F5F5F] hover:text-[#111111]"
        >
          <Heart className="h-4 w-4" aria-hidden="true" />
          Wishlist
          {wishlistCount > 0 && (
            <span className="ml-auto text-xs font-bold text-[#C9AD8B]">
              {wishlistCount}
            </span>
          )}
        </Link>
        <Link
          to={ROUTES.CART}
          onClick={handleClose}
          className="flex items-center gap-3 px-5 py-3 text-sm text-[#5F5F5F] hover:text-[#111111]"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Cart
          {cartCount > 0 && (
            <span className="ml-auto text-xs font-bold text-[#C9AD8B]">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </Drawer>
  )
}
