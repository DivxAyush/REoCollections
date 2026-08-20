import { Router } from 'express'
import {
  getProducts,
  getProductBySlug,
  getFeatured,
  getNewArrivals,
  getBestSellers,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsBatch,
  getInventory,
  bulkUpdateStock,
} from '../controllers/productController.js'
import { protect } from '../middleware/auth.js'
import { adminOnly } from '../middleware/adminOnly.js'

const router = Router()

router.get('/', getProducts)
router.post('/', protect, adminOnly, createProduct)
router.put('/:id', protect, adminOnly, updateProduct)
router.delete('/:id', protect, adminOnly, deleteProduct)
router.get('/search', searchProducts)
router.get('/featured', getFeatured)
router.get('/new-arrivals', getNewArrivals)
router.get('/best-sellers', getBestSellers)
router.post('/batch', getProductsBatch)
router.get('/admin/inventory', protect, adminOnly, getInventory)
router.patch('/admin/bulk-stock', protect, adminOnly, bulkUpdateStock)
router.get('/:slug', getProductBySlug)

export default router
