import { useSelector, useDispatch } from 'react-redux'
import {
  toggleWishlistItem,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from '@/redux/slices/wishlistSlice'

export function useWishlist() {
  const dispatch = useDispatch()
  const productIds = useSelector((state) => state.wishlist.productIds)
  const count = productIds.length

  const isWishlisted = (productId) => productIds.includes(productId)

  const toggle = (productId) => dispatch(toggleWishlistItem(productId))
  const add = (productId) => dispatch(addToWishlist(productId))
  const remove = (productId) => dispatch(removeFromWishlist(productId))
  const clear = () => dispatch(clearWishlist())

  return { productIds, count, isWishlisted, toggle, add, remove, clear }
}
