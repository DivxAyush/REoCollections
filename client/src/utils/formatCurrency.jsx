/**
 * Format a number as Indian Rupee currency.
 *
 * @param {number} amount
 * @param {object} options
 * @returns {string}
 */
export function formatCurrency(amount, options = {}) {
  const { showSymbol = true, decimals = 0 } = options

  const formatted = new Intl.NumberFormat('en-IN', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'INR',
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(amount)

  return formatted
}

/**
 * Format compact large numbers (e.g. 1200 → 1.2K)
 *
 * @param {number} num
 * @returns {string}
 */
export function formatCompact(num) {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num)
}
