import Wishlist from '../models/Wishlist.js'
import Product from '../models/Product.js'
import { asyncHandler, AppError } from '../middleware/errorHandler.js'

// ============================================================
// GET /api/wishlist
// ============================================================
export const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate('products', 'name slug price compareAtPrice images rating reviewCount newArrival bestSeller stock isActive')
    .lean()

  if (!wishlist) {
    return res.json({ success: true, wishlist: { products: [] } })
  }

  // Filter active products
  wishlist.products = wishlist.products.filter(p => p && p.isActive)

  res.json({ success: true, wishlist })
})

// ============================================================
// POST /api/wishlist/toggle
// ============================================================
export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body

  const product = await Product.findOne({ _id: productId, isActive: true })
  if (!product) throw new AppError('Product not found or inactive', 404)

  let wishlist = await Wishlist.findOne({ user: req.user._id })
  let added = false

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [productId],
    })
    added = true
  } else {
    const idx = wishlist.products.indexOf(productId)
    if (idx > -1) {
      wishlist.products.splice(idx, 1)
      added = false
    } else {
      wishlist.products.push(productId)
      added = true
    }
    await wishlist.save()
  }

  res.json({
    success: true,
    message: added ? 'Added to wishlist' : 'Removed from wishlist',
    added,
    wishlist
  })
})
