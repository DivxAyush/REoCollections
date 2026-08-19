import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react'
import Container from '@/components/ui/Container'
import { cn } from '@/utils/cn'

// ============================================================
// FOOTER LINK SECTIONS CONFIG
// ============================================================

const footerSections = [
  {
    title: 'Shopping',
    links: [

      { label: 'Men', href: '/shop/men' },
      { label: 'Footwear', href: '/shop/footwear' },
      { label: 'Accessories', href: '/shop/accessories' },
      { label: 'New Arrivals', href: '/shop/new-arrivals' },
      { label: 'Offers', href: '/shop/offers' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'My Account', href: '/account' },
      { label: 'Track Order', href: '/track-order' },
      { label: 'Size Guide', href: '/help/size-guide' },
      { label: 'FAQ', href: '/help/faq' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Shipping Policy', href: '/shipping' },
      { label: 'Return Policy', href: '/returns' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  },
]

const socialLinks = [
  { label: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { label: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
  { label: 'Twitter / X', icon: Twitter, href: 'https://twitter.com' },
  { label: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
]

// ============================================================
// ACCORDION SECTION (Mobile)
// ============================================================

function FooterAccordion({ section }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-[#E5E5E3]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-4 text-sm font-semibold text-[#111111]"
      >
        {section.title}
        <ChevronDown
          className={cn(
            'h-4 w-4 text-[#5F5F5F] transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {section.links.map((link) => (
              <li key={link.href} className="pb-3">
                <Link
                  to={link.href}
                  className="text-sm text-[#5F5F5F] hover:text-[#111111] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// NEWSLETTER FORM
// ============================================================

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#111111]">
        Stay in the loop
      </h3>
      <p className="mt-1 text-sm text-[#5F5F5F]">
        Get new arrivals, exclusive offers, and style inspiration delivered to your inbox.
      </p>

      {submitted ? (
        <p className="mt-4 text-sm font-medium text-[#C9AD8B]">
          Thank you for subscribing!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            aria-label="Email for newsletter"
            className={cn(
              'flex-1 min-w-0 rounded-md border border-[#E5E5E3] bg-white px-3 py-2 text-sm',
              'text-[#111111] placeholder:text-[#5F5F5F]',
              'focus:outline-none focus:ring-2 focus:ring-[#C9AD8B] focus:border-transparent'
            )}
          />
          <button
            type="submit"
            className="rounded-md bg-[#111111] px-4 py-2 text-sm font-medium text-white hover:bg-[#333333] transition-colors whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  )
}

// ============================================================
// MAIN FOOTER
// ============================================================

export default function Footer() {
  return (
    <footer className="border-t border-[#E5E5E3] bg-[#F7F7F6]" role="contentinfo">
      <Container className="py-12 lg:py-16">

        {/* Desktop grid */}
        <div className="hidden lg:grid lg:grid-cols-5 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2">
            <Link to="/" aria-label="REo Collection — Home">
              <span className="font-['Outfit'] text-2xl font-bold tracking-tight text-[#111111]">
                REo<span className="text-[#C9AD8B]">.</span>
              </span>
            </Link>

            <p className="mt-3 text-sm leading-relaxed text-[#5F5F5F]">
              Premium Indian fashion for men. Curated styles, quality fabrics, and an unmatched shopping experience.
            </p>

            {/* Contact */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#5F5F5F]">
                <MapPin className="h-4 w-4 flex-shrink-0 text-[#C9AD8B]" aria-hidden="true" />
                Mumbai, Maharashtra, India
              </div>
              <div className="flex items-center gap-2 text-sm text-[#5F5F5F]">
                <Phone className="h-4 w-4 flex-shrink-0 text-[#C9AD8B]" aria-hidden="true" />
                +91 98765 43210
              </div>
              <div className="flex items-center gap-2 text-sm text-[#5F5F5F]">
                <Mail className="h-4 w-4 flex-shrink-0 text-[#C9AD8B]" aria-hidden="true" />
                hello@reocollection.in
              </div>
            </div>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E5E3] text-[#5F5F5F] hover:border-[#C9AD8B] hover:text-[#C9AD8B] transition-colors"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#111111]">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-[#5F5F5F] hover:text-[#111111] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter — Desktop */}
        <div className="hidden lg:block mt-12 border-t border-[#E5E5E3] pt-8">
          <div className="max-w-md">
            <NewsletterForm />
          </div>
        </div>

        {/* Mobile: Brand + Newsletter */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between">
            <Link to="/" aria-label="REo Collection — Home">
              <span className="font-['Outfit'] text-xl font-bold tracking-tight text-[#111111]">
                REo<span className="text-[#C9AD8B]">.</span>
              </span>
            </Link>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E5E3] text-[#5F5F5F]"
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="mt-6">
            <NewsletterForm />
          </div>

          {/* Accordion navigation */}
          <div className="mt-6">
            {footerSections.map((section) => (
              <FooterAccordion key={section.title} section={section} />
            ))}
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-[#E5E5E3]">
        <Container className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#5F5F5F]">
            © {new Date().getFullYear()} REo Collection. All rights reserved.
          </p>
          <p className="text-xs text-[#5F5F5F]">
            Designed & built with care in India.
          </p>
        </Container>
      </div>
    </footer>
  )
}
