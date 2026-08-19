import { Router } from 'express'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.js'
import { protect } from '../middleware/auth.js'
import { adminOnly } from '../middleware/adminOnly.js'

const router = Router()

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'reo-collection-products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
})

const upload = multer({ storage: storage })

// Upload a single image, returns the Cloudinary URL and public_id
router.post('/', protect, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' })
  }

  res.status(200).json({
    success: true,
    url: req.file.path,
    publicId: req.file.filename,
  })
})

export default router
