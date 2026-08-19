import Container from '@/components/ui/Container'

function PolicyLayout({ title, lastUpdated, children }) {
  return (
    <div className="bg-white py-12 lg:py-20">
      <Container className="max-w-3xl">
        <div className="mb-10 text-center border-b border-[#E5E5E3] pb-8">
          <h1 className="font-['Outfit'] text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-sm text-[#5F5F5F]">Last Updated: {lastUpdated}</p>
        </div>
        <div className="space-y-8 text-[#5F5F5F] leading-relaxed">
          {children}
        </div>
      </Container>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h3 className="font-['Outfit'] text-xl font-semibold text-[#111111]">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

export function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="August 2026">
      <p>Welcome to REo Collection's Privacy Policy. We value your privacy and are committed to protecting your personal data.</p>
      
      <Section title="1. Information We Collect">
        <p>We may collect personal information such as your name, email address, shipping and billing address, and payment information when you make a purchase or create an account on our website.</p>
      </Section>
      
      <Section title="2. How We Use Your Information">
        <p>Your information is used to process orders, improve our website, provide customer support, and send promotional emails if you have explicitly opted in.</p>
      </Section>
      
      <Section title="3. Sharing Your Data">
        <p>We do not sell your personal data. We may share it with trusted third-party service providers (such as payment processors and shipping partners) strictly for fulfilling your orders.</p>
      </Section>
      
      <Section title="4. Your Rights">
        <p>You have the right to request access, correction, or deletion of your personal data at any time. To exercise these rights, please contact us at hello@reocollection.in.</p>
      </Section>
    </PolicyLayout>
  )
}

export function TermsOfServicePage() {
  return (
    <PolicyLayout title="Terms of Service" lastUpdated="August 2026">
      <p>Welcome to REo Collection. By accessing or using our website, you agree to be bound by these Terms of Service.</p>
      
      <Section title="1. Use of the Site">
        <p>You must be at least the age of majority in your state or province of residence to use this site. You may not use our products for any illegal or unauthorized purpose.</p>
      </Section>
      
      <Section title="2. Products or Services">
        <p>Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.</p>
      </Section>
      
      <Section title="3. Accuracy of Billing and Account Information">
        <p>We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail provided at the time the order was made.</p>
      </Section>
    </PolicyLayout>
  )
}

export function ShippingPolicyPage() {
  return (
    <PolicyLayout title="Shipping Policy" lastUpdated="August 2026">
      <p>Here you will find all information regarding our shipping practices and delivery timelines.</p>
      
      <Section title="1. Processing Time">
        <p>All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.</p>
      </Section>
      
      <Section title="2. Shipping Rates & Delivery Estimates">
        <p>Shipping charges for your order will be calculated and displayed at checkout. Standard delivery typically takes 3-5 business days across India.</p>
      </Section>
      
      <Section title="3. Shipment Confirmation & Order Tracking">
        <p>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.</p>
      </Section>
    </PolicyLayout>
  )
}

export function ReturnPolicyPage() {
  return (
    <PolicyLayout title="Return & Exchange Policy" lastUpdated="August 2026">
      <p>We want you to be completely satisfied with your purchase. If you are not, here is our return and exchange policy.</p>
      
      <Section title="1. Returns">
        <p>You have 14 days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging with all tags attached.</p>
      </Section>
      
      <Section title="2. Refunds">
        <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. If your return is approved, we will initiate a refund to your credit card (or original method of payment) within 5-7 business days.</p>
      </Section>
      
      <Section title="3. Shipping">
        <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.</p>
      </Section>
    </PolicyLayout>
  )
}

export function CookiePolicyPage() {
  return (
    <PolicyLayout title="Cookie Policy" lastUpdated="August 2026">
      <p>This Cookie Policy explains how REo Collection uses cookies and similar technologies to recognize you when you visit our website.</p>
      
      <Section title="1. What are cookies?">
        <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
      </Section>
      
      <Section title="2. Why do we use cookies?">
        <p>We use first and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our website.</p>
      </Section>
      
      <Section title="3. How can I control cookies?">
        <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager that appears at the bottom of the screen when you first visit, which allows you to select which categories of cookies you accept or reject.</p>
      </Section>
    </PolicyLayout>
  )
}
