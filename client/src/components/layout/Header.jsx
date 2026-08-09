import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react'
import { useSelector } from 'react-redux'
import Container from '@/components/ui/Container'
import IconButton from '@/components/ui/IconButton'
import { selectCartCount } from '@/redux/selectors/cartSelectors'
import { selectIsAuthenticated } from '@/redux/selectors/authSelectors'
import { useDispatch } from 'react-redux'
import { openMobileMenu, openSearch } from '@/redux/slices/uiSlice'
import { NAV_ITEMS } from '@/constants/navigation'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'
import MobileMenu from './MobileMenu'
import SearchOverlay from './SearchBar'

// ============================================================
// DESKTOP NAV ITEM WITH DROPDOWN
// ============================================================

function NavItem({ item }) {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef(null)
  const location = useLocation()

  const isActive = location.pathname.startsWith(item.href)

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150)
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={item.href}
        className={cn(
          'flex items-center gap-0.5 py-1 text-sm font-medium transition-colors',
          'hover:text-[#C9AD8B]',
          isActive ? 'text-[#C9AD8B]' : 'text-[#111111]',
          item.highlight && 'text-[#A98C6C] font-semibold'
        )}
        aria-expanded={item.subCategories?.length > 0 ? isOpen : undefined}
      >
        {item.label}
        {item.subCategories?.length > 0 && (
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
            aria-hidden="true"
          />
        )}
      </Link>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && item.subCategories?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 min-w-[180px] rounded-lg border border-[#E5E5E3] bg-white py-1.5 shadow-lg"
          >
            {item.subCategories.map((sub) => (
              <Link
                key={sub.href}
                to={sub.href}
                className="block px-4 py-2 text-sm text-[#5F5F5F] hover:text-[#111111] hover:bg-[#F7F7F6] transition-colors"
              >
                {sub.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// MAIN HEADER
// ============================================================

export default function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const cartCount = useSelector(selectCartCount)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const wishlistCount = useSelector((state) => state.wishlist.productIds.length)
  const isMobileMenuOpen = useSelector((state) => state.ui.isMobileMenuOpen)
  const isSearchOpen = useSelector((state) => state.ui.isSearchOpen)

  const [scrolled, setScrolled] = useState(false)

  // Track scroll for header shadow/bg change
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleAccountClick = () => {
    navigate(isAuthenticated ? ROUTES.ACCOUNT : ROUTES.LOGIN)
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-30 bg-white transition-shadow duration-200',
          scrolled && 'shadow-sm'
        )}
        role="banner"
      >
        {/* Announcement Bar */}
        <div className="hidden sm:flex items-center justify-center bg-[#111111] px-4 py-1.5 text-center">
          <p className="text-xs text-white tracking-wide">
            Free delivery on orders above ₹999 &nbsp;·&nbsp; Easy 30-day returns
          </p>
        </div>

        <Container>
          {/* Main header row */}
          <div className="flex h-14 items-center gap-3 lg:h-16">

            {/* Mobile: Hamburger */}
            <div className="flex lg:hidden">
              <IconButton
                label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => dispatch(openMobileMenu())}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </IconButton>
            </div>

            {/* Logo */}
            <Link
              to={ROUTES.HOME}
              className="flex-shrink-0 flex items-center"
              aria-label="REo Collection — Home"
            >
              <span className="font-['Outfit'] text-lg font-bold tracking-tight text-[#111111] lg:text-xl">
                REo<span className="text-[#C9AD8B]">.</span>
              </span>
            </Link>

            {/* Desktop Category Navigation */}
            <nav
              className="hidden lg:flex items-center gap-6 ml-8"
              aria-label="Main navigation"
            >
              {NAV_ITEMS.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </nav>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Desktop Search Bar (inline) */}
            <div className="hidden lg:flex items-center w-64 xl:w-80">
              <button
                onClick={() => dispatch(openSearch())}
                aria-label="Open search"
                className={cn(
                  'flex w-full items-center gap-2 rounded-full border border-[#E5E5E3]',
                  'bg-[#F7F7F6] px-4 py-2 text-sm text-[#5F5F5F]',
                  'hover:border-[#C9AD8B] transition-colors'
                )}
              >
                <Search className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span>Search for products…</span>
              </button>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              {/* Mobile Search */}
              <div className="lg:hidden">
                <IconButton
                  label="Search"
                  onClick={() => dispatch(openSearch())}
                >
                  <Search className="h-5 w-5" aria-hidden="true" />
                </IconButton>
              </div>

              {/* Wishlist */}
              <Link to={ROUTES.WISHLIST} aria-label={`Wishlist, ${wishlistCount} items`}>
                <IconButton label="Wishlist" badge={wishlistCount}>
                  <Heart className="h-5 w-5" aria-hidden="true" />
                </IconButton>
              </Link>

              {/* Account */}
              <IconButton label="Account" onClick={handleAccountClick}>
                <User className="h-5 w-5" aria-hidden="true" />
              </IconButton>

              {/* Cart */}
              <Link to={ROUTES.CART} aria-label={`Shopping cart, ${cartCount} items`}>
                <IconButton label="Cart" badge={cartCount}>
                  <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                </IconButton>
              </Link>
            </div>
          </div>
        </Container>
      </header>

      {/* Spacer to prevent content going under fixed header */}
      <div className="h-14 lg:h-[104px]" aria-hidden="true" />

      {/* Mobile Menu Drawer */}
      <MobileMenu />

      {/* Search Overlay */}
      <SearchOverlay />
    </>
  )
}
