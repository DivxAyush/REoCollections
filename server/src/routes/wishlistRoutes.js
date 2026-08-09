import { Router } from 'express'
import { getWishlist, toggleWishlist } from '../controllers/wishlistController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/', getWishlist)
router.post('/toggle', toggleWishlist)

export default router
