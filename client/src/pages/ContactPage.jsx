import { useState } from 'react'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import Container from '@/components/ui/Container'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      e.target.reset()
      setTimeout(() => setIsSuccess(false), 5000)
    }, 1500)
  }

  return (
    <div className="bg-white py-12 lg:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h1 className="font-['Outfit'] text-3xl font-bold tracking-tight text-[#111111] sm:text-5xl">
            Get in touch
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[#5F5F5F]">
            Have a question about an order, our products, or just want to say hi? We'd love to hear from you.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-2">
          {/* Contact Info */}
          <div>
            <h2 className="font-['Outfit'] text-2xl font-bold text-[#111111]">Contact Information</h2>
            <p className="mt-4 text-[#5F5F5F] leading-relaxed">
              Our customer service team is available Monday through Friday, 9:00 AM to 6:00 PM IST. We strive to respond to all inquiries within 24 hours.
            </p>

            <dl className="mt-10 space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#F7F7F6]">
                  <MapPin className="h-5 w-5 text-[#C9AD8B]" aria-hidden="true" />
                </div>
                <div>
                  <dt className="font-semibold text-[#111111]">Address</dt>
                  <dd className="mt-1 text-sm text-[#5F5F5F] leading-relaxed">
                    REo Collection HQ<br />
                    123 Fashion Street, Lower Parel<br />
                    Mumbai, Maharashtra 400013<br />
                    India
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#F7F7F6]">
                  <Phone className="h-5 w-5 text-[#C9AD8B]" aria-hidden="true" />
                </div>
                <div>
                  <dt className="font-semibold text-[#111111]">Phone</dt>
                  <dd className="mt-1 text-sm text-[#5F5F5F]">
                    <a href="tel:+919876543210" className="hover:text-[#111111] transition-colors">+91 98765 43210</a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#F7F7F6]">
                  <Mail className="h-5 w-5 text-[#C9AD8B]" aria-hidden="true" />
                </div>
                <div>
                  <dt className="font-semibold text-[#111111]">Email</dt>
                  <dd className="mt-1 text-sm text-[#5F5F5F]">
                    <a href="mailto:hello@reocollection.in" className="hover:text-[#111111] transition-colors">hello@reocollection.in</a>
                  </dd>
                </div>
              </div>
            </dl>
            
            <div className="mt-10 overflow-hidden rounded-xl border border-[#E5E5E3] bg-[#F7F7F6] h-64 w-full">
               {/* Map Placeholder */}
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120668.61803738018!2d72.77196024467005!3d19.066750420790403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="REo Collection Location"
                className="grayscale opacity-80 mix-blend-multiply"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-[#E5E5E3] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-10">
            <h3 className="font-['Outfit'] text-2xl font-bold text-[#111111] mb-8">Send us a message</h3>
            
            {isSuccess ? (
              <div className="rounded-lg bg-[#F7F7F6] p-8 text-center border border-[#E5E5E3]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#111111]">
                  <Send className="h-6 w-6 text-white ml-1" />
                </div>
                <h4 className="mt-6 text-lg font-semibold text-[#111111]">Message Sent!</h4>
                <p className="mt-2 text-sm text-[#5F5F5F]">Thank you for reaching out. We will get back to you as soon as possible.</p>
                <Button 
                  className="mt-8" 
                  variant="outline" 
                  fullWidth 
                  onClick={() => setIsSuccess(false)}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input
                    label="First Name"
                    id="firstName"
                    name="firstName"
                    required
                    placeholder="John"
                  />
                  <Input
                    label="Last Name"
                    id="lastName"
                    name="lastName"
                    required
                    placeholder="Doe"
                  />
                </div>
                
                <Input
                  label="Email Address"
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                />
                
                <Input
                  label="Subject"
                  id="subject"
                  name="subject"
                  required
                  placeholder="How can we help?"
                />
                
                <div className="flex flex-col gap-1">
                  <label htmlFor="message" className="text-sm font-medium text-[#111111]">
                    Message<span className="ml-0.5 text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Tell us what's on your mind..."
                    className={cn(
                      'w-full rounded-md border border-[#E5E5E3] bg-white px-3 py-2.5 text-sm text-[#111111]',
                      'placeholder:text-[#5F5F5F] placeholder:text-sm',
                      'transition-colors duration-150 resize-none',
                      'focus:outline-none focus:ring-2 focus:ring-[#C9AD8B] focus:border-transparent',
                      'hover:border-[#111111]'
                    )}
                  />
                </div>
                
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isSubmitting}
                  rightIcon={<Send className="h-4 w-4" />}
                >
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
