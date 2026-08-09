import { useSelector, useDispatch } from 'react-redux'
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '@/redux/slices/cartSlice'
import {
  selectCartCount,
  selectCartTotals,
} from '@/redux/selectors/cartSelectors'

export function useCart() {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.cart.items)
  const count = useSelector(selectCartCount)
  const totals = useSelector(selectCartTotals)
  const isLoading = useSelector((state) => state.cart.isLoading)

  const add = (product, variant, quantity) =>
    dispatch(addToCart({ product, variant, quantity }))

  const remove = (itemId) => dispatch(removeFromCart(itemId))

  const setQuantity = (itemId, quantity) =>
    dispatch(updateQuantity({ itemId, quantity }))

  const increment = (itemId, currentQty, stock) =>
    dispatch(updateQuantity({ itemId, quantity: Math.min(currentQty + 1, stock) }))

  const decrement = (itemId, currentQty) =>
    dispatch(updateQuantity({ itemId, quantity: currentQty - 1 }))

  const empty = () => dispatch(clearCart())

  return {
    items,
    count,
    totals,
    isLoading,
    add,
    remove,
    setQuantity,
    increment,
    decrement,
    empty,
  }
}
