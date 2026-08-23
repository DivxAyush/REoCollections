import { Router } from 'express'
import {
  createBanner,
  getAdminBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController.js'
import { protect } from '../middleware/auth.js'
import { staffOnly } from '../middleware/adminOnly.js'

const router = Router()

router
  .route('/')
  .get(protect, staffOnly, getAdminBanners)
  .post(protect, staffOnly, createBanner)

router
  .route('/:id')
  .get(protect, staffOnly, getBannerById)
  .put(protect, staffOnly, updateBanner)
  .delete(protect, staffOnly, deleteBanner)

export default router
