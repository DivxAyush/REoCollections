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
import { staffOnly } from '../middleware/adminOnly.js'

const router = Router()

router.get('/', getProducts)
router.post('/', protect, staffOnly, createProduct)
router.put('/:id', protect, staffOnly, updateProduct)
router.delete('/:id', protect, staffOnly, deleteProduct)
router.get('/search', searchProducts)
router.get('/featured', getFeatured)
router.get('/new-arrivals', getNewArrivals)
router.get('/best-sellers', getBestSellers)
router.post('/batch', getProductsBatch)
router.get('/admin/inventory', protect, staffOnly, getInventory)
router.patch('/admin/bulk-stock', protect, staffOnly, bulkUpdateStock)
router.get('/:slug', getProductBySlug)

export default router
