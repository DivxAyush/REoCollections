import { Router } from 'express'
import {
  getStaff,
  createStaff,
  updateStaffRole,
} from '../controllers/adminController.js'
import { protect } from '../middleware/auth.js'
import { superAdminOnly } from '../middleware/adminOnly.js'

const router = Router()

// All routes here are for super_admin only
router.use(protect, superAdminOnly)

router.route('/staff')
  .get(getStaff)
  .post(createStaff)

router.route('/staff/:id/role')
  .patch(updateStaffRole)

export default router
