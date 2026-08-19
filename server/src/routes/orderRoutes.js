import { Router } from 'express'
import {
  getMyOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js'
import { protect } from '../middleware/auth.js'
import { adminOnly } from '../middleware/adminOnly.js'

const router = Router()

router.use(protect)

// Admin routes
router.get('/admin/all', adminOnly, getAllOrders)
router.put('/admin/:id/status', adminOnly, updateOrderStatus)

// User routes
router.get('/', getMyOrders)
router.post('/', createOrder)
router.get('/:id', getOrderById)
router.post('/:id/cancel', cancelOrder)

export default router
