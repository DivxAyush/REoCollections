import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS class names intelligently.
 * Resolves conflicts (e.g., p-2 vs p-4) and handles conditional classes.
 *
 * @param {...(string|undefined|null|boolean|object)} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
