import { useState, useEffect } from 'react'

/**
 * Debounce a value by the given delay.
 *
 * @param {*} value
 * @param {number} delay - milliseconds
 * @returns debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
