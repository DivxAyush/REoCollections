import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight } from 'lucide-react'
import { closeSearch } from '@/redux/slices/uiSlice'
import { useDebounce } from '@/hooks/useDebounce'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'

// Popular search suggestions
const POPULAR_SEARCHES = [
  'Oversized T-Shirts',
  'Graphic Tees',
  'Polo Shirts',
  'Casual Shirts',
  'Women Dresses',
  'New Arrivals',
]

export default function SearchOverlay() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isOpen = useSelector((state) => state.ui.isSearchOpen)

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const inputRef = useRef(null)

  // Auto-focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
    }
  }, [isOpen])

  const handleClose = () => dispatch(closeSearch())

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(trimmed)}`)
      handleClose()
    }
  }

  const handleSuggestionClick = (term) => {
    navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(term)}`)
    handleClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/40"
            aria-hidden="true"
          />

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 bg-white shadow-xl"
          >
            <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
              {/* Search form */}
              <form onSubmit={handleSubmit} className="flex items-center gap-3" role="search">
                <Search className="h-5 w-5 flex-shrink-0 text-[#5F5F5F]" aria-hidden="true" />

                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for products, brands, categories…"
                  aria-label="Search"
                  className={cn(
                    'flex-1 bg-transparent text-base text-[#111111] placeholder:text-[#5F5F5F]',
                    'focus:outline-none'
                  )}
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className="text-[#5F5F5F] hover:text-[#111111] transition-colors"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close search"
                  className="ml-2 text-sm text-[#5F5F5F] hover:text-[#111111] transition-colors"
                >
                  Cancel
                </button>
              </form>

              {/* Suggestions */}
              <div className="mt-5 pb-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#5F5F5F]">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSuggestionClick(term)}
                      className={cn(
                        'flex items-center gap-1 rounded-full border border-[#E5E5E3]',
                        'px-3 py-1.5 text-sm text-[#5F5F5F]',
                        'hover:border-[#111111] hover:text-[#111111] transition-colors'
                      )}
                    >
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
