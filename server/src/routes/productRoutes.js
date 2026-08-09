import { Router } from 'express'
import {
  getProducts,
  getProductBySlug,
  getFeatured,
  getNewArrivals,
  getBestSellers,
  searchProducts,
} from '../controllers/productController.js'

const router = Router()

router.get('/', getProducts)
router.get('/search', searchProducts)
router.get('/featured', getFeatured)
router.get('/new-arrivals', getNewArrivals)
router.get('/best-sellers', getBestSellers)
router.get('/:slug', getProductBySlug)

export default router
