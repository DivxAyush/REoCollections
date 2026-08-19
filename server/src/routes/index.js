import { Router } from 'express'
import authRoutes from './authRoutes.js'
import productRoutes from './productRoutes.js'
import categoryRoutes from './categoryRoutes.js'
import homepageRoutes from './homepageRoutes.js'
import cartRoutes from './cartRoutes.js'
import wishlistRoutes from './wishlistRoutes.js'
import orderRoutes from './orderRoutes.js'
import userRoutes from './userRoutes.js'
import uploadRoutes from './uploadRoutes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
router.use('/homepage', homepageRoutes)
router.use('/cart', cartRoutes)
router.use('/wishlist', wishlistRoutes)
router.use('/orders', orderRoutes)
router.use('/users', userRoutes)
router.use('/upload', uploadRoutes)

// Health check endpoint for Render cron
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Fallback for API routes
router.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' })
})

export default router
