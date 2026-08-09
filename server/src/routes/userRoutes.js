import { Router } from 'express'
import {
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.put('/profile', updateProfile)
router.post('/addresses', addAddress)
router.put('/addresses/:id', updateAddress)
router.delete('/addresses/:id', deleteAddress)

export default router
