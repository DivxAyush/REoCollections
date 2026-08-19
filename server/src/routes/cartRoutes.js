import { Router } from 'express'
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/', getCart)
router.post('/', addToCart)
router.put('/:itemId', updateCartItem)
router.delete('/clear', clearCart)
router.delete('/:itemId', removeFromCart)

export default router
