import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, MessageCircle } from 'lucide-react'
import Container from '@/components/ui/Container'
import { cn } from '@/utils/cn'

const FAQS = [
  {
    category: "Orders & Shipping",
    items: [
      {
        q: "How long does shipping take?",
        a: "Orders are typically processed within 1-2 business days. Standard shipping within India takes 3-5 business days."
      },
      {
        q: "How can I track my order?",
        a: "Once your order is dispatched, you will receive a tracking link via email and SMS. You can also track your order in the 'My Account' section."
      },
      {
        q: "Do you offer international shipping?",
        a: "Currently, we only ship within India. We plan to expand to international shipping in the near future."
      }
    ]
  },
  {
    category: "Returns & Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "We offer a 14-day return policy for unused items in their original packaging with all tags attached. Please visit our Return Policy page for more details."
      },
      {
        q: "How long does it take to process a refund?",
        a: "Once we receive and inspect your returned item, your refund will be processed within 5-7 business days to your original payment method."
      }
    ]
  },
  {
    category: "Products & Sizing",
    items: [
      {
        q: "How do I know my size?",
        a: "We provide a detailed Size Guide with measurements for all our garments. You can find the link to the Size Guide in the footer and on every product page."
      },
      {
        q: "Are the colors on the website accurate?",
        a: "We make every effort to display the colors of our products as accurately as possible. However, actual colors may vary slightly depending on your monitor settings."
      }
    ]
  }
]

export default function FaqPage() {
  return (
    <div className="bg-[#F7F7F6] py-12 lg:py-20 min-h-[calc(100vh-200px)]">
      <Container className="max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white shadow-sm mb-6">
            <MessageCircle className="h-8 w-8 text-[#C9AD8B]" />
          </div>
          <h1 className="font-['Outfit'] text-3xl font-bold tracking-tight text-[#111111] sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 text-lg text-[#5F5F5F]">
            Find answers to common questions about our products, shipping, returns, and more.
          </p>
        </div>

        <div className="space-y-12">
          {FAQS.map((category, idx) => (
            <div key={idx}>
              <h2 className="font-['Outfit'] text-2xl font-bold text-[#111111] mb-6">{category.category}</h2>
              <div className="space-y-4">
                {category.items.map((item, i) => (
                  <FaqItem key={i} question={item.q} answer={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-xl border border-[#E5E5E3] bg-white overflow-hidden transition-colors hover:border-[#C9AD8B]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-6 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-[#111111] text-lg">{question}</span>
        <ChevronDown 
          className={cn(
            "h-5 w-5 flex-shrink-0 text-[#5F5F5F] transition-transform duration-300",
            isOpen && "rotate-180"
          )} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-6 pt-2 text-[#5F5F5F] leading-relaxed border-t border-[#F7F7F6]">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
