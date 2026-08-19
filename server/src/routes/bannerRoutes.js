import { Router } from 'express'
import {
  createBanner,
  getAdminBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController.js'
import { protect } from '../middleware/auth.js'
import { adminOnly } from '../middleware/adminOnly.js'

const router = Router()

router
  .route('/')
  .get(protect, adminOnly, getAdminBanners)
  .post(protect, adminOnly, createBanner)

router
  .route('/:id')
  .get(protect, adminOnly, getBannerById)
  .put(protect, adminOnly, updateBanner)
  .delete(protect, adminOnly, deleteBanner)

export default router
