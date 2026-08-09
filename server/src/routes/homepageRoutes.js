import { Router } from 'express'
import { getHomepageData } from '../controllers/homepageController.js'

const router = Router()

router.get('/', getHomepageData)

export default router
