import { Router } from 'express'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js'
import { protect } from '../middleware/auth.js'
import { staffOnly } from '../middleware/adminOnly.js'

const router = Router()

// Public
router.get('/', getCategories)

// Admin only
router.use(protect, staffOnly)
router.post('/', createCategory)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

export default router
