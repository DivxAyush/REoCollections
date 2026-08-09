// ============================================================
// NAVIGATION CONFIG — REo Collection
// Central navigation data — drives both desktop and mobile menus
// ============================================================

export const NAV_ITEMS = [
  {
    label: 'Women',
    href: '/shop/women',
    subCategories: [
      { label: 'Tops & T-Shirts', href: '/shop/women/tops' },
      { label: 'Dresses', href: '/shop/women/dresses' },
      { label: 'Bottoms', href: '/shop/women/bottoms' },
      { label: 'Ethnic Wear', href: '/shop/women/ethnic' },
      { label: 'Outerwear', href: '/shop/women/outerwear' },
    ],
  },
  {
    label: 'Men',
    href: '/shop/men',
    subCategories: [
      { label: 'T-Shirts', href: '/shop/men/t-shirts' },
      { label: 'Shirts', href: '/shop/men/shirts' },
      { label: 'Bottoms', href: '/shop/men/bottoms' },
      { label: 'Ethnic Wear', href: '/shop/men/ethnic' },
      { label: 'Outerwear', href: '/shop/men/outerwear' },
    ],
  },
  {
    label: 'Kids',
    href: '/shop/kids',
    subCategories: [
      { label: 'Boys', href: '/shop/kids/boys' },
      { label: 'Girls', href: '/shop/kids/girls' },
      { label: 'Infants', href: '/shop/kids/infants' },
    ],
  },
  {
    label: 'Footwear',
    href: '/shop/footwear',
    subCategories: [],
  },
  {
    label: 'Sleepwear',
    href: '/shop/sleepwear',
    subCategories: [],
  },
  {
    label: 'Accessories',
    href: '/shop/accessories',
    subCategories: [],
  },
  {
    label: 'New Arrivals',
    href: '/shop/new-arrivals',
    badge: 'New',
    subCategories: [],
  },
  {
    label: 'Offers',
    href: '/shop/offers',
    badge: 'Sale',
    highlight: true,
    subCategories: [],
  },
]

// Product sort options
export const SORT_OPTIONS = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Popularity', value: 'popularity' },
  { label: 'Rating', value: 'rating' },
]

// Available sizes
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL']

// Product statuses
export const ORDER_STATUSES = {
  pending: { label: 'Pending', color: 'warning' },
  confirmed: { label: 'Confirmed', color: 'info' },
  processing: { label: 'Processing', color: 'info' },
  shipped: { label: 'Shipped', color: 'info' },
  out_for_delivery: { label: 'Out for Delivery', color: 'info' },
  delivered: { label: 'Delivered', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'error' },
  returned: { label: 'Returned', color: 'error' },
  refunded: { label: 'Refunded', color: 'warning' },
}

// Price filter ranges
export const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 – ₹5,000', min: 2000, max: 5000 },
  { label: 'Above ₹5,000', min: 5000, max: null },
]
