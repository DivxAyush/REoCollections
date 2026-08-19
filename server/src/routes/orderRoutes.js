import { Router } from 'express'
import {
  getMyOrders,
  getOrderById,
  createOrder,
  cancelOrder,
} from '../controllers/orderController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/', getMyOrders)
router.post('/', createOrder)
router.get('/:id', getOrderById)
router.post('/:id/cancel', cancelOrder)

export default router
