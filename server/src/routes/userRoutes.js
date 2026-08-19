import { Router } from 'express'
import {
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getAllUsers,
} from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'
import { adminOnly } from '../middleware/adminOnly.js'

const router = Router()

router.use(protect)

// Admin routes
router.get('/all', adminOnly, getAllUsers)

// User profile and addresses
router.put('/profile', updateProfile)
router.get('/addresses', getAddresses)
router.post('/addresses', addAddress)
router.put('/addresses/:id', updateAddress)
router.delete('/addresses/:id', deleteAddress)
router.patch('/addresses/:id/default', setDefaultAddress)

export default router
