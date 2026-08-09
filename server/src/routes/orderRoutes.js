import { Router } from 'express'
import {
  getMyOrders,
  getOrderById,
  createOrder,
} from '../controllers/orderController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/', getMyOrders)
router.post('/', createOrder)
router.get('/:id', getOrderById)

export default router
