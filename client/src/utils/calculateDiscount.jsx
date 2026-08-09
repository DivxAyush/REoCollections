/**
 * Calculate discount percentage between original and current price.
 *
 * @param {number} originalPrice
 * @param {number} currentPrice
 * @returns {number} Discount percentage (0–100), rounded to nearest integer
 */
export function calculateDiscount(originalPrice, currentPrice) {
  if (!originalPrice || originalPrice <= 0 || originalPrice <= currentPrice) {
    return 0
  }
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

/**
 * Calculate discounted price from original price and discount percentage.
 *
 * @param {number} originalPrice
 * @param {number} discountPercent
 * @returns {number}
 */
export function applyDiscount(originalPrice, discountPercent) {
  if (!discountPercent || discountPercent <= 0) return originalPrice
  return Math.round(originalPrice * (1 - discountPercent / 100))
}

/**
 * Calculate cart totals from items array.
 *
 * @param {Array} items - Cart items with { price, quantity, compareAtPrice? }
 * @returns {{ subtotal, discount, deliveryCharge, tax, total }}
 */
export function calculateCartTotals(items = []) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const originalTotal = items.reduce(
    (sum, item) =>
      sum + (item.compareAtPrice || item.price) * item.quantity,
    0
  )
  const discount = originalTotal - subtotal
  const deliveryCharge = subtotal >= 999 ? 0 : 99
  const taxRate = 0.18
  const taxableAmount = subtotal + deliveryCharge
  const tax = Math.round(taxableAmount * taxRate)
  const total = subtotal + deliveryCharge

  return { subtotal, originalTotal, discount, deliveryCharge, tax, total }
}
