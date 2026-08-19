import { Router } from 'express'
import {
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.put('/profile', updateProfile)
router.get('/addresses', getAddresses)
router.post('/addresses', addAddress)
router.put('/addresses/:id', updateAddress)
router.delete('/addresses/:id', deleteAddress)
router.patch('/addresses/:id/default', setDefaultAddress)

export default router
