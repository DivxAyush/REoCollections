import { Router } from 'express'
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/paymentController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.post('/razorpay/create-order', createRazorpayOrder)
router.post('/razorpay/verify', verifyRazorpayPayment)

export default router
