import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { Cookie } from 'lucide-react'
import { cn } from '@/utils/cn'

const COOKIE_KEY = 'reo-cookie-consent'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [preferences, setPreferences] = useState({
    essential: true, // always true
    analytics: true,
    marketing: true
  })

  // Prevent hydration mismatch or layout shift by checking only on mount
  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY)
    if (!saved) {
      // Small delay for better UX (don't show immediately on paint)
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    } else {
      setPreferences(JSON.parse(saved))
    }
  }, [])

  const handleAcceptAll = () => {
    const prefs = { essential: true, analytics: true, marketing: true }
    localStorage.setItem(COOKIE_KEY, JSON.stringify(prefs))
    setPreferences(prefs)
    setShowBanner(false)
    setShowModal(false)
  }

  const handleRejectAll = () => {
    const prefs = { essential: true, analytics: false, marketing: false }
    localStorage.setItem(COOKIE_KEY, JSON.stringify(prefs))
    setPreferences(prefs)
    setShowBanner(false)
    setShowModal(false)
  }

  const handleSavePreferences = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(preferences))
    setShowBanner(false)
    setShowModal(false)
  }

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      <AnimatePresence>
        {showBanner && !showModal && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E5E5E3] bg-white p-4 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] md:p-6"
          >
            <div className="mx-auto max-w-7xl flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-lg font-semibold text-[#111111]">
                  <Cookie className="h-5 w-5 text-[#C9AD8B]" />
                  We value your privacy
                </div>
                <p className="max-w-3xl text-sm leading-relaxed text-[#5F5F5F]">
                  We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center whitespace-nowrap">
                <Button variant="outline" onClick={() => setShowModal(true)}>
                  Customize
                </Button>
                <Button variant="secondary" onClick={handleRejectAll}>
                  Reject All
                </Button>
                <Button variant="primary" onClick={handleAcceptAll}>
                  Accept All
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={showModal}
        onClose={() => showBanner ? setShowModal(false) : null}
        title="Cookie Preferences"
        size="lg"
        showCloseButton={!showBanner}
      >
        <div className="space-y-6">
          <p className="text-sm leading-relaxed text-[#5F5F5F]">
            When you visit any website, it may store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences or your device and is mostly used to make the site work as you expect it to.
          </p>

          <div className="space-y-4">
            {/* Essential */}
            <div className="flex items-start justify-between gap-4 rounded-lg border border-[#E5E5E3] p-4 bg-[#F7F7F6]">
              <div>
                <h4 className="font-semibold text-[#111111]">Strictly Necessary Cookies</h4>
                <p className="mt-1 text-xs leading-relaxed text-[#5F5F5F]">These cookies are necessary for the website to function and cannot be switched off in our systems.</p>
              </div>
              <div className="flex h-6 items-center flex-shrink-0">
                <span className="text-sm font-medium text-[#C9AD8B]">Always Active</span>
              </div>
            </div>

            {/* Analytics */}
            <div className="flex items-start justify-between gap-4 rounded-lg border border-[#E5E5E3] p-4 transition-colors hover:border-[#C9AD8B]">
              <div>
                <h4 className="font-semibold text-[#111111]">Performance & Analytics Cookies</h4>
                <p className="mt-1 text-xs leading-relaxed text-[#5F5F5F]">These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.</p>
              </div>
              <div className="flex h-6 items-center flex-shrink-0">
                <ToggleSwitch checked={preferences.analytics} onChange={() => handleToggle('analytics')} />
              </div>
            </div>

            {/* Marketing */}
            <div className="flex items-start justify-between gap-4 rounded-lg border border-[#E5E5E3] p-4 transition-colors hover:border-[#C9AD8B]">
              <div>
                <h4 className="font-semibold text-[#111111]">Targeting & Marketing Cookies</h4>
                <p className="mt-1 text-xs leading-relaxed text-[#5F5F5F]">These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant adverts on other sites.</p>
              </div>
              <div className="flex h-6 items-center flex-shrink-0">
                <ToggleSwitch checked={preferences.marketing} onChange={() => handleToggle('marketing')} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-[#E5E5E3]">
            <Button variant="outline" onClick={handleRejectAll}>
              Reject All
            </Button>
            <Button variant="primary" onClick={handleSavePreferences}>
              Save Preferences
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#C9AD8B] focus:ring-offset-2',
        checked ? 'bg-[#111111]' : 'bg-[#E5E5E3]'
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  )
}
