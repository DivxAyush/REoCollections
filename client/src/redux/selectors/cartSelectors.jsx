import { createSelector } from '@reduxjs/toolkit'
import { calculateCartTotals } from '@/utils/calculateDiscount'

const selectCartItems = (state) => state.cart.items

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0)
)

export const selectCartTotals = createSelector(selectCartItems, (items) =>
  calculateCartTotals(items)
)

export const selectIsItemInCart = (productId, variantKey = 'default') =>
  createSelector(selectCartItems, (items) =>
    items.some(
      (item) =>
        item.productId === productId &&
        item.itemId === `${productId}_${variantKey}`
    )
  )

export const selectCartItemQuantity = (itemId) =>
  createSelector(
    selectCartItems,
    (items) => items.find((item) => item.itemId === itemId)?.quantity || 0
  )
